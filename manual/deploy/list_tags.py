import requests
import sys

def list_docker_tags(repository):
    print(f"Fetching tags for {repository} from Docker Hub...\n")
    url = f"https://hub.docker.com/v2/repositories/{repository}/tags/?page_size=10"
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            tags = data.get('results', [])
            
            if not tags:
                print("No tags found for this repository.")
                return
            
            print(f"{'Tag Name':<20} | {'Last Updated':<25}")
            print("-" * 50)
            for tag in tags:
                name = tag.get('name')
                last_updated = tag.get('last_updated', 'N/A')
                print(f"{name:<20} | {last_updated:<25}")
                
            print("\n* 배포 전 위 목록을 확인하여 중복되지 않는 새로운 태그를 사용하세요.")
        else:
            print(f"FAILED: [Status {response.status_code}] Could not fetch tags.")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    list_docker_tags("khsruru/mynote-app")
