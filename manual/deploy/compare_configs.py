import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def compare_configs_and_sni():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print("--- MYNOTE CONFIG (/usr/local/etc/nginx/sites-enabled/mynote.conf) ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S cat /usr/local/etc/nginx/sites-enabled/mynote.conf")
        print(stdout.read().decode())
        
        print("\n--- SNI TEST for a11y-english-demo.khsruru.com ---")
        # Testing what certificate is actually served locally on the NAS for this domain
        sni_cmd = "echo | openssl s_client -connect localhost:443 -servername a11y-english-demo.khsruru.com 2>/dev/null | openssl x509 -noout -subject -issuer"
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S {sni_cmd}")
        print(stdout.read().decode())

        print("\n--- SNI TEST for mynote.khsruru.com ---")
        sni_cmd_mynote = "echo | openssl s_client -connect localhost:443 -servername mynote.khsruru.com 2>/dev/null | openssl x509 -noout -subject -issuer"
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S {sni_cmd_mynote}")
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    compare_configs_and_sni()
