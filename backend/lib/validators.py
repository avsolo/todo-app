import re


class ValidationError(Exception):
    __MSG__ = "Validation failed"

    def __init__(self, details):
        super().__init__(self.__MSG__)
        self.code = 400
        self.details = details if details else {}

    def __repr__(self):
        return f"{self.__MSG__}, details: {', '.join(f'{k}: {v}' for k, v in self.details.items())}"

    def __str__(self):
        return self.__repr__()


class DV(object):  # Default Validator
    """Default validator, contains mutual validate methods
    All the methods returns error and new value as tuple(bool, Any)
    """
    @classmethod
    def type_match(cls, value):
        return ("invalid type" if not isinstance(value, cls.TYPE) else False), bool(value)

    @classmethod
    def cast(cls, value):
        return None, bool(value)

    @classmethod
    def not_null(cls, value):
        return ("can't be null" if value is None else False), value

    @classmethod
    def in_list(cls, values):
        def _in_list(value):
            return ("not in list" if value not in values else False), value
        return _in_list


class Str(DV):
    """String-related validator. Validates and MODIFiES value
    All the methods returns error and new value as tuple(bool, Any)"""
    TYPE = str

    @staticmethod
    def trim(value, length=None):
        if isinstance(length, int):
            return (value[:length] + '..') if len(value) > length else value
        return value.strip()

    @staticmethod
    def len(n):
        def _len(value):
            return ("incorrect length" if len(value) > n else False), value
        return _len

    @staticmethod
    def not_empty(value):
        return ("can't be empty" if value == '' else False), value

    @staticmethod
    def trimmed_not_empty(value):
        trimmed = Str.trim(value)
        return Str.not_empty(trimmed)

    @staticmethod
    def email(value):
        err, trimmed = Str.trimmed_not_empty(value)
        match = re.match(r"""[^@]+@[^@]+\.[^@]+""", trimmed)
        return ("invalid format" if err or not match else False), trimmed


class Int(DV):
    TYPE = int


class Bool(DV):
    TYPE = bool
