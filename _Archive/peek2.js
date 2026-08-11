const XLSX = require('./node_modules/xlsx');
const path = require('path');
const BASE = path.join(__dirname, '..', 'Data');

function peekRaw(label, file, numRows=5) {
  const wb  = XLSX.readFile(file);
  const ws  = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(ws, { header:1, defval:'' });
  console.log(`\n══ ${label} ══`);
  raw.slice(0, numRows).forEach((row, i) => console.log(`Row ${i}:`, JSON.stringify(row).substring(0,200)));
}

peekRaw('PAJSK v3',  path.join(BASE,'PAJSK','DATA_PAJSK_5IK_DUMMY_v3.xlsx'), 6);
peekRaw('IMK v3',    path.join(BASE,'Psikometrik','IMK_IbnuKhaldun_DUMMY_v3.xlsx'), 4);
peekRaw('Income v1', path.join(BASE,'Pendapatan','Income_Penjaga_5IK_DUMMY_v1.xlsx'), 4);
