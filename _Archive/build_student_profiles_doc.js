const docx = require('C:/Users/user/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat, Bookmark
} = docx;

const NAVY   = '0F2057';
const BLUE   = '1A56DB';
const TEAL   = '0E7490';
const GREEN  = '166534';
const PURPLE = '5B21B6';
const AMBER  = 'B45309';
const RED    = '9B1C1C';
const WHITE  = 'FFFFFF';
const LGRAY  = 'F1F5F9';
const MGRAY  = 'E2E8F0';
const DGRAY  = '334155';
const LBLUE  = 'EFF6FF';
const LGREEN = 'F0FDF4';
const LPURP  = 'F5F3FF';
const LAMBER = 'FFFBEB';

const PAGE_W  = 11906;
const PAGE_H  = 16838;
const MARGIN  = 900;
const CONTENT = PAGE_W - MARGIN * 2;

// ── helpers ────────────────────────────────────────────────────────
function spacer(pt = 4) {
  return new Paragraph({ spacing: { line: pt * 20 }, children: [new TextRun('')] });
}
function hLine(color = MGRAY) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color, space: 1 } },
    spacing: { before: 30, after: 30 }, children: [new TextRun('')]
  });
}
function cell(text, opts = {}) {
  const { w, bold=false, italic=false, size=18, color=DGRAY, bg=WHITE,
          align=AlignmentType.LEFT, vAlign=VerticalAlign.CENTER, colspan=1 } = opts;
  const b = { style: BorderStyle.SINGLE, size: 3, color: MGRAY };
  return new TableCell({
    columnSpan: colspan, width: w ? { size: w, type: WidthType.DXA } : undefined,
    shading: { fill: bg, type: ShadingType.CLEAR }, verticalAlign: vAlign,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    borders: { top: b, bottom: b, left: b, right: b },
    children: [new Paragraph({
      alignment: align, spacing: { before: 0, after: 0 },
      children: [new TextRun({ text, bold, italic, size, color, font: 'Arial' })]
    })]
  });
}
function hdrCell(text, bg=NAVY, opts={}) {
  return cell(text, { bold: true, size: 17, color: WHITE, bg, ...opts });
}

// ── SPM grade → points ─────────────────────────────────────────────
const GP_MAP = { 'A+':10,'A':9,'A-':8,'B+':7,'B':6,'C+':5,'C':4,'D':3,'E':2,'G':1,'-':0 };
function calcGP(grades) {
  const vals = Object.values(grades).filter(g => g !== '-').map(g => GP_MAP[g] || 0);
  if (!vals.length) return 0;
  return parseFloat((vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2));
}

// ── Grade colour ────────────────────────────────────────────────────
function gradeColor(g) {
  if (['A+','A','A-'].includes(g)) return GREEN;
  if (['B+','B'].includes(g)) return BLUE;
  if (['C+','C'].includes(g)) return AMBER;
  if (g === 'D') return '7C3AED';
  return RED;
}

// ── Category badge colours ──────────────────────────────────────────
function catBg(cat)  { return cat==='B40'?LGREEN : cat==='M40'?LAMBER : LBLUE; }
function catCol(cat) { return cat==='B40'?GREEN  : cat==='M40'?AMBER  : BLUE; }
function llBg(ll)    { return ll==='High'?LGREEN : ll==='Medium'?LAMBER : LGRAY; }
function llCol(ll)   { return ll==='High'?GREEN  : ll==='Medium'?AMBER  : DGRAY; }

// ── RIASEC colour map ───────────────────────────────────────────────
function riasecColor(r) {
  const m = {Realistic:BLUE, Investigative:GREEN, Artistic:PURPLE, Social:AMBER, Enterprising:RED, Conventional:TEAL};
  return m[r] || DGRAY;
}

