
import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def scan_certs():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        # List all subdirectories in _archive
        stdin, stdout, stderr = client.exec_command("sudo ls /usr/syno/etc/certificate/_archive/")
        dirs = stdout.read().decode().strip().split('\n')
        
        for d in dirs:
            if d == 'INFO' or not d: continue
            
            cert_path = f"/usr/syno/etc/certificate/_archive/{d}/cert.pem"
            cmd = f"sudo openssl x509 -in {cert_path} -noout -subject"
            stdin, stdout, stderr = client.exec_command(cmd)
            subject = stdout.read().decode().strip()
            print(f"ID: {d} | SUBJECT: {subject}")
                    
    finally:
        client.close()

if __name__ == '__main__':
    scan_certs()
