import requests
import json
import time
import sys

# Configuration
# BASE_URL = "http://localhost:3000/api/external/notes"
BASE_URL = "https://mynote.khsruru.com/api/external/notes"

def print_result(step, success, message=""):
    status = "PASS" if success else "FAIL"
    print(f"[{status}] | {step}")
    if message:
        print(f"   > {message}")

class APILifecycleTester:
    def __init__(self):
        self.api_key = None
        self.test_note_id = None
        self.user_email = "khsruru@gmail.com"

    def set_key(self, key):
        self.api_key = key

    def get_headers(self, key=None):
        return {
            "x-api-key": key or self.api_key,
            "Content-Type": "application/json"
        }

    def run_tests(self, test_auth_failure_only=False):
        print(f"Starting API Lifecycle Test")
        print(f"Target: {BASE_URL}")
        print("-" * 50)

        if not self.api_key:
            print_result("Check API Key", False, "No API Key provided.")
            return

        if test_auth_failure_only:
            self.test_auth_failure()
            return

        # 1. Authentication Check (Valid Key)
        self.test_auth_success()

        # 2. CRUD: Create Note
        self.test_create_note()

        # 3. CRUD: Verify & Extract Content
        self.test_get_and_extract()

        # 4. CRUD: Soft Delete
        self.test_soft_delete()

        # 5. CRUD: Permanent Delete
        self.test_permanent_delete()

    def test_auth_success(self):
        try:
            response = requests.get(BASE_URL, headers=self.get_headers())
            success = (response.status_code == 200)
            print_result("Authentication Success Check", success, f"Status: {response.status_code}")
        except Exception as e:
            print_result("Authentication Success Check", False, str(e))

    def test_create_note(self):
        try:
            payload = {
                "title": "API Lifecycle Test Note",
                "content": "This is a test note for verifying full API lifecycle. Timestamp: " + str(time.time()),
                "isDraft": False
            }
            response = requests.post(BASE_URL, headers=self.get_headers(), json=payload)
            if response.status_code == 200:
                self.test_note_id = response.json().get('data', {}).get('id')
                print_result("Create Note (POST)", True, f"Created ID: {self.test_note_id}")
            else:
                print_result("Create Note (POST)", False, f"Status: {response.status_code}, {response.text}")
        except Exception as e:
            print_result("Create Note (POST)", False, str(e))

    def test_get_and_extract(self):
        if not self.test_note_id:
            print_result("Verify & Extract", False, "Skipped: No Note ID")
            return
        try:
            response = requests.get(BASE_URL, headers=self.get_headers(), params={"query": "Lifecycle Test"})
            if response.status_code == 200:
                notes = response.json().get('data', [])
                found = any(n['id'] == self.test_note_id for n in notes)
                if found:
                    note = next(n for n in notes if n['id'] == self.test_note_id)
                    content = note.get('content', '')
                    success = "API Lifecycle Test Note" in note['title']
                    print_result("Verify & Extract Content", success, f"Title: {note['title']}, Content Summary: {content[:30]}...")
                else:
                    print_result("Verify & Extract Content", False, "Note not found in search results")
            else:
                print_result("Verify & Extract Content", False, f"Status: {response.status_code}")
        except Exception as e:
            print_result("Verify & Extract Content", False, str(e))

    def test_soft_delete(self):
        if not self.test_note_id:
            print_result("Soft Delete", False, "Skipped: No Note ID")
            return
        try:
            response = requests.delete(f"{BASE_URL}?id={self.test_note_id}", headers=self.get_headers())
            success = (response.status_code == 200)
            print_result("Soft Delete (DELETE)", success, response.json().get('message'))
        except Exception as e:
            print_result("Soft Delete (DELETE)", False, str(e))

    def test_permanent_delete(self):
        if not self.test_note_id:
            print_result("Permanent Delete", False, "Skipped: No Note ID")
            return
        try:
            response = requests.delete(f"{BASE_URL}?id={self.test_note_id}&force=true", headers=self.get_headers())
            success = (response.status_code == 200)
            print_result("Permanent Delete (DELETE force=true)", success, response.json().get('message'))
        except Exception as e:
            print_result("Permanent Delete (DELETE force=true)", False, str(e))

    def test_auth_failure(self):
        try:
            response = requests.get(BASE_URL, headers=self.get_headers())
            success = (response.status_code == 401)
            print_result("Revocation Auth Failure Check", success, f"Expected 401, Got {response.status_code}")
        except Exception as e:
            print_result("Revocation Auth Failure Check", False, str(e))

if __name__ == "__main__":
    tester = APILifecycleTester()
    if len(sys.argv) > 1:
        key = sys.argv[1]
        failure_only = "--failure-only" in sys.argv
        tester.set_key(key)
        tester.run_tests(test_auth_failure_only=failure_only)
    else:
        print("Usage: python api_lifecycle_test.py <API_KEY> [--failure-only]")
