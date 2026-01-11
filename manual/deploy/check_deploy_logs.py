
import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def check_logs():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        DOCKER_BIN = "/var/packages/ContainerManager/target/usr/bin/docker"
        print("--- CONTAINER FILE CHECK (dist/index.js) ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S {DOCKER_BIN} exec consulting-app-green head -n 20 /app/dist/index.js")
        print(stdout.read().decode())
        
        print("--- ALL CONTAINERS (docker ps -a) ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S {DOCKER_BIN} ps -a")
        print(stdout.read().decode())
        
        print("--- RECENT LOGS (consulting-app-green) ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S {DOCKER_BIN} logs --tail 50 consulting-app-green")
        print(stdout.read().decode())
        print(stderr.read().decode())
                    
    finally:
        client.close()

if __name__ == '__main__':
    check_logs()
