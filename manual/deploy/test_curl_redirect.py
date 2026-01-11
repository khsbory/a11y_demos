import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def test_redirect():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print(f"--- TESTING HTTP REDIRECT for {DOMAIN} ---")
        stdin, stdout, stderr = client.exec_command(f"curl -Iv http://{DOMAIN} 2>&1")
        output = stdout.read().decode()
        print(output)
        
        print(f"\n--- TESTING HTTPS CERT for {DOMAIN} ---")
        # Checking what server header and cert we get on 443
        stdin, stdout, stderr = client.exec_command(f"curl -Iv https://{DOMAIN} 2>&1 | head -n 50")
        output = stdout.read().decode()
        print(output)
        
    finally:
        client.close()

if __name__ == "__main__":
    test_redirect()
