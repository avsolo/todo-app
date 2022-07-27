import logging
from lib.Model import Model, Table
from lib.validators import Str, Bool
from models.fields import Validator


log = logging.getLogger(__name__)


class Task(Model):
    TABLE = Table("tasks", {
        "id": {"index": True},
        "name": {"validator": Validator.name},
        "email": {"validator": Validator.email},
        "summary": {"null": False, "validator": [Str.len(256), Str.trimmed_not_empty]},
        "isChecked": {"validator": Bool.cast},
        "updatedBy": {"validator": Validator.name},
    })

    def __init__(self, **fields):
        super().__init__(Task.TABLE, fields)

    def __repr__(self):
        return '<Task %s>' % self.__dict__['_fields'].get('id', '?')

    def merge_from(self, data, updated_by=None):
        old_summary = self.__dict__['_fields']['summary']
        super().merge_from(data)
        if updated_by is not None and old_summary != self.__dict__['_fields']['summary']:
            self.__dict__['_fields']['updatedBy'] = updated_by
        return self

