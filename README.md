# Intraday Stock Summary

Look up a stock symbol to see daily average high and low prices and total trading volume for the past month.

## Run with Docker

1. Start Docker Desktop and wait for it to finish starting.
2. Open a terminal in this project folder and run:

   ```sh
   docker compose up --build
   ```

3. Open **http://localhost:8080**, enter a symbol such as `AAPL`, and select **View summary**. The first build may take a few minutes.
4. To stop the app, press `Ctrl+C`, then run:

   ```sh
   docker compose down
   ```

If port 8080 is already in use, choose another port. For example, in PowerShell:

```powershell
$env:APP_PORT = "8081"
docker compose up --build
```

Then open **http://localhost:8081**. In macOS or Linux shells, use `APP_PORT=8081 docker compose up --build` instead. Docker Compose defaults to port 8080 when `APP_PORT` is not set.

## Run without Docker

Install Node.js 20 or newer, then run:

```sh
npm install
npm run dev
```

Open **http://localhost:5173**. To stop the app, press `Ctrl+C`. Run `npm test` to run the tests, or `npm run build` to build both applications.

## How the data is calculated

The app requests one month of 15-minute bars from Yahoo Finance. For each exchange-local date, it averages the bar lows and highs, rounds those averages to four decimal places, and sums the volumes. Bars missing a low, high, or volume are skipped. Results are sorted by date. The exchange's timezone is used for grouping, with its GMT offset as a fallback; UTC is used if neither is available.

Yahoo's chart API is unofficial and may change, rate-limit, or become unavailable. The API uses a timeout, one retry for transient failures, and a short in-memory cache. This data is not a guaranteed real-time feed.

## API and configuration

`GET /api/v1/stocks/:symbol/intraday-summary` returns a symbol and its daily summaries. Symbols may contain 1–10 letters, dots, hyphens, or `^`. Errors use `{ "error": { "code": "...", "message": "..." } }`. `GET /health` reports backend health.

The backend accepts `PORT` (default `3000`), `CACHE_TTL` in seconds (default `60`), and `CORS_ORIGIN` (default `http://localhost:5173`). Docker Compose sets its own frontend origin and proxies `/api` through Nginx, so no frontend API URL is needed. For a separately hosted frontend, set `VITE_API_URL` at build time to the API origin.

