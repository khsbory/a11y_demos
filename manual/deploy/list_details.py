import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def list_details():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print("--- LS -LA SITE-ENABLED ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S ls -la /usr/local/etc/nginx/sites-enabled/")
        print(stdout.read().decode())
        
        print("\n--- STAT on a11y file ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S stat /usr/local/etc/nginx/sites-enabled/a11y-english-demo.khsruru.com.conf")
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    list_details()
