from jose import jwt, JWTError
from fastapi import HTTPException, status
from app.core.config import settings

ALGORITHM = "HS256"

def verify_token(token: str):
    try:
        # Debug: Check Headers
        unverified_header = jwt.get_unverified_header(token)
        print(f"🔍 Token Header: {unverified_header}")
        
        if not settings.SUPABASE_JWT_SECRET or settings.SUPABASE_JWT_SECRET == "your-supabase-jwt-secret":
            print("❌ CRITICAL: SUPABASE_JWT_SECRET is unset or default in backend/.env")
        
        payload = jwt.decode(token, settings.SUPABASE_JWT_SECRET, algorithms=[ALGORITHM], options={"verify_aud": False})
        return payload
    except JWTError as e:
        print(f"❌ JWT Validation Error: {str(e)}")
        print(f"Using Secret: {settings.SUPABASE_JWT_SECRET[:4]}... (Length: {len(settings.SUPABASE_JWT_SECRET)})")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
