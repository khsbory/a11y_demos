
import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'
CERT_ID = 'DLeTgl'
TARGET_PORT = 5001  # Target port for the new project (5001/5002)

config_content = f"""
server {{
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name {DOMAIN};

    ssl_certificate /usr/syno/etc/certificate/_archive/{CERT_ID}/fullchain.pem;
    ssl_certificate_key /usr/syno/etc/certificate/_archive/{CERT_ID}/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    location / {{
        proxy_pass http://localhost:{TARGET_PORT};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }}
}}
"""

def apply_config():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        tmp_path = f"/tmp/{DOMAIN}.conf"
        remote_path = f"/usr/local/etc/nginx/sites-enabled/{DOMAIN}.conf"
        
        # 1. Create the config file in /tmp first
        print(f"Creating temporary config file at {tmp_path}...")
        stdin, stdout, stderr = client.exec_command(f"cat > {tmp_path}")
        stdin.write(config_content)
        stdin.close()
        stdout.channel.recv_exit_status()

        # 2. Move it to the final location with sudo
        print(f"Moving config to {remote_path}...")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S mv {tmp_path} {remote_path}")
        if stdout.channel.recv_exit_status() != 0:
            print(f"FAILED to move config: {stderr.read().decode()}")
            return

        # 2. Test Nginx config
        print("Testing Nginx configuration...")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S nginx -t")
        if stdout.channel.recv_exit_status() != 0:
            print(f"Nginx config test FAILED: {stderr.read().decode()}")
            return
        
        # 3. Reload Nginx
        print("Reloading Nginx...")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S nginx -s reload")
        if stdout.channel.recv_exit_status() != 0:
            print(f"Nginx reload FAILED: {stderr.read().decode()}")
            return
            
        print("Successfully applied Nginx reverse proxy configuration!")
                    
    finally:
        client.close()

if __name__ == '__main__':
    apply_config()
