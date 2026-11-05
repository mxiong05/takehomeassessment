# Intraday Stock Summary

A React dashboard and Fastify API that summarize one month of 15-minute Yahoo Finance bars by trading day. Node.js 20 or newer is required.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:5173. The Vite development server proxies `/api` to the backend on port 3000. Run `npm test` for the test suite and `npm run build` to build both apps. Start the built API with `npm start -w backend`. Serve `frontend/dist` with a static server, configured to proxy `/api` to the API, or set `VITE_API_URL` at frontend build time to the API origin.

Backend environment variables: `PORT` (default `3000`), `CACHE_TTL` (seconds, default `60`), and `CORS_ORIGIN` (default `http://localhost:5173`; use the frontend origin in production). Configuration is validated on startup. `GET /health` reports process health.

## Run with Docker

With Docker and the Compose plugin installed, run:

```sh
docker compose up --build
```

Open http://localhost:8080. Nginx serves the frontend and proxies `/api` to the backend over the Compose network; the backend is not exposed directly on the host. Stop the containers with `docker compose down`. Set `APP_PORT` to change the host port, or `CACHE_TTL` to change the backend cache lifetime in seconds. `CORS_ORIGIN` can be set if the API needs to accept requests from a different origin. For example:

```sh
APP_PORT=8081 CACHE_TTL=120 docker compose up --build
```

On PowerShell, set these as environment variables (for example, `$env:APP_PORT = "8081"`) before running Compose. The frontend uses same-origin API requests in this setup, so no `VITE_API_URL` is needed.

## API

`GET /api/v1/stocks/:symbol/intraday-summary` returns `{ "symbol": "AAPL", "data": [{ "day": "2025-01-02", "lowAverage": 100.1234, "highAverage": 101.1234, "volume": 12345 }] }`. Symbols contain 1–10 letters, dots, hyphens, or `^`. Errors use `{ "error": { "code": "...", "message": "..." } }`. Invalid symbols return 400; missing symbols return 404; provider failures return 502 or 503.

For each exchange-local date, low and high averages are the arithmetic means of the corresponding 15-minute bar lows and highs, rounded to four decimal places. Volume is the sum of bar volumes. Bars missing any of those fields are skipped. Results are sorted by day. The provider's IANA exchange timezone is used for date grouping, including daylight saving changes; its GMT offset is the fallback. If neither is present, UTC is used. Empty valid data produces an empty array.

Yahoo's chart API is unofficial and may change, rate-limit, or become unavailable. The backend uses a timeout, one retry for transient failures, and a short in-memory cache. Data should not be treated as investment advice or a guaranteed real-time feed. The provider and cache interfaces allow replacements without changing aggregation or routes.

## Next steps

For a growing deployment: shared Redis caching, rate limiting, authentication, provider fallback, observability, and OpenAPI documentation.
