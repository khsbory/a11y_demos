
import paramiko
import json

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def find_cert_path():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        # DSM stores certificate info in a JSON-like INFO file
        stdin, stdout, stderr = client.exec_command("sudo cat /usr/syno/etc/certificate/_archive/INFO")
        info_content = stdout.read().decode().strip()
        
        if not info_content:
            print("Could not read /usr/syno/etc/certificate/_archive/INFO")
            return

        info = json.loads(info_content)
        for cert_id, cert_data in info.items():
             # Check for main domain or subject alternative names
             if cert_data.get('common_name') == DOMAIN or DOMAIN in cert_data.get('subject_alt_names', []):
                 print(f"FOUND_CERT_ID: {cert_id}")
                 print(f"PATH: /usr/syno/etc/certificate/_archive/{cert_id}/")
                 return
        
        print(f"Cert for {DOMAIN} not found in INFO file.")
                    
    finally:
        client.close()

if __name__ == '__main__':
    find_cert_path()
