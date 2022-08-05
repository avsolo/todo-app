
DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT COLLATE NOCASE,
    email TEXT COLLATE NOCASE,
    isChecked INTEGER,
    summary TEXT COLLATE NOCASE,
    updatedBy TEXT COLLATE NOCASE
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    password TEXT,
    email TEXT,
    role TEXT
);

INSERT INTO users (role, name, password, email) VALUES ('ADMIN', 'admin', '123', 'ad@m.in');