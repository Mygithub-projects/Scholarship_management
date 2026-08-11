// ══════════════════════════════════════════════════════════════════
//  AGENT 1 — Student Profiling Agent (Test / Demo)
//  Simulates the full profiling pipeline for any student ID
// ══════════════════════════════════════════════════════════════════

// ── Raw dataset (sample of 5 students for demo) ────────────────────
const RAW_SPM = {
  SBP5IK001: { BM:'A-', BI:'B+', MT:'A',  SJ:'B+', PAI:'A+', MM:'A',  FZ:'A',  KM:'A+', BO:'A'  },
  SBP5IK002: { BM:'B+', BI:'A-', MT:'B+', SJ:'A-', PAI:'A',  MM:'B',  FZ:'B+', KM:'A',  BO:'B+' },
  SBP5IK003: { BM:'C+', BI:'C',  MT:'B',  SJ:'C+', PAI:'B+', MM:'C+', FZ:'B',  KM:'B+', BO:'B'  },
  SBP5IK004: { BM:'A+', BI:'A+', MT:'A+', SJ:'A+', PAI:'A+', MM:'A+', FZ:'A+', KM:'A+', BO:'A+' },
  SBP5IK005: { BM:'B',  BI:'B',  MT:'C+', SJ:'B',  PAI:'B+', MM:'C',  FZ:'C+', KM:'B',  BO:'C+' },
};

const RAW_PAJSK = {
  SBP5IK001: { markah: 92, sukan:'HOKI', kelab:'PERSATUAN SAINS', badanBeruniform:'KADET POLIS', jawatan:'KAPTEN', peringkat:'KEBANGSAAN' },
  SBP5IK002: { markah: 78, sukan:'BADMINTON', kelab:'PERSATUAN MATEMATIK', badanBeruniform:'PENGAKAP', jawatan:'AHLI', peringkat:'DAERAH' },
  SBP5IK003: { markah: 65, sukan:'BOLA SEPAK', kelab:'KELAB KOMPUTER', badanBeruniform:'KADET REMAJA SEKOLAH', jawatan:'AHLI', peringkat:'SEKOLAH' },
  SBP5IK004: { markah:105, sukan:'RENANG', kelab:'PERSATUAN BAHASA INGGERIS', badanBeruniform:'PUTERI ISLAM', jawatan:'PENGERUSI', peringkat:'NEGERI' },
  SBP5IK005: { markah: 72, sukan:'PING PONG', kelab:'KELAB BAHASA ARAB', badanBeruniform:'KADET POLIS', jawatan:'AHLI', peringkat:'DAERAH' },
};

const RAW_IMK = {
  SBP5IK001: { R:78, I:82, A:55, S:60, E:70, K:65 },
  SBP5IK002: { R:55, I:60, A:80, S:75, E:85, K:50 },
  SBP5IK003: { R:70, I:50, A:60, S:65, E:55, K:75 },
  SBP5IK004: { R:65, I:90, A:70, S:80, E:60, K:55 },
  SBP5IK005: { R:60, I:55, A:75, S:70, E:80, K:65 },
};

const RAW_INCOME = {
  SBP5IK001: 1200,   // per capita RM/month
  SBP5IK002: 2800,
  SBP5IK003:  900,
  SBP5IK004: 6500,
  SBP5IK005: 1800,
};

const RAW_NAMES = {
  SBP5IK001:'AHMAD FARIS BIN RAZALI',
  SBP5IK002:'NURUL IZZATI BINTI HASSAN',
  SBP5IK003:'MOHD HAFIZ BIN ZULKIFLI',
  SBP5IK004:'SITI AISYAH BINTI MAHMUD',
  SBP5IK005:'DANIEL HAIQAL BIN ROSLAN',
};

const RAW_GENDER = {
  SBP5IK001:'L', SBP5IK002:'P', SBP5IK003:'L', SBP5IK004:'P', SBP5IK005:'L',
};

// ── Grade → Grade Point mapping ────────────────────────────────────
const GP_MAP = {'A+':10,'A':9,'A-':8,'B+':7,'B':6,'C+':5,'C':4,'D':3,'E':2,'G':1};

