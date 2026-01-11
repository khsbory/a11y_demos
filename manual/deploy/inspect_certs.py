import paramiko
import json

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def inspect_certificates():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        # Check INFO file which contains mapping of directory names to domains
        info_path = "/usr/syno/etc/certificate/_archive/INFO"
        print(f"--- CERTIFICATE INFO: {info_path} ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S cat {info_path}")
        info_json = stdout.read().decode()
        print(info_json)
        
        try:
            info_data = json.loads(info_json)
            for cert_id, cert_info in info_data.items():
                print(f"ID: {cert_id}, Description: {cert_info.get('desc')}, Services: {list(cert_info.get('services', {{}}).keys())}")
        except:
            pass

        # Inspect specific certificate
        cert_path = "/usr/syno/etc/certificate/_archive/DLeTgl/cert.pem"
        print(f"\n--- INSPECTING CERT: {cert_path} ---")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S openssl x509 -in {cert_path} -text -noout | grep -E 'Subject:|DNS:'")
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    inspect_certificates()
