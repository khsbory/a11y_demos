import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def read_nginx_conf():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        print("Reading nginx.conf (lines 450-650)...")
        stdin, stdout, stderr = client.exec_command("sed -n '450,650p' /etc/nginx/nginx.conf")
        print(stdout.read().decode())
        
        print("\nChecking for include directives in nginx.conf...")
        stdin, stdout, stderr = client.exec_command("grep 'include' /etc/nginx/nginx.conf")
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    read_nginx_conf()
