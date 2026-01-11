try:
    import paramiko
except ImportError:
    paramiko = None
import sys
import io
import os
import time
import socket
import argparse
import base64
import re
import tarfile
import subprocess

# Configuration
HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
PROJECT_NAME = 'consulting' 
REMOTE_BASE_DIR = '/volume1/docker/projects/consulting'
LOCAL_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOMAIN_NAME = 'a11y-english-demo.khsruru.com'

# Blue/Green Config
BLUE_PORT = 5001
GREEN_PORT = 5002

# Set stdout encoding to UTF-8
if sys.platform == 'win32':
    if hasattr(sys.stdout, 'buffer'):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)
    elif not hasattr(sys.stdout, 'encoding') or sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except (AttributeError, ValueError):
            pass

class LocalChannel:
    def __init__(self, process): self.process = process
    def exit_status_ready(self): return self.process.poll() is not None
    def recv_exit_status(self): return self.process.wait()

class LocalStream:
    def __init__(self, stream, channel):
        self.stream = stream
        self.channel = channel
    def read(self): return self.stream.read()
    def readline(self):
        line = self.stream.readline()
        return line.decode() if isinstance(line, bytes) else line
    def __iter__(self): return iter(self.stream)

class LocalSSH:
    def exec_command(self, command):
        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=subprocess.PIPE)
        channel = LocalChannel(process)
        stdout = LocalStream(process.stdout, channel)
        stderr = LocalStream(process.stderr, channel)
        return process.stdin, stdout, stderr
    def close(self): pass
    def open_sftp(self): raise NotImplementedError("SFTP not supported in LocalSSH")

