import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def find_5001_redirects():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print("--- SEARCHING FOR '5001' REDIRECTS ---")
        # Search for 5001 in combination with typical redirect keywords
        cmd = f"echo '{PASSWORD}' | sudo -S grep -rE '5001|rewrite|return' /etc/nginx/ /usr/local/etc/nginx/ /usr/syno/etc/www/ | grep '5001' | head -n 50"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
        print("\n--- CHECKING DSM NGINX CONFIGS ---")
        cmd = f"echo '{PASSWORD}' | sudo -S ls -la /usr/local/etc/nginx/conf.d/ /etc/nginx/conf.d/"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    find_5001_redirects()
