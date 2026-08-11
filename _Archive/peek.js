const XLSX = require('./node_modules/xlsx');
const path = require('path');
const BASE = path.join(__dirname, '..', 'Data');

function peek(label, file) {
  const wb = XLSX.readFile(file);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  console.log(`\n── ${label} ──────────────────────────────`);
  console.log('Columns:', Object.keys(rows[0]));
  console.log('Row 0:', rows[0]);
  console.log('Row 1:', rows[1]);
}

peek('SPM v4',    path.join(BASE,'SPM','Peperiksaan_SPM_IbnuKhaldun_DUMMY_v4.xlsx'));
peek('PAJSK v3',  path.join(BASE,'PAJSK','DATA_PAJSK_5IK_DUMMY_v3.xlsx'));
peek('IMK v3',    path.join(BASE,'Psikometrik','IMK_IbnuKhaldun_DUMMY_v3.xlsx'));
peek('Income v1', path.join(BASE,'Pendapatan','Income_Penjaga_5IK_DUMMY_v1.xlsx'));
