from typing import Optional
from models.api.base import BaseModel, UserType


class User(BaseModel):
    name: Optional[UserType.name]
    email: Optional[UserType.email]


class ResponseUser(User):
    role: Optional[str]


class GetUserRequest(BaseModel):
    pass


class GetUserResponse(ResponseUser):
    pass


class SetUserRequest(BaseModel):
    name: UserType.name
    email: UserType.email


class SetUserResponse(ResponseUser):
    pass


class LoginUserRequest(BaseModel):
    name: UserType.name
    password: UserType.password


class LoginUserResponse(BaseModel):
    name: UserType.name
    email: UserType.email
    role: str


class LogoutUserRequest(BaseModel):
    pass


class LogoutUserResponse(BaseModel):
    pass
