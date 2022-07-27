
DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    isChecked INTEGER,
    summary TEXT,
    updatedBy TEXT
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    password TEXT,
    email TEXT,
    role TEXT
);

INSERT INTO users (role, name, password, email) VALUES ('ADMIN', 'admin', '123', 'ad@m.in');