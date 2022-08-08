from fastapi import APIRouter, Request, HTTPException
from sqlalchemy import select
import models.api.user as api
from models.db.User import User
from config import cfg


router = APIRouter(prefix=f"{cfg.API_PREFIX}/user")


@router.get('/get', response_model=api.GetUserResponse)
async def get_user(req: Request):
    return User(**dict(req.session)).dict() if 'name' in req.session else {}


@router.post('/set', response_model=api.SetUserResponse)
async def set_user(user: api.SetUserRequest, req: Request):
    for f in ['name', 'email']:
        req.session[f] = getattr(user, f)
    req.session['role'] = None
    return user


@router.post('/login', response_model=api.LoginUserResponse)
def user_login(usr: api.LoginUserRequest, req: Request):
    """Logins user from post data (username, password)
    Returns:
        ( dict([user]) | error )
    """
    stmt = select(User).where(User.name == usr.name, User.password == usr.password)
    user = req.state.db.execute(stmt).scalars().first()
    if not (user and user.is_admin()):  # Only admin role
        raise HTTPException(status_code=403, detail=[{"loc": ["body", "api"], "msg": "Logging in failed"}])
    user.put_to(req.session)
    return user.dict()


@router.post('/logout', response_model=api.LogoutUserResponse)
def user_logout(req: Request):
    """Removes user from session"""
    User.delete_from(req.session)
    return {}
