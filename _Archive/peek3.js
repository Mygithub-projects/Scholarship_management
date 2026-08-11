const XLSX = require('./node_modules/xlsx');
const path = require('path');
const BASE = path.join(__dirname, '..', 'Data');

const wb  = XLSX.readFile(path.join(BASE,'PAJSK','DATA_PAJSK_5IK_DUMMY_v3.xlsx'));
const ws  = wb.Sheets[wb.SheetNames[0]];
const raw = XLSX.utils.sheet_to_json(ws, { header:1, defval:'' });

// Row 3 = header
console.log('Row 3 (header):', JSON.stringify(raw[3]));
console.log('\nRow 4 (first student):', JSON.stringify(raw[4]));
