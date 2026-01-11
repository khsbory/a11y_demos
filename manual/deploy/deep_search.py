import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def deep_search():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print(f"--- SEARCHING FOR {DOMAIN} IN ALL CONFIGS ---")
        # Search in all config directories, including sites-available and subfolders
        cmd = f"echo '{PASSWORD}' | sudo -S grep -r '{DOMAIN}' /usr/local/etc/nginx/ /etc/nginx/ /usr/syno/etc/www/ /usr/syno/share/nginx/ /etc/httpd/"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
        print("\n--- LISTING SITES-AVAILABLE ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S ls -la /usr/local/etc/nginx/sites-available/")
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    deep_search()
