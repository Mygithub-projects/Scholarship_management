// ══════════════════════════════════════════════════════════════════
//  AGENT 1 — Student Profiling Agent
//  Input  : 4 Excel files from ../Data/  (read-only)
//  Output : console + Agent1\output.json
// ══════════════════════════════════════════════════════════════════

const XLSX = require('./node_modules/xlsx');
const fs   = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'Data');
const FILES = {
  spm    : path.join(BASE, 'SPM',         'Peperiksaan_SPM_IbnuKhaldun_DUMMY_v4.xlsx'),
  pajsk  : path.join(BASE, 'PAJSK',       'DATA_PAJSK_5IK_DUMMY_v3.xlsx'),
  imk    : path.join(BASE, 'Psikometrik', 'IMK_IbnuKhaldun_DUMMY_v3.xlsx'),
  income : path.join(BASE, 'Pendapatan',  'Income_Penjaga_5IK_DUMMY_v1.xlsx'),
};

// ── Grade Point table ─────────────────────────────────────────────
const GP_MAP = {'A+':10,'A':9,'A-':8,'B+':7,'B':6,'C+':5,'C':4,'D':3,'E':2,'G':1};

// ── RIASEC → Field / Career ───────────────────────────────────────
const RIASEC_MAP = {
  Realistic    : { field:'Kejuruteraan & Teknologi',           career:'Jurutera / Juruteknik' },
  Investigative: { field:'Sains & Perubatan',                  career:'Saintis / Doktor' },
  Artistic     : { field:'Seni & Komunikasi',                  career:'Pereka Grafik / Arkitek' },
  Social       : { field:'Pendidikan & Perkhidmatan Sosial',   career:'Pendidik / Pegawai Sosial' },
  Enterprising : { field:'Perniagaan & Pengurusan',            career:'Usahawan / Pengurus Perniagaan' },
  Conventional : { field:'Perakaunan & Kewangan',              career:'Akauntan / Penganalisis Kewangan' },
};
const CODE_NAME = { R:'Realistic', I:'Investigative', A:'Artistic', S:'Social', E:'Enterprising', K:'Conventional' };

// ══════════════════════════════════════════════════════════════════
//  LOAD EXCEL — row 0 is the real header, skip title rows
// ══════════════════════════════════════════════════════════════════
function loadSheet(file, headerRow = 0) {
  const wb   = XLSX.readFile(file);
  const ws   = wb.Sheets[wb.SheetNames[0]];
  const raw  = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  const hdrs = raw[headerRow];
  const rows = [];
  for (let i = headerRow + 1; i < raw.length; i++) {
    const obj = {};
    hdrs.forEach((h, j) => { obj[String(h).trim()] = raw[i][j] ?? ''; });
    rows.push(obj);
  }
  return rows;
}

console.log('\n🤖 AGENT 1 — Student Profiling Agent');
console.log('━'.repeat(58));
console.log('📂 Loading Excel source files...\n');

// SPM   : row 0=title, row 1=header (Bil/Nama/ID/Jantina/BM/...)
// PAJSK : row 0=title, row 1=session, row 2=section, row 3=field names
// IMK   : row 0=title, row 1=header (Bil/Nama/ID/...)
// Income: row 0=title, row 1=header (BIL/ID/NAMA/PENDAPATAN...)
const spmRows    = loadSheet(FILES.spm,    1);
const pajskRows  = loadSheet(FILES.pajsk,  3);
const imkRows    = loadSheet(FILES.imk,    1);
const incomeRows = loadSheet(FILES.income, 1);

// Filter only student rows (ID starts with SBP)
const spmData    = spmRows.filter(r    => String(r['ID']   || '').startsWith('SBP'));
const pajskData  = pajskRows.filter(r  => String(r['ID']   || '').startsWith('SBP'));
const imkData    = imkRows.filter(r    => String(r['ID']   || '').startsWith('SBP'));
const incomeData = incomeRows.filter(r => String(r['ID']   || '').startsWith('SBP'));

console.log(`   ✅ SPM      : ${spmData.length} student records`);
console.log(`   ✅ PAJSK    : ${pajskData.length} student records`);
console.log(`   ✅ IMK      : ${imkData.length} student records`);
console.log(`   ✅ Income   : ${incomeData.length} student records`);
console.log('');

// ── Index all datasets by student ID ──────────────────────────────
function indexBy(rows, idFn) {
  const map = {};
  rows.forEach(r => { const id = idFn(r); if (id) map[id] = r; });
  return map;
}

