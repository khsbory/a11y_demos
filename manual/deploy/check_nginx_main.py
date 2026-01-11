import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def check_nginx_include():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print("--- NGINX MAIN CONFIG (/etc/nginx/nginx.conf) ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S cat /etc/nginx/nginx.conf")
        print(stdout.read().decode())
        
        print("\n--- CHECKING SITES-ENABLED FOLDER ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S ls -F /usr/local/etc/nginx/sites-enabled/")
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    check_nginx_include()