// ════════════════════════════════════════════════════════════════════
// STUDENT DATA
// ════════════════════════════════════════════════════════════════════
const STUDENTS = [
  { id:'SBP5IK001',gender:'L',name:'AHMAD FARIS BIN MOHD AZRI',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'A+','Bahasa Inggeris':'A+','Matematik':'A+','Sejarah':'A+','Pendidikan Agama Islam':'A+','Matematik Tambahan':'A+','Fizik':'A+','Kimia':'A+','Biologi':'A+'},pajskScore:70,riasecType:['Artistic','Realistic','Conventional'],fieldOfInterest:'Seni & Komunikasi',dreamCareer:'Pereka Grafik / Arkitek',leadershipLevel:'Medium',keyAchievements:['JOHAN [NEGERI] – SILAT','ANUGERAH KHAS KOKURIKULUM DAN SUKAN - NEGERI (PENERIMA)','Ahli KELAB KOMPUTER ICT']},
  { id:'SBP5IK002',gender:'L',name:'MUHAMMAD HAFIZUDDIN BIN AHMAD FAUZI',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'A+','Bahasa Inggeris':'A+','Matematik':'A+','Sejarah':'A+','Pendidikan Agama Islam':'A+','Matematik Tambahan':'A+','Fizik':'A+','Kimia':'A+','Biologi':'A+'},pajskScore:70,riasecType:['Social','Realistic','Investigative'],fieldOfInterest:'Pendidikan & Perkhidmatan Sosial',dreamCareer:'Pendidik / Kaunselor',leadershipLevel:'Medium',keyAchievements:['KETIGA [SEKOLAH] – HOKI','ANUGERAH REMAJA PERDANA (EMAS)','Ahli PERSATUAN BAHASA ARAB']},
  { id:'SBP5IK003',gender:'L',name:'MUHAMMAD QUSYAIRI BIN ABDUL HALIM',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'B+','Bahasa Inggeris':'A+','Matematik':'A','Sejarah':'A','Pendidikan Agama Islam':'A+','Matematik Tambahan':'A-','Fizik':'A','Kimia':'A+','Biologi':'A+'},pajskScore:66.4,riasecType:['Enterprising','Realistic','Investigative'],fieldOfInterest:'Perniagaan & Pengurusan',dreamCareer:'Usahawan / Pengurus Perniagaan',leadershipLevel:'Basic',keyAchievements:['NAIB JOHAN [KEBANGSAAN] – TENIS MEJA','Ahli KELAB SENI VISUAL']},
  { id:'SBP5IK004',gender:'L',name:'AHMAD DANIAL BIN ZAINUDIN',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'A-','Bahasa Inggeris':'B','Matematik':'E','Sejarah':'C','Pendidikan Agama Islam':'A-','Matematik Tambahan':'B','Fizik':'A-','Kimia':'A','Biologi':'A+'},pajskScore:59.1,riasecType:['Social','Enterprising','Investigative'],fieldOfInterest:'Pendidikan & Perkhidmatan Sosial',dreamCareer:'Pendidik / Kaunselor',leadershipLevel:'Basic',keyAchievements:['NAIB JOHAN [ZON/DAERAH] – SEPAK TAKRAW','ANUGERAH KHAS KOKURIKULUM DAN SUKAN - NEGERI (PENERIMA)','Ahli KELAB FIZIK']},
  { id:'SBP5IK005',gender:'L',name:'MUHAMMAD QUSYAIRI BIN MOHD ZULKIFLI',parentCategory:'T20',spmGrades:{'Bahasa Melayu':'B+','Bahasa Inggeris':'B+','Matematik':'A-','Sejarah':'C','Pendidikan Agama Islam':'A-','Matematik Tambahan':'B+','Fizik':'A','Kimia':'A-','Biologi':'A-'},pajskScore:75.5,riasecType:['Realistic','Enterprising','Investigative'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Medium',keyAchievements:['JOHAN [SEKOLAH] – RAGBI','ANUGERAH REMAJA PERDANA (PERAK)','Ahli KELAB SEJARAH']},
  { id:'SBP5IK006',gender:'L',name:'AHMAD FARIS BIN MOHD ZULKIFLI',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'B+','Bahasa Inggeris':'A-','Matematik':'B+','Sejarah':'A+','Pendidikan Agama Islam':'A+','Matematik Tambahan':'A','Fizik':'B+','Kimia':'A','Biologi':'A'},pajskScore:70,riasecType:['Artistic','Social','Enterprising'],fieldOfInterest:'Seni & Komunikasi',dreamCareer:'Pereka Grafik / Arkitek',leadershipLevel:'Medium',keyAchievements:['LULUS – TAEKWONDO','Ahli KELAB KEUSAHAWANAN']},
  { id:'SBP5IK007',gender:'L',name:'MUHAMMAD QUSYAIRI BIN ABDUL RAZAK',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'A','Bahasa Inggeris':'B+','Matematik':'A-','Sejarah':'D','Pendidikan Agama Islam':'A','Matematik Tambahan':'C+','Fizik':'A-','Kimia':'D','Biologi':'A+'},pajskScore:92.7,riasecType:['Enterprising','Realistic','Artistic'],fieldOfInterest:'Perniagaan & Pengurusan',dreamCareer:'Usahawan / Pengurus Perniagaan',leadershipLevel:'High',keyAchievements:['NAIB JOHAN [SEKOLAH] – BOLA SEPAK','PROGRAM KEPIMPINAN GENERASI MADANI - TIER 2','Ahli KELAB GEOGRAFI']},
  { id:'SBP5IK008',gender:'L',name:'MUHAMMAD AZFAR BIN NORDIN',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'B','Bahasa Inggeris':'B+','Matematik':'D','Sejarah':'A-','Pendidikan Agama Islam':'E','Matematik Tambahan':'A+','Fizik':'B','Kimia':'C+','Biologi':'B+'},pajskScore:66.4,riasecType:['Conventional','Social','Artistic'],fieldOfInterest:'Perakaunan & Kewangan',dreamCareer:'Akauntan / Penganalisis Kewangan',leadershipLevel:'Basic',keyAchievements:['KETIGA [SEKOLAH] – BADMINTON','ANUGERAH REMAJA PERDANA (EMAS)','Ahli PERSATUAN BAHASA INGGERIS']},
  { id:'SBP5IK009',gender:'L',name:'MUHAMMAD QUSYAIRI BIN MOHD AZRI',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'A','Bahasa Inggeris':'C+','Matematik':'A-','Sejarah':'A','Pendidikan Agama Islam':'A+','Matematik Tambahan':'A-','Fizik':'A','Kimia':'A+','Biologi':'C'},pajskScore:78.2,riasecType:['Realistic','Investigative','Conventional'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Medium',keyAchievements:['JOHAN [NEGERI] – CATUR','ANUGERAH KHAS KOKURIKULUM DAN SUKAN - KEBANGSAAN (PENERIMA)','Ahli KELAB MUZIK']},
  { id:'SBP5IK010',gender:'L',name:'MOHAMAD AIMAN BIN NORDIN',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'A','Bahasa Inggeris':'A','Matematik':'A','Sejarah':'A+','Pendidikan Agama Islam':'D','Matematik Tambahan':'D','Fizik':'A+','Kimia':'B','Biologi':'B+'},pajskScore:64.5,riasecType:['Realistic','Investigative','Enterprising'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Basic',keyAchievements:['KETIGA [KEBANGSAAN] – MEMANAH','ANUGERAH REMAJA PERDANA (GANGSA)','Ahli KELAB PERTANIAN']},
  { id:'SBP5IK011',gender:'L',name:'MOHAMAD SYAFIQ BIN MOHD REDZUAN',parentCategory:'T20',spmGrades:{'Bahasa Melayu':'A+','Bahasa Inggeris':'B','Matematik':'E','Sejarah':'A','Pendidikan Agama Islam':'A','Matematik Tambahan':'C','Fizik':'A+','Kimia':'C+','Biologi':'A+'},pajskScore:68.2,riasecType:['Enterprising','Investigative','Conventional'],fieldOfInterest:'Perniagaan & Pengurusan',dreamCareer:'Usahawan / Pengurus Perniagaan',leadershipLevel:'Basic',keyAchievements:['NAIB JOHAN [ZON/DAERAH] – BOLA KERANJANG','AKTIVITI INSANIAH','Ahli KELAB REKA BENTUK DAN TEKNOLOGI']},
  { id:'SBP5IK012',gender:'L',name:'MOHAMAD SYAFIQ BIN MOHD SHAHRUL',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'A-','Bahasa Inggeris':'E','Matematik':'C+','Sejarah':'C+','Pendidikan Agama Islam':'A','Matematik Tambahan':'B','Fizik':'A+','Kimia':'A+','Biologi':'A-'},pajskScore:81.8,riasecType:['Conventional','Enterprising','Social'],fieldOfInterest:'Perakaunan & Kewangan',dreamCareer:'Akauntan / Penganalisis Kewangan',leadershipLevel:'Medium',keyAchievements:['LULUS – RENANG','ANUGERAH KHAS KOKURIKULUM DAN SUKAN - NEGERI (PENERIMA)','Ahli KELAB KOPERASI SEKOLAH']},
  { id:'SBP5IK013',gender:'L',name:'AHMAD DANIAL BIN MOHD ROSLI',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'B+','Bahasa Inggeris':'A+','Matematik':'A+','Sejarah':'A','Pendidikan Agama Islam':'B+','Matematik Tambahan':'A+','Fizik':'A+','Kimia':'A','Biologi':'A+'},pajskScore:84.5,riasecType:['Artistic','Social','Realistic'],fieldOfInterest:'Seni & Komunikasi',dreamCareer:'Pereka Grafik / Arkitek',leadershipLevel:'Medium',keyAchievements:['NAIB JOHAN [ANTARABANGSA] – OLAHRAGA','ANUGERAH KHAS KOKURIKULUM DAN SUKAN - KEBANGSAAN (PENERIMA)','Ahli KELAB SAINS']},
  { id:'SBP5IK014',gender:'L',name:'MUHAMMAD AZFAR BIN ABDUL WAHAB',parentCategory:'T20',spmGrades:{'Bahasa Melayu':'D','Bahasa Inggeris':'B+','Matematik':'A+','Sejarah':'B+','Pendidikan Agama Islam':'A+','Matematik Tambahan':'B','Fizik':'A-','Kimia':'A','Biologi':'B'},pajskScore:72.7,riasecType:['Realistic','Social','Enterprising'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Medium',keyAchievements:['NAIB JOHAN [ANTARABANGSA] – SKUASY','ANUGERAH KHAS KOKURIKULUM DAN SUKAN - KEBANGSAAN (PENERIMA)','Ahli KELAB BIOLOGI']},
  { id:'SBP5IK015',gender:'P',name:'SITI HAJAR BINTI MOHD HELMI',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'A+','Bahasa Inggeris':'C+','Matematik':'A+','Sejarah':'A','Pendidikan Agama Islam':'A+','Matematik Tambahan':'B+','Fizik':'B+','Kimia':'B+','Biologi':'A+'},pajskScore:80,riasecType:['Conventional','Enterprising','Realistic'],fieldOfInterest:'Perakaunan & Kewangan',dreamCareer:'Akauntan / Penganalisis Kewangan',leadershipLevel:'Medium',keyAchievements:['KETIGA [NEGERI] – BOLA TAMPAR','PROGRAM KEPIMPINAN GENERASI MADANI - TIER 1','Ahli PERSATUAN BAHASA MELAYU']},
  { id:'SBP5IK016',gender:'P',name:'NURUL LIYANA BINTI ZULKARNAIN',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'A+','Bahasa Inggeris':'B','Matematik':'A-','Sejarah':'B+','Pendidikan Agama Islam':'A-','Matematik Tambahan':'A','Fizik':'B','Kimia':'A','Biologi':'B+'},pajskScore:70.9,riasecType:['Enterprising','Social','Conventional'],fieldOfInterest:'Perniagaan & Pengurusan',dreamCareer:'Usahawan / Pengurus Perniagaan',leadershipLevel:'Medium',keyAchievements:['KETIGA [NEGERI] – BOLA JARING','PROGRAM KEPIMPINAN GENERASI MADANI - TIER 1','Ahli PERSATUAN EKONOMI']},
  { id:'SBP5IK017',gender:'P',name:'NUR FARHANA BINTI MOHD ARIFFIN',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'A','Bahasa Inggeris':'C+','Matematik':'B+','Sejarah':'C+','Pendidikan Agama Islam':'B+','Matematik Tambahan':'A','Fizik':'B','Kimia':'C','Biologi':'E'},pajskScore:83.6,riasecType:['Artistic','Enterprising','Social'],fieldOfInterest:'Seni & Komunikasi',dreamCareer:'Pereka Grafik / Arkitek',leadershipLevel:'Medium',keyAchievements:['KEEMPAT [ZON/DAERAH] – SILAT','PENGHARGAAN KHAS SETARA-KEBANGSAAN (PENERIMA)','Ahli KELAB PENDIDIKAN ISLAM']},
  { id:'SBP5IK018',gender:'P',name:'NUR IZZATI BINTI NORHAIZAM',parentCategory:'T20',spmGrades:{'Bahasa Melayu':'B+','Bahasa Inggeris':'B','Matematik':'A-','Sejarah':'B','Pendidikan Agama Islam':'B','Matematik Tambahan':'G','Fizik':'A+','Kimia':'A+','Biologi':'A'},pajskScore:81.8,riasecType:['Conventional','Investigative','Enterprising'],fieldOfInterest:'Perakaunan & Kewangan',dreamCareer:'Akauntan / Penganalisis Kewangan',leadershipLevel:'Medium',keyAchievements:['KEEMPAT [KEBANGSAAN] – BOLA JARING','ANUGERAH REMAJA PERDANA (EMAS)','Ahli KELAB DEBAT']},
  { id:'SBP5IK019',gender:'P',name:'NURUL SYAFIQAH BINTI ZULKARNAIN',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'A-','Bahasa Inggeris':'A-','Matematik':'E','Sejarah':'B','Pendidikan Agama Islam':'A-','Matematik Tambahan':'A','Fizik':'C+','Kimia':'G','Biologi':'A-'},pajskScore:83.6,riasecType:['Realistic','Social','Investigative'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Medium',keyAchievements:['NAIB JOHAN [KEBANGSAAN] – BADMINTON','ANUGERAH REMAJA PERDANA (EMAS)','Ahli KELAB MATEMATIK']},
  { id:'SBP5IK020',gender:'P',name:'NUR SYAZWANI BINTI ABDUL KADIR',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'A-','Bahasa Inggeris':'A+','Matematik':'A+','Sejarah':'A','Pendidikan Agama Islam':'A+','Matematik Tambahan':'A+','Fizik':'A','Kimia':'A+','Biologi':'A'},pajskScore:59.1,riasecType:['Enterprising','Social','Conventional'],fieldOfInterest:'Perniagaan & Pengurusan',dreamCareer:'Usahawan / Pengurus Perniagaan',leadershipLevel:'Basic',keyAchievements:['KETIGA [NEGERI] – SILAT','Ahli KELAB ROBOTIK']},
  { id:'SBP5IK021',gender:'P',name:'NUR FARHANA BINTI ZULKARNAIN',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'B+','Bahasa Inggeris':'A','Matematik':'C+','Sejarah':'C','Pendidikan Agama Islam':'A-','Matematik Tambahan':'C+','Fizik':'C+','Kimia':'A','Biologi':'C'},pajskScore:83.6,riasecType:['Realistic','Social','Enterprising'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Medium',keyAchievements:['KETIGA [NEGERI] – MEMANAH','Ahli KELAB ASTRONOMI']},
  { id:'SBP5IK022',gender:'P',name:'SITI HAJAR BINTI ROSLAN',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'B','Bahasa Inggeris':'A+','Matematik':'C+','Sejarah':'B+','Pendidikan Agama Islam':'B','Matematik Tambahan':'A','Fizik':'C+','Kimia':'B+','Biologi':'A+'},pajskScore:70.9,riasecType:['Enterprising','Investigative','Artistic'],fieldOfInterest:'Perniagaan & Pengurusan',dreamCareer:'Usahawan / Pengurus Perniagaan',leadershipLevel:'Medium',keyAchievements:['LULUS – BOLA KERANJANG','ANUGERAH KHAS KOKURIKULUM DAN SUKAN - NEGERI (PENERIMA)','Ahli KELAB ALAM SEKITAR']},
  { id:'SBP5IK023',gender:'P',name:'SITI MAISARAH BINTI ABDUL KADIR',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'B+','Bahasa Inggeris':'A','Matematik':'A+','Sejarah':'A+','Pendidikan Agama Islam':'A','Matematik Tambahan':'A+','Fizik':'A+','Kimia':'A+','Biologi':'A+'},pajskScore:86.4,riasecType:['Enterprising','Investigative','Social'],fieldOfInterest:'Perniagaan & Pengurusan',dreamCareer:'Usahawan / Pengurus Perniagaan',leadershipLevel:'High',keyAchievements:['JOHAN [NEGERI] – BOLA JARING','ANUGERAH REMAJA PERDANA (PERAK)','Ahli KELAB KIMIA']},
  { id:'SBP5IK024',gender:'P',name:'NUR SYAZWANI BINTI MOHD HELMI',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'A+','Bahasa Inggeris':'A','Matematik':'C+','Sejarah':'A-','Pendidikan Agama Islam':'A','Matematik Tambahan':'A','Fizik':'B','Kimia':'A','Biologi':'B+'},pajskScore:82.7,riasecType:['Conventional','Realistic','Artistic'],fieldOfInterest:'Perakaunan & Kewangan',dreamCareer:'Akauntan / Penganalisis Kewangan',leadershipLevel:'Medium',keyAchievements:['LULUS – BOLA JARING','AKTIVITI INSANIAH','Ahli KELAB NASYID']},
  { id:'SBP5IK025',gender:'P',name:'NUR AISYAH BINTI MOHD FADZILLAH',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'A+','Bahasa Inggeris':'B+','Matematik':'A','Sejarah':'A+','Pendidikan Agama Islam':'A+','Matematik Tambahan':'A+','Fizik':'A','Kimia':'A-','Biologi':'A+'},pajskScore:69.1,riasecType:['Social','Conventional','Enterprising'],fieldOfInterest:'Pendidikan & Perkhidmatan Sosial',dreamCareer:'Pendidik / Kaunselor',leadershipLevel:'Basic',keyAchievements:['KELIMA [NEGERI] – TENIS MEJA','PROGRAM KEPIMPINAN GENERASI MADANI - TIER 2','Ahli KELAB INOVASI DAN REKACIPTA']},
  { id:'SBP5IK026',gender:'P',name:'NUR IZZATI BINTI MOHD FADZILLAH',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'D','Bahasa Inggeris':'A+','Matematik':'E','Sejarah':'B+','Pendidikan Agama Islam':'E','Matematik Tambahan':'A','Fizik':'C','Kimia':'B+','Biologi':'G'},pajskScore:96.4,riasecType:['Social','Realistic','Artistic'],fieldOfInterest:'Pendidikan & Perkhidmatan Sosial',dreamCareer:'Pendidik / Kaunselor',leadershipLevel:'High',keyAchievements:['JOHAN [ZON/DAERAH] – BADMINTON','PENGHARGAAN KHAS SETARA-KEBANGSAAN (PENERIMA)','Ahli KELAB KOMPUTER ICT']},
  { id:'SBP5IK027',gender:'P',name:'SITI NURFATIN BINTI MOHD HELMI',parentCategory:'T20',spmGrades:{'Bahasa Melayu':'A','Bahasa Inggeris':'C+','Matematik':'A-','Sejarah':'E','Pendidikan Agama Islam':'C','Matematik Tambahan':'A','Fizik':'E','Kimia':'A+','Biologi':'D'},pajskScore:96.4,riasecType:['Enterprising','Investigative','Conventional'],fieldOfInterest:'Perniagaan & Pengurusan',dreamCareer:'Usahawan / Pengurus Perniagaan',leadershipLevel:'High',keyAchievements:['NAIB JOHAN [ANTARABANGSA] – TENIS MEJA','AKTIVITI INSANIAH','Ahli KELAB ALAM SEKITAR']},
  { id:'SBP5IK028',gender:'P',name:'NURUL AIN BINTI NORHAIZAM',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'C+','Bahasa Inggeris':'A','Matematik':'G','Sejarah':'B','Pendidikan Agama Islam':'D','Matematik Tambahan':'B','Fizik':'G','Kimia':'D','Biologi':'B+'},pajskScore:80.9,riasecType:['Realistic','Enterprising','Social'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Medium',keyAchievements:['KETIGA [KEBANGSAAN] – TAEKWONDO','ANUGERAH REMAJA PERDANA (EMAS)','Ahli KELAB SENI VISUAL']},
  { id:'SBP5IK029',gender:'L',name:'MUHAMMAD IRFAN BIN ZULKIFLI',parentCategory:'T20',spmGrades:{'Bahasa Melayu':'C','Bahasa Inggeris':'E','Matematik':'A','Sejarah':'C','Pendidikan Agama Islam':'A','Matematik Tambahan':'G','Fizik':'A','Kimia':'A-','Biologi':'B'},pajskScore:81.8,riasecType:['Realistic','Conventional','Investigative'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Medium',keyAchievements:['NAIB JOHAN [ZON/DAERAH] – HOKI','ANUGERAH REMAJA PERDANA (EMAS)','Ahli KELAB PERTANIAN']},
  { id:'SBP5IK030',gender:'L',name:'ADAM HARRIS BIN MOHD NOOR',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'D','Bahasa Inggeris':'G','Matematik':'B','Sejarah':'A-','Pendidikan Agama Islam':'B+','Matematik Tambahan':'C+','Fizik':'B+','Kimia':'C','Biologi':'C+'},pajskScore:72.7,riasecType:['Investigative','Enterprising','Artistic'],fieldOfInterest:'Sains & Perubatan',dreamCareer:'Doktor / Saintis & Penyelidik',leadershipLevel:'Medium',keyAchievements:['NAIB JOHAN [ANTARABANGSA] – SKUASY','PENGHARGAAN KHAS SETARA-KEBANGSAAN (PENERIMA)','Ahli KELAB NASYID']},
  { id:'SBP5IK031',gender:'L',name:'IZZUL HAKIM BIN ROSLAN',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'C+','Bahasa Inggeris':'C+','Matematik':'B','Sejarah':'A+','Pendidikan Agama Islam':'B','Matematik Tambahan':'C','Fizik':'E','Kimia':'C','Biologi':'D'},pajskScore:79.1,riasecType:['Enterprising','Conventional','Social'],fieldOfInterest:'Perniagaan & Pengurusan',dreamCareer:'Usahawan / Pengurus Perniagaan',leadershipLevel:'Medium',keyAchievements:['KELIMA [NEGERI] – SEPAK TAKRAW','PROGRAM KEPIMPINAN GENERASI MADANI - TIER 1','Ahli KELAB FIZIK']},
  { id:'SBP5IK032',gender:'L',name:'MUHAMMAD SYAHMI BIN OMAR',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'B+','Bahasa Inggeris':'A','Matematik':'C','Sejarah':'E','Pendidikan Agama Islam':'E','Matematik Tambahan':'C','Fizik':'A+','Kimia':'C','Biologi':'C'},pajskScore:90.9,riasecType:['Social','Realistic','Investigative'],fieldOfInterest:'Pendidikan & Perkhidmatan Sosial',dreamCareer:'Pendidik / Kaunselor',leadershipLevel:'High',keyAchievements:['NAIB JOHAN [ZON/DAERAH] – HOKI','Ahli KELAB KEUSAHAWANAN']},
  { id:'SBP5IK033',gender:'L',name:'ARIF DANISH BIN ZAINUDIN',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'C+','Bahasa Inggeris':'A','Matematik':'B','Sejarah':'C','Pendidikan Agama Islam':'B+','Matematik Tambahan':'C+','Fizik':'B','Kimia':'D','Biologi':'C'},pajskScore:89.1,riasecType:['Enterprising','Social','Realistic'],fieldOfInterest:'Perniagaan & Pengurusan',dreamCareer:'Usahawan / Pengurus Perniagaan',leadershipLevel:'High',keyAchievements:['NAIB JOHAN [KEBANGSAAN] – MEMANAH','ANUGERAH REMAJA PERDANA (EMAS)','Ahli KELAB BIOLOGI']},
  { id:'SBP5IK034',gender:'L',name:'MUHAMMAD HARITH BIN ABD RAHMAN',parentCategory:'T20',spmGrades:{'Bahasa Melayu':'E','Bahasa Inggeris':'A-','Matematik':'A','Sejarah':'C+','Pendidikan Agama Islam':'C+','Matematik Tambahan':'A','Fizik':'D','Kimia':'B+','Biologi':'B+'},pajskScore:66.4,riasecType:['Artistic','Investigative','Social'],fieldOfInterest:'Seni & Komunikasi',dreamCareer:'Pereka Grafik / Arkitek',leadershipLevel:'Basic',keyAchievements:['NAIB JOHAN [ZON/DAERAH] – BOLA SEPAK','ANUGERAH REMAJA PERDANA (PERAK)','Ahli KELAB DEBAT']},
  { id:'SBP5IK035',gender:'L',name:'LUQMANUL HAKIM BIN IBRAHIM',parentCategory:'T20',spmGrades:{'Bahasa Melayu':'B+','Bahasa Inggeris':'E','Matematik':'C+','Sejarah':'C','Pendidikan Agama Islam':'B+','Matematik Tambahan':'B','Fizik':'D','Kimia':'A+','Biologi':'B'},pajskScore:80.9,riasecType:['Realistic','Investigative','Conventional'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Medium',keyAchievements:['KETIGA [SEKOLAH] – OLAHRAGA','ANUGERAH REMAJA PERDANA (PERAK)','Ahli KELAB ROBOTIK']},
  { id:'SBP5IK036',gender:'L',name:'DANISH AQIL BIN MOHD FADZIL',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'B','Bahasa Inggeris':'G','Matematik':'B','Sejarah':'D','Pendidikan Agama Islam':'C','Matematik Tambahan':'G','Fizik':'C','Kimia':'C','Biologi':'B'},pajskScore:75.5,riasecType:['Social','Investigative','Enterprising'],fieldOfInterest:'Pendidikan & Perkhidmatan Sosial',dreamCareer:'Pendidik / Kaunselor',leadershipLevel:'Medium',keyAchievements:['KELIMA [NEGERI] – TAEKWONDO','ANUGERAH REMAJA PERDANA (GANGSA)','Ahli KELAB FIZIK']},
  { id:'SBP5IK037',gender:'P',name:'NUR BATRISYIA BINTI HASSAN',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'E','Bahasa Inggeris':'B','Matematik':'C+','Sejarah':'B','Pendidikan Agama Islam':'C','Matematik Tambahan':'E','Fizik':'C+','Kimia':'B+','Biologi':'C'},pajskScore:70,riasecType:['Investigative','Conventional','Social'],fieldOfInterest:'Sains & Perubatan',dreamCareer:'Doktor / Saintis & Penyelidik',leadershipLevel:'Medium',keyAchievements:['KETIGA [NEGERI] – RENANG','PENGHARGAAN KHAS SETARA-KEBANGSAAN (PENERIMA)','Ahli KELAB INOVASI DAN REKACIPTA']},
  { id:'SBP5IK038',gender:'P',name:'AMIRAH HUMAIRA BINTI RAZALI',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'C','Bahasa Inggeris':'G','Matematik':'D','Sejarah':'B','Pendidikan Agama Islam':'A-','Matematik Tambahan':'E','Fizik':'A-','Kimia':'C','Biologi':'E'},pajskScore:80,riasecType:['Investigative','Realistic','Artistic'],fieldOfInterest:'Sains & Perubatan',dreamCareer:'Doktor / Saintis & Penyelidik',leadershipLevel:'Medium',keyAchievements:['JOHAN [SEKOLAH] – BOLA KERANJANG','PROGRAM KEPIMPINAN GENERASI MADANI - TIER 1','Ahli KELAB BIOLOGI']},
  { id:'SBP5IK039',gender:'P',name:'NURUL HUSNA BINTI MOHD YUSOF',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'C','Bahasa Inggeris':'E','Matematik':'E','Sejarah':'E','Pendidikan Agama Islam':'D','Matematik Tambahan':'C+','Fizik':'C+','Kimia':'A+','Biologi':'B'},pajskScore:84.5,riasecType:['Artistic','Enterprising','Realistic'],fieldOfInterest:'Seni & Komunikasi',dreamCareer:'Pereka Grafik / Arkitek',leadershipLevel:'Medium',keyAchievements:['NAIB JOHAN [ZON/DAERAH] – CATUR','AKTIVITI INSANIAH','Ahli KELAB MUZIK']},
  { id:'SBP5IK040',gender:'P',name:'SITI ZULAIKHA BINTI ZAINAL',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'C+','Bahasa Inggeris':'C','Matematik':'D','Sejarah':'D','Pendidikan Agama Islam':'C','Matematik Tambahan':'C+','Fizik':'B','Kimia':'A','Biologi':'D'},pajskScore:86.4,riasecType:['Artistic','Conventional','Social'],fieldOfInterest:'Seni & Komunikasi',dreamCareer:'Pereka Grafik / Arkitek',leadershipLevel:'High',keyAchievements:['KEEMPAT [KEBANGSAAN] – CATUR','ANUGERAH KHAS KOKURIKULUM DAN SUKAN - KEBANGSAAN (PENERIMA)','Ahli KELAB ALAM SEKITAR']},
  { id:'SBP5IK041',gender:'P',name:'FARAH DIYANA BINTI OTHMAN',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'E','Bahasa Inggeris':'C+','Matematik':'A+','Sejarah':'G','Pendidikan Agama Islam':'A+','Matematik Tambahan':'B+','Fizik':'A','Kimia':'B+','Biologi':'E'},pajskScore:93.6,riasecType:['Social','Conventional','Investigative'],fieldOfInterest:'Pendidikan & Perkhidmatan Sosial',dreamCareer:'Pendidik / Kaunselor',leadershipLevel:'High',keyAchievements:['KETIGA [ZON/DAERAH] – SKUASY','ANUGERAH REMAJA PERDANA (GANGSA)','Ahli KELAB MATEMATIK']},
  { id:'SBP5IK042',gender:'P',name:'NUR ATHIRAH BINTI KAMARUDIN',parentCategory:'T20',spmGrades:{'Bahasa Melayu':'G','Bahasa Inggeris':'B','Matematik':'A-','Sejarah':'A+','Pendidikan Agama Islam':'C+','Matematik Tambahan':'C+','Fizik':'C+','Kimia':'A','Biologi':'C+'},pajskScore:72.7,riasecType:['Realistic','Artistic','Social'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Medium',keyAchievements:['NAIB JOHAN [ZON/DAERAH] – BADMINTON','AKTIVITI INSANIAH','Ahli KELAB PENDIDIKAN ISLAM']},
  { id:'SBP5IK043',gender:'P',name:'AISYAH NUR BINTI MOHD SABRI',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'C','Bahasa Inggeris':'B','Matematik':'B','Sejarah':'D','Pendidikan Agama Islam':'D','Matematik Tambahan':'E','Fizik':'E','Kimia':'B+','Biologi':'A+'},pajskScore:87.3,riasecType:['Conventional','Realistic','Social'],fieldOfInterest:'Perakaunan & Kewangan',dreamCareer:'Akauntan / Penganalisis Kewangan',leadershipLevel:'High',keyAchievements:['JOHAN [ZON/DAERAH] – BOLA JARING','PROGRAM KEPIMPINAN GENERASI MADANI - TIER 2','Ahli KELAB SENI VISUAL']},
  { id:'SBP5IK044',gender:'P',name:'NURUL AIN BINTI AHMAD FAUZI',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'E','Bahasa Inggeris':'B','Matematik':'C','Sejarah':'D','Pendidikan Agama Islam':'C+','Matematik Tambahan':'A+','Fizik':'A-','Kimia':'C','Biologi':'B'},pajskScore:85.5,riasecType:['Artistic','Enterprising','Conventional'],fieldOfInterest:'Seni & Komunikasi',dreamCareer:'Pereka Grafik / Arkitek',leadershipLevel:'High',keyAchievements:['LULUS – SILAT','Ahli KELAB NASYID']},
  { id:'SBP5IK045',gender:'P',name:'SITI HAFSAH BINTI MOHD SALLEH',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'C+','Bahasa Inggeris':'C+','Matematik':'B','Sejarah':'C+','Pendidikan Agama Islam':'C+','Matematik Tambahan':'C+','Fizik':'A-','Kimia':'A-','Biologi':'D'},pajskScore:80,riasecType:['Realistic','Enterprising','Investigative'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Medium',keyAchievements:['NAIB JOHAN [NEGERI] – OLAHRAGA','ANUGERAH REMAJA PERDANA (GANGSA)','Ahli KELAB ROBOTIK']},
  { id:'SBP5IK046',gender:'P',name:'NUR IMAN BINTI ZULKARNAIN',parentCategory:'T20',spmGrades:{'Bahasa Melayu':'D','Bahasa Inggeris':'C','Matematik':'C+','Sejarah':'D','Pendidikan Agama Islam':'G','Matematik Tambahan':'C','Fizik':'E','Kimia':'E','Biologi':'C'},pajskScore:68.2,riasecType:['Realistic','Investigative','Conventional'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'Basic',keyAchievements:['KETIGA [SEKOLAH] – SEPAK TAKRAW','Ahli KELAB PENDIDIKAN ISLAM']},
  { id:'SBP5IK047',gender:'P',name:'FARIDAH HANUM BINTI RAZAK',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'C+','Bahasa Inggeris':'A','Matematik':'B','Sejarah':'A+','Pendidikan Agama Islam':'G','Matematik Tambahan':'E','Fizik':'C','Kimia':'C+','Biologi':'B+'},pajskScore:60,riasecType:['Artistic','Enterprising','Realistic'],fieldOfInterest:'Seni & Komunikasi',dreamCareer:'Pereka Grafik / Arkitek',leadershipLevel:'Basic',keyAchievements:['NAIB JOHAN [ZON/DAERAH] – SKUASY','PROGRAM KEPIMPINAN GENERASI MADANI - TIER 2','Ahli KELAB PERTANIAN']},
  { id:'SBP5IK048',gender:'P',name:'NUR SAFIYYAH BINTI ABD HALIM',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'C','Bahasa Inggeris':'D','Matematik':'D','Sejarah':'D','Pendidikan Agama Islam':'E','Matematik Tambahan':'C+','Fizik':'C+','Kimia':'A','Biologi':'D'},pajskScore:80,riasecType:['Social','Enterprising','Realistic'],fieldOfInterest:'Pendidikan & Perkhidmatan Sosial',dreamCareer:'Pendidik / Kaunselor',leadershipLevel:'Medium',keyAchievements:['NAIB JOHAN [SEKOLAH] – OLAHRAGA','PROGRAM KEPIMPINAN GENERASI MADANI - TIER 2','Ahli KELAB NASYID']},
  { id:'SBP5IK049',gender:'P',name:'ZULAIKHA BINTI MOHD ZAIN',parentCategory:'B40',spmGrades:{'Bahasa Melayu':'C','Bahasa Inggeris':'C','Matematik':'E','Sejarah':'B','Pendidikan Agama Islam':'B+','Matematik Tambahan':'B+','Fizik':'B','Kimia':'A','Biologi':'B+'},pajskScore:88.2,riasecType:['Realistic','Conventional','Investigative'],fieldOfInterest:'Kejuruteraan & Teknologi',dreamCareer:'Jurutera',leadershipLevel:'High',keyAchievements:['KETIGA [ZON/DAERAH] – MEMANAH','AKTIVITI INSANIAH','Ahli PERSATUAN BAHASA ARAB']},
  { id:'SBP5IK050',gender:'P',name:'NURUL HIDAYAH BINTI NORDIN',parentCategory:'M40',spmGrades:{'Bahasa Melayu':'A-','Bahasa Inggeris':'E','Matematik':'C','Sejarah':'D','Pendidikan Agama Islam':'G','Matematik Tambahan':'D','Fizik':'G','Kimia':'G','Biologi':'C+'},pajskScore:96.4,riasecType:['Enterprising','Realistic','Investigative'],fieldOfInterest:'Perniagaan & Pengurusan',dreamCareer:'Usahawan / Pengurus Perniagaan',leadershipLevel:'High',keyAchievements:['NAIB JOHAN [KEBANGSAAN] – SKUASY','PROGRAM KEPIMPINAN GENERASI MADANI - TIER 2','Ahli PERSATUAN BAHASA ARAB']},
];