const spmMap    = indexBy(spmData,    r => String(r['ID']).trim());
const imkMap    = indexBy(imkData,    r => String(r['ID']).trim());
const incomeMap = indexBy(incomeData, r => String(r['ID']).trim());

// PAJSK: ID column is named 'ID' after loadSheet with row 3 as header
const pajskMap = indexBy(pajskData, r => String(r['ID'] || '').trim());

const allIds = Object.keys(spmMap).sort();

// ══════════════════════════════════════════════════════════════════
//  processStudent(id)
// ══════════════════════════════════════════════════════════════════
function processStudent(id) {
  const sRow = spmMap[id];
  if (!sRow) return { error: `"${id}" not found` };

  // ── STEP 2: SPM Grades → GP Score ──────────────────────────────
  // Columns: BM, BI, MM, SEJ, PAI, MT, BCKOM, FIZIK, KIMIA, BIO
  const subjectMap = {
    'Bahasa Melayu'       : sRow['BM']    || '–',
    'Bahasa Inggeris'     : sRow['BI']    || '–',
    'Matematik'           : sRow['MM']    || '–',
    'Sejarah'             : sRow['SEJ']   || '–',
    'Pend. Agama Islam'   : sRow['PAI']   || '–',
    'Matematik Tambahan'  : sRow['MT']    || '–',
    'Fizik'               : sRow['FIZIK'] || '–',
    'Kimia'               : sRow['KIMIA'] || '–',
    'Biologi'             : sRow['BIO']   || '–',
  };

  let totalGP = 0, gpCount = 0;
  Object.values(subjectMap).forEach(grade => {
    if (GP_MAP[grade] !== undefined) { totalGP += GP_MAP[grade]; gpCount++; }
  });
  const gpScore = gpCount > 0 ? parseFloat((totalGP / gpCount).toFixed(2)) : 0;

  // ── STEP 3: PAJSK → Score + Leadership ─────────────────────────
  // PAJSK columns (from row 3 header):
  // JENIS=sukan type, JAWATAN=sukan jawatan, PERINGKAT=sukan peringkat
  // NAMA KELAB, JAWATAN KELAB, PERINGKAT KELAB
  // NAMA BADAN, JAWATAN BB, PERINGKAT BB
  // JUMLAH MARKAH = total markah
  const pRow = pajskMap[id] || {};
  const markah = parseFloat(pRow['MARKAH'] || pRow['JUMLAH MARKAH'] || 0) || 0;
  const pajskScore      = parseFloat(((markah / 110) * 100).toFixed(1));
  const leadershipLevel = pajskScore >= 85 ? 'High' : pajskScore >= 70 ? 'Medium' : 'Basic';

  const sukan           = String(pRow['JENIS']        || '–').trim();
  const jawatanSukan    = String(pRow['JAWATAN']       || '–').trim();
  const peringkatSukan  = String(pRow['PERINGKAT']     || '–').trim();
  const kelab           = String(pRow['NAMA KELAB']    || '–').trim();
  const jawatanKelab    = String(pRow['JAWATAN KELAB'] || '–').trim();
  const peringkatKelab  = String(pRow['PERINGKAT KELAB'] || '–').trim();
  const badanBeruniform   = String(pRow['NAMA BADAN']         || '–').trim();
  const jawatanBB         = String(pRow['JAWATAN BB']         || '–').trim();
  const peringkatBB       = String(pRow['PERINGKAT BB']       || '–').trim();
  const perkhidmatan      = String(pRow['PERKHIDMATAN']       || '').trim() || null;
  const anugerahKhas      = String(pRow['ANUGERAH KHAS']      || '').trim() || null;
  const khidmatMasyarakat = String(pRow['KHIDMAT MASYARAKAT'] || '').trim() || null;

  // Best jawatan/peringkat for display summary
  const jawatan   = [jawatanSukan, jawatanKelab, jawatanBB].find(v => v !== '–') || '–';
  const peringkat = [peringkatSukan, peringkatKelab, peringkatBB].find(v => v !== '–') || '–';

  const keyAchievements = [];
  if (sukan !== '–' && peringkat !== '–' && peringkat.toUpperCase() !== 'SEKOLAH')
    keyAchievements.push(`${jawatan} – ${sukan} [${peringkat}]`);
  if (jawatan !== '–' && badanBeruniform !== '–')
    keyAchievements.push(`${jawatan}, ${badanBeruniform}`);
  if (kelab !== '–')
    keyAchievements.push(`Ahli ${kelab}`);

  // ── STEP 4: IMK RIASEC → Holland Code ──────────────────────────
  const iRow = imkMap[id] || {};
  const riasecRaw = {
    R: parseFloat(iRow['R (Realistik)'])    || 0,
    I: parseFloat(iRow['I (Investigatif)']) || 0,
    A: parseFloat(iRow['A (Artistik)'])     || 0,
    S: parseFloat(iRow['S (Sosial)'])       || 0,
    E: parseFloat(iRow['E (Enterprising)']) || 0,
    K: parseFloat(iRow['K (Konvensional)']) || 0,
  };
  const sorted     = Object.entries(riasecRaw).sort((a,b) => b[1]-a[1]);
  const riasecType = sorted.slice(0,3).map(([code]) => CODE_NAME[code]);
  const hollandCode = riasecType.map(r => r[0]).join('');
  const topRiasec   = riasecType[0] || 'Realistic';
  const fieldOfInterest = RIASEC_MAP[topRiasec].field;
  const dreamCareer     = RIASEC_MAP[topRiasec].career;

  // ── STEP 5: Income → B40/M40/T20 ───────────────────────────────
  const nRow      = incomeMap[id] || {};
  const perCapita = parseFloat(nRow['PENDAPATAN PERKAPITA (RM)'] || nRow['PENDAPATAN PERKAPITA'] || 0) || 0;
  const parentCategory = perCapita < 1500 ? 'B40' : perCapita < 5000 ? 'M40' : 'T20';

  // ── STEP 6: Assemble StudentProfile ─────────────────────────────
  return {
    id,
    name    : String(sRow['Nama'] || '').trim(),
    gender  : String(sRow['Jantina'] || '').trim(),
    spmGrades: subjectMap,
    gpScore,
    pajskScore,
    leadershipLevel,
    riasecScores : riasecRaw,
    riasecType,
    hollandCode,
    fieldOfInterest,
    dreamCareer,
    parentCategory,
    perCapitaIncome: perCapita,
    keyAchievements,
    pajskData: { markah, sukan, jawatanSukan, peringkatSukan, kelab, jawatanKelab, peringkatKelab, badanBeruniform, jawatanBB, peringkatBB, jawatan, peringkat, perkhidmatan, anugerahKhas, khidmatMasyarakat },
  };
}

