"""Main module

"""
import logging
from http import HTTPStatus
from os.path import join, dirname
from flask import Flask, g, session, jsonify, request, make_response, abort, send_from_directory
from config import cfg
from lib.rest import add_nocors_headers, add_preflight_headers, login_required
from lib.Db import get_sqlite3_db
from lib.validators import ValidationError
from models.User import User, Role
from models.Task import Task


logging.basicConfig(
    filename=join(cfg.LOG_PATH),
    filemode='a',
    format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    level=cfg.LOG_LEVEL
)
log = logging.getLogger('')
log.info("=== APP_START ===")
log.info(f'- DATA_DIR: {cfg.DATA_DIR}')
log.info(f'- FRONTEND_URL: {cfg.FRONTEND_URL}')

app = Flask(
    __name__,
    static_folder=cfg.STATIC_DIR,
    # static_url_path=''
)
app.config.update({
    "DEBUG": cfg.DEBUG,
    "SECRET_KEY": cfg.SECRET_KEY,
})


@app.route('/api/user/login', methods=['POST'])
def user_login():
    """Logins user from post data (username, password)
    Returns:
        ( dict([user]) | error )
    """
    j = request.get_json()
    params = User.validate({'name': j.get('name'), 'password': j.get('password')})
    user = User.get(**params)
    if not (user and user.is_admin()):  # Only admin role
        abort(401, "Logging in failed")
    user.put_to(session)
    return jsonify(user.dumps())


@app.route('/api/user/get', methods=['GET'])
def user_get():
    """Returns current user from session"""
    if 'name' not in session:
        return jsonify({}), 200
    return jsonify(User(**session).dumps()), 200


@app.route('/api/user/set', methods=['POST'])
def user_set():
    """Validate given user, set him/her to session and returns validated data"""
    user = User(**request.get_json())
    user.put_to(session)
    return jsonify(user.dumps())


@app.route('/api/user/logout', methods=['POST'])
def user_logout():
    """Removes user from session"""
    User.delete_from(session)
    return jsonify(''), 201


@app.route('/api/tasks/filter', methods=['GET'])
def filter_tasks():
    """Filter tasks using get parameters
    Get parameters:
     - f (str,str,..): comma separated fields to select
     - sort (str:bool): colon separated field:ascending
     - limit (int): SQL 'LIMIT'
     - offset (int): SQL 'OFFSET'
     Returns:
         list(dict1, dict2, ... dictN): tasks
     """
    args = request.args.to_dict()

    fields = [f.strip() for f in args["f"].split(",")] if args.get('f') else []
    sort = args['sort'].split(',') if args.get('sort') else []
    sort = [p.split(':') for p in sort]
    limit, offset = args.get('limit'), args.get('offset')

    tasks = Task.query(*fields, sort=sort, limit=limit, offset=offset)
    count = Task.count('id')

    return jsonify({"data": tasks.fetchall(), "meta": {"count": count}})


@app.route('/api/tasks/create', methods=['POST'])
def create_task():
    """Creates tasks from json body fields and session user"""
    j = {"summary": request.get_json().get("summary")}
    for k in ['name', 'email']:
        if k in session and isinstance(session[k], str) and session[k] != "":
            j[k] = session[k]
        else:
            raise ValidationError({k: "Can't be empty"})

    task, count = Task(**j).save(), Task.count()
    return jsonify({"data": task.dumps(), "meta": {"count": count}})


@app.route('/api/tasks/update/<_id>', methods=['PUT'])
@login_required(role=Role.ADMIN)
def update_task(_id):
    """Updates task by _id query parameter and json body of changed fields"""
    task = Task.get(id=_id)
    if not task:
        abort(400, "Task is not found")
    task.merge_from(request.get_json(), updated_by=session['name']).save()
    return jsonify(task.dumps())


@app.route('/api/tasks/delete/<_id>', methods=['DELETE'])
@login_required(role=Role.ADMIN)
def delete_task(_id):
    """Deletes task by _id"""
    Task.delete(where={'id': _id})
    return jsonify({})


@app.route('/api/tasks/count', methods=['GET'])
def count_tasks():
    """GET number of tasks"""
    jsonify({"count": Task.count()})


@app.route('/', methods=['GET'])
def index():
    """GET number of tasks"""
    return app.send_static_file('index.html')


@app.route('/static/<path:_path>', methods=['GET'])
def _static(_path):
    """GET number of tasks"""
    if _path in [
        'styles/main.css',
        'js/main.js',
        'img/favicon.svg'
    ]:
        return send_from_directory("static", _path)


@app.errorhandler(Exception)
def default_errorhandler(e):
    log.error(e)
    res = {'code': e.code if hasattr(e, 'code') else 500}
    if hasattr(e, 'msg'):
        res['message'] = e.msg
    elif hasattr(e, 'message'):
        res['message'] = e.message
    elif hasattr(e, 'description'):
        res['message'] = e.description
    elif hasattr(e, 'args') and len(e.args) > 0:
        res['message'] = e.args[0]
    else:
        res['message'] = HTTPStatus(res['code']).phrase

    if hasattr(e, 'details'):
        res['details'] = e.details
    return jsonify({"error": res}), res['code']


@app.before_request
def before_request():
    """Check income request format, open DB connection, etc"""
    session.permanent = True

    if cfg.CORS and request.method == "OPTIONS":  # CORS preflight
        return add_preflight_headers(make_response())
    if request.method not in ['GET', 'PUT', 'POST', 'DELETE']:
        abort(405)

    if len(request.get_data()) > 0:
        try:
            assert isinstance(request.get_json(), (dict, list))
        except Exception as e:
            log.error(f"Not a JSON, request.data='{request.get_data()}', e='{e}")
            abort(400)

    try:
        get_db()
    except Exception as e:
        log.error(f"Unable connect to database, e='{e}'")
        abort(500)


@app.after_request
def after_request(response):
    if cfg.CORS:
        return response if request.method == "OPTIONS" else add_nocors_headers(response)
    return response


@app.teardown_appcontext
def teardown_appcontext(_):
    try:
        db = g.pop('db', None)
        if db is not None:
            db.close()
    except Exception as e:
        log.error(f"Unable disconnect from database, e='{e}'")


def get_db():
    """Open connection to the database (if required).
    Save reference to connection as Flasks 'g.db' attribute for further usage.
    Returns:
        sqlite3.connection
    """
    if 'db' not in g:
        g.db = get_sqlite3_db(cfg.DB_PATH)
        log.info("Db initialised")
    return g.db


if __name__ == '__main__':
    with app.app_context():
        get_db()
    app.run(host=cfg.APP_HOST, port=cfg.APP_PORT)