const SUBJECTS = ['Bahasa Melayu','Bahasa Inggeris','Matematik','Sejarah','Pendidikan Agama Islam','Matematik Tambahan','Fizik','Kimia','Biologi'];

// ════════════════════════════════════════════════════════════════════
// BUILD STUDENT CARD
// ════════════════════════════════════════════════════════════════════
function studentCard(s, idx) {
  const gp = calcGP(s.spmGrades);
  const isEven = idx % 2 === 0;
  const headerBg = isEven ? NAVY : '1e3a8a';
  const rows = [];

  // ── Header bar ──────────────────────────────────────────────────
  rows.push(new TableRow({ children: [
    new TableCell({
      columnSpan: 3,
      width: { size: CONTENT, type: WidthType.DXA },
      shading: { fill: headerBg, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      borders: { top:{style:BorderStyle.SINGLE,size:4,color:MGRAY}, bottom:{style:BorderStyle.SINGLE,size:4,color:MGRAY}, left:{style:BorderStyle.SINGLE,size:4,color:MGRAY}, right:{style:BorderStyle.SINGLE,size:4,color:MGRAY} },
      children: [new Paragraph({
        spacing:{before:0,after:0},
        children:[
          new TextRun({ text: `${s.id}  `, bold:true, size:22, color:'93C5FD', font:'Arial' }),
          new TextRun({ text: s.name, bold:true, size:22, color:WHITE, font:'Arial' }),
          new TextRun({ text: `   ${s.gender==='L'?'Lelaki':'Perempuan'}`, size:19, color:'CBD5E1', font:'Arial' }),
        ]
      })]
    })
  ]}));

  const W1 = 3400, W2 = 3400, W3 = CONTENT - W1 - W2;

  // ── Row 1: identity + SPM grades ────────────────────────────────
  const spmRows = SUBJECTS.map((sub, i) => {
    const g = s.spmGrades[sub] || '-';
    return new TableRow({ children: [
      cell(sub, { w: 2100, size: 16, bg: i%2===0?WHITE:LGRAY }),
      cell(g,   { w: 800, bold:true, size:17, color:gradeColor(g), align:AlignmentType.CENTER, bg: i%2===0?WHITE:LGRAY }),
    ]});
  });

  const spmTable = new Table({
    width: { size: W1, type: WidthType.DXA },
    columnWidths: [2100, 800],
    rows: [
      new TableRow({ children: [hdrCell('Subject',BLUE,{w:2100}), hdrCell('Grade',BLUE,{w:800,align:AlignmentType.CENTER})] }),
      ...spmRows,
      new TableRow({ children: [
        cell('GP Score (Average)', { w:2100, bold:true, bg:LBLUE }),
        cell(gp.toFixed(2), { w:800, bold:true, size:18, color:NAVY, align:AlignmentType.CENTER, bg:LBLUE }),
      ]}),
    ]
  });

  // ── PAJSK block ──────────────────────────────────────────────────
  const pajskTable = new Table({
    width: { size: W2, type: WidthType.DXA },
    columnWidths: [1700, 1700],
    rows: [
      new TableRow({ children: [hdrCell('PAJSK',TEAL,{w:1700,colspan:2})] }),
      new TableRow({ children: [cell('Score',{w:1700,bold:true,bg:LGRAY}), cell(`${s.pajskScore.toFixed(1)}%`,{w:1700,bold:true,color:TEAL,align:AlignmentType.CENTER})] }),
      new TableRow({ children: [cell('Leadership',{w:1700,bold:true,bg:LGRAY}), cell(s.leadershipLevel,{w:1700,bold:true,color:llCol(s.leadershipLevel),align:AlignmentType.CENTER})] }),
      new TableRow({ children: [hdrCell('Achievements',TEAL,{w:1700,colspan:2})] }),
      ...s.keyAchievements.map((a,i)=>new TableRow({ children: [
        cell((i+1)+'.',{w:300,bold:true,bg:i%2===0?WHITE:LGRAY,align:AlignmentType.CENTER}),
        cell(a,{w:3100,size:16,bg:i%2===0?WHITE:LGRAY}),
      ]})).map(r => { r.cells[0].options.width = {size:300,type:WidthType.DXA}; return new TableRow({ children: [
        cell((s.keyAchievements.indexOf(s.keyAchievements[s.keyAchievements.length-1])>=0?'·':'+'),{w:1700,colspan:2,size:16,bg:LGRAY})
      ]}); })
    ]
  });

  // Build PAJSK + achievements table properly
  const achievRows = s.keyAchievements.map((a,i) => new TableRow({ children: [
    cell(`${i+1}.`, { w:300, bold:true, size:16, bg:i%2===0?WHITE:LGRAY, align:AlignmentType.CENTER }),
    cell(a, { w:W2-300, size:16, bg:i%2===0?WHITE:LGRAY }),
  ]}));

  const pajskBlock = new Table({
    width: { size: W2, type: WidthType.DXA },
    columnWidths: [1700, W2-1700],
    rows: [
      new TableRow({ children: [hdrCell('PAJSK',TEAL,{w:1700}), hdrCell('Score / Level',TEAL,{w:W2-1700})] }),
      new TableRow({ children: [cell('Score',{w:1700,bold:true,bg:LGRAY}), cell(`${s.pajskScore.toFixed(1)}%`,{w:W2-1700,bold:true,color:TEAL})] }),
      new TableRow({ children: [cell('Leadership Level',{w:1700,bold:true}), cell(s.leadershipLevel,{w:W2-1700,bold:true,color:llCol(s.leadershipLevel)})] }),
      new TableRow({ children: [hdrCell('Key Achievements',TEAL,{w:W2,colspan:2})] }),
      ...s.keyAchievements.map((a,i) => new TableRow({ children: [
        cell(`${i+1}.`, { w:300, bold:true, size:16, bg:i%2===0?WHITE:LGRAY, align:AlignmentType.CENTER }),
        cell(a, { w:W2-300, size:16, bg:i%2===0?WHITE:LGRAY }),
      ]})),
    ]
  });

  // ── Profile block ────────────────────────────────────────────────
  const profileBlock = new Table({
    width: { size: W3, type: WidthType.DXA },
    columnWidths: [1400, W3-1400],
    rows: [
      new TableRow({ children: [hdrCell('Profile',PURPLE,{w:1400}), hdrCell('',PURPLE,{w:W3-1400})] }),
      new TableRow({ children: [cell('Income',{w:1400,bold:true,bg:LGRAY}), cell(s.parentCategory,{w:W3-1400,bold:true,color:catCol(s.parentCategory)})] }),
      new TableRow({ children: [hdrCell('RIASEC',PURPLE,{w:1400,colspan:2})] }),
      ...s.riasecType.map((r,i) => new TableRow({ children: [
        cell(`#${i+1}`, { w:500, bold:true, size:16, bg:LPURP, align:AlignmentType.CENTER }),
        cell(r, { w:W3-500, bold:true, size:16, color:riasecColor(r), bg:LPURP }),
      ]})),
      new TableRow({ children: [hdrCell('Career',PURPLE,{w:1400,colspan:2})] }),
      new TableRow({ children: [cell('Field',{w:1400,bold:true,bg:LGRAY}), cell(s.fieldOfInterest,{w:W3-1400,size:17})] }),
      new TableRow({ children: [cell('Dream Career',{w:1400,bold:true}), cell(s.dreamCareer,{w:W3-1400,size:17})] }),
    ]
  });

  // ── Outer 3-column wrapper ───────────────────────────────────────
  rows.push(new TableRow({ children: [
    new TableCell({ width:{size:W1,type:WidthType.DXA}, borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, margins:{top:0,bottom:0,left:0,right:80}, children:[spmTable] }),
    new TableCell({ width:{size:W2,type:WidthType.DXA}, borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, margins:{top:0,bottom:0,left:0,right:80}, children:[pajskBlock] }),
    new TableCell({ width:{size:W3,type:WidthType.DXA}, borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, margins:{top:0,bottom:0,left:0,right:0}, children:[profileBlock] }),
  ]}));

  return [
    new Table({ width:{size:CONTENT,type:WidthType.DXA}, columnWidths:[CONTENT], rows }),
    spacer(6),
  ];
}

// ════════════════════════════════════════════════════════════════════
// COVER PAGE
// ════════════════════════════════════════════════════════════════════
function coverPage() {
  const b40 = STUDENTS.filter(s=>s.parentCategory==='B40').length;
  const m40 = STUDENTS.filter(s=>s.parentCategory==='M40').length;
  const t20 = STUDENTS.filter(s=>s.parentCategory==='T20').length;
  const lelaki = STUDENTS.filter(s=>s.gender==='L').length;
  const perempuan = STUDENTS.filter(s=>s.gender==='P').length;

  return [
    spacer(60),
    new Paragraph({ alignment:AlignmentType.CENTER, border:{bottom:{style:BorderStyle.SINGLE,size:8,color:NAVY,space:1}}, spacing:{before:0,after:200}, children:[new TextRun({text:'KEMENTERIAN PENDIDIKAN MALAYSIA',bold:true,size:22,color:NAVY,font:'Arial',allCaps:true})] }),
    new Paragraph({ alignment:AlignmentType.CENTER, spacing:{before:0,after:80}, children:[new TextRun({text:'DELIMa Platform  ·  PRESTIJ Programme',size:20,color:BLUE,font:'Arial'})] }),
    spacer(40),
    new Paragraph({ alignment:AlignmentType.CENTER, shading:{fill:NAVY,type:ShadingType.CLEAR}, spacing:{before:160,after:0}, children:[new TextRun({text:'STUDENT PROFILE CATALOGUE',bold:true,size:48,color:WHITE,font:'Arial',allCaps:true})] }),
    new Paragraph({ alignment:AlignmentType.CENTER, shading:{fill:BLUE,type:ShadingType.CLEAR}, spacing:{before:0,after:0}, children:[new TextRun({text:'Kelas Ibnu Khaldun — 50 Students',bold:true,size:28,color:WHITE,font:'Arial'})] }),
    new Paragraph({ alignment:AlignmentType.CENTER, shading:{fill:TEAL,type:ShadingType.CLEAR}, spacing:{before:0,after:200}, children:[new TextRun({text:'SBP Integrasi Kuantan  |  Sesi 2025/2026',size:22,color:WHITE,font:'Arial',italic:true})] }),
    spacer(30),
    hLine(NAVY),
    spacer(20),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA}, columnWidths:[CONTENT/2|0,CONTENT-(CONTENT/2|0)],
      rows:[
        new TableRow({children:[cell('Total Students',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}), cell('50 students (SBP5IK001 – SBP5IK050)',{size:19})]}),
        new TableRow({children:[cell('Gender',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}), cell(`Lelaki: ${lelaki}  |  Perempuan: ${perempuan}`,{size:19})]}),
        new TableRow({children:[cell('Income Category',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}), cell(`B40: ${b40}  |  M40: ${m40}  |  T20: ${t20}`,{size:19})]}),
        new TableRow({children:[cell('School',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}), cell('SBP Integrasi Kuantan, Pahang',{size:19})]}),
        new TableRow({children:[cell('Programme',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}), cell('PRESTIJ — DELIMa KPM',{size:19})]}),
        new TableRow({children:[cell('Data Sources',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}), cell('SPM v4  |  PAJSK v3  |  IMK v3  |  Pendapatan v1',{size:19})]}),
        new TableRow({children:[cell('Security Notice',{w:CONTENT/2|0,bold:true,bg:LAMBER,size:19,color:AMBER}), cell('Student passwords are SULIT — not included in this document',{size:19,bg:LAMBER,color:AMBER})]}),
      ]
    }),
    new Paragraph({children:[new PageBreak()]})
  ];
}

