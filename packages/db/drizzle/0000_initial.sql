CREATE TYPE recommendation_status AS ENUM ('draft', 'accepted', 'dismissed');

CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  primary_region VARCHAR(120) NOT NULL DEFAULT 'India',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE outlets (
  id SERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id),
  owner_user_id INT NOT NULL REFERENCES users(id),
  name VARCHAR(160) NOT NULL,
  city VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  cuisine VARCHAR(120) NOT NULL,
  seats INT NOT NULL DEFAULT 40,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  sku VARCHAR(80) NOT NULL,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(120) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  is_top_sku BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE UNIQUE INDEX menu_items_outlet_sku_idx ON menu_items(outlet_id, sku);
