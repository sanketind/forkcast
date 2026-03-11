-- ── Remaining core tables (missing from 0000_initial.sql) ───────────────────

CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  name VARCHAR(160) NOT NULL,
  unit VARCHAR(24) NOT NULL,
  current_stock NUMERIC(10, 2) NOT NULL DEFAULT 0
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  menu_item_id INT NOT NULL REFERENCES menu_items(id),
  ingredient_id INT NOT NULL REFERENCES ingredients(id),
  quantity_per_order NUMERIC(10, 2) NOT NULL
);

CREATE TABLE sales_days (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  business_date DATE NOT NULL,
  gross_revenue NUMERIC(12, 2) NOT NULL,
  total_orders INT NOT NULL,
  covers INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX sales_days_outlet_date_idx ON sales_days(outlet_id, business_date);

CREATE TABLE sales_orders (
  id SERIAL PRIMARY KEY,
  sales_day_id INT NOT NULL REFERENCES sales_days(id),
  pos_order_id VARCHAR(120) NOT NULL,
  order_hour INT NOT NULL,
  revenue NUMERIC(10, 2) NOT NULL,
  covers INT NOT NULL DEFAULT 1
);

CREATE TABLE sales_order_items (
  id SERIAL PRIMARY KEY,
  sales_order_id INT NOT NULL REFERENCES sales_orders(id),
  menu_item_id INT NOT NULL REFERENCES menu_items(id),
  quantity INT NOT NULL,
  line_revenue NUMERIC(10, 2) NOT NULL
);

CREATE TABLE weather_daily (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  signal_date DATE NOT NULL,
  condition VARCHAR(40) NOT NULL,
  max_temp_c NUMERIC(5, 2) NOT NULL,
  rainfall_mm NUMERIC(8, 2) NOT NULL
);

CREATE TABLE local_events (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  event_date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  event_type VARCHAR(80) NOT NULL,
  impact_score INT NOT NULL DEFAULT 1,
  notes TEXT
);

CREATE TABLE holiday_flags (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  signal_date DATE NOT NULL,
  holiday_name VARCHAR(160) NOT NULL,
  region VARCHAR(120) NOT NULL,
  is_festival BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE fasting_flags (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  signal_date DATE NOT NULL,
  fasting_type VARCHAR(120) NOT NULL,
  audience VARCHAR(120) NOT NULL,
  expected_demand_shift NUMERIC(5, 2) NOT NULL
);

CREATE TABLE onboarding_mappings (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  external_item_name VARCHAR(160) NOT NULL,
  menu_item_id INT NOT NULL REFERENCES menu_items(id),
  confidence NUMERIC(5, 2) NOT NULL DEFAULT 1.00
);

CREATE TABLE daily_forecasts (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  forecast_date DATE NOT NULL,
  predicted_revenue NUMERIC(12, 2) NOT NULL,
  predicted_orders INT NOT NULL,
  confidence_low NUMERIC(12, 2) NOT NULL,
  confidence_high NUMERIC(12, 2) NOT NULL,
  reasoning JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE staffing_recommendations (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  forecast_date DATE NOT NULL,
  shift_start_hour INT NOT NULL,
  shift_end_hour INT NOT NULL,
  cooks_needed INT NOT NULL,
  service_staff_needed INT NOT NULL,
  rationale TEXT NOT NULL,
  status recommendation_status NOT NULL DEFAULT 'draft'
);

CREATE TABLE shopping_recommendations (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  forecast_date DATE NOT NULL,
  ingredient_id INT NOT NULL REFERENCES ingredients(id),
  quantity_to_buy NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(24) NOT NULL,
  rationale TEXT NOT NULL,
  status recommendation_status NOT NULL DEFAULT 'draft'
);

CREATE TABLE action_cards (
  id SERIAL PRIMARY KEY,
  outlet_id INT NOT NULL REFERENCES outlets(id),
  forecast_date DATE NOT NULL,
  title VARCHAR(180) NOT NULL,
  priority INT NOT NULL DEFAULT 1,
  category VARCHAR(60) NOT NULL,
  explanation TEXT NOT NULL,
  expected_impact VARCHAR(160) NOT NULL,
  status recommendation_status NOT NULL DEFAULT 'draft'
);

-- ── Supply intelligence (added in Week 2) ────────────────────────────────────

CREATE TYPE supply_alert_status AS ENUM ('new', 'snoozed', 'dismissed');

CREATE TABLE supply_alerts (
  id SERIAL PRIMARY KEY,
  outlet_id INT REFERENCES outlets(id),
  commodity VARCHAR(80) NOT NULL,
  signal_type VARCHAR(60) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  headline TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  estimated_cost_impact TEXT NOT NULL,
  affected_ingredients JSONB NOT NULL DEFAULT '[]',
  days_until_impact INT NOT NULL DEFAULT 7,
  confidence NUMERIC(5, 2) NOT NULL DEFAULT 0.60,
  status supply_alert_status NOT NULL DEFAULT 'new',
  region JSONB NOT NULL DEFAULT '[]',
  expires_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Settings: WhatsApp notification number ────────────────────────────────────

ALTER TABLE outlets ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(30);
