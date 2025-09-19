// server.js
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for demo
const sessions = {};

// Generate a short pairing code
function generatePairCode() {
  return crypto.randomBytes(3).toString('hex'); // 6 hex chars
}

// Endpoint: generate pair code
app.post('/generate_pair', (req, res) => {
  const pair = generatePairCode();
  const id = crypto.randomUUID();
  sessions[id] = {
    id,
    pair,
    createdAt: Date.now(),
    status: 'waiting', // or 'paired' or 'sending'
    messagesSent: 0,
  };
  res.json({ ok: true, id, pair });
});

// Endpoint: start sending messages (mock)
app.post('/start', (req, res) => {
  const { sessionId, targetType, target, body } = req.body;
  const s = sessions[sessionId];
  if (!s) return res.status(404).json({ ok: false, error: 'session not found' });
  s.status = 'sending';
  // Simulate sending by incrementing messagesSent
  s.messagesSent += 1;
  // For a real implementation you would integrate with whatsapp-web.js, puppeteer, or an API
  res.json({ ok: true, session: s });
});

// Endpoint: stop session
app.post('/stop', (req, res) => {
  const { sessionId } = req.body;
  const s = sessions[sessionId];
  if (!s) return res.status(404).json({ ok: false, error: 'session not found' });
  s.status = 'stopped';
  res.json({ ok: true, session: s });
});

// Endpoint: show session details
app.get('/session/:id', (req, res) => {
  const s = sessions[req.params.id];
  if (!s) return res.status(404).json({ ok: false, error: 'not found' });
  res.json({ ok: true, session: s });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
