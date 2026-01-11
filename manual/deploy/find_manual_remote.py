
import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def find_manual():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print("--- SEARCHING FOR 'manual' FOLDER ---")
        stdin, stdout, stderr = client.exec_command("find /volume1/docker/projects/ -name manual -type d")
        print(stdout.read().decode())
        
        print("\n--- CHECKING DIRECTORIES IN /volume1/docker/projects/ ---")
        stdin, stdout, stderr = client.exec_command("ls -F /volume1/docker/projects/")
        print(stdout.read().decode())
                    
    finally:
        client.close()

if __name__ == '__main__':
    find_manual()
