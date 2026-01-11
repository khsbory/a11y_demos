import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def read_remote_files():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        files = [
            "/usr/local/etc/nginx/sites-enabled/a11y-english-demo.khsruru.com.conf",
            "/usr/local/etc/nginx/sites-enabled/server.ReverseProxy.conf"
        ]
        
        for f in files:
            print(f"--- FILE: {f} ---")
            # Using sudo cat to ensure we can read it
            stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S cat {f}")
            content = stdout.read().decode()
            if "a11y-english-demo.khsruru.com" in content:
                 print("FOUND domain in this file.")
                 # Print first 20 lines and lines around domain
                 lines = content.split('\n')
                 for i, line in enumerate(lines):
                     if "a11y-english-demo.khsruru.com" in line or i < 20:
                         print(f"{i+1}: {line}")
            else:
                 print("Domain NOT found in this file (or file empty).")
        
    finally:
        client.close()

if __name__ == "__main__":
    read_remote_files()
