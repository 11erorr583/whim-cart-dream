# Whim Cart Dream
Clean rebuild of an immersive simulated retail platform. No real purchases, money or deliveries. This is a foundation, not a completed mall.
## Local development
Python 3.12+, Node 22+, Docker (optional for local database).
1. Run `docker compose up -d db`.
2. In backend: `python -m venv .venv`, activate it, then `pip install -r requirements.txt` and `uvicorn app.main:app --reload`.
3. In frontend: `npm install` then `npm run dev`. Vite proxies /api to port 8000.
4. Backend tests: from backend run `pytest`. Frontend build: `npm run build`.
Database container is provisioned for the next phase; the health API does not yet use it. No auth, ledger, 3D assets, sound or calls are implemented yet.
See [roadmap](docs/ROADMAP.md) and [rebuild decisions](docs/REBUILD.md).
