-- sqlite3 database schema

CREATE TABLE user (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE trail (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  picture TEXT NOT NULL,
  crumbCount INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,

  -- relations

  authorId TEXT NOT NULL,
  FOREIGN KEY (authorId) REFERENCES user(id) ON DELETE NO ACTION
);

CREATE TABLE crumb (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,

  -- relations

  trailId TEXT NOT NULL,
  FOREIGN KEY (trailId) REFERENCES trail(id) ON DELETE CASCADE,
  authorId TEXT NOT NULL,
  FOREIGN KEY (authorId) REFERENCES user(id) ON DELETE NO ACTION
);

CREATE TABLE content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  contentType TEXT NOT NULL,
  body TEXT NOT NULL,
  originalBody TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL

  -- relations

  crumbId TEXT NOT NULL,
  FOREIGN KEY (crumbId) REFERENCES crumb(id) ON DELETE CASCADE,
  authorId TEXT NOT NULL,
  FOREIGN KEY (authorId) REFERENCES user(id) ON DELETE NO ACTION
);

