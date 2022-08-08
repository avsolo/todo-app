import re


RE_EMAIL = re.compile(r'^[a-z0-9_.-]+[@][a-z0-9_.-]+\.[a-z]{2,8}$')
