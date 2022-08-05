import logging
from sqlalchemy import Column, Integer, String, Boolean
from lib.Db import Base, BaseMixin
from models.db.types import Email

log = logging.getLogger(__name__)


class Task(Base, BaseMixin):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True)
    name = Column(String(32))
    email = Column(Email)
    summary = Column(String(512))
    isChecked = Column(Boolean)
    updatedBy = Column(String(32))

    def __repr__(self):
        return f'<Task {str(self.id)}>'

    def merge_from(self, data, updated_by=None):
        old_summary = self.summary
        super().merge_from(data)
        if updated_by is not None and old_summary != self.summary:
            self.updatedBy = updated_by
        return self
