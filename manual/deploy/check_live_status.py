import requests
import sys

def check_url(url):
    print(f"Checking {url}...")
    try:
        # Use a common User-Agent to avoid some basic bot blocks
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print(f"SUCCESS: [Status {response.status_code}] Server is UP and responding correctly.")
            return True
        elif response.status_code == 502:
            print(f"FAILED: [Status 502] Bad Gateway. The server or proxy is not working correctly.")
            return False
        else:
            print(f"WARNING: [Status {response.status_code}] Server responded but not with 200 OK.")
            return False
    except Exception as e:
        print(f"ERROR: Could not connect to the server. {e}")
        return False

if __name__ == "__main__":
    urls = [
        "https://a11y-english-demo.khsruru.com/",
        "https://a11y-english-demo.khsruru.com/api/products"
    ]
    
    all_passed = True
    for url in urls:
        if not check_url(url):
            all_passed = False
            
    if all_passed:
        print("\nAll live status checks PASSED! The server is healthy.")
        sys.exit(0)
    else:
        print("\nSome live status checks FAILED. Please investigate.")
        sys.exit(1)
