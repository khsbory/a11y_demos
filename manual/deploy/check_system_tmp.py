
import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def check_system():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print("--- BASIC TEST ---")
        stdin, stdout, stderr = client.exec_command("echo 'SSH_IS_WORKING'")
        print(stdout.read().decode())
        
        print("\n--- DOCKER PATH ---")
        stdin, stdout, stderr = client.exec_command("which docker")
        print(stdout.read().decode())
        
        print("\n--- DOCKER SERVICE STATUS (DSM 7) ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S synosystemctl status pkgctl-ContainerManager")
        print(stdout.read().decode())
        
        print("\n--- DOCKER SERVICE STATUS (OLD DSM) ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S synoservice --status pkgctl-Docker")
        print(stdout.read().decode())
                    
    finally:
        client.close()

if __name__ == '__main__':
    check_system()
