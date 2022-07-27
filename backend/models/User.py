import logging
from lib.Model import Model, Table
from lib.validators import Str
from models.fields import Validator


log = logging.getLogger(__name__)


class Role(object):
    ADMIN = 'ADMIN'
    GUEST = 'GUEST'

    @staticmethod
    def to_list():
        return [Role.ADMIN, Role.GUEST]


class User(Model):

    TABLE = Table("users", {
        "id": {'index': True},
        "name": {"validator": Validator.name},
        "email": {"validator": Validator.email},
        "role": {"validator": Str.in_list(Role.to_list())},
        "password": {"validator": Validator.password, 'json': False}
    })

    def __init__(self, **fields):
        super().__init__(User.TABLE, fields)

    def __repr__(self):
        return '<User %s>' % self.name

    def is_admin(self):
        return self.role == Role.ADMIN

    def put_to(self, data, null=None):
        for k in ['name', 'email', 'role']:
            v = self.__dict__['_fields'][k]
            if v is None and null is not True:
                continue
            data[k] = self.__dict__['_fields'][k]

    def dumps(self, null=None):
        res = {}
        self.put_to(res)
        return res
