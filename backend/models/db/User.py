import logging
from sqlalchemy import Column, Integer, String
from lib.Db import Base, BaseMixin
from models.db.types import Email

log = logging.getLogger(__name__)


class Role(object):
    ADMIN = 'ADMIN'
    GUEST = 'GUEST'

    @staticmethod
    def to_list():
        return [Role.ADMIN, Role.GUEST]


class User(BaseMixin, Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(32))
    email = Column(Email)
    password = Column(String(32))
    role = Column(String(32))

    def __repr__(self):
        return '<User %s>' % self.name

    @classmethod
    def skip_to_dict(cls, key):
        return key == 'password'

    def is_admin(self):
        return hasattr(self, 'role') and self.role == Role.ADMIN

    def put_to(self, data, null=None):
        for k in ['name', 'email', 'role']:
            v = self.__table__.columns.get(k)
            if v is None and null is not True:
                continue
            data[k] = getattr(self, k)

    def dict(self, null=None):
        res = {}
        self.put_to(res)
        return res