def create_ssh_client():
    if paramiko is None or os.path.exists(REMOTE_BASE_DIR):
        print("🏠 Running locally on Synology NAS...")
        return LocalSSH()
    print(f"🔗 Connecting to {HOST}:{PORT} via SSH...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
    return client

def determine_active_color(ssh):
    print("🚦 Determining active color (via Docker PS)...")
    stdin, stdout, stderr = ssh.exec_command("sudo docker ps --format '{{.Names}}'")
    names = stdout.read().decode().strip().split('\n')
    if any('consulting-app-blue' in name for name in names):
        print("   Active: BLUE")
        return 'blue', BLUE_PORT
    elif any('consulting-app-green' in name for name in names):
        print("   Active: GREEN")
        return 'green', GREEN_PORT
    else:
        print("⚠️ No active container found. Defaulting to BLUE active (Targeting Green).")
        return 'blue', BLUE_PORT


def upload_compose_file(ssh, local_dir, remote_dir, target_color='green', target_port=3000, image_tag='latest'):
    print(f"📄 Generating and uploading docker-compose.{target_color}.yml...")
    
    # Read local production compose file
    local_template = os.path.join(local_dir, "docker-compose.prod.yml")
    with open(local_template, "r", encoding="utf-8") as f:
        content = f.read()

    # Modify Ports
    content = content.replace('- "3000:5000"', f'- "{target_port}:5000"')
    
    # Modify Container Names
    content = content.replace("container_name: consulting-app", f"container_name: consulting-app-{target_color}")
    content = content.replace("container_name: consulting-postgres-prod", f"container_name: consulting-postgres-{target_color}")
    
    # Remove any existing 'build:' blocks completely to ensure we use the image from the hub
    # This handles both simple 'build: .' and multi-line 'build: \n context: ...'
    content = re.sub(r"^\s*build:.*(?:\n\s+.*)*", "", content, flags=re.MULTILINE)
    
    # Force the image tag to match our target (e.g. latest or hotfix-1)
    # We search for the consulting-app service and replace its image tag
    image_pattern = r"(consulting-app:[\s\S]*?image:\s+khsruru/consulting-app:)([\w.-]+)"
    if re.search(image_pattern, content):
        content = re.sub(image_pattern, rf"\1{image_tag}", content)
    else:
        # If no image tag found (unlikely), we add it after consulting-app:
        content = re.sub(r"(consulting-app:)", rf"\1\n    image: khsruru/consulting-app:{image_tag}", content)

    print(f"✅ Configured for image image: khsruru/consulting-app:{image_tag}")

    remote_color_dir = f"{remote_dir}/{target_color.lower()}"
    active_compose_name = f"docker-compose.{target_color}.yml"
    
    # Upload compose file
    ssh.exec_command(f"mkdir -p {remote_color_dir}")
    stdin, stdout, stderr = ssh.exec_command(f"cat > {remote_color_dir}/{active_compose_name}")
    stdin.write(content)
    stdin.close()
    
    if stdout.channel.recv_exit_status() != 0:
        print(f"❌ Failed to upload compose file: {stderr.read().decode()}")
        raise Exception("Upload failed")
        
    print(f"✅ Uploaded {active_compose_name} to {remote_color_dir}")
    return active_compose_name

def wait_for_health(ssh, port, timeout=300):
    print(f"🏥 Checking health of new container on port {port}...")
    start_time = time.time()
    while time.time() - start_time < timeout:
        cmd = f"curl -I http://localhost:{port}"
        stdin, stdout, stderr = ssh.exec_command(cmd)
        if stdout.channel.recv_exit_status() == 0:
            print("\n✅ New container is HEALTHY!")
            return True
        time.sleep(5)
        print(".", end="", flush=True)
    return False

def switch_traffic(ssh, domain, port, password):
    print(f"🔄 Switching traffic for {domain} to port {port}...")
    
    # Dynamically find the config file for this domain
    find_cmd = f"grep -l '{domain}' /usr/local/etc/nginx/sites-enabled/*"
    stdin, stdout, stderr = ssh.exec_command(f"echo '{password}' | sudo -S {find_cmd}")
    nginx_conf = stdout.read().decode().strip()
    
    if not nginx_conf:
        print(f"❌ Could not find Nginx config for {domain}")
        # Fallback to checking specific Synology generated files if needed, but for now report error
        return False
        
    print(f"   Found config file: {nginx_conf}")
    
    # Use sed to replace proxy_pass port
    # It replaces http://localhost:ANY_PORT; with http://localhost:NEW_PORT;
    sed_cmd = f"sed -i 's/proxy_pass http:\\/\\/localhost:[0-9]\\+/proxy_pass http:\\/\\/localhost:{port}/g' {nginx_conf}"
    
    print(f"   Executing: {sed_cmd}")
    stdin, stdout, stderr = ssh.exec_command(f"echo '{password}' | sudo -S {sed_cmd}")
    if stdout.channel.recv_exit_status() != 0:
        print(f"❌ Failed to update Nginx config: {stderr.read().decode()}")
        return False
        
    print("   Reloading Nginx...")
    stdin, stdout, stderr = ssh.exec_command(f"echo '{password}' | sudo -S nginx -s reload")
    if stdout.channel.recv_exit_status() != 0:
        print(f"❌ Failed to reload Nginx: {stderr.read().decode()}")
        return False
        
    return True

def deploy():
    parser = argparse.ArgumentParser(description='Deploy Next.js app to Synology NAS')
    parser.add_argument('--tag', type=str, default='latest', help='Docker image tag to deploy (default: latest)')
    args = parser.parse_args()
    
    image_tag = args.tag
    
    ssh = create_ssh_client()
    try:
        print(f"📢 Starting Deployment (Tag: {image_tag})...")
        
        # 0. Deploy DB Stack (Persistent) - SKIPPING as per user request (No DB in this project)
        # print("🗄️  Deploying Persistent Database Stack...")
        # db_dir = f"{REMOTE_BASE_DIR}/db"
        # ssh.exec_command(f"mkdir -p {db_dir}")
        
        # # Upload DB Compose
        # local_db_compose = os.path.join(LOCAL_BASE_DIR, "docker-compose.db.yml")
        # remote_db_compose = f"{db_dir}/docker-compose.db.yml"
        
        # with open(local_db_compose, "r", encoding="utf-8") as f:
        #     db_content = f.read()
            
        # stdin, stdout, stderr = ssh.exec_command(f"cat > {remote_db_compose}")
        # stdin.write(db_content)
        # stdin.close()
        
        # if stdout.channel.recv_exit_status() != 0:
        #     raise Exception(f"Failed to upload DB compose: {stderr.read().decode()}")
            
        # # Detect Docker Compose Binary
        # detect_cmd = "which docker-compose || echo /usr/local/bin/docker-compose"
        # stdin, stdout, stderr = ssh.exec_command(detect_cmd)
        # dc_bin = stdout.read().decode().strip()
        
        # # Start DB
        # print("   Starting DB container...")
        # start_db_cmd = f"cd {db_dir} && {dc_bin} -f docker-compose.db.yml up -d --remove-orphans"
        # stdin, stdout, stderr = ssh.exec_command(f"echo '{PASSWORD}' | sudo -S /bin/sh -c '{start_db_cmd}'")
        
        # # Stream DB output
        # while not stdout.channel.exit_status_ready():
        #      if stdout.channel.recv_ready(): print(stdout.channel.recv(1024).decode('utf-8', 'replace'), end="", flush=True)

        # print("\n✅ Database Stack Deployed.")

        # ---------------------------------------------------------
        # Detect Docker Compose Binary (Required for App Deployment)
        detect_cmd = "which docker-compose || echo /usr/local/bin/docker-compose"
        stdin, stdout, stderr = ssh.exec_command(detect_cmd)
        dc_bin = stdout.read().decode().strip()

        print("📢 Starting Blue/Green App Deployment...")
        active_color, active_port = determine_active_color(ssh)
        target_color = 'green' if active_color == 'blue' else 'blue'
        target_port = GREEN_PORT if target_color == 'green' else BLUE_PORT
        print(f"🎯 Target: {target_color.upper()} (Port {target_port})")
        target_color_dir = f"{REMOTE_BASE_DIR}/{target_color.lower()}"
        
        # 1. Update/Upload Docker Compose
        active_compose_file = upload_compose_file(ssh, LOCAL_BASE_DIR, REMOTE_BASE_DIR, 
                                           target_color=target_color, 
                                           target_port=target_port,
                                           image_tag=image_tag)
        
        print("🔧 Linking master .env and creating volume directories...")
        ssh.exec_command(f"cp {REMOTE_BASE_DIR}/.env {target_color_dir}/.env")
        
        # 2. Pull Latest Image
        print(f"⬇️  Pulling image khsruru/consulting-app:{image_tag}...")
        # Determine docker binary path
        stdin_docker, stdout_docker, stderr_docker = ssh.exec_command("which docker || echo /usr/local/bin/docker")
        docker_bin = stdout_docker.read().decode().strip()
        stdin, stdout, stderr = ssh.exec_command(f"echo '{PASSWORD}' | sudo -S {docker_bin} pull khsruru/consulting-app:{image_tag}")
        # Stream output
        while not stdout.channel.exit_status_ready():
             if stdout.channel.recv_ready(): print(stdout.channel.recv(1024).decode('utf-8', 'replace'), end="", flush=True)
        
        # 3. Start Container
        print(f"🚀 Starting {target_color.upper()} container on NAS...")
        # App will join 'mynote-net' defined in compose file (external)
        # --remove-orphans cleans up the mynote-postgres-* containers from this stack
        start_cmd = f"cd {target_color_dir} && {dc_bin} -f {active_compose_file} up -d --force-recreate --remove-orphans" 
        stdin, stdout, stderr = ssh.exec_command(f"echo '{PASSWORD}' | sudo -S /bin/sh -c '{start_cmd}'")
        
        while not stdout.channel.exit_status_ready() or stdout.channel.recv_ready() or stdout.channel.recv_stderr_ready():
            if stdout.channel.recv_ready():
                data = stdout.channel.recv(1024).decode('utf-8', 'replace')
                if data: print(data, end="", flush=True)
            if stdout.channel.recv_stderr_ready():
                data = stdout.channel.recv_stderr(1024).decode('utf-8', 'replace')
                if data: print(data, end="", flush=True)
            time.sleep(0.1)
        
        if wait_for_health(ssh, target_port):
            if switch_traffic(ssh, DOMAIN_NAME, target_port, PASSWORD):
                print(f"🎉 Switched traffic to {target_color.upper()}!")
                stop_cmd = f"docker stop consulting-app-{active_color} || true"
                ssh.exec_command(f"echo '{PASSWORD}' | sudo -S {stop_cmd}")
                print("✅ Deployment Finished Successfully.")
            else:
                print("❌ Traffic switch failed.")
        else:
            print("❌ Health check failed.")
    finally:
        ssh.close()

if __name__ == '__main__':
    deploy()
