
import requests
import json

BASE_URL = "https://a11y-english-demo.khsruru.com"

def test_api():
    print(f"🔍 Testing API at {BASE_URL}...")
    
    # 1. Test GET /api/products
    try:
        response = requests.get(f"{BASE_URL}/api/products")
        print(f"✅ GET /api/products: {response.status_code}")
        if response.status_code == 200:
            products = response.json()
            print(f"   Found {len(products)} products.")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

    # 2. Test GET /api/products/none (accessibilityLevel)
    try:
        response = requests.get(f"{BASE_URL}/api/products/none")
        print(f"✅ GET /api/products/none: {response.status_code}")
        if response.status_code == 200:
            products = response.json()
            print(f"   Found {len(products)} products for 'none' level.")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_api()
