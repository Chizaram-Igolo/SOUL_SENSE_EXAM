
import sqlite3
import os
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.config import DB_PATH

def check_schema():
    if not os.path.exists(DB_PATH):
        print(f"❌ DB not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("Checking schema for 'journal_entries'...")
    try:
        cursor.execute("PRAGMA table_info(journal_entries)")
        columns = cursor.fetchall()
        col_names = [col[1] for col in columns]
        
        if 'user_id' not in col_names:
            print("❌ 'user_id' column is MISSING!")
            print("🔧 Attempting to add 'user_id' column...")
            cursor.execute("ALTER TABLE journal_entries ADD COLUMN user_id INTEGER REFERENCES users(id)")
            conn.commit()
            print("✅ 'user_id' column added.")
        else:
            print("✅ 'user_id' column exists.")
            
    except Exception as e:
        print(f"❌ Error checking journal_entries: {e}")

    print("\nChecking schema for 'question_cache'...")
    try:
        cursor.execute("PRAGMA table_info(question_cache)")
        columns = cursor.fetchall()
        col_names = [col[1] for col in columns]
        
        needed_cols = {
            'min_age': 'INTEGER DEFAULT 0',
            'max_age': 'INTEGER DEFAULT 120'
        }
        
        for col_name, col_def in needed_cols.items():
            if col_name not in col_names:
                print(f"❌ '{col_name}' column is MISSING!")
                print(f"🔧 Attempting to add '{col_name}' column...")
                cursor.execute(f"ALTER TABLE question_cache ADD COLUMN {col_name} {col_def}")
                conn.commit()
                print(f"✅ '{col_name}' column added.")
            else:
                print(f"✅ '{col_name}' column exists.")

    except Exception as e:
        print(f"❌ Error checking question_cache: {e}")

    print("\nChecking schema for 'question_bank'...")
    try:
        cursor.execute("PRAGMA table_info(question_bank)")
        columns = cursor.fetchall()
        col_names = [col[1] for col in columns]
        
        needed_cols = {
            'min_age': 'INTEGER DEFAULT 0',
            'max_age': 'INTEGER DEFAULT 120'
        }
        
        for col_name, col_def in needed_cols.items():
            if col_name not in col_names:
                print(f"❌ '{col_name}' column is MISSING!")
                print(f"🔧 Attempting to add '{col_name}' column...")
                cursor.execute(f"ALTER TABLE question_bank ADD COLUMN {col_name} {col_def}")
                conn.commit()
                print(f"✅ '{col_name}' column added.")
            else:
                print(f"✅ '{col_name}' column exists.")

    except Exception as e:
        print(f"❌ Error checking question_bank: {e}")

    conn.close()

if __name__ == "__main__":
    check_schema()

if __name__ == "__main__":
    check_schema()