// ══════════════════════════════════════════════════════════════════
//  PROCESS ALL STUDENTS
// ══════════════════════════════════════════════════════════════════
console.log('⚙️  Running Agent 1 pipeline for all students...\n');

const profiles = [];
const errors   = [];
allIds.forEach(id => {
  const p = processStudent(id);
  if (p.error) errors.push(p); else profiles.push(p);
});

// ══════════════════════════════════════════════════════════════════
//  PRINT SAMPLE — first 3 students
// ══════════════════════════════════════════════════════════════════
function printProfile(p) {
  console.log(`\n╔${'═'.repeat(56)}╗`);
  console.log(`║  ${p.id}  —  ${p.name.substring(0,38).padEnd(38)}  ║`);
  console.log(`╚${'═'.repeat(56)}╝`);
  console.log(`  Gender       : ${p.gender === 'L' ? 'Male (Lelaki)' : 'Female (Perempuan)'}`);

  console.log(`\n  ── SPM GRADES ─────────────────────────────────────`);
  Object.entries(p.spmGrades).forEach(([subj, grade]) => {
    const gp  = GP_MAP[grade] || 0;
    const bar = '█'.repeat(gp);
    console.log(`    ${subj.padEnd(22)} ${String(grade).padEnd(3)}  GP ${gp}  ${bar}`);
  });
  console.log(`    ${'─'.repeat(50)}`);
  console.log(`    GP Score : ${p.gpScore} / 10.0`);

  console.log(`\n  ── PAJSK ──────────────────────────────────────────`);
  console.log(`    Markah           : ${p.pajskData.markah} / 110`);
  console.log(`    PAJSK Score      : ${p.pajskScore}%`);
  console.log(`    Leadership Level : ${p.leadershipLevel.toUpperCase()}`);
  console.log(`    Sukan            : ${p.pajskData.sukan}`);
  console.log(`    Kelab            : ${p.pajskData.kelab}`);
  console.log(`    Badan Beruniform : ${p.pajskData.badanBeruniform}`);
  console.log(`    Jawatan          : ${p.pajskData.jawatan}  [${p.pajskData.peringkat}]`);

  console.log(`\n  ── RIASEC (IMK) ───────────────────────────────────`);
  Object.entries(p.riasecScores).sort((a,b)=>b[1]-a[1]).forEach(([code, val]) => {
    const name = CODE_NAME[code];
    const bar  = '▓'.repeat(Math.round(val / 3));
    const tag  = p.riasecType[0] === name ? ' ← TOP' : p.riasecType.includes(name) ? ' ✓' : '';
    console.log(`    ${code} ${name.padEnd(14)} ${String(val).padStart(3)}  ${bar}${tag}`);
  });
  console.log(`    Holland Code     : ${p.hollandCode}`);
  console.log(`    Field            : ${p.fieldOfInterest}`);
  console.log(`    Career           : ${p.dreamCareer}`);

  console.log(`\n  ── FAMILY INCOME ──────────────────────────────────`);
  console.log(`    Per Capita       : RM ${p.perCapitaIncome.toFixed(2)} / month`);
  console.log(`    Category         : ${p.parentCategory}`);

  console.log(`\n  ── KEY ACHIEVEMENTS ───────────────────────────────`);
  if (p.keyAchievements.length === 0) console.log('    (none recorded)');
  p.keyAchievements.forEach(a => console.log(`    • ${a}`));
  console.log(`\n  ✅ Profile complete → ready for Agent 2 (Matching)\n`);
}

