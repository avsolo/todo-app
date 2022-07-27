import pytest
from flask import session

ctx = None
ERR_FORBIDDEN = {'error': {'code': 403, 'message': 'Forbidden'}}
ERR_AUTH_FAILED = {"error": {"code": 401, "message": "Authorization failed"}}


@pytest.fixture(autouse=True)
def init(init_ctx):
    global ctx
    ctx = init_ctx
    yield


def is_user_not_in_session(data=None):
    data = data if data else ['name', 'email', 'role']
    for k in data:
        if k in session:
            return False
    return True


def is_user_in_session(data):
    for k, v in data.items():
        if session[k] != v:
            return False
    return True


def test_get_set_user():
    response = ctx.client.get("/user/get")
    assert is_user_not_in_session()
    assert {} == response.get_json()

    data = {"name": "a", "email": "b@c.d"}
    response = ctx.client.post("/user/set", json=data)
    assert is_user_in_session(data)
    assert data == response.get_json()


@pytest.mark.parametrize("login_req,login_resp,login_err", [
    ({"name": "a", "password": "b"}, None, ERR_AUTH_FAILED),
    ({"name": "", "password": ""}, None, ERR_AUTH_FAILED),
    ({"name": " ", "password": "123"}, None, ERR_AUTH_FAILED),
    ({"name": "admin", "password": " "}, None, ERR_AUTH_FAILED),
    ({"name": True, "password": True}, None, ERR_AUTH_FAILED),
    ({"name": "admin", "password": ""}, None, ERR_AUTH_FAILED),
    ({"name": "", "password": "123"}, None, ERR_AUTH_FAILED),
    ({"name": " admin", "password": "123"}, None, ERR_AUTH_FAILED),
    ({"name": "admin", "password": " 123"}, None, ERR_AUTH_FAILED),
    ({"name": "admin", "password": "123 "}, None, ERR_AUTH_FAILED),
    ({"name": "admin", "password": "12"}, None, ERR_AUTH_FAILED),
    ({"name": "admin", "password": "1234"}, None, ERR_AUTH_FAILED),
    ({"name": "admi", "password": "1234"}, None, ERR_AUTH_FAILED),
    (
        {"name": "admin", "password": "123"},
        {"name": "admin", "email": "ad@m.in", "role": "ADMIN"}, None,
    )
])
def test_login_logout(login_req, login_resp, login_err):

    resp = ctx.client.post("/user/login", json=login_req)
    if login_resp is not None:
        assert login_resp == resp.get_json()
        assert is_user_in_session(login_resp)
    if login_err is not None:
        assert login_err == resp.get_json()
        assert is_user_not_in_session()

    resp = ctx.client.post("/user/logout")
    assert '' == resp.get_json()
    assert is_user_not_in_session()



