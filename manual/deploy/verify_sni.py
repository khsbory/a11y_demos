import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def verify_sni():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print(f"--- TESTING HTTPS LOCALHOST with SNI: {DOMAIN} ---")
        # We must use -servername for SNI to work with openssl s_client
        cmd = f"echo | openssl s_client -connect localhost:443 -servername {DOMAIN} 2>/dev/null | openssl x509 -noout -subject -issuer"
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S {cmd}")
        print(stdout.read().decode())
        
        print(f"\n--- TESTING HTTPS with CURL ---")
        cmd = f"curl -Ikv -H 'Host: {DOMAIN}' https://localhost 2>&1"
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S {cmd}")
        output = stdout.read().decode()
        for line in output.split('\n'):
             if "Server certificate" in line or "subject:" in line or "common name" in line:
                  print(line)
        
    finally:
        client.close()

if __name__ == "__main__":
    verify_sni()
