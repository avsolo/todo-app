import pytest

ctx = None


@pytest.fixture(autouse=True)
def init(init_ctx):
    global ctx
    ctx = init_ctx
    yield


def test_get_set_user():
    response = ctx.client.get("/api/user/get")
    assert {} == response.json()

    data = {"name": "a", "email": "b@c.de"}
    response = ctx.client.post("/api/user/set", json=data)
    assert data == response.json()


@pytest.mark.parametrize("login_req,login_resp,login_err_code", [
    ({"name": "a", "password": "b"}, None, 422),
    ({"name": "", "password": ""}, None, 422),
    ({"name": " ", "password": "123"}, None, 422),
    ({"name": "admin", "password": " "}, None, 422),
    ({"name": "admin", "password": ""}, None, 422),
    ({"name": "", "password": "123"}, None, 422),
    ({"name": "admin", "password": "12"}, None, 422),

    ({"name": True, "password": True}, None, 403),
    ({"name": "admin", "password": "1234"}, None, 403),
    ({"name": "admin", "password": "123 "}, None, 403),
    ({"name": "admi", "password": "1234"}, None, 403),
    ({"name": "admin", "password": " 123"}, None, 403),
    (
        {"name": " admin", "password": "123"},
        {"name": "admin", "email": "ad@m.in", "role": "ADMIN"}, None,
    ),
    (
        {"name": "admin", "password": "123"},
        {"name": "admin", "email": "ad@m.in", "role": "ADMIN"}, None,
    )
])
def test_login_logout(login_req, login_resp, login_err_code):

    resp = ctx.client.post("/api/user/login", json=login_req)
    if login_resp is not None:
        assert login_resp == resp.json()
    if login_err_code is not None:
        assert login_err_code == resp.status_code

    resp = ctx.client.post("/api/user/logout")
    assert {} == resp.json()

    resp = ctx.client.get("/api/user/get")
    assert {} == resp.json()




