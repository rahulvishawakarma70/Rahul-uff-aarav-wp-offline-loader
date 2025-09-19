// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory sessions
const sessions = {};

// Generate random pairing code
function generatePairCode() {
  return crypto.randomBytes(3).toString("hex"); // 6 chars
}

// API: Generate pairing code
app.post("/generate_pair", (req, res) => {
  const id = crypto.randomUUID();
  const pair = generatePairCode();

  sessions[id] = {
    id,
    pair,
    createdAt: Date.now(),
    status: "waiting",
  };

  res.json({ ok: true, id, pair });
});

// API: Start sending (mock)
app.post("/start", (req, res) => {
  const { sessionId, targetType, target, body } = req.body;
  if (!sessions[sessionId]) {
    return res.status(404).json({ ok: false, error: "session not found" });
  }
  sessions[sessionId].status = "sending";
  sessions[sessionId].lastTarget = target;
  sessions[sessionId].lastMessage = body;

  res.json({ ok: true, session: sessions[sessionId] });
});

// API: Stop session
app.post("/stop", (req, res) => {
  const { sessionId } = req.body;
  if (!sessions[sessionId]) {
    return res.status(404).json({ ok: false, error: "session not found" });
  }
  sessions[sessionId].status = "stopped";
  res.json({ ok: true, session: sessions[sessionId] });
});

// API: Get session info
app.get("/session/:id", (req, res) => {
  const s = sessions[req.params.id];
  if (!s) return res.status(404).json({ ok: false, error: "not found" });
  res.json({ ok: true, session: s });
});

// Start server (Render requires process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
