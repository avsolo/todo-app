from pydantic import BaseModel as PydanticBaseModel, Extra, constr, conint
from lib.validators import RE_EMAIL


class BaseModel(PydanticBaseModel):

    def dict(self, *args, **kwargs):
        kwargs['exclude_none'] = self.Config.exclude_none
        return super().dict(*args, **kwargs)

    class Config:
        orm_mode = True
        exclude_none = True
        extra = Extra.forbid


# Validators


class Int:
    ge_zero = conint(gt=-1)


def cstr(mal=32):
    return constr(min_length=1, max_length=mal, strip_whitespace=True)


class TaskType:
    summary = cstr(1024)


class UserType:
    name = cstr(32)
    email = constr(regex=RE_EMAIL.pattern, max_length=64)
    password = constr(min_length=3, max_length=32)
