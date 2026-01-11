import paramiko
import os

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def read_nginx_config():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        config_path = f"/usr/local/etc/nginx/sites-enabled/{DOMAIN}.conf"
        
        print(f"--- NGINX CONFIG: {config_path} ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S cat {config_path}")
        print(stdout.read().decode())
        
        print("--- CHECKING FOR PORT 80 LISTENERS ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S grep -r 'listen 80' /usr/local/etc/nginx/sites-enabled/")
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    read_nginx_config()
