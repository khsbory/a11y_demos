try:
    import paramiko
except ImportError:
    paramiko = None
import sys
import io
import os
import time

# Configuration
HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

# Set stdout encoding to UTF-8
if sys.platform == 'win32':
    if hasattr(sys.stdout, 'buffer'):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)
    elif not hasattr(sys.stdout, 'encoding') or sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except (AttributeError, ValueError):
            pass

def fetch_logs():
    if paramiko is None:
        print("Paramiko not found, cannot connect.")
        return

    print(f"🔗 Connecting to {HOST}:{PORT} via SSH...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        print("✅ Connected!")
        
        # Try to locate docker or use default Synology path
        DOCKER_BIN = "/usr/local/bin/docker"
        
        # Check ALL containers to find recent one
        print(f"Executing {DOCKER_BIN} ps -a...")
        stdin, stdout, stderr = client.exec_command(f"echo 'Lzt8cry5k$' | sudo -S {DOCKER_BIN} ps -a --format '{{{{.Names}}}}|{{{{.Status}}}}'")
        output = stdout.read().decode('utf-8')
        print(f"Stdout:\n{output}")
        
        containers = output.splitlines()
        
        target = "mynote-app-green"
        if target:
            print(f"📄 Fetching logs for {target}...")
            stdin, stdout, stderr = client.exec_command(f"echo 'Lzt8cry5k$' | sudo -S {DOCKER_BIN} logs --tail 200 {target}")
            print(stdout.read().decode('utf-8', 'replace'))
            print("--- STDERR ---")
            print(stderr.read().decode('utf-8', 'replace'))
            
            # Also check image creation time to verify if it's new
            print(f"🕵️ Checking image details for {target}...")
            stdin, stdout, stderr = client.exec_command(f"echo 'Lzt8cry5k$' | sudo -S {DOCKER_BIN} inspect --format '{{{{.Image}}}}' {target}")
            image_id = stdout.read().decode().strip()
            if image_id:
                stdin, stdout, stderr = client.exec_command(f"echo 'Lzt8cry5k$' | sudo -S {DOCKER_BIN} inspect --format '{{{{.Created}}}}' {image_id}")
                print(f"Image Created: {stdout.read().decode().strip()}")
        else:
            print("❌ No matching container found.")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == '__main__':
    fetch_logs()
