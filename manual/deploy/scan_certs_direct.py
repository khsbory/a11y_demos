
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
        
        # Fast way to find the folder containing our domain
        cmd = "sudo find /usr/syno/etc/certificate/_archive/ -name cert.pem -exec openssl x509 -in {} -noout -subject -nameopt RFC2253 \; -print"
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S {cmd}")
        
        output = stdout.read().decode().strip()
        print(output)
        
    finally:
        client.close()

if __name__ == '__main__':
    scan_certs()
