const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
// allow cross-origin requests from browser pages (local files / GitHub Pages)
app.use(cors());
app.use(bodyParser.json());

// simple request logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify({users:[]}, null, 2));

function readUsers(){
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function writeUsers(obj){
  fs.writeFileSync(USERS_FILE, JSON.stringify(obj, null, 2));
}

function genToken(){ return crypto.randomBytes(24).toString('hex'); }
function genId(){ return crypto.randomBytes(6).toString('hex'); }

app.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.json({ error: 'missing' });
  const db = readUsers();
  if (db.users.find(u=>u.username === username)) return res.json({ error: 'exists' });
  const id = genId();
  const token = genToken();
  const user = { id, username, password, balance: 0, token };
  db.users.push(user);
  writeUsers(db);
  res.json({ id, token, balance: 0 });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.json({ error: 'missing' });
  const db = readUsers();
  const user = db.users.find(u=>u.username === username && u.password === password);
  if (!user) return res.json({ error: 'invalid' });
  // issue new token
  user.token = genToken();
  writeUsers(db);
  res.json({ id: user.id, token: user.token, balance: user.balance });
});

app.get('/me', (req, res) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'unauth' });
  const db = readUsers();
  const user = db.users.find(u=>u.token === token);
  if (!user) return res.status(401).json({ error: 'unauth' });
  res.json({ id: user.id, username: user.username, balance: user.balance });
});

// simple root endpoint to verify server is alive
app.get('/', (req, res) => {
  res.send('Notify-server running');
});

// developer-friendly /notify endpoint (shows user count and id/balance list)
app.get('/notify', (req, res) => {
  const db = readUsers();
  const users = (db.users || []).map(u => ({ id: u.id, balance: u.balance }));
  res.json({ ok: true, usersCount: users.length, users });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('Notify-server listening on', port));
