from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
Session = sessionmaker()  # autocommit=True, autoflush=True)


def bind_engine(engine):
    Base.metadata.bind = engine
    Session.configure(bind=engine)


def get_db():
    return Session()


class BaseMixin(object):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @classmethod
    def skip_to_dict(cls, _):
        """Field filter (should be implemented in model subclass)
        Return True if :key field should be excluded during converting into dict
        Example:
            return key == 'password'  # exclude password from export
        :_|key (str) - field name
        :returns (bool)"""
        return False

    @classmethod
    def delete_from(cls, data):
        """Deletes current models keys from data (dict)"""
        [data.pop(k) for k in cls.__table__.columns.keys() if k in data]

    def merge_from(self, data, null=None):
        """Overwrites current models fields from from data (dict)"""
        existing_keys = self.__class__.__table__.columns.keys()
        for k, v in data.items():
            if (k not in existing_keys) or (k is None and null is not True):
                continue
            setattr(self, 'k', v)
        return self

    def dict(self, none=None):
        """Returns fields as dict
        :none (bool|None):
            - True: include keys with None value in result dict
            - False|None: exclude keys with None value from result dict"""
        res = {}
        for c in self.__table__.columns:
            v = getattr(self, c.name)
            if self.__class__.skip_to_dict(c.name) or (v is None and none is not True):
                continue
            res[c.name] = v
        return res
