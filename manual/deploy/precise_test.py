import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def precise_test():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print("Cleaning up backup config...")
        client.exec_command(f"echo '{PASSWORD}' | sudo -S rm /usr/local/etc/nginx/sites-enabled/mynote.conf.bak")
        
        print("Reloading Nginx...")
        client.exec_command(f"echo '{PASSWORD}' | sudo -S nginx -s reload")
        
        print(f"\n--- TESTING LOCALHOST with Host: {DOMAIN} (Port 80) ---")
        cmd = f"curl -Iv -H 'Host: {DOMAIN}' http://localhost 2>&1 | grep -E '> Host:|< HTTP/|Location:'"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
        print(f"\n--- TESTING LOCALHOST with Host: {DOMAIN} (Port 443) ---")
        # -k to ignore cert warnings since we just want to see if it matches the SNI block
        cmd = f"curl -Ikv -H 'Host: {DOMAIN}' https://localhost 2>&1 | grep -E 'Server certificate:|subject:|CN='"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    precise_test()
