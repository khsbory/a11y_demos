
import paramiko
import sys

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def find_config():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        # 1. deploy_to_synology.py에 명시된 경로 확인
        path1 = "/usr/local/etc/nginx/sites-enabled/mynote.conf"
        stdin, stdout, stderr = client.exec_command(f"ls -l {path1}")
        res1 = stdout.read().decode().strip()
        if res1:
            print(f"FOUND (specified in script): {res1}")
            stdin, stdout, stderr = client.exec_command(f"cat {path1}")
            print("\n--- CONTENT ---\n")
            print(stdout.read().decode())
        
        # 2. DSM 표준 리버스 프록시 경로 확인
        print("\n--- Checking standard DSM Reverse Proxy paths ---")
        paths = ["/etc/nginx/sites-enabled", "/usr/local/etc/nginx/sites-enabled", "/etc/nginx/conf.d"]
        for p in paths:
            stdin, stdout, stderr = client.exec_command(f"grep -l 'mynote.khsruru.com' {p}/* 2>/dev/null")
            res = stdout.read().decode().strip()
            if res:
                print(f"FOUND in {p}:")
                for f in res.split('\n'):
                    print(f"  - {f}")
                    # Read the first found file
                    stdin2, stdout2, stderr2 = client.exec_command(f"cat {f}")
                    print(f"\n--- CONTENT of {f} ---\n")
                    print(stdout2.read().decode())
                    break
                    
    finally:
        client.close()

if __name__ == '__main__':
    find_config()
