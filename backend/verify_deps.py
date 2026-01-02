
import sys

def check_import(module_name, package_name=None):
    if package_name is None:
        package_name = module_name
    try:
        __import__(module_name)
        print(f"✅ {package_name} imported successfully")
        return True
    except ImportError as e:
        print(f"❌ {package_name} FAILED (ImportError): {e}")
        return False
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"❌ {package_name} ERROR: {e}")
        return False

print("--- Starting Comprehensive Dependency Check ---")
all_good = True

# Core
all_good &= check_import("fastapi")
all_good &= check_import("uvicorn")
all_good &= check_import("sqlalchemy")
all_good &= check_import("pydantic")
all_good &= check_import("pydantic_settings", "pydantic-settings")

# Crypto
all_good &= check_import("jose", "python-jose")
all_good &= check_import("passlib", "passlib")
all_good &= check_import("cryptography", "cryptography")

# External Services
all_good &= check_import("supabase", "supabase")
all_good &= check_import("simple_salesforce", "simple-salesforce")
all_good &= check_import("pinecone", "pinecone-client")
all_good &= check_import("sentence_transformers", "sentence-transformers")

# Websockets (Recent failure point)
try:
    from websockets.asyncio.client import ClientConnection
    print("✅ websockets (asyncio) imported successfully")
except ImportError as e:
    print(f"❌ websockets FAILED: {e}")
    all_good = False

if all_good:
    print("\n🎉 ALL DEPENDENCIES VERIFIED. Backend should start.")
    sys.exit(0)
else:
    print("\n⚠️ SOME DEPENDENCIES FAILED. Installing fixes...")
    sys.exit(1)
