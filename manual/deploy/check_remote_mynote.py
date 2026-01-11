
import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def check_mynote():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print("--- MYNOTE PROJECT STRUCTURE ---")
        stdin, stdout, stderr = client.exec_command("ls -R /volume1/docker/projects/my_note")
        print(stdout.read().decode())
        
        print("\n--- ACTIVE COLOR CHECK ---")
        stdin, stdout, stderr = client.exec_command("sudo /var/packages/ContainerManager/target/usr/bin/docker ps -a")
        print(stdout.read().decode())
                    
    finally:
        client.close()

if __name__ == '__main__':
    check_mynote()
