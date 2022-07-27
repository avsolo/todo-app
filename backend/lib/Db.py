import sqlite3
import logging
from flask import g

log = logging.getLogger(__name__)


class DbException(Exception):
    def __init__(self, msg):
        super().__init__(msg)
        self.code = 500


class Db(object):
    """Light ORM-helper class for working with SQL.
    Build and execute SQL queries from income parameters.
    Contains only SQL related methods.
    Args:
        table (Table): see :ref:`<Model.Table>`
        fields (dict): {"field_name": { options }, ... }
            options:
            - validator ( function(value) ): validate and clean value before using in SQL query (optional)
            - validators (list(function(value)): see previous one (optional)
            - json (bool): exclude from response to client (optional, default=False)
            - index (bool): is this field to be index in the SQL table (optional)
    Returns:
        Any: result
    See also `<./Model.py>`
    """
    def __init__(self, table, fields=None):
        self.__dict__['_fields'] = {}
        self.__dict__['_table'] = table
        fields = fields if isinstance(fields, dict) else {}
        fields = self.__class__.validate(fields)
        for f, data in table.fields.items():
            self.__dict__['_fields'][f] = fields.get(f, data.get('default'))

    def __getattr__(self, k):
        log.debug(f"Db.__getattr__, k='{k}'")
        if k in self.__dict__['_fields']:
            return self.__dict__['_fields'].get(k)

    @staticmethod
    def make_params(field_names, params, sub='=?'):
        names, values = [], []
        for f in params.keys():
            if f in field_names:
                names.append(f"{f}{sub}")
                values.append(params[f])
        return names, values

    @staticmethod
    def exec(sql, values=None, commit=True):
        values = tuple(values) if values else tuple()
        cur = g.db.execute(sql, values)
        if issubclass(cur.__class__, Exception):
            log.error(f"SQL: Unable execute, '{sql}', {values}, {str(cur)}")
            raise cur
        if commit:
            g.db.commit()
        log.info(f"SQL: executed, '{sql}', {values}")
        return cur

    @staticmethod
    def execscript(sql):
        cur = g.db.executescript(sql)
        if issubclass(cur.__class__, Exception):
            log.error(f"SQL: Unable execute, '{sql}', {str(e)}")
            raise cur
        g.db.commit()
        log.info(f"SQL: script executed, '{sql}'")
        return cur

    @classmethod
    def query(cls, *args, **kwargs):
        what = ', '.join(str(e) for e in args) if len(args) > 0 else '*'

        names, values = Db.make_params(cls.TABLE.fields, kwargs.get('where', {}))
        where = f"  WHERE {' AND '.join(names)}" if len(names) > 0 else ""

        if 'sort' in kwargs and len(kwargs['sort']) > 0:
            sort, asc, key = [], "", ""
            for el in kwargs['sort']:
                if isinstance(el, str):
                    key, asc = el, ""
                elif isinstance(el, (tuple, list)) and isinstance(el[0], str):
                    key = el[0]
                    asc = "" if len(el) == 1 or el[1] in [True, 1, "1", "true"] else " DESC"
                else:
                    log.error(f"Bad parameters for sort, {el}")
                    raise DbException(f"Syntax error where=SORT, value='{kwargs['sort']}'")
                if key not in cls.TABLE.fields:
                    raise DbException(f"Bad key '{key}' for SORT")
                sort.append(f"{key}{asc}")
            sort = f"  ORDER BY " + ', '.join(sort) if len(sort) > 0 else ""
        else:
            sort = ""

        o = {}  # '?' doesn't work for these keywords
        for k in ['limit', 'offset']:
            if k in kwargs and str(kwargs[k]).isnumeric():
                o[k] = f" {k.upper()} ?"
                values.append(int(kwargs[k]))
            else:
                o[k] = ""

        return Db.exec(f"SELECT {what} FROM {cls.TABLE.name}{where}{sort}{o['limit']}{o['offset']}", values)

    @classmethod
    def get(cls, **kwargs):
        results = cls.query(where=kwargs)
        as_list = results.fetchall()
        if len(as_list) == 1:
            return cls(**dict(as_list[0]))
        if len(as_list) == 0:
            return None
        elif len(as_list) > 1:
            raise DbException(f"Multiple results where only one expected, kwargs={kwargs}")

    @classmethod
    def count(cls, field='id', **kwargs):
        return cls.query(f'COUNT({field}) AS cnt', **kwargs).fetchone()['cnt']

    @classmethod
    def insert(cls, params):
        params = cls.validate(params)
        names, values = Db.make_params(cls.TABLE.fields, params, sub='')
        sql = f"INSERT INTO {cls.TABLE.name} ({', '.join(names)}) VALUES ({', '.join(['?'] * len(names))})"
        return Db.exec(sql, values)

    @classmethod
    def update(cls, params, **kwargs):
        if len(params) == 0:
            return KeyError("No fields for UPDATE"), None
        params = cls.validate(params)
        u_names, u_values = Db.make_params(cls.TABLE.fields, params)

        where = kwargs.get('where')
        if not isinstance(where, dict) or len(where) < 1:
            raise KeyError(f"Incorrect keys for 'WHERE' clause, where='{where}'")
        w_names, w_values = Db.make_params(cls.TABLE.fields, where)

        return Db.exec(f"UPDATE tasks SET {', '.join(u_names)} WHERE {' AND '.join(w_names)}", u_values + w_values)

    @classmethod
    def delete(cls, where=None):
        if not where or len(where) == 0:
            return KeyError("No 'WHERE' field dict for DELETE"), None
        params = cls.validate(where)
        names, values = Db.make_params(cls.TABLE.fields, params)
        return Db.exec(f"DELETE FROM tasks WHERE {' AND '.join(names)}", values)


def get_sqlite3_db(path):
    def dict_factory(cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    _db = sqlite3.connect(path, detect_types=sqlite3.PARSE_DECLTYPES)
    _db.row_factory = dict_factory
    sqlite3.register_adapter(bool, int)
    sqlite3.register_converter("BOOLEAN", lambda v: bool(int(v)))
    return _db
