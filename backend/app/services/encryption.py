from cryptography.fernet import Fernet
from app.core.config import settings

# Ensure key is bytes
key = settings.ENCRYPTION_KEY.encode() if isinstance(settings.ENCRYPTION_KEY, str) else settings.ENCRYPTION_KEY
cipher_suite = Fernet(key)

def encrypt_value(value: str) -> str:
    if not value:
        return ""
    return cipher_suite.encrypt(value.encode()).decode()

def decrypt_value(value: str) -> str:
    if not value:
        return ""
    return cipher_suite.decrypt(value.encode()).decode()
