import paramiko
import time

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'
DOMAIN = 'a11y-english-demo.khsruru.com'

def apply_fix_v2():
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
    
    # HTTP to HTTPS Redirect
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
        print(f"Applying fix to {config_path} using direct stdin write...")
        stdin, stdout, stderr = client.exec_command(f"sudo -S tee {config_path} > /dev/null")
        stdin.write(f"{PASSWORD}\n")
        stdin.flush()
        time.sleep(0.5) # Wait for sudo to consume password
        stdin.write(new_config)
        stdin.flush()
        stdin.close()
        
        exit_status = stdout.channel.recv_exit_status()
        if exit_status == 0:
            print("Config written successfully.")
            # Verify immediately
            stdin, stdout, stderr = client.exec_command(f"echo '{PASSWORD}' | sudo -S cat {config_path}")
            content = stdout.read().decode()
            if DOMAIN in content:
                print("VERIFIED: Domain found in file.")
                print("Reloading Nginx...")
                client.exec_command(f"echo '{PASSWORD}' | sudo -S nginx -s reload")
                print("Nginx reloaded.")
            else:
                print("FAILURE: File is still empty or doesn't contain domain.")
        else:
            print(f"Tee failed with exit code: {exit_status}")

    finally:
        client.close()

if __name__ == "__main__":
    apply_fix_v2()
