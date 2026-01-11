import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def update_nginx_redirect():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        config_path = f"/usr/local/etc/nginx/sites-enabled/{DOMAIN}.conf"
        
        new_config = f"""
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
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }}
}}
"""
        print(f"Update Nginx config at {config_path}...")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S cat > {config_path}")
        stdin.write(new_config)
        stdin.close()
        
        if stdout.channel.recv_exit_status() == 0:
            print("Successfully updated Nginx config.")
            print("Reloading Nginx...")
            stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S nginx -s reload")
            if stdout.channel.recv_exit_status() == 0:
                print("Nginx reloaded successfully.")
            else:
                print(f"Error reloading Nginx: {stderr.read().decode()}")
        else:
            print(f"Error updating config: {stderr.read().decode()}")
            
    finally:
        client.close()

if __name__ == "__main__":
    update_nginx_redirect()
