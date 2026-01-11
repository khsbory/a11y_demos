
import paramiko
import os

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
REMOTE_BASE_DIR = '/volume1/docker/projects/consulting'

def setup_remote():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        # 1. Create remote base dir and network
        print(f"Creating remote directory: {REMOTE_BASE_DIR}")
        client.exec_command(f"mkdir -p {REMOTE_BASE_DIR}")
        
        print("Creating docker network: consulting-net")
        # Use absolute path for docker
        DOCKER_BIN = "/var/packages/ContainerManager/target/usr/bin/docker"
        client.exec_command(f"echo '{PASSWORD}' | sudo -S {DOCKER_BIN} network create consulting-net")
        
        # 2. Upload .env (using a default one or dummy if not exists locally, but we need one)
        # Assuming we can use a temporary .env for initial deploy
        env_content = "NODE_ENV=production\nPORT=5000\n"
        print("Uploading temporary .env to remote...")
        stdin, stdout, stderr = client.exec_command(f"cat > {REMOTE_BASE_DIR}/.env")
        stdin.write(env_content)
        stdin.close()
        stdout.channel.recv_exit_status()
        
        print("Remote environment setup complete.")
                    
    finally:
        client.close()

if __name__ == '__main__':
    setup_remote()
