// Minimal file-backed server to store a balance securely outside of the public repo.
// Usage: node server.js
// This server exposes a simple API: GET /api/balance
// It protects write endpoints with a simple API key.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const BALANCE_FILE = path.join(DATA_DIR, 'balance.json');
const API_KEY = process.env.API_KEY || 'changeme'; // set real key in environment

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(BALANCE_FILE)) {
  fs.writeFileSync(BALANCE_FILE, JSON.stringify({ balance: 0 }, null, 2), { flag: 'w' });
}

function readBalance() {
  try {
    const raw = fs.readFileSync(BALANCE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { balance: 0 };
  }
}

function writeBalance(obj) {
  fs.writeFileSync(BALANCE_FILE, JSON.stringify(obj, null, 2));
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/balance') {
    const data = readBalance();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ balance: data.balance }));
  }

  // Protected endpoint to set balance (requires API key in header x-api-key)
  if (req.method === 'POST' && req.url === '/api/balance') {
    const key = req.headers['x-api-key'];
    if (key !== API_KEY) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (typeof parsed.balance === 'number') {
          writeBalance({ balance: parsed.balance });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ ok: true }));
        }
      } catch (e) {}
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Bad request' }));
    });
    return;
  }

  // Static file serving for demo (do not expose data dir)
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const p = path.join(__dirname, '..', '..', 'index.html');
    fs.readFile(p, (err, content) => {
      if (err) { res.writeHead(500); return res.end('Server error'); }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Notify-server running on http://localhost:${PORT} (API_KEY from env)`);
});
