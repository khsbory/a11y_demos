import paramiko
import time

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def apply_high_priority_config():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        # 1. Clean up old files in sites-enabled
        print("Cleaning up sites-enabled...")
        client.exec_command(f"echo '{PASSWORD}' | sudo -S rm /usr/local/etc/nginx/sites-enabled/00-consulting.conf")
        client.exec_command(f"echo '{PASSWORD}' | sudo -S rm /usr/local/etc/nginx/sites-enabled/a11y-english-demo.khsruru.com.conf")
        
        # 2. Create new config in /etc/nginx/conf.d/http.a11y.conf
        config_path = "/etc/nginx/conf.d/http.a11y.conf"
        new_config = f"""
server {{
    listen 80;
    listen [::]:80;
    server_name {DOMAIN};
    
    # Force Redirect to HTTPS
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
        
        print("Testing and Reloading Nginx...")
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S nginx -t && echo '{PASSWORD}' | sudo -S nginx -s reload")
        print(stdout.read().decode())
        print(stderr.read().decode())
        
        print("\n--- FINAL SNI TEST ---")
        cmd = f"echo | openssl s_client -connect localhost:443 -servername {DOMAIN} 2>/dev/null | openssl x509 -noout -subject"
        stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S {cmd}")
        print(stdout.read().decode())
        
    finally:
        client.close()

if __name__ == "__main__":
    apply_high_priority_config()
