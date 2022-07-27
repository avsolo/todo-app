import json
import logging
from os import path, environ, makedirs
from lib.utils import Cfg


def __cfg_to_dict(d):
    if path.isfile(d):
        with open(d) as _f:
            res = json.load(_f)
        return res
    elif isinstance(d, dict):
        return d
    else:
        raise TypeError(f"Bad type for configuration '{d}'")


def __cfg_from_env(pfx):
    res = {}
    for k in ["DATA_DIR", "STATIC_DIR", "LOG_DIR"]:
        val = environ.get(f"{pfx}_{k}")
        if val:
            res[k] = val
    return res


__default_cfg = __cfg_to_dict(path.join(path.dirname(__file__), "default.json"))
__cfg_pfx = __default_cfg.get('APP_ENV_PFX', 'TODO_APP')
__local_cfg_path = environ.get(__cfg_pfx + '_CONFIG_PATH')
__local_cfg = __cfg_to_dict(__local_cfg_path) if __local_cfg_path else {}
__env_cfg = __cfg_from_env(__cfg_pfx)


cfg = Cfg(__default_cfg, __local_cfg, __env_cfg)
cfg.LOG_LEVEL = getattr(logging, cfg.LOG_LEVEL)

cfg.APP_DIR = path.abspath(path.join(path.dirname(__file__), '..'))
if not path.isdir(cfg.STATIC_DIR):
    raise IOError(f"Unable to load, STATIC_DIR='{cfg.STATIC_DIR}")
if not path.isdir(cfg.DATA_DIR):
    makedirs(cfg.DATA_DIR)
if not path.isdir(cfg.LOG_DIR):
    makedirs(cfg.LOG_DIR)

cfg.DB_PATH = path.join(cfg.DATA_DIR, 'db.sqlite3')
cfg.LOG_PATH = path.join(cfg.LOG_DIR, 'main.log')

