import paramiko
import sys
import io
import time
import argparse

# Set stdout encoding to UTF-8 for Korean output on Windows
if sys.platform == 'win32':
    if hasattr(sys.stdout, 'buffer'):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)
    elif not hasattr(sys.stdout, 'encoding') or sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except (AttributeError, ValueError):
            pass

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DEFAULT_DOMAIN = 'a11y-english-demo.khsruru.com'
DEFAULT_EMAIL = 'khsbory@naver.com'

# Synology hook requires these env vars to be exported before running acme.sh
# Usually needs a user in 'administrators' group.
SYNO_USERNAME = USERNAME
SYNO_PASSWORD = PASSWORD

def create_ssh_client():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=30, banner_timeout=30)
    return client

def stream_command(ssh, cmd, sudo=False):
    if sudo:
        # Check for shell operators
        if any(op in cmd for op in ['||', '&&', ';', '| ']):
             cmd_escaped = cmd.replace("'", "'\\''") # Escape single quotes
             cmd = f"echo '{PASSWORD}' | sudo -S sh -c '{cmd_escaped}'"
        else:
             cmd = f"echo '{PASSWORD}' | sudo -S {cmd}"
    
    print(f"Running: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    # Stream output
    while not stdout.channel.exit_status_ready():
        if stdout.channel.recv_ready():
            out = stdout.channel.recv(1024).decode('utf-8', 'replace')
            sys.stdout.write(out)
            sys.stdout.flush()
        if stderr.channel.recv_ready():
            err = stderr.channel.recv(1024).decode('utf-8', 'replace')
            sys.stderr.write(err)
            sys.stderr.flush()
        time.sleep(0.1)
    
    # Capture remaining
    out = stdout.read().decode('utf-8', 'replace')
    sys.stdout.write(out)
    err = stderr.read().decode('utf-8', 'replace')
    sys.stderr.write(err)
    
    return stdout.channel.recv_exit_status()

def parse_args():
    parser = argparse.ArgumentParser(description='Synology SSL Setup')
    parser.add_argument('--domain', default=DEFAULT_DOMAIN, help='Domain name (e.g. mynote.khsruru.com)')
    parser.add_argument('--email', default=DEFAULT_EMAIL, help='Email address for Let\'s Encrypt')
    return parser.parse_args()

def setup_ssl(domain, email):
    ssh = create_ssh_client()
    try:
        print(f"🔐 Starting SSL Setup for {domain} on Synology NAS...")

        # 1. Check/Install acme.sh
        check_acme = "test -f /root/.acme.sh/acme.sh"
        if stream_command(ssh, check_acme, sudo=True) != 0:
            print("📦 Installing acme.sh...")
            install_cmd = f"curl https://get.acme.sh | sudo sh -s email={email} --force"
            stream_command(ssh, install_cmd, sudo=True)
        else:
            print("✅ acme.sh is already installed.")

        # 2. Issue Certificate (Custom Standalone via Python)
        print(f"📜 Issuing certificate for {domain} using Python HTTP Server...")
        
        acme_bin = "/root/.acme.sh/acme.sh"
        temp_webroot = "/tmp/acme-challenge"
        
        # Prepare webroot
        stream_command(ssh, f"mkdir -p {temp_webroot}", sudo=True)
        
        # Define Nginx Control Commands
        stop_nginx = "synoservice --stop nginx || systemctl stop pkg-nginx || systemctl stop nginx"
        start_nginx = "synoservice --start nginx || systemctl start pkg-nginx || systemctl start nginx"
        
        print("🛑 Temporarily stopping Nginx to bind port 80...")
        stream_command(ssh, stop_nginx, sudo=True)
        
        server_pid = None
        try:
            # Start Python HTTP Server
            print("🚀 Starting temporary Python HTTP server on port 80...")
            python_server_cmd = (
                f"nohup python3 -m http.server 80 --directory {temp_webroot} > /dev/null 2>&1 & echo $!"
            )
            stdin, stdout, stderr = ssh.exec_command(f"echo '{PASSWORD}' | sudo -S sh -c '{python_server_cmd}'")
            server_pid = stdout.read().decode().strip()
            print(f"   Python server PID: {server_pid}")
            
            if not server_pid:
                print("❌ Failed to start Python server. Port 80 might still be in use.")
                raise Exception("Python server start failed")

            time.sleep(3) # Wait for server spinup

            # Run acme.sh
            issue_cmd = (
                f"{acme_bin} --issue "
                f"-d {domain} "
                f"--webroot {temp_webroot} "
                f"--server letsencrypt "
                f"--force "
                f"--debug"
            )
            
            print("RUNNING ACME issuance...")
            if stream_command(ssh, issue_cmd, sudo=True) != 0:
                 print("❌ Manual issuance failed.")
                 print("💡 Suggestion: Use the 'DNS-01' challenge or configure Port 80 forwarding.")
                 return

            print("✅ Certificate Issued Successfully!")

        finally:
             if server_pid:
                 print(f"🧹 Killing Python server {server_pid}...")
                 stream_command(ssh, f"kill {server_pid}", sudo=True)
             
             print("▶️ Restarting Nginx...")
             stream_command(ssh, start_nginx, sudo=True)

        # 3. Deploy Certificate to Synology DSM
        print("🚀 Deploying certificate to Synology DSM...")
        
        deploy_cmd = (
            f"export SYNO_Username='{SYNO_USERNAME}'; "
            f"export SYNO_Password='{SYNO_PASSWORD}'; "
            f"export SYNO_Certificate='{domain}'; " 
            f"export SYNO_Create=1; " 
            f"/root/.acme.sh/acme.sh --deploy "
            f"-d {domain} "
            f"--deploy-hook synology_dsm"
        )
        
        if stream_command(ssh, deploy_cmd, sudo=True) == 0:
            print(f"\n✨ Certificate successfully deployed for {domain}!")
            print("ℹ️ Note: You may still need to assign this certificate to your Reverse Proxy service in DSM Control Panel if it created a NEW certificate entry.")
        else:
            print("\n❌ Deployment to DSM failed. Please check credentials (2FA might prevent this).")

    finally:
        ssh.close()

if __name__ == '__main__':
    args = parse_args()
    setup_ssl(args.domain, args.email)