// ── RIASEC code → field/career mapping ────────────────────────────
const RIASEC_FIELD = {
  Realistic:    { field:'Kejuruteraan & Teknologi',            career:'Jurutera / Juruteknik' },
  Investigative:{ field:'Sains & Perubatan',                  career:'Saintis / Doktor' },
  Artistic:     { field:'Seni & Komunikasi',                   career:'Pereka Grafik / Arkitek' },
  Social:       { field:'Pendidikan & Perkhidmatan Sosial',    career:'Pendidik / Pegawai Sosial' },
  Enterprising: { field:'Perniagaan & Pengurusan',             career:'Usahawan / Pengurus Perniagaan' },
  Conventional: { field:'Perakaunan & Kewangan',               career:'Akauntan / Penganalisis Kewangan' },
};
const RIASEC_LABELS = { R:'Realistic', I:'Investigative', A:'Artistic', S:'Social', E:'Enterprising', K:'Conventional' };

// ══════════════════════════════════════════════════════════════════
//  AGENT 1 — processStudent(id)
// ══════════════════════════════════════════════════════════════════
function processStudent(id) {

  // ── Step 1: Validate ID exists ──────────────────────────────────
  if (!RAW_SPM[id]) {
    return { error: `Student ID "${id}" not found in dataset.` };
  }

  // ── Step 2: Compute GP Score from SPM grades ────────────────────
  const grades = RAW_SPM[id];
  const subjectNames = { BM:'Bahasa Melayu', BI:'Bahasa Inggeris', MT:'Matematik Tambahan',
    SJ:'Sejarah', PAI:'Pend. Agama Islam', MM:'Matematik', FZ:'Fizik', KM:'Kimia', BO:'Biologi' };
  const spmGrades = {};
  let totalGP = 0, subjectCount = 0;
  for (const [code, grade] of Object.entries(grades)) {
    const gp = GP_MAP[grade] || 0;
    spmGrades[subjectNames[code] || code] = grade;
    totalGP += gp;
    subjectCount++;
  }
  const gpScore = parseFloat((totalGP / subjectCount).toFixed(2));

  // ── Step 3: Compute PAJSK score & leadership level ──────────────
  const pajsk = RAW_PAJSK[id];
  const pajskScore = parseFloat(((pajsk.markah / 110) * 100).toFixed(1));
  const leadershipLevel = pajskScore >= 85 ? 'High' : pajskScore >= 70 ? 'Medium' : 'Basic';

  // Key achievements
  const keyAchievements = [];
  if (pajsk.peringkat !== 'SEKOLAH') keyAchievements.push(`${pajsk.jawatan} – ${pajsk.sukan} [${pajsk.peringkat}]`);
  keyAchievements.push(`${pajsk.jawatan}, ${pajsk.badanBeruniform}`);
  keyAchievements.push(`Ahli ${pajsk.kelab}`);

  // ── Step 4: Derive RIASEC Holland Code ─────────────────────────
  const imk = RAW_IMK[id];
  const sorted = Object.entries(imk)
    .sort((a, b) => b[1] - a[1])
    .map(([code]) => RIASEC_LABELS[code]);
  const riasecType = sorted.slice(0, 3);
  const topRiasec = riasecType[0];
  const fieldOfInterest = RIASEC_FIELD[topRiasec].field;
  const dreamCareer = RIASEC_FIELD[topRiasec].career;

  // ── Step 5: Classify family income ─────────────────────────────
  const perCapita = RAW_INCOME[id];
  const parentCategory = perCapita < 1500 ? 'B40' : perCapita < 5000 ? 'M40' : 'T20';

  // ── Step 6: Assemble StudentProfile object ──────────────────────
  return {
    id,
    name: RAW_NAMES[id],
    gender: RAW_GENDER[id],
    spmGrades,
    gpScore,
    pajskScore,
    leadershipLevel,
    riasecType,
    hollandCode: riasecType.map(r => r[0]).join(''),
    fieldOfInterest,
    dreamCareer,
    parentCategory,
    perCapitaIncome: perCapita,
    keyAchievements,
    pajskData: {
      markah: pajsk.markah,
      sukan: pajsk.sukan,
      kelab: pajsk.kelab,
      badanBeruniform: pajsk.badanBeruniform,
      jawatan: pajsk.jawatan,
      peringkat: pajsk.peringkat,
    }
  };
}

