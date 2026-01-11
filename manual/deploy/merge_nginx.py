import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def merge_configs():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        # Read current mynote.conf
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S cat /usr/local/etc/nginx/sites-enabled/mynote.conf")
        mynote_content = stdout.read().decode()
        
        # New config blocks to append
        a11y_blocks = f"""
# --- MERGED a11y-english-demo.khsruru.com ---
server {{
    listen 80;
    listen [::]:80;
    server_name {DOMAIN};
    return 301 https://$host$request_uri;
}}

server {{
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name {DOMAIN};

    ssl_certificate /usr/syno/etc/certificate/_archive/DLeTgl/fullchain.pem;
    ssl_certificate_key /usr/syno/etc/certificate/_archive/DLeTgl/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

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
        full_config = mynote_content + a11y_blocks
        
        print("Writing merged config to mynote.conf...")
        stdin, stdout, stderr = client.exec_command(f"sudo -S tee /usr/local/etc/nginx/sites-enabled/mynote.conf > /dev/null")
        stdin.write(f"{PASSWORD}\n")
        stdin.write(full_config)
        stdin.close()
        stdout.channel.recv_exit_status()
        
        print("Removing separate a11y config file...")
        client.exec_command(f"echo '{PASSWORD}' | sudo -S rm /usr/local/etc/nginx/sites-enabled/a11y-english-demo.khsruru.com.conf")
        
        print("Reloading Nginx...")
        client.exec_command(f"echo '{PASSWORD}' | sudo -S nginx -s reload")
        
        print("Final verification with nginx -T...")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S nginx -T | grep -A 50 'mynote.conf'")
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    merge_configs()
