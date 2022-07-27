from copy import deepcopy

import pytest
from tests.constants import ADMIN, ERR_UNAUTHORIZED

ctx = None


def login(data):
    return ctx.client.post("/user/login", json=data)


@pytest.fixture(autouse=True)
def init(init_ctx):
    global ctx
    ctx = init_ctx
    yield


@pytest.mark.parametrize("c_req,c_resp", [
    (
        {"summary": "task 1"},  # create
        {'data': {'id': 1, 'summary': 'task 1'}, 'meta': {'count': 1}},
    )
])
def test_crud_guest(c_req, c_resp):
    resp = ctx.client.post("/tasks/create", json=c_req)
    j = resp.get_json()
    assert c_resp == j
    _id = j['data']['id']

    for u_req in [{"summary": "new"}, {"name": "bb"}, {"email": "bbb@bb.bb"}, {"isChecked": True}]:
        resp = ctx.client.put(f"/tasks/update/{_id}", json=u_req)
        assert ERR_UNAUTHORIZED == resp.get_json()

    resp = ctx.client.delete(f"/tasks/delete/{_id}")
    assert ERR_UNAUTHORIZED == resp.get_json()


def assert_updated_fields(resp, base, ext):
    exp = deepcopy(base)
    exp.update(ext)
    assert exp == resp.get_json()


@pytest.mark.parametrize("c_req,c_resp", [
    (
        {"summary": "task 1"},  # create
        {'data': {'email': 'ad@m.in', 'id': 1, 'name': 'admin', 'summary': 'task 1'}, 'meta': {'count': 1}},
    )
])
def test_crud_admin(c_req, c_resp):
    ctx.client.post("/user/login", json=ADMIN)
    resp = ctx.client.post("/tasks/create", json=c_req)
    j = resp.get_json()
    assert c_resp == j
    _id = j['data']['id']

    exp_resp = deepcopy(j['data'])
    for u_req in [{"name": "bb"}, {"email": "bbb@bb.bb"}, {"isChecked": True}]:
        resp = ctx.client.put(f"/tasks/update/{_id}", json=u_req)
        exp_resp.update(u_req)
        assert exp_resp == resp.get_json()

    new_summary = {"summary": "1abcd"}
    resp = ctx.client.put(f"/tasks/update/{_id}", json=new_summary)
    updated_by = {"updatedBy": "admin"}
    exp_resp.update(**new_summary, **updated_by)
    assert exp_resp == resp.get_json()

    resp = ctx.client.delete(f"/tasks/delete/{_id}")
    assert {} == resp.get_json()