// ══════════════════════════════════════════════════════════════════
//  PRINT PROFILE — pretty console output
// ══════════════════════════════════════════════════════════════════
function printProfile(profile) {
  if (profile.error) { console.log('❌', profile.error); return; }
  const bar = '─'.repeat(56);
  console.log(`\n╔${'═'.repeat(56)}╗`);
  console.log(`║  AGENT 1 OUTPUT — STUDENT PROFILE${' '.repeat(21)}║`);
  console.log(`╚${'═'.repeat(56)}╝`);
  console.log(`  ID       : ${profile.id}`);
  console.log(`  Name     : ${profile.name}`);
  console.log(`  Gender   : ${profile.gender === 'L' ? 'Male (Lelaki)' : 'Female (Perempuan)'}`);
  console.log(bar);
  console.log('  SPM GRADES');
  for (const [subj, grade] of Object.entries(profile.spmGrades)) {
    const gp = GP_MAP[grade];
    const bar2 = '█'.repeat(gp);
    console.log(`    ${subj.padEnd(24)} ${grade.padEnd(3)}  GP ${gp}  ${bar2}`);
  }
  console.log(`  ${'─'.repeat(54)}`);
  console.log(`  GP Score       : ${profile.gpScore} / 10.0`);
  console.log(bar);
  console.log('  PAJSK (CO-CURRICULAR)');
  console.log(`  Markah         : ${profile.pajskData.markah} / 110`);
  console.log(`  PAJSK Score    : ${profile.pajskScore}%`);
  console.log(`  Leadership     : ${profile.leadershipLevel.toUpperCase()}`);
  console.log(`  Sukan          : ${profile.pajskData.sukan}`);
  console.log(`  Kelab          : ${profile.pajskData.kelab}`);
  console.log(`  Badan Beruniform: ${profile.pajskData.badanBeruniform}`);
  console.log(`  Jawatan        : ${profile.pajskData.jawatan} [${profile.pajskData.peringkat}]`);
  console.log(bar);
  console.log('  PSYCHOMETRIC (RIASEC / IMK)');
  console.log(`  Holland Code   : ${profile.hollandCode}`);
  console.log(`  Top-3 RIASEC   : ${profile.riasecType.join(' → ')}`);
  console.log(`  Field          : ${profile.fieldOfInterest}`);
  console.log(`  Career         : ${profile.dreamCareer}`);
  console.log(bar);
  console.log('  FAMILY INCOME');
  console.log(`  Per Capita     : RM ${profile.perCapitaIncome.toLocaleString()} / month`);
  console.log(`  Category       : ${profile.parentCategory}`);
  console.log(bar);
  console.log('  KEY ACHIEVEMENTS');
  profile.keyAchievements.forEach(a => console.log(`  • ${a}`));
  console.log(`\n  ✅ Profile complete. Ready for Agent 2 (Matching).\n`);
}

// ══════════════════════════════════════════════════════════════════
//  RUN TEST — process all 5 demo students
// ══════════════════════════════════════════════════════════════════
console.log('\n🤖 AGENT 1 — Student Profiling Agent');
console.log('   Processing 5 students from Kelas Ibnu Khaldun...\n');

const TEST_IDS = ['SBP5IK001','SBP5IK002','SBP5IK003','SBP5IK004','SBP5IK005'];

TEST_IDS.forEach(id => {
  const profile = processStudent(id);
  printProfile(profile);
});

// ── test invalid ID ───────────────────────────────────────────────
console.log('── Test: invalid ID ─────────────────────────────────────');
printProfile(processStudent('SBP5IK999'));

console.log('🏁 Agent 1 test complete. All students profiled successfully.\n');
