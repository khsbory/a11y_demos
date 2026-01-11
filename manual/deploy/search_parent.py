import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
PARENT_DOMAIN = 'khsruru.com'

def search_parent():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print(f"--- SEARCHING FOR {PARENT_DOMAIN} ---")
        cmd = f"echo '{PASSWORD}' | sudo -S grep -r '{PARENT_DOMAIN}' /usr/local/etc/nginx/ /etc/nginx/"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    search_parent()