console.log('── SAMPLE OUTPUT — first 3 students ────────────────────');
profiles.slice(0, 3).forEach(printProfile);

// ══════════════════════════════════════════════════════════════════
//  SUMMARY
// ══════════════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(58));
console.log('  AGENT 1 — SUMMARY STATISTICS');
console.log('═'.repeat(58));
console.log(`  Students processed : ${profiles.length} / ${allIds.length}`);
if (errors.length) {
  console.log(`  Errors             : ${errors.length}`);
  errors.forEach(e => console.log(`    ❌ ${e.error}`));
} else {
  console.log(`  Errors             : 0  ✅`);
}

const avg = p => profiles.reduce((s,x) => s + p(x), 0) / profiles.length;

console.log('\n  GP Score Distribution:');
[['Below 4.0', p => p.gpScore < 4],
 ['4.0 – 5.9', p => p.gpScore >= 4 && p.gpScore < 6],
 ['6.0 – 7.9', p => p.gpScore >= 6 && p.gpScore < 8],
 ['8.0 – 10.0',p => p.gpScore >= 8]
].forEach(([label, fn]) => {
  const n = profiles.filter(fn).length;
  console.log(`    ${label.padEnd(12)}: ${n} students`);
});
console.log(`    Class Avg    : ${avg(p=>p.gpScore).toFixed(2)}`);

console.log('\n  Leadership Level:');
['High','Medium','Basic'].forEach(lvl => {
  const n = profiles.filter(p=>p.leadershipLevel===lvl).length;
  console.log(`    ${lvl.padEnd(8)}: ${n} students`);
});

console.log('\n  Primary RIASEC Type (Top-1):');
const rc = {};
profiles.forEach(p => { rc[p.riasecType[0]] = (rc[p.riasecType[0]]||0)+1; });
Object.entries(rc).sort((a,b)=>b[1]-a[1]).forEach(([t,n]) =>
  console.log(`    ${t.padEnd(15)}: ${n} students`));

console.log('\n  Income Category:');
['B40','M40','T20'].forEach(cat => {
  const n = profiles.filter(p=>p.parentCategory===cat).length;
  const pct = Math.round(n/profiles.length*100);
  console.log(`    ${cat}: ${n} students (${pct}%)`);
});

// ══════════════════════════════════════════════════════════════════
//  SAVE OUTPUT → Agent1\output.json  (passwords excluded)
// ══════════════════════════════════════════════════════════════════
const output = {
  agent: 'Agent 1 — Student Profiling Agent',
  timestamp: new Date().toISOString(),
  totalStudents: profiles.length,
  profiles,
};
fs.writeFileSync(path.join(__dirname, 'output.json'), JSON.stringify(output, null, 2));

console.log(`\n  💾 output.json saved → Agent1\\output.json`);
console.log(`  📊 ${profiles.length} profiles ready for Agent 2`);
console.log('\n' + '═'.repeat(58));
console.log('  🏁 Agent 1 complete.');
console.log('═'.repeat(58) + '\n');
