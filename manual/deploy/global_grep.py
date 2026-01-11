import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def global_grep():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        search_paths = [
            "/etc/nginx/",
            "/usr/local/etc/nginx/",
            "/usr/syno/etc/www/certificate/"
        ]
        
        for path in search_paths:
            print(f"--- SEARCHING IN {path} ---")
            stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S grep -r '{DOMAIN}' {path}")
            print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    global_grep()
