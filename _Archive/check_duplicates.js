// ── Check for duplicates & relationship integrity ──────────────────
const path = require('path');

// Load student data inline (extracted from mockData.ts)
// We'll read the file and parse the key fields
const fs = require('fs');
const raw = fs.readFileSync(
  path.join(__dirname, 'v2/src/data/mockData.ts'), 'utf8'
);

// Extract student IDs using regex
const idMatches = [...raw.matchAll(/id:\s*'(SBP5IK\d+)'/g)].map(m => m[1]);
const nameMatches = [...raw.matchAll(/name:\s*'([A-Z][^']+)'/g)].map(m => m[1]);
const genderMatches = [...raw.matchAll(/gender:\s*'([LP])'/g)].map(m => m[1]);
const gpMatches = [...raw.matchAll(/gpScore:\s*([\d.]+)/g)].map(m => parseFloat(m[1]));
const pajskMatches = [...raw.matchAll(/pajskScore:\s*([\d.]+)/g)].map(m => parseFloat(m[1]));
const parentMatches = [...raw.matchAll(/parentCategory:\s*'([^']+)'/g)].map(m => m[1]);

console.log('═══════════════════════════════════════════════════════');
console.log('  DUPLICATE & RELATIONSHIP INTEGRITY CHECK — PRESTIJ');
console.log('═══════════════════════════════════════════════════════\n');

// ── 1. Total records ──────────────────────────────────────────────
console.log(`Total student records found : ${idMatches.length}`);
console.log(`Expected                    : 50`);
console.log(`Status : ${idMatches.length === 50 ? '✅ OK' : '❌ MISMATCH'}\n`);

// ── 2. Duplicate IDs ─────────────────────────────────────────────
const idCount = {};
idMatches.forEach(id => idCount[id] = (idCount[id] || 0) + 1);
const dupIds = Object.entries(idCount).filter(([,v]) => v > 1);
console.log('── CHECK 1: Duplicate Student IDs ──────────────────────');
if (dupIds.length === 0) {
  console.log('✅ No duplicate IDs found. All 50 IDs are unique.\n');
} else {
  console.log(`❌ DUPLICATES FOUND:`);
  dupIds.forEach(([id, count]) => console.log(`   ${id} appears ${count} times`));
  console.log();
}

// ── 3. Duplicate Names ───────────────────────────────────────────
const nameCount = {};
nameMatches.forEach(n => nameCount[n] = (nameCount[n] || 0) + 1);
const dupNames = Object.entries(nameCount).filter(([,v]) => v > 1);
console.log('── CHECK 2: Duplicate Student Names ───────────────────');
if (dupNames.length === 0) {
  console.log('✅ No duplicate names found. All 50 names are unique.\n');
} else {
  console.log(`⚠️  DUPLICATE NAMES:`);
  dupNames.forEach(([n, count]) => console.log(`   "${n}" appears ${count} times`));
  console.log();
}

// ── 4. ID format validation ──────────────────────────────────────
console.log('── CHECK 3: ID Format Validation (SBP5IK001–SBP5IK050) ─');
const expectedIds = Array.from({length:50}, (_,i) => `SBP5IK${String(i+1).padStart(3,'0')}`);
const missing = expectedIds.filter(id => !idMatches.includes(id));
const unexpected = idMatches.filter(id => !expectedIds.includes(id));
if (missing.length === 0 && unexpected.length === 0) {
  console.log('✅ All IDs follow SBP5IK001–SBP5IK050 format correctly.\n');
} else {
  if (missing.length) console.log('❌ Missing IDs:', missing.join(', '));
  if (unexpected.length) console.log('❌ Unexpected IDs:', unexpected.join(', '));
  console.log();
}

// ── 5. GP Score range validation ─────────────────────────────────
console.log('── CHECK 4: GP Score Range (0.0 – 10.0) ───────────────');
const invalidGP = gpMatches.filter(g => g < 0 || g > 10);
if (invalidGP.length === 0) {
  const avg = (gpMatches.reduce((a,b)=>a+b,0)/gpMatches.length).toFixed(2);
  const min = Math.min(...gpMatches).toFixed(2);
  const max = Math.max(...gpMatches).toFixed(2);
  console.log(`✅ All ${gpMatches.length} GP scores valid.  avg=${avg}  min=${min}  max=${max}\n`);
} else {
  console.log(`❌ Out-of-range GP scores: ${invalidGP.join(', ')}\n`);
}

// ── 6. PAJSK score range ──────────────────────────────────────────
console.log('── CHECK 5: PAJSK Score Range (0 – 100%) ──────────────');
const invalidPajsk = pajskMatches.filter(p => p < 0 || p > 100);
if (invalidPajsk.length === 0) {
  const avg = (pajskMatches.reduce((a,b)=>a+b,0)/pajskMatches.length).toFixed(1);
  const min = Math.min(...pajskMatches).toFixed(1);
  const max = Math.max(...pajskMatches).toFixed(1);
  console.log(`✅ All ${pajskMatches.length} PAJSK scores valid.  avg=${avg}%  min=${min}%  max=${max}%\n`);
} else {
  console.log(`❌ Out-of-range PAJSK scores: ${invalidPajsk.join(', ')}\n`);
}

// ── 7. Foreign key simulation: each dataset has record for every student ─
console.log('── CHECK 6: Referential Integrity (FK simulation) ──────');
const tables = {
  'SPM_GRADES (gpScore)': gpMatches.length,
  'PAJSK_DATA (pajskScore)': pajskMatches.length,
  'FAMILY_INCOME (parentCategory)': parentMatches.length,
};
let fkOk = true;
Object.entries(tables).forEach(([table, count]) => {
  const ok = count === idMatches.length;
  console.log(`  ${ok ? '✅' : '❌'} ${table}: ${count} records → ${ok ? 'matches' : 'MISMATCH with'} ${idMatches.length} students`);
  if (!ok) fkOk = false;
});
console.log(fkOk ? '\n✅ All related tables have records for all 50 students.\n' : '\n❌ Referential integrity issue detected.\n');

// ── 8. parentCategory domain check ───────────────────────────────
console.log('── CHECK 7: parentCategory Domain (B40/M40/T20 only) ──');
const validCats = ['B40','M40','T20'];
const invalidCats = parentMatches.filter(c => !validCats.includes(c));
const catCount = {B40:0,M40:0,T20:0};
parentMatches.forEach(c => { if(catCount[c]!==undefined) catCount[c]++; });
if (invalidCats.length === 0) {
  console.log(`✅ All values valid.  B40=${catCount.B40}  M40=${catCount.M40}  T20=${catCount.T20}\n`);
} else {
  console.log(`❌ Invalid values found: ${[...new Set(invalidCats)].join(', ')}\n`);
}

// ── 9. Gender domain check ────────────────────────────────────────
console.log('── CHECK 8: Gender Domain (L/P only) ──────────────────');
const invalidGender = genderMatches.filter(g => !['L','P'].includes(g));
const L = genderMatches.filter(g=>g==='L').length;
const P = genderMatches.filter(g=>g==='P').length;
if (invalidGender.length === 0) {
  console.log(`✅ All values valid.  L (Male)=${L}  P (Female)=${P}\n`);
} else {
  console.log(`❌ Invalid gender values: ${invalidGender.join(', ')}\n`);
}

// ── SUMMARY ───────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════');
console.log('  SUMMARY');
console.log('═══════════════════════════════════════════════════════');
console.log('  8 checks completed. Review results above.');
console.log('  Green ✅ = PASS   Red ❌ = FAIL   Yellow ⚠️ = WARNING');
console.log('═══════════════════════════════════════════════════════');
