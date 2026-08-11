"""
Agent 2 Web UI — DELIMa-styled Flask interface
Run: py app.py  then open http://localhost:5000
"""

import os, sys, json, threading
from flask import Flask, render_template_string, request, jsonify

app = Flask(__name__)

state = {"status": "idle", "logs": [], "result": None, "error": None}
lock  = threading.Lock()

def add_log(msg):
    with lock:
        state["logs"].append(str(msg))

# ── HTML ────────────────────────────────────────────────────
HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Agent 2 — Scholarship Matching</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Outfit',sans-serif;background:#F0F4FF;color:#1e293b;min-height:100vh;}

  .header{background:#0F2057;padding:0 32px;display:flex;align-items:center;height:60px;gap:16px;}
  .header-logo{color:#fff;font-size:20px;font-weight:700;}
  .header-sub{color:#93C5FD;font-size:13px;}
  .header-badge{margin-left:auto;background:#1A56DB;color:#fff;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:600;}

  .container{max-width:980px;margin:32px auto;padding:0 16px;}
  .card{background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.08);margin-bottom:20px;overflow:hidden;}
  .card-header{background:#0F2057;color:#fff;padding:14px 20px;font-size:15px;font-weight:600;display:flex;align-items:center;gap:10px;}
  .card-body{padding:22px;}

  label{display:block;font-size:13px;color:#475569;margin-bottom:6px;font-weight:600;}
  input[type=text],input[type=password]{width:100%;padding:10px 14px;border:1.5px solid #CBD5E1;border-radius:7px;font-size:14px;font-family:'Outfit',sans-serif;outline:none;transition:.2s;}
  input:focus{border-color:#1A56DB;box-shadow:0 0 0 3px rgba(26,86,219,.1);}
  .hint{font-size:12px;color:#94A3B8;margin-top:5px;}
  .hint a{color:#1A56DB;text-decoration:none;}

  .mode-toggle{display:flex;gap:10px;margin-bottom:20px;}
  .mode-btn{flex:1;padding:12px;border:2px solid #CBD5E1;border-radius:8px;background:#fff;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;color:#64748B;transition:.2s;text-align:center;}
  .mode-btn.active{border-color:#1A56DB;background:#EFF6FF;color:#1A56DB;}
  .mode-btn:hover{border-color:#1A56DB;}
  .mode-label{font-size:11px;font-weight:400;color:#94A3B8;display:block;margin-top:3px;}

  .field-group{margin-bottom:18px;}
  .divider{border:none;border-top:1px solid #E2E8F0;margin:18px 0;}

  .btn{display:inline-flex;align-items:center;gap:8px;padding:11px 28px;border-radius:7px;font-size:14px;font-weight:600;font-family:'Outfit',sans-serif;cursor:pointer;border:none;transition:.2s;}
  .btn-primary{background:#1A56DB;color:#fff;}
  .btn-primary:hover{background:#1447C0;}
  .btn-primary:disabled{background:#94A3B8;cursor:not-allowed;}

  .progress-bar-wrap{background:#E2E8F0;border-radius:100px;height:10px;margin:12px 0;}
  .progress-bar{height:10px;border-radius:100px;background:linear-gradient(90deg,#1A56DB,#3B82F6);transition:width .4s ease;}
  .log-box{background:#0F172A;border-radius:8px;padding:16px;font-family:'Courier New',monospace;font-size:12px;color:#94A3B8;max-height:220px;overflow-y:auto;line-height:1.7;}
  .log-box .ok{color:#34D399;}
  .log-box .warn{color:#FBBF24;}
  .log-box .done{color:#60A5FA;font-weight:bold;}

  .status-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;}
  .badge-idle{background:#F1F5F9;color:#64748B;}
  .badge-running{background:#DBEAFE;color:#1D4ED8;}
  .badge-done{background:#D1FAE5;color:#065F46;}
  .badge-error{background:#FEE2E2;color:#991B1B;}
  .dot{width:7px;height:7px;border-radius:50%;}
  .dot-idle{background:#94A3B8;}
  .dot-running{background:#1A56DB;animation:pulse 1s infinite;}
  .dot-done{background:#059669;}
  .dot-error{background:#DC2626;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}

  .results-area{display:none;}
  .summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;}
  .summary-card{background:#fff;border-radius:8px;padding:16px;text-align:center;border:1.5px solid #E2E8F0;}
  .summary-card .num{font-size:28px;font-weight:700;color:#0F2057;}
  .summary-card .lbl{font-size:12px;color:#94A3B8;margin-top:4px;}

  table{width:100%;border-collapse:collapse;font-size:13px;}
  th{background:#0F2057;color:#fff;padding:10px 14px;text-align:left;font-weight:600;}
  td{padding:9px 14px;border-bottom:1px solid #F1F5F9;vertical-align:middle;}
  tr:hover td{background:#F8FAFF;}
  .score-bar-wrap{background:#E2E8F0;border-radius:100px;height:6px;width:80px;display:inline-block;vertical-align:middle;margin-left:6px;}
  .score-bar{height:6px;border-radius:100px;background:#1A56DB;}
  .eligible-yes{color:#059669;font-weight:600;}
  .eligible-no{color:#94A3B8;}
  .student-select{padding:8px 12px;border:1.5px solid #CBD5E1;border-radius:7px;font-size:13px;font-family:'Outfit',sans-serif;outline:none;margin-bottom:16px;}
  .factor-chip{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;margin:2px;}
  .fc-academic{background:#DBEAFE;color:#1D4ED8;}
  .fc-pajsk{background:#D1FAE5;color:#065F46;}
  .fc-psycho{background:#F3E8FF;color:#6B21A8;}
  .fc-aspiration{background:#FEF3C7;color:#92400E;}
  .fc-income{background:#FEE2E2;color:#991B1B;}

  .student-info-bar{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#1E40AF;display:flex;align-items:center;gap:8px;}
</style>
</head>
<body>

<div class="header">
  <div class="header-logo">AI Scholarship Matching</div>
  <div class="header-sub">Agentic AI Multi-Agent System</div>
  <div class="header-badge">Agent 2 — Scholarship Matching</div>
</div>

<div class="container">

  <!-- Setup Card -->
  <div class="card" id="setup-card">
    <div class="card-header">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
      Setup
    </div>
    <div class="card-body">

      <label style="margin-bottom:10px;">Select Mode</label>
      <div class="mode-toggle">
        <button class="mode-btn active" id="mode-batch" onclick="setMode('batch')">
          Run All Students
          <span class="mode-label">Batch mode — score all students at once</span>
        </button>
        <button class="mode-btn" id="mode-single" onclick="setMode('single')">
          Run for One Student
          <span class="mode-label">On-demand — score only the selected student</span>
        </button>
      </div>

      <hr class="divider"/>

      <div class="field-group" id="student-id-field" style="display:none;">
        <label for="student-id">Student ID</label>
        <input type="text" id="student-id" placeholder="e.g. SBP5IK001" autocomplete="off"/>
        <div class="hint">Enter the student ID exactly as it appears in output.json</div>
      </div>

      <div class="field-group">
        <label for="apikey">Groq API Key</label>
        <input type="password" id="apikey" placeholder="gsk_xxxxxxxxxxxxxxxxxxxx" autocomplete="off"/>
        <div class="hint">Get your free key at <a href="https://console.groq.com" target="_blank">console.groq.com</a> &rarr; API Keys &rarr; Create key</div>
      </div>

      <button class="btn btn-primary" id="run-btn" onclick="startRun()">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
        <span id="run-btn-label">Run Agent 2</span>
      </button>
    </div>
  </div>

  <!-- Progress Card -->
  <div class="card" id="progress-card" style="display:none;">
    <div class="card-header">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
      Pipeline Progress
    </div>
    <div class="card-body">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <span id="status-badge" class="status-badge badge-idle">
          <span class="dot dot-idle" id="status-dot"></span>
          <span id="status-text">Idle</span>
        </span>
        <span id="progress-pct" style="font-size:13px;color:#64748B;">0%</span>
      </div>
      <div class="progress-bar-wrap"><div class="progress-bar" id="progress-bar" style="width:0%"></div></div>
      <div style="font-size:12px;color:#94A3B8;margin-bottom:10px;" id="progress-label">Waiting to start...</div>
      <div class="log-box" id="log-box">Waiting...</div>
    </div>
  </div>

  <!-- Results -->
  <div id="results-area" class="results-area">

    <div class="summary-grid">
      <div class="summary-card"><div class="num" id="sum-students">—</div><div class="lbl">Students Processed</div></div>
      <div class="summary-card"><div class="num" id="sum-scholarships">—</div><div class="lbl">Scholarships Evaluated</div></div>
      <div class="summary-card"><div class="num" id="sum-matches">—</div><div class="lbl">Total Match Records</div></div>
    </div>

    <div class="card">
      <div class="card-header">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
        Top-5 Scholarship Matches
      </div>
      <div class="card-body">
        <div id="student-info-bar" class="student-info-bar" style="display:none;"></div>
        <select class="student-select" id="student-select" onchange="showStudent()" style="display:none;">
          <option value="">-- Select a student --</option>
        </select>
        <div id="matches-table"></div>
        <div style="margin-top:16px;">
          <button class="btn btn-primary" onclick="resetUI()" style="background:#475569;padding:9px 20px;">
            &larr; Run Another
          </button>
        </div>
      </div>
    </div>

  </div>

</div>

<script>
let pollTimer  = null;
let resultData = null;
let currentMode = 'batch';

function setMode(mode) {
  currentMode = mode;
  document.getElementById('mode-batch').classList.toggle('active', mode === 'batch');
  document.getElementById('mode-single').classList.toggle('active', mode === 'single');
  document.getElementById('student-id-field').style.display = mode === 'single' ? 'block' : 'none';
  document.getElementById('run-btn-label').textContent = mode === 'single' ? 'Run for This Student' : 'Run All Students';
}

function startRun() {
  const key = document.getElementById('apikey').value.trim();
  if (!key) { alert('Please enter your Groq API key.'); return; }

  let studentId = '';
  if (currentMode === 'single') {
    studentId = document.getElementById('student-id').value.trim();
    if (!studentId) { alert('Please enter a Student ID.'); return; }
  }

  document.getElementById('run-btn').disabled = true;
  document.getElementById('setup-card').style.display = 'none';
  document.getElementById('progress-card').style.display = 'block';
  setStatus('running');

  fetch('/start', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({api_key: key, student_id: studentId, mode: currentMode})
  }).then(r => r.json()).then(d => {
    if (d.ok) {
      pollTimer = setInterval(poll, 1500);
    } else {
      setStatus('error');
      document.getElementById('log-box').innerHTML = '<div class="warn">ERROR: ' + esc(d.error) + '</div>';
    }
  });
}

function poll() {
  fetch('/status').then(r => r.json()).then(d => {
    const box = document.getElementById('log-box');
    box.innerHTML = d.logs.map(l => {
      if (l.startsWith('OK') || l.startsWith('DONE')) return `<div class="ok">${esc(l)}</div>`;
      if (l.startsWith('WARNING'))                   return `<div class="warn">${esc(l)}</div>`;
      if (l.includes('DONE') || l.includes('saved')) return `<div class="done">${esc(l)}</div>`;
      return `<div>${esc(l)}</div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;

    const total = 10;
    const done  = d.logs.filter(l => /^\[\d+\//.test(l)).length;
    const pct   = Math.min(95, Math.round((done / total) * 90));
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('progress-pct').textContent = pct + '%';
    document.getElementById('progress-label').textContent =
      done > 0 ? `Scored ${done} of ${total} scholarships` : 'Initialising...';

    if (d.status === 'done') {
      clearInterval(pollTimer);
      setStatus('done');
      document.getElementById('progress-bar').style.width = '100%';
      document.getElementById('progress-pct').textContent = '100%';
      document.getElementById('progress-label').textContent = 'Complete!';
      loadResults();
    } else if (d.status === 'error') {
      clearInterval(pollTimer);
      setStatus('error');
    }
  });
}

function setStatus(s) {
  document.getElementById('status-badge').className = 'status-badge badge-' + s;
  document.getElementById('status-dot').className   = 'dot dot-' + s;
  document.getElementById('status-text').textContent = {idle:'Idle',running:'Running...',done:'Complete',error:'Error'}[s];
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function loadResults() {
  fetch('/results').then(r => r.json()).then(data => {
    resultData = data;
    document.getElementById('results-area').style.display = 'block';
    document.getElementById('sum-students').textContent     = data.totalStudents;
    document.getElementById('sum-scholarships').textContent = data.totalScholarships;
    document.getElementById('sum-matches').textContent      = data.totalMatches;

    if (data.mode === 'single') {
      const s   = data.results[0];
      const bar = document.getElementById('student-info-bar');
      bar.style.display = 'flex';
      bar.innerHTML = `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        <strong>${esc(s.studentId)}</strong>&nbsp;&mdash;&nbsp;${esc(s.studentName)}`;
      renderMatches(s.top5);
    } else {
      const sel = document.getElementById('student-select');
      sel.style.display = 'block';
      data.results.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.studentId;
        opt.textContent = s.studentId + ' — ' + s.studentName;
        sel.appendChild(opt);
      });
      if (data.results.length > 0) { sel.value = data.results[0].studentId; showStudent(); }
    }
  });
}

function showStudent() {
  const id = document.getElementById('student-select').value;
  if (!id || !resultData) return;
  const s = resultData.results.find(s => s.studentId === id);
  if (s) renderMatches(s.top5);
}

function renderMatches(matches) {
  const rows = matches.map((m, i) => {
    const bd = m.breakdown;
    return `<tr>
      <td style="font-weight:600;color:#0F2057;">${i+1}</td>
      <td>
        <div style="font-weight:600;">${esc(m.scholarshipName)}</div>
        <div style="font-size:11px;color:#94A3B8;">${esc(m.provider||'')}</div>
      </td>
      <td>
        <span style="font-weight:700;font-size:15px;color:#1A56DB;">${m.totalScore}</span>
        <div class="score-bar-wrap"><div class="score-bar" style="width:${Math.round(m.totalScore)}%"></div></div>
      </td>
      <td>${m.eligible
        ? '<span class="eligible-yes">&#10003; Eligible</span>'
        : '<span class="eligible-no">Not eligible</span>'}</td>
      <td>
        <span class="factor-chip fc-academic">Acad: ${bd.academic}</span>
        <span class="factor-chip fc-pajsk">PAJSK: ${bd.pajsk}</span>
        <span class="factor-chip fc-psycho">Psycho: ${bd.psychometric}</span>
        <span class="factor-chip fc-aspiration">Aspir: ${bd.aspiration}</span>
        <span class="factor-chip fc-income">Income: ${bd.income}</span>
      </td>
      <td>${m.url ? `<a href="${m.url}" target="_blank" style="color:#1A56DB;font-size:12px;">Apply &#8599;</a>` : ''}</td>
    </tr>`;
  }).join('');

  document.getElementById('matches-table').innerHTML = `
    <table>
      <thead><tr>
        <th>#</th><th>Scholarship</th><th>Score /100</th>
        <th>Eligible</th><th>Factor Breakdown</th><th>Link</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function resetUI() {
  resultData = null;
  document.getElementById('results-area').style.display  = 'none';
  document.getElementById('progress-card').style.display = 'none';
  document.getElementById('setup-card').style.display    = 'block';
  document.getElementById('run-btn').disabled = false;
  document.getElementById('log-box').innerHTML = 'Waiting...';
  document.getElementById('progress-bar').style.width = '0%';
  document.getElementById('progress-pct').textContent = '0%';
  const sel = document.getElementById('student-select');
  sel.innerHTML = '<option value="">-- Select a student --</option>';
  sel.style.display = 'none';
  document.getElementById('student-info-bar').style.display = 'none';
  document.getElementById('student-info-bar').innerHTML = '';
  document.getElementById('matches-table').innerHTML = '';
  setStatus('idle');
}
</script>
</body>
</html>
"""

# ── Flask routes ─────────────────────────────────────────────

@app.route("/")
def index():
    return render_template_string(HTML)


@app.route("/start", methods=["POST"])
def start():
    global state
    data       = request.get_json()
    api_key    = data.get("api_key", "").strip()
    mode       = data.get("mode", "batch")
    student_id = data.get("student_id", "").strip()

    if not api_key:
        return jsonify({"ok": False, "error": "No API key provided"})
    if mode == "single" and not student_id:
        return jsonify({"ok": False, "error": "No student ID provided"})

    os.environ["GROQ_API_KEY"] = api_key

    with lock:
        state = {"status": "running", "logs": [], "result": None, "error": None}

    def worker():
        try:
            sys.path.insert(0, os.path.dirname(__file__))
            import agent2
            if mode == "single":
                result = agent2.run_single(student_id, progress_cb=add_log)
            else:
                result = agent2.run(progress_cb=add_log)
            with lock:
                state["status"] = "done"
                state["result"] = result
        except Exception as e:
            add_log(f"ERROR: {e}")
            with lock:
                state["status"] = "error"
                state["error"]  = str(e)

    threading.Thread(target=worker, daemon=True).start()
    return jsonify({"ok": True})


@app.route("/status")
def status():
    with lock:
        return jsonify({"status": state["status"], "logs": state["logs"][-60:]})


@app.route("/results")
def results():
    with lock:
        return jsonify(state["result"] or {})


if __name__ == "__main__":
    print("=" * 50)
    print("  Agent 2 — Scholarship Matching Web UI")
    print("  Open: http://localhost:5000")
    print("=" * 50)
    app.run(port=5000, debug=False)