// ════════════════════════════════════════════════════════════════════
// SUMMARY TABLE (all 50 on one page)
// ════════════════════════════════════════════════════════════════════
function summaryTable() {
  const rows = STUDENTS.map((s,i) => {
    const gp = calcGP(s.spmGrades);
    return new TableRow({ children: [
      cell(s.id, { w:1200, bold:true, size:16, bg:i%2===0?WHITE:LGRAY }),
      cell(s.name, { w:3200, size:16, bg:i%2===0?WHITE:LGRAY }),
      cell(s.gender==='L'?'L':'P', { w:400, size:16, align:AlignmentType.CENTER, bg:i%2===0?WHITE:LGRAY }),
      cell(s.parentCategory, { w:600, bold:true, size:16, color:catCol(s.parentCategory), align:AlignmentType.CENTER, bg:i%2===0?WHITE:LGRAY }),
      cell(gp.toFixed(2), { w:600, bold:true, size:16, color:gp<=2?GREEN:gp<=4?BLUE:AMBER, align:AlignmentType.CENTER, bg:i%2===0?WHITE:LGRAY }),
      cell(`${s.pajskScore.toFixed(1)}%`, { w:700, size:16, align:AlignmentType.CENTER, bg:i%2===0?WHITE:LGRAY }),
      cell(s.leadershipLevel, { w:800, bold:true, size:16, color:llCol(s.leadershipLevel), bg:i%2===0?WHITE:LGRAY }),
      cell(s.riasecType[0], { w:1200, size:16, color:riasecColor(s.riasecType[0]), bg:i%2===0?WHITE:LGRAY }),
      cell(s.fieldOfInterest, { w:CONTENT-8700, size:15, bg:i%2===0?WHITE:LGRAY }),
    ]});
  });

  return [
    new Paragraph({ heading:HeadingLevel.HEADING_1, spacing:{before:0,after:160}, children:[new TextRun({text:'Summary — All 50 Students',font:'Arial',size:28,bold:true,color:NAVY})] }),
    hLine(),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},
      columnWidths:[1200,3200,400,600,600,700,800,1200,CONTENT-8700],
      rows:[
        new TableRow({ children:[
          hdrCell('ID',NAVY,{w:1200}),
          hdrCell('Name',NAVY,{w:3200}),
          hdrCell('G',NAVY,{w:400,align:AlignmentType.CENTER}),
          hdrCell('Cat.',NAVY,{w:600,align:AlignmentType.CENTER}),
          hdrCell('GP',NAVY,{w:600,align:AlignmentType.CENTER}),
          hdrCell('PAJSK',NAVY,{w:700,align:AlignmentType.CENTER}),
          hdrCell('Lead.',NAVY,{w:800}),
          hdrCell('RIASEC #1',NAVY,{w:1200}),
          hdrCell('Field of Interest',NAVY,{w:CONTENT-8700}),
        ]}),
        ...rows,
      ]
    }),
    new Paragraph({children:[new PageBreak()]})
  ];
}

