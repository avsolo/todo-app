"""Main module

"""
import logging
from os.path import join
import uvicorn
from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from starlette import status
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy import create_engine
import routes
from lib.Db import bind_engine, get_db
from config import cfg


logging.basicConfig(
    filename=join(cfg.LOG_PATH),
    filemode='a',
    format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    level=cfg.LOG_LEVEL
)
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
log = logging.getLogger('')
log.info("=== APP_START ===")
log.info('- DATA_DIR: %s', cfg.DATA_DIR)
log.info('- FRONTEND_URL: %s', cfg.FRONTEND_URL)

engine = create_engine(f'sqlite:///{cfg.DB_PATH}?check_same_thread=False', echo=cfg.DEBUG is True)
bind_engine(engine)

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=cfg.SECRET_KEY)
app.mount("/static", StaticFiles(directory=cfg.STATIC_DIR), name='static')
app.include_router(routes.user)
app.include_router(routes.tasks)


@app.middleware("http")
async def db_session_middleware(req: Request, call_next):
    try:
        req.state.db = get_db()
        resp = await call_next(req)
    except Exception as e:
        log.error("Unable process request, %s", str(e))
        resp = JSONResponse({"detail": "Server error"}, status_code=500)
    finally:
        req.state.db.close()
    return resp


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


@app.get("/", response_class=FileResponse)
async def read_items():
    return join(cfg.STATIC_DIR, "index.html")


if __name__ == "__main__":
    config = uvicorn.Config("main:app", host=cfg.APP_HOST, port=cfg.APP_PORT, log_level=cfg.LOG_LEVEL)
    server = uvicorn.Server(config)
    server.run()
