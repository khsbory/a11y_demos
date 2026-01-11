import paramiko
import sys
import threading
import os
import io

# Configuration (Synced with deploy_to_synology.py)
HOST = 'accessbridge.synology.me'
PORT = 52961
USERNAME = 'khsbory'
PASSWORD = 'Lzt8cry5k$'

# Set stdout encoding to UTF-8 for Windows
if sys.platform == 'win32':
    if hasattr(sys.stdout, 'buffer'):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)
    elif not hasattr(sys.stdout, 'encoding') or sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except (AttributeError, ValueError):
            pass

def interactive_shell(chan):
    import termios
    import tty
    
    oldtty = termios.tcgetattr(sys.stdin)
    try:
        tty.setraw(sys.stdin.fileno())
        tty.setcbreak(sys.stdin.fileno())
        chan.settimeout(0.0)
        
        while True:
            r, w, e = select.select([chan, sys.stdin], [], [])
            if chan in r:
                try:
                    x = chan.recv(1024)
                    if len(x) == 0:
                        sys.stdout.write('\r\n*** EOF\r\n')
                        break
                    sys.stdout.write(x.decode('utf-8', 'replace'))
                    sys.stdout.flush()
                except socket.timeout:
                    pass
            if sys.stdin in r:
                x = sys.stdin.read(1)
                if len(x) == 0:
                    break
                chan.send(x)
                
    finally:
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, oldtty)

def windows_shell(chan):
    # Windows doesn't have termios/tty standard libs easily accessible for raw mode in standard release python without curses
    # falling back to a thread-based simple approach
    
    def write_to_stdout(chan):
        while True:
            if chan.recv_ready():
                data = chan.recv(1024)
                if not data: break
                sys.stdout.buffer.write(data)
                sys.stdout.flush()
    
    t = threading.Thread(target=write_to_stdout, args=(chan,))
    t.daemon = True
    t.start()
    
    print("--- Shell Open (Type 'exit' to quit) ---")
    while True:
        try:
            cmd = input()
            chan.send(cmd + "\n")
        except EOFError:
            break
        except KeyboardInterrupt:
            chan.close()
            break

def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    print(f"🔗 Connecting to {HOST}:{PORT}...")
    try:
        client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return

    chan = client.invoke_shell()
    
    if sys.platform == 'win32':
        windows_shell(chan)
    else:
        # Import only on non-windows
        import select
        interactive_shell(chan)
    
    chan.close()
    client.close()

if __name__ == '__main__':
    main()