// ════════════════════════════════════════════════════════════════════
// ASSEMBLE
// ════════════════════════════════════════════════════════════════════
const b6 = { style:BorderStyle.SINGLE, size:6, color:NAVY, space:1 };

const allStudentCards = [];
STUDENTS.forEach((s, idx) => {
  allStudentCards.push(...studentCard(s, idx));
  // page break every 2 students to avoid overly long pages
  if ((idx+1) % 2 === 0 && idx < STUDENTS.length-1) {
    allStudentCards.push(new Paragraph({children:[new PageBreak()]}));
  }
});

const doc = new Document({
  styles: {
    default: { document: { run: { font:'Arial', size:20 } } },
    paragraphStyles: [
      { id:'Heading1', name:'Heading 1', basedOn:'Normal', next:'Normal', quickFormat:true,
        run:{size:28,bold:true,font:'Arial',color:NAVY},
        paragraph:{spacing:{before:320,after:160},outlineLevel:0} },
    ]
  },
  sections: [{
    properties: { page:{ size:{width:PAGE_W,height:PAGE_H}, margin:{top:MARGIN,right:MARGIN,bottom:MARGIN,left:MARGIN} } },
    headers: {
      default: new Header({ children:[new Paragraph({
        border:{bottom:b6}, spacing:{before:0,after:80},
        children:[
          new TextRun({text:'Student Profile Catalogue  |  Kelas Ibnu Khaldun',size:17,color:NAVY,font:'Arial'}),
          new TextRun({text:'\tSBP Integrasi Kuantan  ·  PRESTIJ Programme',size:17,color:DGRAY,font:'Arial'}),
        ],
        tabStops:[{type:docx.TabStopType.RIGHT,position:docx.TabStopPosition.MAX}]
      })] })
    },
    footers: {
      default: new Footer({ children:[new Paragraph({
        border:{top:b6}, spacing:{before:80,after:0},
        children:[
          new TextRun({text:'SULIT: Passwords not included  |  For internal use only',size:17,color:AMBER,font:'Arial'}),
          new TextRun({text:'\tPage ',size:17,color:DGRAY,font:'Arial'}),
          new TextRun({children:[PageNumber.CURRENT],size:17,color:NAVY,font:'Arial'}),
          new TextRun({text:' of ',size:17,color:DGRAY,font:'Arial'}),
          new TextRun({children:[PageNumber.TOTAL_PAGES],size:17,color:NAVY,font:'Arial'}),
        ],
        tabStops:[{type:docx.TabStopType.RIGHT,position:docx.TabStopPosition.MAX}]
      })] })
    },
    children: [
      ...coverPage(),
      ...summaryTable(),
      ...allStudentCards,
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = 'C:/Users/user/Documents/AI Agentic Schollarship Final/StudentProfiles_KelasIbnuKhaldun.docx';
  fs.writeFileSync(out, buf);
  console.log('Done:', out, '| Size:', (buf.length/1024).toFixed(1), 'KB');
});
