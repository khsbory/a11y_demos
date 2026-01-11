import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def read_portal_configs():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        path1 = "/usr/local/etc/nginx/sites-available/f20b274f-9659-4a39-9e61-0c89a245febd.w3conf"
        path2 = "/usr/local/etc/nginx/sites-available/f6be9d93-ad8f-4db2-94cf-2876029d61a4.w3conf"
        
        for p in [path1, path2]:
             print(f"--- FILE: {p} ---")
             stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S cat {p}")
             print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    read_portal_configs()
