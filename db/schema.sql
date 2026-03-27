CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(100) UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  role       VARCHAR(20) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) UNIQUE NOT NULL,
  category    VARCHAR(50) NOT NULL,
  description TEXT,
  image       TEXT,
  price       NUMERIC(10,2),
  unit        VARCHAR(50) DEFAULT 'kg',
  stock       INTEGER DEFAULT 0,
  features    JSONB DEFAULT '[]',
  quantities  JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
