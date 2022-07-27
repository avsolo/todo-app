import pytest

ctx = None


@pytest.fixture(autouse=True)
def init(init_ctx):
    global ctx
    ctx = init_ctx
    yield


@pytest.mark.parametrize("req,resp,query", [
    (
        {"summary": "task 1"},
        {'data': {'id': 1, 'summary': 'task 1'}, 'meta': {'count': 1}},
        {
            'data': [{'email': None, 'id': 1, 'isChecked': None, 'name': None, 'summary': 'task 1', 'updatedBy': None}],
            'meta': {'count': 1}
        },
    ),
    (
        {"summary": "task 2", "name": "no", "email": "no@ema.il"},
        {'data': {'id': 1, 'summary': 'task 2'}, 'meta': {'count': 1}},
        {
            'data': [{'email': None, 'id': 1, 'isChecked': None, 'name': None, 'summary': 'task 2', 'updatedBy': None}],
            'meta': {'count': 1}
        }
    ),
    (
        {"summary": ""},
        {'error': {'code': 400, 'message': 'Invalid data'}},
        {"data": [], "meta": {"count": 0}}
    ),
    (
        {"user": "admin"},
        {'error': {'code': 400, 'message': 'Invalid data'}},
        {"data": [], "meta": {"count": 0}}
    ),
    (
        "",
        {'error': {'code': 400, 'message': 'Bad request'}},
        {"data": [], "meta": {"count": 0}}
    ),
])
def test_create_task(req, resp, query):
    resp1 = ctx.client.post("/tasks/create", json=req)
    assert resp == resp1.get_json()
    resp2 = ctx.client.get("/tasks/filter")
    assert query == resp2.get_json()

