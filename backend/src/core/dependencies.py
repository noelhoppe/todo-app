# --- EXTERN IMPORTS ---
from typing import Annotated
from fastapi import Depends

# --- INTERN IMPORTS ---
from src.models.user import User
from src.core.security import get_current_user_with_refresh_fallback

GetCurrentUserWithRefresh = Annotated[User, Depends(get_current_user_with_refresh_fallback)]