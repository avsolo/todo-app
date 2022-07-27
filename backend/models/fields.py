from lib.validators import Str


class Validator:
    """Class-helper, keeps mutual validators in one place"""
    name = [Str.len(16), Str.trimmed_not_empty]
    password = name
    email = [Str.len(32), Str.email]
