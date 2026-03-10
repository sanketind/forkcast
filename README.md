# Forkcast

India-first restaurant SaaS MVP that turns POS sales, weather, holidays, festivals, fasting days, and local events into tomorrow's operating actions.

## Workspace

- `apps/web`: Next.js owner dashboard, onboarding, and API routes
- `apps/ml-service`: FastAPI forecasting service
- `packages/db`: Drizzle schema and migration snapshot
- `packages/domain`: Forecasting, shopping, staffing, and action-card logic
- `packages/integrations`: CSV POS parsing plus India-first signal adapters

## Local setup

1. Copy `.env.example` to `.env.local` for the web app and `.env` for shared tooling.
2. Start Postgres with `docker compose up -d`.
3. Install JS deps with `pnpm install`.
4. Install Python deps in `apps/ml-service` with `pip install -r requirements.txt`.
5. Run the web app with `pnpm --filter @forkcast/web dev`.
6. Run the ML service with `uvicorn main:app --reload --port 8000` from `apps/ml-service`.

## MVP flow

1. Sign in using the seed owner flow.
2. Create an outlet profile.
3. Paste or upload CSV-like POS rows for preview.
4. Map top SKUs to recipe ingredients.
5. Open the dashboard to review forecast, shopping, staffing, and action cards.
