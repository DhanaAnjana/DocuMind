from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
import os

from .models import User
from .database import get_db

router = APIRouter()

class GoogleToken(BaseModel):
    token: str

@router.post("/auth/google")
def google_login(data: GoogleToken, db = Depends(get_db)):
    try:
        idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )

        user_email = idinfo["email"]
        user_name = idinfo["name"]
        user_picture = idinfo["picture"]

        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            user = User(email=user_email, name=user_name, picture=user_picture)
            db.add(user)
            db.commit()

        return {
            "email": user_email,
            "name": user_name,
            "picture": user_picture
        }

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")
