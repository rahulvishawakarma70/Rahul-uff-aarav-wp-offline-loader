// public/client.js
async function postJSON(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  return r.json();
}

let currentSession = null;

document.getElementById('genPair').addEventListener('click', async () => {
  const resp = await postJSON('/generate_pair', {});
  if (resp.ok) {
    currentSession = resp.id;
    document.getElementById('pairCode').textContent = resp.pair;
    document.getElementById('sessionId').textContent = resp.id;
    document.getElementById('pairArea').style.display = 'block';
  } else {
    alert('failed to generate pair');
  }
});

document.getElementById('startSend').addEventListener('click', async () => {
  if (!currentSession) return alert('Generate pairing code first');
  const targetType = document.getElementById('targetType').value;
  const target = document.getElementById('target').value.trim();
  const body = document.getElementById('body').value;
  const resp = await postJSON('/start', { sessionId: currentSession, targetType, target, body });
  if (resp.ok) {
    alert('Started (mock) sending — session status: ' + resp.session.status);
  } else {
    alert('Start failed: ' + (resp.error || 'unknown'));
  }
});

document.getElementById('stopSend').addEventListener('click', async () => {
  if (!currentSession) return alert('No active session');
  const resp = await postJSON('/stop', { sessionId: currentSession });
  if (resp.ok) {
    alert('Session stopped');
  } else {
    alert('Stop failed');
  }
});

document.getElementById('showSession').addEventListener('click', async () => {
  if (!currentSession) return alert('No active session');
  const r = await fetch('/session/' + currentSession);
  const data = await r.json();
  if (data.ok) {
    const s = data.session;
    document.getElementById('sessionDetails').textContent = JSON.stringify(s, null, 2);
  } else {
    document.getElementById('sessionDetails').textContent = 'Not found';
  }
});
