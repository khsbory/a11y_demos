import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def deep_inspect():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print(f"--- SEARCHING FOR {DOMAIN} IN ALL SYSTEM CONFIGS ---")
        # Follow symlinks and search everywhere likely
        cmd = f"echo '{PASSWORD}' | sudo -S grep -rn '{DOMAIN}' /usr/syno/etc/ /etc/ /usr/local/etc/nginx/"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
        print("\n--- CHECKING DSM REDIRECT SETTINGS ---")
        # Check if DSM redirect is enabled in system config
        cmd = f"echo '{PASSWORD}' | sudo -S cat /etc/synoinfo.conf | grep -E 'redirect|https_port|http_port'"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
        print("\n--- CHECKING FOR OTHER DEFAULT SERVERS ---")
        cmd = f"echo '{PASSWORD}' | sudo -S grep -rn 'default_server' /etc/nginx/ /usr/local/etc/nginx/"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    deep_inspect()
