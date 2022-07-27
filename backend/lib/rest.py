import logging
from functools import wraps
from flask import abort, session
from models.User import User
from config import cfg


log = logging.getLogger(__name__)


def add_preflight_headers(resp):
    for k, v in {
        "Access-Control-Allow-Origin": cfg.FRONTEND_URL,
        "Access-Control-Allow-Credentials": cfg.RESPONSE_ALLOW_CREDENTIALS,
        'Access-Control-Allow-Headers': cfg.RESPONSE_ALLOW_HEADERS,
        'Access-Control-Allow-Methods': cfg.RESPONSE_ALLOW_METHODS
    }.items():
        if v:
            resp.headers[k] = v
    return resp


def add_nocors_headers(resp):
    resp = add_preflight_headers(resp)
    resp.headers.add('Access-Control-Expose-Headers', cfg.RESPONSE_ALLOW_HEADERS)
    return resp


def login_required(role=None):
    def decorator(fn):
        @wraps(fn)
        def decorated(*args, **kws):
            user = User(**session)
            if not user or (role is not None and user.role != role):
                return abort(401, "Authorization is required")
            return fn(*args, **kws)
        return decorated
    return decorator
