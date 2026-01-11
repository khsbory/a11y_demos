import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def apply_reorg():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        # 1. Restore mynote.conf to original (only first server block)
        print("Restoring mynote.conf...")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S cat /usr/local/etc/nginx/sites-enabled/mynote.conf")
        content = stdout.read().decode()
        # Find the end of the first server block
        original_end = content.find("# --- MERGED")
        if original_end != -1:
            original_mynote = content[:original_end].strip()
            stdin, stdout, stderr = client.exec_command(f"sudo -S tee /usr/local/etc/nginx/sites-enabled/mynote.conf > /dev/null")
            stdin.write(f"{PASSWORD}\n")
            stdin.write(original_mynote)
            stdin.close()
            stdout.channel.recv_exit_status()
        
        # 2. Create 00-consulting.conf
        config_path = "/usr/local/etc/nginx/sites-enabled/00-consulting.conf"
        new_config = f"""
server {{
    listen 80;
    listen [::]:80;
    server_name {DOMAIN};
    return 301 https://$host$request_uri;
}}

server {{
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name {DOMAIN};

    ssl_certificate /usr/syno/etc/certificate/_archive/DLeTgl/fullchain.pem;
    ssl_certificate_key /usr/syno/etc/certificate/_archive/DLeTgl/privkey.pem;

    location / {{
        proxy_pass http://localhost:5002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }}
}}
"""
        print(f"Creating {config_path}...")
        stdin, stdout, stderr = client.exec_command(f"sudo -S tee {config_path} > /dev/null")
        stdin.write(f"{PASSWORD}\n")
        stdin.write(new_config)
        stdin.close()
        stdout.channel.recv_exit_status()
        
        print("Reloading Nginx...")
        client.exec_command(f"echo '{PASSWORD}' | sudo -S nginx -s reload")
        
        print("\n--- FINAL VERIFICATION with Host header (Port 80) ---")
        cmd = f"curl -Iv -H 'Host: {DOMAIN}' http://localhost 2>&1 | grep -E '> Host:|< HTTP/|Location:'"
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    apply_reorg()
