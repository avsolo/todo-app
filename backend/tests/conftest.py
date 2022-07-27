import logging
from os import path, mkdir, environ
from shutil import rmtree
import pytest
from flask import g


environ['TODO_APP_LOCAL_CONFIG'] = ""
from config import cfg
data_dir = path.join(path.dirname(__file__), "data")
if path.isdir(data_dir):
    rmtree(data_dir)
mkdir(data_dir)
cfg.merge({
    "DATA_DIR": data_dir,
    "LOG_DIR": data_dir,
    "DB_PATH": path.join(data_dir, "test.sqlite3"),
    "LOG_PATH": path.join(data_dir, "test.log"),
    "LOG_LEVEL": logging.DEBUG,
    "DEBUG": True
})

from main import app as main_app
from lib.Db import Db, get_sqlite3_db


class Ctx:
    client = None
    app = None
    db = None


def exec_sql_file(fname):
    abs_path = path.join(cfg.APP_DIR, "scripts", fname)
    with open(abs_path) as f:
        res = Db.execscript(f.read())
    return res


@pytest.fixture
def init_ctx():
    rmtree(cfg.DATA_DIR)
    mkdir(cfg.DATA_DIR)

    app = main_app
    app.config.update({"TESTING": True, "DEBUG": True})

    with app.app_context():
        g.db = get_sqlite3_db(cfg.DB_PATH)
        exec_sql_file("db_init.sql")  # Prepare db

    #  global Client, App
    with app.test_client() as test_client:
        with test_client.session_transaction() as client_session:
            [client_session.pop(k) for k in ['name', 'email', 'role'] if k in client_session]
        with app.app_context() as context:
            # Client = test_client
            # App = context
            Ctx.client = test_client
            Ctx.app = context
            yield Ctx

    with app.app_context():
        exec_sql_file("db_clean.sql")  # Clean db
