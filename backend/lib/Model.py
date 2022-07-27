import logging
from lib.Db import Db
from lib.validators import ValidationError

log = logging.getLogger(__name__)


class Model(Db):
    """Base model for ORM-like pattern.
    Contains useful middleware like validation, preparing and managing fields linked to DB table.
    Args:
        see `<./Db.py>`
    Usage:
        Person(Model):
            ....
    """
    def __init__(self, table, fields=None):
        super().__init__(table, fields)

    def __str__(self):
        return self.__repr__()

    @staticmethod
    def validate_one(errors, res, validator, k, data, v):
        if v is None:
            if data.get('null', True) is True:
                res[k] = None
            else:
                errors[k] = f"Field '{k}' can't be null"
            return
        _err, _res = validator(v)
        if _err:
            errors[k] = _err  # Don't save invalid value
        else:
            res[k] = _res

    @classmethod
    def validate(cls, params, ignore_fields=None, ignore_null=True):
        """Validates and cleans params (dict)"""
        errors, res = {}, {}
        ignore_fields = ignore_fields if isinstance(ignore_fields, (list, tuple, set)) else []
        for k, data in cls.TABLE.fields.items():
            if k not in params or k in ignore_fields:
                continue
            elif k is None and ignore_null is True:
                continue
            elif "validator" in data:
                validators = data['validator'] if isinstance(data['validator'], (list, tuple)) else [data['validator']]
                [Model.validate_one(errors, res, v, k, data, params[k]) for v in validators]
            else:
                log.warning(f"No 'validator' for key '{k}'")
                res[k] = params[k]
        if errors:
            raise ValidationError(errors)
        return res

    @classmethod
    def delete_from(cls, data):
        """Deletes current models keys from data (dict)"""
        [data.pop(k) for k in cls.TABLE.fields.keys() if k in data]

    def merge_from(self, data, null=None):
        """Overwrites current models fields from from data (dict)"""
        for k in self.TABLE.fields.keys():
            if (k not in data) or (k is None and null is not True):
                continue
            self.__dict__['_fields'][k] = data[k]
        return self

    def save(self):
        """Inserts (if no id key exists) or updates (otherwise) fields into SQL table"""
        _id = self.__dict__['_fields'].get('id')
        if _id:
            self.__dict__['_fields'].pop('id')
            self.__class__.update(self.__dict__['_fields'], where={'id': _id})
            self.__dict__['_fields']['id'] = _id
        else:
            cur = self.__class__.insert(self.__dict__['_fields'])
            self.__dict__['_fields']['id'] = cur.lastrowid
        return self

    def dumps(self, none=None):
        """Returns fields as dict
        Kwargs:
            none (bool|None):
            - True: include keys with None value in result dict (overwrite values in DB with NULL)
            - False|None: exclude keys with None value from result dict"""
        res = {}
        for k, v in self.__dict__['_fields'].items():
            if (
                (self.__dict__['_table'].fields[k].get('json', False))
                or
                (v is None and none is not True)
            ):
                continue
            res[k] = v
        return res


class Table(object):
    """Helper class to keep table related data"""
    def __init__(self, name, fields):
        self.name = name
        self.fields = fields
