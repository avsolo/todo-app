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
            'data': [{'id': 1, 'summary': 'task 1'}],
            'meta': {'count': 1}
        },
    ),
    (
        {"summary": "task 2", "name": "no", "email": "no@ema.il"},
        {
            'detail': [
                {'loc': ['body', 'email'], 'msg': 'extra fields not permitted', 'type': 'value_error.extra'},
                {'loc': ['body', 'name'], 'msg': 'extra fields not permitted', 'type': 'value_error.extra'}
            ],
            'body': {'summary': 'task 2', 'name': 'no', 'email': 'no@ema.il'}
        },
        # {'data': {'id': 1, 'summary': 'task 2'}, 'meta': {'count': 1}},
        {'data': [], 'meta': {'count': 0}}
    ),
    (
        {"summary": ""},
        {
            'detail': [{
                'loc': ['body', 'summary'],
                'msg': 'ensure this value has at least 1 characters', 'type': 'value_error.any_str.min_length',
                'ctx': {'limit_value': 1}
            }],
            'body': {'summary': ''}
        },
        {"data": [], "meta": {"count": 0}}
    ),
    (
        {"user": "admin"},
        {
            'detail': [
                {'loc': ['body', 'summary'], 'msg': 'field required', 'type': 'value_error.missing'},
                {'loc': ['body', 'user'], 'msg': 'extra fields not permitted', 'type': 'value_error.extra'}
            ],
            'body': {'user': 'admin'}
        },
        {"data": [], "meta": {"count": 0}}
    ),
    (
        "",
        {'detail': [{'loc': ['body', 'summary'], 'msg': 'field required', 'type': 'value_error.missing'}], 'body': ''},
        {"data": [], "meta": {"count": 0}}
    ),
])
def test_create_task(req, resp, query):
    resp1 = ctx.client.post("/api/tasks/create", json=req)
    assert resp == resp1.json()
    resp2 = ctx.client.get("/api/tasks/filter")
    assert query == resp2.json()

