import logging
from sqlalchemy import types
from lib.validators import RE_EMAIL

log = logging.getLogger(__name__)


class Email(types.TypeDecorator):
    impl = types.Unicode
    cache_ok = True

    @property
    def python_type(self):
        return str

    def process_bind_param(self, value, dialect):
        if not RE_EMAIL.fullmatch(value):
            log.error(f"Email validation, value='{value}'")
            raise ValueError("Validation failed")
        return value

    def process_literal_param(self, value, dialect):
        return value

    def process_result_value(self, value, dialect):
        return value

    def copy(self, **kw):
        return Email(self.impl.length)
