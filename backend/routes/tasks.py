from typing import Optional

from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy import update, insert, func, text
import models.api.tasks as api
from models.db.Task import Task
from models.db.User import Role
from config import cfg

router = APIRouter(prefix=f"{cfg.API_PREFIX}/tasks")


def str_to_list(s, sep=','):
    return [f.strip() for f in s.split(sep)] if s else []


def login_required(req: Request):
    """Middleware for protected api endpoints"""
    if req.session.get('role') != Role.ADMIN:
        raise HTTPException(status_code=401, detail=[{"loc": ["body", "api"], "msg": "Authorization is required"}])
    return req


@router.get('/filter', response_model=api.FilterTasksResponse)
async def filter_tasks(req: Request, model: api.FilterTaskRequest = Depends()):
    tasks = req.state.db.query(Task) \
        .order_by(text(model.sort)) \
        .limit(model.limit) \
        .offset(model.offset) \
        .all()
    count = req.state.db.query(func.count(Task.id)).scalar()
    return {"data": tasks, "meta": {"count": count}}


@router.post('/create', response_model=api.CreateTaskResponse)
async def create_task(model: api.CreateTaskRequest, req: Request):
    task = Task(**model.dict(), name=req.session.get('name'), email=req.session.get('email'))
    db = req.state.db

    task.id = db.execute(insert(Task).values(**task.dict())).lastrowid
    count = db.query(func.count(Task.id)).scalar()
    db.commit()

    return {'data': task, 'meta': {'count': count}}


@router.put('/update/{task_id}', response_model=api.UpdateTaskResponse)
async def update_task(task_id: int, model: api.UpdateTaskRequest, req: Request = Depends(login_required)):
    errs = []
    if len(model.dict()) == 0:
        errs.append({"loc": ["body", "api"], "msg": "no fields for update"})

    db = req.state.db
    task = db.get(Task, task_id)
    if task is None:
        errs.append({"loc": ["query", "task_id"], "msg": "entry not found"})

    if errs:
        raise HTTPException(status_code=422, detail=errs)

    if 'summary' in model.dict() and task.summary != model.summary:
        task.updatedBy = req.session['name']

    db.execute(update(Task).where(Task.id == task_id).values(**model.dict()))
    db.commit()
    db.refresh(task)
    return task.dict()
