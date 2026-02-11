import requests
import json
import uuid

API_URL = "http://127.0.0.1:8000/api/v1/analytics/events"

def test_analytics():
    event = {
        "anonymous_id":str(uuid.uuid4()),
        "event_type": "test_event",
        "event_name": "debug_script_run",
        "event_data": {"status": "running", "safe_param": "ok"}
    }
    
    print(f"Sending event: {json.dumps(event, indent=2)}")
    try:
        response = requests.post(API_URL, json=event)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201 or response.status_code == 200:
            print("SUCCESS: Event logged.")
        else:
            print("FAILURE: Could not log event.")
    except Exception as e:
        print(f"ERROR: {e}")

def test_pii_rejection():
    event = {
        "anonymous_id":str(uuid.uuid4()),
        "event_type": "test_event",
        "event_name": "pii_test",
        "event_data": {"password": "secret_password"}
    }
    print(f"\nSending PII event (should fail): {json.dumps(event, indent=2)}")
    try:
        response = requests.post(API_URL, json=event)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 422:
             print("SUCCESS: PII Rejected.")
        else:
             print("FAILURE: PII was NOT rejected properly.")

    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    print("--- Test 1: Valid Event ---")
    test_analytics()
    print("\n--- Test 2: PII Rejection ---")
    test_pii_rejection()
