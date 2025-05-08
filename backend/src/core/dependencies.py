from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends

from src.models.user import User
from src.core.security import get_current_user

GetCurrentUser = Annotated[User, Depends(get_current_user)]