Notify-server (local)

This small server provides a file-backed balance API meant to be run locally or on a private host.

Endpoints:
- GET /api/balance -> { balance: number }
- POST /api/balance (requires header x-api-key) -> { ok: true }

Security notes:
- Do NOT commit the 'data' directory. It is ignored by .gitignore.
- Set a strong API key in environment variable API_KEY before running the server.

Run locally (PowerShell):

$env:API_KEY = 'your-strong-key'; node server.js

Or on one line:
$env:API_KEY = 'your-strong-key'; node server.js

The server listens on PORT (default 3001) which can be overridden by setting PORT env var.
