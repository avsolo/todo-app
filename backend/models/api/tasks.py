import logging
from pydantic import validator
from typing import Optional, List
from models.api.base import BaseModel, UserType, TaskType, Int
from config import cfg

log = logging.getLogger(__name__)


class Task(BaseModel):
    id: Optional[Int.ge_zero]
    summary: Optional[TaskType.summary]
    name: Optional[UserType.name]
    email: Optional[UserType.email]
    updatedBy: Optional[UserType.name]
    isChecked: Optional[bool]


class Meta(BaseModel):
    count: Optional[Int.ge_zero]
    limit: Optional[Int.ge_zero]
    offset: Optional[Int.ge_zero]


class CreateTaskRequest(BaseModel):
    summary: TaskType.summary


class CreateTaskResponse(BaseModel):
    data: Task
    meta: Meta


class UpdateTaskRequest(BaseModel):
    summary: Optional[TaskType.summary]
    name: Optional[UserType.name]
    email: Optional[UserType.email]
    isChecked: Optional[bool]


class UpdateTaskResponse(Task):
    pass


class FilterTaskRequest(BaseModel):
    sort: Optional[str] = ''
    limit: Optional[Int.ge_zero] = cfg.TASKLIST_PAGINATION_DEFAULT
    offset: Optional[Int.ge_zero] = 0

    @validator('sort')
    def validate_sort(cls, v):
        if v is None:
            return
        res = []
        for f in v.split(','):
            f, desc = (f[1:], ' DESC') if f.startswith('-') else (f, '')
            if f in Task.__fields__.keys():
                res.append(f"{f}{desc}")
            else:
                log.warning(f"Unknown sorting field '{f}'")
        return ', '.join(res)


class FilterTasksResponse(BaseModel):
    data: List[Task]
    meta: Meta
