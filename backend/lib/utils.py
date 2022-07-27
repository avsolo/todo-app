import logging


log = logging.getLogger(__name__)


def dict_merge(a, b, path=None):
    """Recursively merges b (dict) into a (dict)
    Args:
        a (dict): target, to merge to, will be modified
        b (dict): source, to merge from
    Kwargs:
        path (str): is used in recursion
    Returns:
        dict: a (dict) after merging
    """
    if path is None:
        path = []
    for key in b:
        if key in a:
            if isinstance(a[key], dict) and isinstance(b[key], dict):
                dict_merge(a[key], b[key], path + [str(key)])
            elif a[key] == b[key]:
                pass
            else:
                a[key] = b[key]  # raise Exception('Conflict at %s' % '.'.join(path + [str(key)]))
        else:
            a[key] = b[key]
    return a


class Cfg(object):
    """Helper class for managing configuration
    Arg:
        default (dict) - base confiration
    *Args:
        to_merge (tuple(dict)|list(dict)): additional configurations
    Usage:
        cfg = Cfg(base_dict, env_depended_dict, host_depended_dict, ...etc)
        val = cfg.KEY  # or cfg['KEY']
    """
    def __init__(self, default, *to_merge):
        self.__dict__['data'] = default
        self.merge(*to_merge)

    def __getattr__(self, key):
        return self.__dict__['data'].get(key)

    def __setattr__(self, key, value):
        self.__dict__['data'][key] = value

    def __getitem__(self, key):
        return self.data.get(key)

    def __setitem__(self, key, value):
        self.data[key] = value

    def merge(self, *to_merge):
        [dict_merge(self.__dict__['data'], d) for d in to_merge]
