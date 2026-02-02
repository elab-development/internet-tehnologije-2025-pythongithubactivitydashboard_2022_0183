import os
from cryptography.fernet import Fernet

def _get_fernet() -> Fernet:
    key = os.getenv("FERNET_KEY")
    if not key:
        raise RuntimeError("FERNET_KEY is not set in environment.")
    return Fernet(key.encode() if isinstance(key, str) else key)

def encrypt_token(token: str) -> str:
    f = _get_fernet()
    return f.encrypt(token.encode()).decode()

def decrypt_token(token_encrypted: str) -> str:
    f = _get_fernet()
    return f.decrypt(token_encrypted.encode()).decode()
