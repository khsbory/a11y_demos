
import paramiko

HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

def diagnose():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        DOCKER = "/var/packages/ContainerManager/target/usr/bin/docker"
        SYNO_CTL = "/usr/syno/bin/synosystemctl"
        
        commands = [
            f"echo '{PASSWORD}' | sudo -S {DOCKER} ps -a",
            f"echo '{PASSWORD}' | sudo -S {DOCKER} images",
            f"echo '{PASSWORD}' | sudo -S {SYNO_CTL} status pkgctl-ContainerManager",
        ]
        
        for cmd in commands:
            print(f"\n--- EXECUTING: {cmd} ---")
            if "sudo" in cmd:
                cmd_to_run = f"echo '{PASSWORD}' | sudo -S {cmd}"
            else:
                cmd_to_run = cmd
                
            stdin, stdout, stderr = client.exec_command(cmd_to_run)
            out = stdout.read().decode('utf-8', 'replace').strip()
            err = stderr.read().decode('utf-8', 'replace').strip()
            
            if out: print(f"STDOUT:\n{out}")
            if err: print(f"STDERR:\n{err}")
                    
    finally:
        client.close()

if __name__ == '__main__':
    diagnose()
