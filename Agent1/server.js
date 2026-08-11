const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const https  = require('https');
const { spawn } = require('child_process');
const { Pool } = require('pg');

// polyfill fetch for Node < 18
let fetch;
try { fetch = globalThis.fetch; } catch {}
if (!fetch) {
  fetch = (url, opts = {}) => new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === 'https:' ? https : http;
    const body = opts.body || null;
    const reqOpts = {
      hostname: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + u.search, method: opts.method || 'GET',
      headers: opts.headers || {},
    };
    const req = mod.request(reqOpts, r => {
      let data = '';
      r.on('data', c => data += c);
      r.on('end', () => resolve({ ok: r.statusCode < 400, status: r.statusCode, json: () => Promise.resolve(JSON.parse(data)) }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

let scholarshipCache = null; // { ts: timestamp, data: [...] }
const SCRAPER_SCRIPT = path.join(__dirname, 'scrape_scholarships.py');
const CACHE_FILE     = path.join(__dirname, 'scholarship_cache.json');
const ONE_DAY_MS     = 24 * 60 * 60 * 1000;

// ── Run scraper and update cache ──
function runScraper() {
  console.log('[Biasiswa] Running scraper...');
  return new Promise(resolve => {
    const py = spawn('python', [SCRAPER_SCRIPT], { cwd: __dirname });
    let out = '', err = '';
    py.stdout.on('data', d => out += d);
    py.stderr.on('data', d => err += d);
    py.on('close', () => {
      if (err.trim()) console.log('[Biasiswa scraper stderr]', err.trim().split('\n').slice(-3).join(' | '));
      try {
        const scholarships = JSON.parse(out.trim() || '[]');
        if (scholarships.length > 0) {
          scholarshipCache = { ts: Date.now(), data: scholarships };
          fs.writeFileSync(CACHE_FILE, JSON.stringify(scholarshipCache), 'utf8');
          console.log(`[Biasiswa] OK ${scholarships.length} scholarships cached.`);
        } else {
          console.log('[Biasiswa] Scraper returned 0 items — keeping old cache.');
        }
      } catch (e) {
        console.log('[Biasiswa] Parse error:', e.message);
      }
      resolve();
    });
    py.on('error', e => { console.log('[Biasiswa] Spawn error:', e.message); resolve(); });
    setTimeout(() => { py.kill(); console.log('[Biasiswa] Scraper timeout.'); resolve(); }, 60000);
  });
}

// ── Load cache from disk on startup ──
try {
  const saved = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  scholarshipCache = saved;
  console.log(`[Biasiswa] Loaded cache from disk (${saved.data.length} items, age ${Math.round((Date.now()-saved.ts)/3600000)}h)`);
} catch { /* no cache yet */ }

// ── Schedule daily refresh ──
// Run immediately at startup if cache is missing or older than 24h
if (!scholarshipCache || (Date.now() - scholarshipCache.ts) >= ONE_DAY_MS) {
  runScraper();
}
// Then repeat every 24 hours
setInterval(runScraper, ONE_DAY_MS);

// ── Load .env from project root ──
const envFile = path.join(__dirname, '..', '.env');
try {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
  console.log('✅ .env loaded');
} catch { console.log('⚠️  .env not found — set GROQ_API_KEY manually'); }

// ── PostgreSQL connection pool ──
const db = new Pool({
  host:     process.env.PG_HOST     || '127.0.0.1',
  port:     parseInt(process.env.PG_PORT || '5432'),
  database: process.env.PG_DATABASE || 'sekolah_5ik',
  user:     process.env.PG_USER     || 'postgres',
  password: process.env.PG_PASSWORD || '',
});
db.connect()
  .then(async () => {
    console.log('✅ PostgreSQL connected');
    await db.query(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id          SERIAL PRIMARY KEY,
        ts          TIMESTAMPTZ DEFAULT NOW(),
        student_id  VARCHAR(20),
        action      VARCHAR(50) NOT NULL,
        detail      TEXT,
        ip          VARCHAR(45),
        status      VARCHAR(20) DEFAULT 'ok'
      )
    `);
    console.log('✅ activity_log table ready');
  })
  .catch(e => console.log('❌ PostgreSQL error:', e.message));

// ── Activity logger (fire-and-forget, never blocks a request) ──
function writeLog(action, { studentId = null, detail = null, ip = null, status = 'ok' } = {}) {
  db.query(
    'INSERT INTO activity_log (action, student_id, detail, ip, status) VALUES ($1,$2,$3,$4,$5)',
    [action, studentId || null, detail || null, ip || null, status]
  ).catch(e => console.error('[log error]', e.message));
}

function clientIp(req) {
  return (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
}

const PORT = 3333;
const MIME = {
  '.html':'text/html', '.css':'text/css',
  '.js':'application/javascript', '.json':'application/json',
};

// ── Load credentials from PostgreSQL (server-side only, never sent to client) ──
const CREDENTIALS = {};
const PROFILES    = {};

async function loadStudentsFromDB() {
  try {
    const res = await db.query(`
      SELECT p.id, p.nama, p.jantina,
             k.password, k.gp, k.ringkasan_gred,
             k.bm, k.bi, k.mm, k.sej, k.pai, k.mt, k.bckom, k.fizik, k.kimia, k.bio,
             pd.jumlah_pendapatan, pd.kategori_pendapatan,
             ps.markah AS pajsk_markah, ps.peratus AS pajsk_peratus,
             ps.jenis_sukan, ps.jawatan_sukan, ps.peringkat_sukan,
             ps.nama_kelab, ps.jawatan_kelab, ps.peringkat_kelab,
             ps.nama_badan, ps.jawatan_bb, ps.peringkat_bb,
             ps.perkhidmatan, ps.anugerah_khas, ps.khidmat_masyarakat,
             ps.tahap_pencapaian,
             i.kod_holland, i.tafsiran_utama, i.bidang_1, i.bidang_2, i.bidang_3
      FROM pelajar p
      LEFT JOIN keputusan_spm k ON p.id = k.id
      LEFT JOIN pendapatan_penjaga pd ON p.id = pd.id
      LEFT JOIN pajsk ps ON p.id = ps.id
      LEFT JOIN imk i ON p.id = i.id
    `);
    res.rows.forEach(row => {
      CREDENTIALS[row.id] = row.password;
      PROFILES[row.id] = {
        id:              row.id,
        name:            row.nama,
        gender:          row.jantina,
        gpScore:         row.gp ? (10 - parseFloat(row.gp)) : 0,
        ringkasan:       row.ringkasan_gred || '',
        subjects:        { bm: row.bm, bi: row.bi, mm: row.mm, sej: row.sej, pai: row.pai, mt: row.mt, bckom: row.bckom, fizik: row.fizik, kimia: row.kimia, bio: row.bio },
        pajskScore:      row.pajsk_peratus ? parseFloat(row.pajsk_peratus) : 0,
        pajskData: {
          sukan:          row.jenis_sukan || '',
          jawatanSukan:   row.jawatan_sukan || '',
          peringkatSukan: row.peringkat_sukan || '',
          kelab:          row.nama_kelab || '',
          jawatanKelab:   row.jawatan_kelab || '',
          peringkatKelab: row.peringkat_kelab || '',
          badanBeruniform:row.nama_badan || '',
          jawatanBB:      row.jawatan_bb || '',
          peringkatBB:    row.peringkat_bb || '',
          perkhidmatan:   row.perkhidmatan || '',
          anugerahKhas:   row.anugerah_khas || '',
          khidmatMasyarakat: row.khidmat_masyarakat || '',
          tahapPencapaian:row.tahap_pencapaian || '',
        },
        parentIncome:    row.jumlah_pendapatan ? parseFloat(row.jumlah_pendapatan) : 0,
        parentCategory:  row.kategori_pendapatan || 'M40',
        hollandCode:     row.kod_holland || '',
        fieldOfInterest: row.bidang_1 || '',
        dreamCareer:     row.tafsiran_utama || '',
      };
    });
    console.log(`🔐 Loaded ${Object.keys(CREDENTIALS).length} student credentials from PostgreSQL`);
    console.log(`📊 Loaded ${Object.keys(PROFILES).length} student profiles from PostgreSQL`);
  } catch(e) {
    console.error('❌ Failed to load students from DB:', e.message);
  }
}
loadStudentsFromDB();

// ── Match state per student ──
const matchState    = {};
const reportState   = {};
const interestState = {};
const AGENT2_SCRIPT = path.join(__dirname, '..', 'Agent2', 'agent2.py');
const AGENT3_SCRIPT = path.join(__dirname, '..', 'Agent3', 'agent3.py');

// ── Helper: parse JSON body ──
function parseBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
  });
}

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type':'application/json', 'Access-Control-Allow-Origin':'*' });
  res.end(JSON.stringify(data));
}

// ── Server ──
const server = http.createServer(async (req, res) => {

  // GET /students — return list of students with credentials for dropdown
  if (req.method === 'GET' && req.url === '/students') {
    const list = Object.entries(CREDENTIALS).map(([id, pw]) => ({
      id,
      name: PROFILES[id] ? PROFILES[id].name : id,
      password: pw,
    })).sort((a, b) => a.id.localeCompare(b.id));
    return json(res, 200, list);
  }

  // POST /start-match — trigger Agent 2 for one student
  if (req.method === 'POST' && req.url === '/start-match') {
    const body = await parseBody(req);
    const id   = String(body.id || '').trim().toUpperCase();
    if (!id) return json(res, 400, { error: 'No student ID' });
    if (!process.env.GROQ_API_KEY) return json(res, 400, { error: 'Groq API key not set. Hubungi pentadbir.' });

    // Write SPM override file — grade scale: 0=best (A+), 9=worst (G)
    const GRADE_POINTS = {'A+':0,'A':1,'A-':2,'B+':3,'B':4,'C+':5,'C':6,'D':7,'E':8,'G':9};
    const spmSubjects = body.spmSubjects || [];
    const bidang      = (body.bidang     || '').trim();
    const iptKat      = (body.iptKat     || '').trim();
    const iptNama     = (body.iptNama    || '').trim();
    const kos         = (body.kos        || '').trim();
    const useHolland  = !!body.useHolland;
    const overrideFile = path.join(__dirname, '..', 'Agent2', `spm_override_${id}.json`);
    if (spmSubjects.length > 0) {
      // Full write — student submitted SPM subjects
      const total   = spmSubjects.reduce((s, x) => s + (GRADE_POINTS[x.grade] ?? 9), 0);
      const gpScore = parseFloat((total / spmSubjects.length).toFixed(2));
      fs.writeFileSync(overrideFile, JSON.stringify({ gpScore, subjects: spmSubjects, bidang, iptKat, iptNama, kos, useHolland }, null, 2), 'utf8');
      writeLog('SPM_SUBMIT', { studentId: id, detail: `${spmSubjects.length} subjek, GP=${gpScore}, bidang=${bidang||'—'}, kos=${kos||'—'}, ipt=${iptKat||'—'}/${iptNama||'—'}`, ip: clientIp(req) });
    } else if (fs.existsSync(overrideFile)) {
      // SPM already saved — only update path params (kos, bidang, iptKat, iptNama, useHolland)
      const existing = JSON.parse(fs.readFileSync(overrideFile, 'utf8'));
      existing.bidang     = bidang     || existing.bidang     || '';
      existing.iptKat     = iptKat     || existing.iptKat     || '';
      existing.iptNama    = iptNama    || existing.iptNama    || '';
      existing.kos        = kos;
      existing.useHolland = useHolland;
      fs.writeFileSync(overrideFile, JSON.stringify(existing, null, 2), 'utf8');
      writeLog('STATUS_UPDATE', { studentId: id, detail: `bidang=${bidang||'—'}, kos=${kos||'—'}, useHolland=${useHolland}`, ip: clientIp(req) });
    }

    // If currently running, don't double-spawn; if done, clear so re-run happens with new params
    if (matchState[id] && matchState[id].status === 'running') return json(res, 200, { ok: true, status: 'running' });
    delete matchState[id];

    matchState[id] = { status: 'running', logs: [], result: null };
    writeLog('MATCH_START', { studentId: id, ip: clientIp(req) });

    const py = spawn('python', [AGENT2_SCRIPT, '--single', id], {
      env: { ...process.env },
      cwd: path.join(__dirname, '..', 'Agent2'),
    });

    py.stdout.on('data', d => {
      d.toString().split('\n').filter(Boolean).forEach(line => {
        matchState[id].logs.push(line);
      });
    });
    py.stderr.on('data', d => {
      d.toString().split('\n').filter(Boolean).forEach(line => {
        matchState[id].logs.push('ERR: ' + line);
      });
    });
    py.on('close', code => {
      const spmNotEntered = matchState[id].logs.some(l => l.includes('SPM_NOT_ENTERED'));
      if (spmNotEntered) {
        matchState[id].status = 'spm_required';
        writeLog('MATCH_ERROR', { studentId: id, detail: 'SPM belum dimasukkan', status: 'fail' });
        return;
      }
      try {
        const outFile = path.join(__dirname, '..', 'Agent2', `matches_${id}.json`);
        const result  = JSON.parse(fs.readFileSync(outFile, 'utf8'));
        matchState[id].result = result;
        matchState[id].status = 'done';
        const top = result.matches && result.matches[0];
        writeLog('MATCH_DONE', { studentId: id, detail: top ? `Top: ${top.scholarshipName} (${top.totalScore})` : 'tiada padanan' });
      } catch {
        matchState[id].status = code === 0 ? 'done' : 'error';
        writeLog('MATCH_ERROR', { studentId: id, detail: `exit code ${code}`, status: 'fail' });
      }
    });

    return json(res, 200, { ok: true, status: 'running' });
  }

  // GET /match-status?id= — poll match progress
  if (req.method === 'GET' && req.url.startsWith('/match-status')) {
    const id = new URL(req.url, 'http://x').searchParams.get('id') || '';
    const s  = matchState[id.toUpperCase()];
    if (!s) return json(res, 200, { status: 'idle', logs: [] });
    return json(res, 200, { status: s.status, logs: s.logs.slice(-60) });
  }

  // GET /match-result?id= — get final results
  if (req.method === 'GET' && req.url.startsWith('/match-result')) {
    const id = new URL(req.url, 'http://x').searchParams.get('id') || '';
    const s  = matchState[id.toUpperCase()];
    if (!s || !s.result) return json(res, 200, {});
    return json(res, 200, s.result);
  }

  // POST /start-report — trigger Agent 3 for one student
  if (req.method === 'POST' && req.url === '/start-report') {
    const body = await parseBody(req);
    const id   = String(body.id || '').trim().toUpperCase();
    if (!id) return json(res, 400, { error: 'No student ID' });
    if (reportState[id] && reportState[id].status === 'running') return json(res, 200, { ok: true, status: 'running' });
    reportState[id] = null; // reset supaya PDF dijana semula dari matching result terkini

    reportState[id] = { status: 'running', logs: [], result: null };
    writeLog('REPORT_REQUEST', { studentId: id, ip: clientIp(req) });

    const py = spawn('python', [AGENT3_SCRIPT, '--single', id], {
      env: { ...process.env },
      cwd: path.join(__dirname, '..', 'Agent3'),
    });

    py.stdout.on('data', d => {
      d.toString().split('\n').filter(Boolean).forEach(line => {
        reportState[id].logs.push(line);
      });
    });
    py.stderr.on('data', d => {
      d.toString().split('\n').filter(Boolean).forEach(line => {
        reportState[id].logs.push('ERR: ' + line);
      });
    });
    py.on('close', code => {
      try {
        const outFile = path.join(__dirname, '..', 'Agent3', `report_${id}.json`);
        const result  = JSON.parse(fs.readFileSync(outFile, 'utf8'));
        reportState[id].result = result;
        reportState[id].status = 'done';
      } catch {
        reportState[id].status = code === 0 ? 'done' : 'error';
      }
    });

    return json(res, 200, { ok: true, status: 'running' });
  }

  // GET /report-status?id=
  if (req.method === 'GET' && req.url.startsWith('/report-status')) {
    const id = new URL(req.url, 'http://x').searchParams.get('id') || '';
    const s  = reportState[id.toUpperCase()];
    if (!s) return json(res, 200, { status: 'idle', logs: [] });
    return json(res, 200, { status: s.status, logs: s.logs.slice(-20) });
  }

  // GET /report-result?id=
  if (req.method === 'GET' && req.url.startsWith('/report-result')) {
    const id = new URL(req.url, 'http://x').searchParams.get('id') || '';
    const s  = reportState[id.toUpperCase()];
    if (!s || !s.result) return json(res, 200, {});
    return json(res, 200, s.result);
  }

  // POST /start-interest — trigger interest-based search
  if (req.method === 'POST' && req.url === '/start-interest') {
    const body     = await parseBody(req);
    const id       = String(body.id || '').trim().toUpperCase();
    const interest = String(body.interest || '').trim();
    if (!id || !interest) return json(res, 400, { error: 'Missing id or interest' });

    const key = `${id}::${interest}`;
    if (interestState[key]) return json(res, 200, { ok: true, status: interestState[key].status });

    interestState[key] = { status: 'running', logs: [], result: null };

    const py = spawn('python', [AGENT2_SCRIPT, '--interest', id, interest], {
      env: { ...process.env },
      cwd: path.join(__dirname, '..', 'Agent2'),
    });

    py.stdout.on('data', d => d.toString().split('\n').filter(Boolean).forEach(l => interestState[key].logs.push(l)));
    py.stderr.on('data', d => d.toString().split('\n').filter(Boolean).forEach(l => interestState[key].logs.push('ERR: ' + l)));
    py.on('close', code => {
      try {
        const outFile = path.join(__dirname, '..', 'Agent2', `interest_${id}.json`);
        interestState[key].result = JSON.parse(fs.readFileSync(outFile, 'utf8'));
        interestState[key].status = 'done';
      } catch {
        interestState[key].status = code === 0 ? 'done' : 'error';
      }
    });

    return json(res, 200, { ok: true, status: 'running' });
  }

  // GET /interest-status?id=&interest=
  if (req.method === 'GET' && req.url.startsWith('/interest-status')) {
    const p        = new URL(req.url, 'http://x').searchParams;
    const id       = (p.get('id') || '').toUpperCase();
    const interest = p.get('interest') || '';
    const s        = interestState[`${id}::${interest}`];
    if (!s) return json(res, 200, { status: 'idle' });
    return json(res, 200, { status: s.status, logs: s.logs.slice(-20) });
  }

  // GET /interest-result?id=&interest=
  if (req.method === 'GET' && req.url.startsWith('/interest-result')) {
    const p        = new URL(req.url, 'http://x').searchParams;
    const id       = (p.get('id') || '').toUpperCase();
    const interest = p.get('interest') || '';
    const s        = interestState[`${id}::${interest}`];
    if (!s || !s.result) return json(res, 200, {});
    return json(res, 200, s.result);
  }

  // GET /download-report?id= — stream the PDF file
  if (req.method === 'GET' && req.url.startsWith('/download-report')) {
    const id      = new URL(req.url, 'http://x').searchParams.get('id') || '';
    const pdfPath = path.join(__dirname, '..', 'Agent3', `report_${id.toUpperCase()}.pdf`);
    fs.readFile(pdfPath, (err, data) => {
      if (err) { res.writeHead(404); res.end('PDF not found'); return; }
      res.writeHead(200, {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="Biasiswa_${id.toUpperCase()}.pdf"`,
        'Content-Length':      data.length,
      });
      res.end(data);
    });
    return;
  }

  // POST /login — validate credentials, return profile
  if (req.method === 'POST' && req.url === '/login') {
    const body = await parseBody(req);
    const id   = String(body.id || '').trim().toUpperCase();
    const pw   = String(body.password || '').trim();

    if (!CREDENTIALS[id]) {
      writeLog('LOGIN_FAIL', { studentId: id, detail: 'ID tidak dijumpai', ip: clientIp(req), status: 'fail' });
      return json(res, 401, { error: 'ID tidak dijumpai dalam sistem.' });
    }
    if (CREDENTIALS[id] !== pw) {
      writeLog('LOGIN_FAIL', { studentId: id, detail: 'Password salah', ip: clientIp(req), status: 'fail' });
      return json(res, 401, { error: 'Password salah. Cuba semula.' });
    }

    const profile = PROFILES[id];
    if (!profile) return json(res, 500, { error: 'Profil pelajar tidak ditemui. Sila hubungi pentadbir.' });

    writeLog('LOGIN_SUCCESS', { studentId: id, detail: profile.name, ip: clientIp(req) });
    // Return profile — NO password field
    return json(res, 200, { success: true, profile });
  }

  // GET /scholarship-news — DB biasiswa (dengan IPT & kursus) + scraped cache
  if (req.method === 'GET' && req.url === '/scholarship-news') {
    try {
      // Biasiswa dari DB
      const dbResult = await db.query(`
        SELECT b.id_biasiswa, b.nama_biasiswa, b.penganjur, b.peringkat_pengajian,
               b.bidang_pengajian, b.kategori_pendapatan_layak, b.url_permohonan, b.min_a
        FROM biasiswa b
        ORDER BY b.id_biasiswa
      `);

      // IPT per biasiswa
      const iptResult = await db.query(`
        SELECT bi.id_biasiswa, i.nama, i.kategori
        FROM biasiswa_ipt bi
        JOIN ipt i ON bi.id_ipt = i.id
        ORDER BY bi.id_biasiswa, i.kategori, i.nama
      `);
      const iptMap = {};
      iptResult.rows.forEach(r => {
        if (!iptMap[r.id_biasiswa]) iptMap[r.id_biasiswa] = [];
        iptMap[r.id_biasiswa].push({ nama: r.nama, kategori: r.kategori });
      });

      // Kursus per biasiswa
      const kursusResult = await db.query(`
        SELECT bk.id_biasiswa, k.nama, k.bidang
        FROM biasiswa_kursus bk
        JOIN kursus k ON bk.id_kursus = k.id
        ORDER BY bk.id_biasiswa, k.bidang, k.nama
      `);
      const kursusMap = {};
      kursusResult.rows.forEach(r => {
        if (!kursusMap[r.id_biasiswa]) kursusMap[r.id_biasiswa] = [];
        kursusMap[r.id_biasiswa].push({ nama: r.nama, bidang: r.bidang });
      });

      const dbScholarships = dbResult.rows.map(r => {
        const ipts    = iptMap[r.id_biasiswa] || [];
        const kursus  = kursusMap[r.id_biasiswa] || [];
        const bidang1 = (r.bidang_pengajian || '').split(';')[0].trim();
        const iptRingkas = ipts.length
          ? [...new Set(ipts.map(i => i.kategori))].join(', ')
          : '';
        return {
          name:      r.nama_biasiswa,
          desc:      `${r.penganjur} — ${r.peringkat_pengajian}. Min ${r.min_a}A. ${bidang1}.`,
          tutup:     'Semak portal',
          tutup_iso: '',
          url:       r.url_permohonan || '',
          sumber:    'db',
          ipt_list:  ipts,
          ipt_ringkas: iptRingkas,
          kursus_list: kursus,
          kursus_ringkas: kursus.length ? [...new Set(kursus.map(k => k.bidang))].join(', ') : '',
          jumlah_ipt: ipts.length,
          jumlah_kursus: kursus.length,
        };
      });

      const scraped = (scholarshipCache && scholarshipCache.data.length > 0)
        ? scholarshipCache.data.map(s => ({ ...s, sumber: 'web' }))
        : [];

      return json(res, 200, { ok: true, scholarships: [...dbScholarships, ...scraped] });
    } catch (e) {
      if (scholarshipCache && scholarshipCache.data.length > 0) {
        return json(res, 200, { ok: true, scholarships: scholarshipCache.data });
      }
      return json(res, 200, { ok: false, error: e.message });
    }
  }

  // GET /ipt-categories — return all categories + IPT list grouped
  if (req.method === 'GET' && req.url === '/ipt-categories') {
    try {
      const result = await db.query('SELECT id, kategori, nama, nama_penuh FROM ipt ORDER BY kategori, nama');
      const grouped = {};
      result.rows.forEach(r => {
        if (!grouped[r.kategori]) grouped[r.kategori] = [];
        grouped[r.kategori].push({ id: r.id, nama: r.nama, nama_penuh: r.nama_penuh });
      });
      return json(res, 200, { categories: grouped });
    } catch(e) { return json(res, 500, { error: e.message }); }
  }

  // POST /murid-status — student updates their post-SPM status
  if (req.method === 'POST' && req.url === '/murid-status') {
    const body = await parseBody(req);
    const id   = String(body.id || '').trim().toUpperCase();
    if (!id || !CREDENTIALS[id]) return json(res, 401, { error: 'Unauthorized' });
    const { status, ipt_id, bidang, dapat_biasiswa, nama_biasiswa } = body;
    try {
      await db.query(`
        INSERT INTO murid_status (id, status, ipt_id, bidang, dapat_biasiswa, nama_biasiswa, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,NOW())
        ON CONFLICT (id) DO UPDATE SET
          status=$2, ipt_id=$3, bidang=$4, dapat_biasiswa=$5, nama_biasiswa=$6, updated_at=NOW()
      `, [id, status, ipt_id || null, bidang || null, dapat_biasiswa || false, nama_biasiswa || null]);
      writeLog('STATUS_UPDATE', { studentId: id, detail: `${status}${ipt_id ? ' | IPT:'+ipt_id : ''}`, ip: clientIp(req) });
      return json(res, 200, { ok: true });
    } catch(e) { return json(res, 500, { error: e.message }); }
  }

  // GET /murid-status?id= — get student's current status
  if (req.method === 'GET' && req.url.startsWith('/murid-status')) {
    const id = (new URL(req.url, 'http://x').searchParams.get('id') || '').toUpperCase();
    if (!id) return json(res, 400, { error: 'No ID' });
    try {
      const result = await db.query(`
        SELECT ms.status, ms.ipt_id, ms.bidang, ms.dapat_biasiswa, ms.nama_biasiswa, ms.updated_at,
               i.nama AS ipt_nama, i.nama_penuh, i.kategori AS ipt_kategori
        FROM murid_status ms
        LEFT JOIN ipt i ON ms.ipt_id = i.id
        WHERE ms.id = $1`, [id]);
      return json(res, 200, result.rows[0] || null);
    } catch(e) { return json(res, 500, { error: e.message }); }
  }

  // GET /spm-saved?id= — return saved SPM override for a student (if exists)
  if (req.method === 'GET' && req.url.startsWith('/spm-saved')) {
    const id = new URL(req.url, 'http://x').searchParams.get('id') || '';
    if (!id) return json(res, 400, { error: 'Missing id' });
    const overrideFile = path.join(__dirname, '..', 'Agent2', `spm_override_${id.toUpperCase()}.json`);
    if (!fs.existsSync(overrideFile)) return json(res, 200, { saved: false });
    try {
      const data = JSON.parse(fs.readFileSync(overrideFile, 'utf8'));
      return json(res, 200, { saved: true, subjects: data.subjects || [], gpScore: data.gpScore });
    } catch(e) { return json(res, 200, { saved: false }); }
  }

  // GET /ipt-list — return all unique IPT categories for dropdown
  if (req.method === 'GET' && req.url === '/ipt-list') {
    try {
      const result = await db.query('SELECT ipt_kategori FROM biasiswa WHERE ipt_kategori IS NOT NULL');
      const cats = new Set();
      result.rows.forEach(r => r.ipt_kategori.split(',').forEach(c => cats.add(c.trim())));
      return json(res, 200, { categories: [...cats].sort() });
    } catch(e) { return json(res, 500, { error: e.message }); }
  }

  // GET /ipt-search?ipt=Universiti+Awam&studentId=SBP5IK001 — scholarships matching chosen IPT
  if (req.method === 'GET' && req.url.startsWith('/ipt-search')) {
    const params    = new URL(req.url, 'http://x').searchParams;
    const ipt       = params.get('ipt') || '';
    const studentId = (params.get('studentId') || '').toUpperCase();
    if (!ipt) return json(res, 400, { error: 'No IPT selected' });
    try {
      const result = await db.query(
        `SELECT id_biasiswa, nama_biasiswa, penganjur, peringkat_pengajian,
                ipt_kategori, ipt_senarai, url_permohonan, bidang_pengajian,
                tajaan_penuh
         FROM biasiswa
         WHERE ipt_kategori ILIKE $1 OR ipt_senarai ILIKE $1
         ORDER BY nama_biasiswa`,
        [`%${ipt}%`]
      );
      writeLog('IPT_SEARCH', { studentId: studentId || null, detail: `IPT: ${ipt}`, ip: clientIp(req) });
      return json(res, 200, { ipt, scholarships: result.rows });
    } catch(e) { return json(res, 500, { error: e.message }); }
  }

  // GET /admin/logs — admin-only activity log viewer
  if (req.method === 'GET' && req.url.startsWith('/admin/logs')) {
    const params  = new URL(req.url, 'http://x').searchParams;
    const key     = params.get('key') || '';
    const adminKey = process.env.ADMIN_KEY || '';
    if (!adminKey || key !== adminKey) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }
    const limit  = Math.min(parseInt(params.get('limit') || '200'), 500);
    const filter = params.get('action') || null;
    const rows   = await db.query(
      `SELECT ts, student_id, action, detail, ip, status
       FROM activity_log
       ${filter ? 'WHERE action = $2' : ''}
       ORDER BY ts DESC LIMIT $1`,
      filter ? [limit, filter] : [limit]
    );
    const ACTION_COLOR = {
      LOGIN_SUCCESS: '#16A34A', LOGIN_FAIL: '#DC2626',
      MATCH_START: '#1565C0',  MATCH_DONE: '#0D9488', MATCH_ERROR: '#DC2626',
      SPM_SUBMIT: '#7C3AED',   REPORT_REQUEST: '#D97706',
    };
    const rows_html = rows.rows.map(r => {
      const ts  = new Date(r.ts).toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' });
      const col = ACTION_COLOR[r.action] || '#374151';
      const statusBadge = r.status === 'fail'
        ? `<span style="background:#FEE2E2;color:#DC2626;padding:1px 8px;border-radius:20px;font-size:11px">GAGAL</span>`
        : `<span style="background:#DCFCE7;color:#16A34A;padding:1px 8px;border-radius:20px;font-size:11px">OK</span>`;
      return `<tr>
        <td style="color:#6B7280;white-space:nowrap">${ts}</td>
        <td style="font-weight:600">${r.student_id || '—'}</td>
        <td><span style="color:${col};font-weight:700;font-size:12px">${r.action}</span></td>
        <td style="color:#374151">${r.detail || '—'}</td>
        <td style="color:#6B7280">${r.ip || '—'}</td>
        <td>${statusBadge}</td>
      </tr>`;
    }).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>PRESTIJ — Activity Log</title>
    <style>body{font-family:Calibri,sans-serif;padding:32px;background:#F8FAFC;color:#1E293B}
    h1{color:#1A1464;margin-bottom:4px}p{color:#64748B;margin:0 0 20px}
    table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)}
    th{background:#1A1464;color:#fff;padding:10px 14px;text-align:left;font-size:13px}
    td{padding:9px 14px;border-bottom:1px solid #F1F5F9;font-size:13px;vertical-align:middle}
    tr:last-child td{border-bottom:none}tr:hover td{background:#F8FAFC}</style></head>
    <body><h1>PRESTIJ — Activity Log</h1>
    <p>Menunjukkan ${rows.rows.length} rekod terbaru &nbsp;|&nbsp; <a href="?key=${key}&action=LOGIN_FAIL">Login Gagal</a> &nbsp;|&nbsp; <a href="?key=${key}&action=MATCH_ERROR">Match Error</a> &nbsp;|&nbsp; <a href="?key=${key}">Semua</a></p>
    <table><thead><tr><th>Masa</th><th>ID Pelajar</th><th>Tindakan</th><th>Detail</th><th>IP</th><th>Status</th></tr></thead>
    <tbody>${rows_html}</tbody></table></body></html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // POST /ocr-spm — OCR a SPM result slip image using Google Gemini Vision
  if (req.method === 'POST' && req.url === '/ocr-spm') {
    const body = await parseBody(req);
    const { image, mimeType = 'image/jpeg', studentId } = body;
    if (!image) return json(res, 400, { error: 'Tiada imej disertakan' });
    if (!process.env.GEMINI_API_KEY) return json(res, 400, { error: 'Gemini API key tidak tersedia. Hubungi pentadbir.' });

    const ocrPrompt = `You are an OCR specialist for Malaysian SPM (Sijil Pelajaran Malaysia) result slips.

Extract from this image:
1. Student full name (UPPERCASE)
2. IC/MyKad number if visible (format XXXXXX-XX-XXXX)
3. All subjects with grades

Return ONLY valid JSON — no markdown, no explanation:
{"name":"AHMAD FARIS BIN RAZALI","ic":"050312-14-5678","subjects":[{"subject":"Bahasa Melayu","grade":"A+"},{"subject":"Bahasa Inggeris","grade":"A"}]}

Rules:
- Grades must be exactly: A+, A, A-, B+, B, C+, C, D, E, or G
- Full subject names (not BM/MM abbreviations)
- Include ALL subjects visible
- Use "" for fields not visible`;

    try {
      const payload = JSON.stringify({
        contents: [{ parts: [
          { inline_data: { mime_type: mimeType, data: image } },
          { text: ocrPrompt },
        ]}],
        generationConfig: { temperature: 0.05, maxOutputTokens: 1024 },
      });

      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload }
      );

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        throw new Error(errBody.error?.message || `Gemini API ralat ${resp.status}`);
      }

      const data    = await resp.json();
      const content = (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Format respons tidak sah. Cuba gambar yang lebih jelas.');
      const extracted = JSON.parse(jsonMatch[0]);

      if (!Array.isArray(extracted.subjects) || extracted.subjects.length === 0)
        throw new Error('Tiada subjek ditemui. Pastikan gambar jelas dan cuba lagi.');

      const validGrades = new Set(['A+','A','A-','B+','B','C+','C','D','E','G']);
      extracted.subjects = extracted.subjects
        .filter(s => s && s.subject)
        .map(s => ({
          subject: String(s.subject).trim(),
          grade:   validGrades.has(String(s.grade || '').trim()) ? String(s.grade).trim() : 'C',
        }));

      writeLog('OCR_SCAN', { studentId: studentId || null, detail: `${extracted.subjects.length} subjek`, ip: clientIp(req) });
      return json(res, 200, { ok: true, extracted });

    } catch(e) {
      console.error('[OCR Error]', e.message);
      writeLog('OCR_ERROR', { studentId: studentId || null, detail: e.message, ip: clientIp(req), status: 'fail' });
      return json(res, 500, { error: e.message });
    }
  }

  // GET static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath.split('?')[0]);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ DELIMa UI  →  http://localhost:${PORT}`);
  console.log('   Ctrl+C to stop.\n');
});
