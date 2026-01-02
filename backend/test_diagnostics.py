import os
from dotenv import load_dotenv
from supabase import create_client
from cryptography.fernet import Fernet
from simple_salesforce import Salesforce

# Load Env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")

print(f"1. Checking Env Vars...")
if not all([SUPABASE_URL, SUPABASE_KEY, ENCRYPTION_KEY]):
    print("❌ MISSING ENV VARS")
    exit()
print("✅ Env Vars Present")

# Encryption
cipher = Fernet(ENCRYPTION_KEY.encode())

def decrypt(val):
    return cipher.decrypt(val.encode()).decode()

# DB
print(f"2. Connecting to Supabase...")
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    # Get first user settings
    res = supabase.table("user_settings").select("*").limit(1).execute()
    data = res.data
    if not data:
        print("❌ No User Settings found in DB. Did you connect Org?")
        exit()
    print("✅ Supabase Connected. Found User Settings.")
    
    row = data[0]
    print("3. Decrypting Credentials...")
    username = decrypt(row['sf_username'])
    password = decrypt(row['sf_password'])
    token = decrypt(row['sf_security_token'])
    domain = row.get('sf_domain', 'login')
    print(f"   - Username: {username}")
    print(f"   - Domain: {domain}")
    print("✅ Decryption Success")

    print("4. Connecting to Salesforce...")
    sf = Salesforce(username=username, password=password, security_token=token, domain=domain)
    print("✅ Salesforce Authenticated!")
    
    print("5. Testing Query (Leads)...")
    leads = sf.query("SELECT Id, Name FROM Lead LIMIT 1")
    print(f"✅ Query Success! Found {len(leads['records'])} leads.")

except Exception as e:
    print(f"\n❌ FATAL ERROR: {e}")
    import traceback
    traceback.print_exc()
