import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def nginx_diagnostic():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print("--- NGINX -T (Syntax Check) ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S nginx -t")
        print(stdout.read().decode())
        print(stderr.read().decode())
        
        print("\n--- CHECKING IF CONFIG IS LOADED (grep in nginx -T) ---")
        # nginx -T dumps all configs. We check if our domain is there.
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S nginx -T | grep -A 20 'a11y-english-demo.khsruru.com'")
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    nginx_diagnostic()
