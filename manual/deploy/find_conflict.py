import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def find_conflict():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        # We use -L to follow symlinks in grep
        print(f"--- SEARCHING FOR mynote.khsruru.com (Following Symlinks) ---")
        cmd = f"echo '{PASSWORD}' | sudo -S grep -rL 'khsruru.com' /usr/local/etc/nginx/ /etc/nginx/"
        # Actually -l just lists files. I want the content/line.
        cmd = f"echo '{PASSWORD}' | sudo -S grep -rn 'khsruru.com' /usr/local/etc/nginx/ /etc/nginx/"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    find_conflict()
