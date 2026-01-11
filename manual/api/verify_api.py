import requests
import json

# BASE_URL = "http://localhost:3000/api/external/notes"
BASE_URL = "https://mynote.khsruru.com/api/external/notes"
API_KEY = "sk_test_51Mx2q3Kj9P7n4L8"

headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json"
}

def test_get_notes():
    print("Testing GET /notes...")
    try:
        response = requests.get(BASE_URL, headers=headers)
        if response.status_code == 200:
            print("SUCCESS: Retrieved notes")
            # print(json.dumps(response.json(), indent=2))
        else:
            print(f"FAILED: Status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"ERROR: {e}")

def test_create_and_delete_note():
    print("\nTesting POST /notes (Create)...")
    try:
        new_note = {
            "title": "API Test Note",
            "content": "This note was created by the API verification script.",
            "isDraft": False
        }
        response = requests.post(BASE_URL, headers=headers, json=new_note)
        
        print(f"POST Status Code: {response.status_code}")
        
        try:
            json_response = response.json()
            if response.status_code == 200:
                print("SUCCESS: Note created")
                data = json_response.get('data')
                note_id = data.get('id')
                print(f"Created Note ID: {note_id}")
                
                # Now delete it
                if note_id:
                    print(f"\nTesting DELETE /notes?id={note_id}...")
                    del_response = requests.delete(f"{BASE_URL}?id={note_id}", headers=headers)
                    print(f"DELETE Status Code: {del_response.status_code}")
                    if del_response.status_code == 200:
                        print("SUCCESS: Note deleted (soft)")
                    else:
                        print(f"FAILED: Status {del_response.status_code}")
                        print(del_response.text)
            else:
                print(f"FAILED: Status {response.status_code}")
                print(response.text)
        except json.JSONDecodeError:
            print("FAILED to decode JSON")
            print("Response text:", response.text)

    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_get_notes()
    test_create_and_delete_note()
