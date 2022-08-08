import pytest
import logging
from shutil import rmtree
from os import path, mkdir, environ
from fastapi.testclient import TestClient


environ['TODO_APP_LOCAL_CONFIG'] = ""
data_dir = path.join(path.dirname(__file__), "..", ".tests_cache")
for k, v in {
        "TODO_APP_STATIC_DIR": path.join(path.dirname(__file__), '..', '..', 'static'),
        "TODO_APP_DATA_DIR": data_dir,
        "TODO_APP_LOG_DIR": data_dir,
}.items():
    environ[k] = v
from config import cfg
if path.isdir(data_dir):
    rmtree(data_dir)
mkdir(data_dir)
cfg.merge({"LOG_LEVEL": logging.DEBUG, "DEBUG": True})

from main import app as main_app


class Ctx:
    client = None
    app = None
    db = None


def exec_sql_file(fname):
    abs_path = path.join(cfg.APP_DIR, "scripts", fname)
    with open(abs_path) as f:
        import sqlite3
        conn = sqlite3.connect(cfg.DB_PATH)
        conn.executescript(f.read())
    conn.close()


@pytest.fixture
def init_ctx():
    rmtree(cfg.DATA_DIR)
    mkdir(cfg.DATA_DIR)

    Ctx.app = main_app
    Ctx.client = TestClient(Ctx.app)

    exec_sql_file("db_init.sql")
    yield Ctx
    exec_sql_file("db_clean.sql")
