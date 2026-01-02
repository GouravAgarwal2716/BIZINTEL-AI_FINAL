from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.supabase import supabase

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        # Validate token via Supabase API (Handles HS256, ES256, etc.)
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user session",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return {
            "id": user.id,
            "email": user.email,
            "metadata": user.app_metadata
        }
    except Exception as e:
        print(f"❌ Auth Verification Failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
