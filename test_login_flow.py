import requests
import json

base_url = "http://127.0.0.1:8000/api/v1"

def test_login_wrong_password():
    # 1. Get Captcha
    print("Fetching CAPTCHA...")
    resp = requests.get(f"{base_url}/auth/captcha")
    captcha_data = resp.json()
    print(f"CAPTCHA received: {captcha_data}")

    # 2. Try Login
    payload = {
        "identifier": "testuser",
        "password": "wrongpassword",
        "captcha_input": captcha_data["captcha_code"],
        "session_id": captcha_data["session_id"]
    }
    
    print("\nAttempting login with WRONG password...")
    resp = requests.post(f"{base_url}/auth/login", json=payload)
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")

def test_login_2fa():
    # 1. Get Captcha
    print("\nFetching CAPTCHA for 2FA test...")
    resp = requests.get(f"{base_url}/auth/captcha")
    captcha_data = resp.json()
    
    # 2. Try Login with 2fa user
    payload = {
        "identifier": "2fa@example.com",
        "password": "any",
        "captcha_input": captcha_data["captcha_code"],
        "session_id": captcha_data["session_id"]
    }
    
    print("\nAttempting login for 2FA user...")
    resp = requests.post(f"{base_url}/auth/login", json=payload)
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")

if __name__ == "__main__":
    test_login_wrong_password()
    test_login_2fa()
