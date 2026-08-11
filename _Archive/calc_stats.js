const GP_MAP = {'A+':10,'A':9,'A-':8,'B+':7,'B':6,'C+':5,'C':4,'D':3,'E':2,'G':1};
const data = [
  {id:'SBP5IK001',gender:'L',cat:'B40',pajsk:70,ll:'Medium',riasec:['Artistic','Realistic','Conventional'],field:'Seni & Komunikasi',grades:{'BM':'A+','BI':'A+','MT':'A+','SJ':'A+','PAI':'A+','MM':'A+','FZ':'A+','KM':'A+','BO':'A+'}},
  {id:'SBP5IK002',gender:'L',cat:'B40',pajsk:70,ll:'Medium',riasec:['Social','Realistic','Investigative'],field:'Pendidikan & Perkhidmatan Sosial',grades:{'BM':'A+','BI':'A+','MT':'A+','SJ':'A+','PAI':'A+','MM':'A+','FZ':'A+','KM':'A+','BO':'A+'}},
  {id:'SBP5IK003',gender:'L',cat:'B40',pajsk:66.4,ll:'Basic',riasec:['Enterprising','Realistic','Investigative'],field:'Perniagaan & Pengurusan',grades:{'BM':'B+','BI':'A+','MT':'A','SJ':'A','PAI':'A+','MM':'A-','FZ':'A','KM':'A+','BO':'A+'}},
  {id:'SBP5IK004',gender:'L',cat:'M40',pajsk:59.1,ll:'Basic',riasec:['Social','Enterprising','Investigative'],field:'Pendidikan & Perkhidmatan Sosial',grades:{'BM':'A-','BI':'B','MT':'E','SJ':'C','PAI':'A-','MM':'B','FZ':'A-','KM':'A','BO':'A+'}},
  {id:'SBP5IK005',gender:'L',cat:'T20',pajsk:75.5,ll:'Medium',riasec:['Realistic','Enterprising','Investigative'],field:'Kejuruteraan & Teknologi',grades:{'BM':'B+','BI':'B+','MT':'A-','SJ':'C','PAI':'A-','MM':'B+','FZ':'A','KM':'A-','BO':'A-'}},
  {id:'SBP5IK006',gender:'L',cat:'M40',pajsk:70,ll:'Medium',riasec:['Artistic','Social','Enterprising'],field:'Seni & Komunikasi',grades:{'BM':'B+','BI':'A-','MT':'B+','SJ':'A+','PAI':'A+','MM':'A','FZ':'B+','KM':'A','BO':'A'}},
  {id:'SBP5IK007',gender:'L',cat:'B40',pajsk:92.7,ll:'High',riasec:['Enterprising','Realistic','Artistic'],field:'Perniagaan & Pengurusan',grades:{'BM':'A','BI':'B+','MT':'A-','SJ':'D','PAI':'A','MM':'C+','FZ':'A-','KM':'D','BO':'A+'}},
  {id:'SBP5IK008',gender:'L',cat:'B40',pajsk:66.4,ll:'Basic',riasec:['Conventional','Social','Artistic'],field:'Perakaunan & Kewangan',grades:{'BM':'B','BI':'B+','MT':'D','SJ':'A-','PAI':'E','MM':'A+','FZ':'B','KM':'C+','BO':'B+'}},
  {id:'SBP5IK009',gender:'L',cat:'M40',pajsk:78.2,ll:'Medium',riasec:['Realistic','Investigative','Conventional'],field:'Kejuruteraan & Teknologi',grades:{'BM':'A','BI':'C+','MT':'A-','SJ':'A','PAI':'A+','MM':'A-','FZ':'A','KM':'A+','BO':'C'}},
  {id:'SBP5IK010',gender:'L',cat:'M40',pajsk:64.5,ll:'Basic',riasec:['Realistic','Investigative','Enterprising'],field:'Kejuruteraan & Teknologi',grades:{'BM':'A','BI':'A','MT':'A','SJ':'A+','PAI':'D','MM':'D','FZ':'A+','KM':'B','BO':'B+'}},
  {id:'SBP5IK011',gender:'L',cat:'T20',pajsk:68.2,ll:'Basic',riasec:['Enterprising','Investigative','Conventional'],field:'Perniagaan & Pengurusan',grades:{'BM':'A+','BI':'B','MT':'E','SJ':'A','PAI':'A','MM':'C','FZ':'A+','KM':'C+','BO':'A+'}},
  {id:'SBP5IK012',gender:'L',cat:'B40',pajsk:81.8,ll:'Medium',riasec:['Conventional','Enterprising','Social'],field:'Perakaunan & Kewangan',grades:{'BM':'A-','BI':'E','MT':'C+','SJ':'C+','PAI':'A','MM':'B','FZ':'A+','KM':'A+','BO':'A-'}},
  {id:'SBP5IK013',gender:'L',cat:'M40',pajsk:84.5,ll:'Medium',riasec:['Artistic','Social','Realistic'],field:'Seni & Komunikasi',grades:{'BM':'B+','BI':'A+','MT':'A+','SJ':'A','PAI':'B+','MM':'A+','FZ':'A+','KM':'A','BO':'A+'}},
  {id:'SBP5IK014',gender:'L',cat:'T20',pajsk:72.7,ll:'Medium',riasec:['Realistic','Social','Enterprising'],field:'Kejuruteraan & Teknologi',grades:{'BM':'D','BI':'B+','MT':'A+','SJ':'B+','PAI':'A+','MM':'B','FZ':'A-','KM':'A','BO':'B'}},
  {id:'SBP5IK015',gender:'P',cat:'B40',pajsk:80,ll:'Medium',riasec:['Conventional','Enterprising','Realistic'],field:'Perakaunan & Kewangan',grades:{'BM':'A+','BI':'C+','MT':'A+','SJ':'A','PAI':'A+','MM':'B+','FZ':'B+','KM':'B+','BO':'A+'}},
  {id:'SBP5IK016',gender:'P',cat:'B40',pajsk:70.9,ll:'Medium',riasec:['Enterprising','Social','Conventional'],field:'Perniagaan & Pengurusan',grades:{'BM':'A+','BI':'B','MT':'A-','SJ':'B+','PAI':'A-','MM':'A','FZ':'B','KM':'A','BO':'B+'}},
  {id:'SBP5IK017',gender:'P',cat:'B40',pajsk:83.6,ll:'Medium',riasec:['Artistic','Enterprising','Social'],field:'Seni & Komunikasi',grades:{'BM':'A','BI':'C+','MT':'B+','SJ':'C+','PAI':'B+','MM':'A','FZ':'B','KM':'C','BO':'E'}},
  {id:'SBP5IK018',gender:'P',cat:'T20',pajsk:81.8,ll:'Medium',riasec:['Conventional','Investigative','Enterprising'],field:'Perakaunan & Kewangan',grades:{'BM':'B+','BI':'B','MT':'A-','SJ':'B','PAI':'B','MM':'G','FZ':'A+','KM':'A+','BO':'A'}},
  {id:'SBP5IK019',gender:'P',cat:'M40',pajsk:83.6,ll:'Medium',riasec:['Realistic','Social','Investigative'],field:'Kejuruteraan & Teknologi',grades:{'BM':'A-','BI':'A-','MT':'E','SJ':'B','PAI':'A-','MM':'A','FZ':'C+','KM':'G','BO':'A-'}},
  {id:'SBP5IK020',gender:'P',cat:'B40',pajsk:59.1,ll:'Basic',riasec:['Enterprising','Social','Conventional'],field:'Perniagaan & Pengurusan',grades:{'BM':'A-','BI':'A+','MT':'A+','SJ':'A','PAI':'A+','MM':'A+','FZ':'A','KM':'A+','BO':'A'}},
  {id:'SBP5IK021',gender:'P',cat:'B40',pajsk:83.6,ll:'Medium',riasec:['Realistic','Social','Enterprising'],field:'Kejuruteraan & Teknologi',grades:{'BM':'B+','BI':'A','MT':'C+','SJ':'C','PAI':'A-','MM':'C+','FZ':'C+','KM':'A','BO':'C'}},
  {id:'SBP5IK022',gender:'P',cat:'M40',pajsk:70.9,ll:'Medium',riasec:['Enterprising','Investigative','Artistic'],field:'Perniagaan & Pengurusan',grades:{'BM':'B','BI':'A+','MT':'C+','SJ':'B+','PAI':'B','MM':'A','FZ':'C+','KM':'B+','BO':'A+'}},
  {id:'SBP5IK023',gender:'P',cat:'M40',pajsk:86.4,ll:'High',riasec:['Enterprising','Investigative','Social'],field:'Perniagaan & Pengurusan',grades:{'BM':'B+','BI':'A','MT':'A+','SJ':'A+','PAI':'A','MM':'A+','FZ':'A+','KM':'A+','BO':'A+'}},
  {id:'SBP5IK024',gender:'P',cat:'B40',pajsk:82.7,ll:'Medium',riasec:['Conventional','Realistic','Artistic'],field:'Perakaunan & Kewangan',grades:{'BM':'A+','BI':'A','MT':'C+','SJ':'A-','PAI':'A','MM':'A','FZ':'B','KM':'A','BO':'B+'}},
  {id:'SBP5IK025',gender:'P',cat:'M40',pajsk:69.1,ll:'Basic',riasec:['Social','Conventional','Enterprising'],field:'Pendidikan & Perkhidmatan Sosial',grades:{'BM':'A+','BI':'B+','MT':'A','SJ':'A+','PAI':'A+','MM':'A+','FZ':'A','KM':'A-','BO':'A+'}},
  {id:'SBP5IK026',gender:'P',cat:'B40',pajsk:96.4,ll:'High',riasec:['Social','Realistic','Artistic'],field:'Pendidikan & Perkhidmatan Sosial',grades:{'BM':'D','BI':'A+','MT':'E','SJ':'B+','PAI':'E','MM':'A','FZ':'C','KM':'B+','BO':'G'}},
  {id:'SBP5IK027',gender:'P',cat:'T20',pajsk:96.4,ll:'High',riasec:['Enterprising','Investigative','Conventional'],field:'Perniagaan & Pengurusan',grades:{'BM':'A','BI':'C+','MT':'A-','SJ':'E','PAI':'C','MM':'A','FZ':'E','KM':'A+','BO':'D'}},
  {id:'SBP5IK028',gender:'P',cat:'B40',pajsk:80.9,ll:'Medium',riasec:['Realistic','Enterprising','Social'],field:'Kejuruteraan & Teknologi',grades:{'BM':'C+','BI':'A','MT':'G','SJ':'B','PAI':'D','MM':'B','FZ':'G','KM':'D','BO':'B+'}},
  {id:'SBP5IK029',gender:'L',cat:'T20',pajsk:81.8,ll:'Medium',riasec:['Realistic','Conventional','Investigative'],field:'Kejuruteraan & Teknologi',grades:{'BM':'C','BI':'E','MT':'A','SJ':'C','PAI':'A','MM':'G','FZ':'A','KM':'A-','BO':'B'}},
  {id:'SBP5IK030',gender:'L',cat:'B40',pajsk:72.7,ll:'Medium',riasec:['Investigative','Enterprising','Artistic'],field:'Sains & Perubatan',grades:{'BM':'D','BI':'G','MT':'B','SJ':'A-','PAI':'B+','MM':'C+','FZ':'B+','KM':'C','BO':'C+'}},
  {id:'SBP5IK031',gender:'L',cat:'M40',pajsk:79.1,ll:'Medium',riasec:['Enterprising','Conventional','Social'],field:'Perniagaan & Pengurusan',grades:{'BM':'C+','BI':'C+','MT':'B','SJ':'A+','PAI':'B','MM':'C','FZ':'E','KM':'C','BO':'D'}},
  {id:'SBP5IK032',gender:'L',cat:'B40',pajsk:90.9,ll:'High',riasec:['Social','Realistic','Investigative'],field:'Pendidikan & Perkhidmatan Sosial',grades:{'BM':'B+','BI':'A','MT':'C','SJ':'E','PAI':'E','MM':'C','FZ':'A+','KM':'C','BO':'C'}},
  {id:'SBP5IK033',gender:'L',cat:'B40',pajsk:89.1,ll:'High',riasec:['Enterprising','Social','Realistic'],field:'Perniagaan & Pengurusan',grades:{'BM':'C+','BI':'A','MT':'B','SJ':'C','PAI':'B+','MM':'C+','FZ':'B','KM':'D','BO':'C'}},
  {id:'SBP5IK034',gender:'L',cat:'T20',pajsk:66.4,ll:'Basic',riasec:['Artistic','Investigative','Social'],field:'Seni & Komunikasi',grades:{'BM':'E','BI':'A-','MT':'A','SJ':'C+','PAI':'C+','MM':'A','FZ':'D','KM':'B+','BO':'B+'}},
  {id:'SBP5IK035',gender:'L',cat:'T20',pajsk:80.9,ll:'Medium',riasec:['Realistic','Investigative','Conventional'],field:'Kejuruteraan & Teknologi',grades:{'BM':'B+','BI':'E','MT':'C+','SJ':'C','PAI':'B+','MM':'B','FZ':'D','KM':'A+','BO':'B'}},
  {id:'SBP5IK036',gender:'L',cat:'B40',pajsk:75.5,ll:'Medium',riasec:['Social','Investigative','Enterprising'],field:'Pendidikan & Perkhidmatan Sosial',grades:{'BM':'B','BI':'G','MT':'B','SJ':'D','PAI':'C','MM':'G','FZ':'C','KM':'C','BO':'B'}},
  {id:'SBP5IK037',gender:'P',cat:'B40',pajsk:70,ll:'Medium',riasec:['Investigative','Conventional','Social'],field:'Sains & Perubatan',grades:{'BM':'E','BI':'B','MT':'C+','SJ':'B','PAI':'C','MM':'E','FZ':'C+','KM':'B+','BO':'C'}},
  {id:'SBP5IK038',gender:'P',cat:'M40',pajsk:80,ll:'Medium',riasec:['Investigative','Realistic','Artistic'],field:'Sains & Perubatan',grades:{'BM':'C','BI':'G','MT':'D','SJ':'B','PAI':'A-','MM':'E','FZ':'A-','KM':'C','BO':'E'}},
  {id:'SBP5IK039',gender:'P',cat:'B40',pajsk:84.5,ll:'Medium',riasec:['Artistic','Enterprising','Realistic'],field:'Seni & Komunikasi',grades:{'BM':'C','BI':'E','MT':'E','SJ':'E','PAI':'D','MM':'C+','FZ':'C+','KM':'A+','BO':'B'}},
  {id:'SBP5IK040',gender:'P',cat:'M40',pajsk:86.4,ll:'High',riasec:['Artistic','Conventional','Social'],field:'Seni & Komunikasi',grades:{'BM':'C+','BI':'C','MT':'D','SJ':'D','PAI':'C','MM':'C+','FZ':'B','KM':'A','BO':'D'}},
  {id:'SBP5IK041',gender:'P',cat:'B40',pajsk:93.6,ll:'High',riasec:['Social','Conventional','Investigative'],field:'Pendidikan & Perkhidmatan Sosial',grades:{'BM':'E','BI':'C+','MT':'A+','SJ':'G','PAI':'A+','MM':'B+','FZ':'A','KM':'B+','BO':'E'}},
  {id:'SBP5IK042',gender:'P',cat:'T20',pajsk:72.7,ll:'Medium',riasec:['Realistic','Artistic','Social'],field:'Kejuruteraan & Teknologi',grades:{'BM':'G','BI':'B','MT':'A-','SJ':'A+','PAI':'C+','MM':'C+','FZ':'C+','KM':'A','BO':'C+'}},
  {id:'SBP5IK043',gender:'P',cat:'B40',pajsk:87.3,ll:'High',riasec:['Conventional','Realistic','Social'],field:'Perakaunan & Kewangan',grades:{'BM':'C','BI':'B','MT':'B','SJ':'D','PAI':'D','MM':'E','FZ':'E','KM':'B+','BO':'A+'}},
  {id:'SBP5IK044',gender:'P',cat:'B40',pajsk:85.5,ll:'High',riasec:['Artistic','Enterprising','Conventional'],field:'Seni & Komunikasi',grades:{'BM':'E','BI':'B','MT':'C','SJ':'D','PAI':'C+','MM':'A+','FZ':'A-','KM':'C','BO':'B'}},
  {id:'SBP5IK045',gender:'P',cat:'B40',pajsk:80,ll:'Medium',riasec:['Realistic','Enterprising','Investigative'],field:'Kejuruteraan & Teknologi',grades:{'BM':'C+','BI':'C+','MT':'B','SJ':'C+','PAI':'C+','MM':'C+','FZ':'A-','KM':'A-','BO':'D'}},
  {id:'SBP5IK046',gender:'P',cat:'T20',pajsk:68.2,ll:'Basic',riasec:['Realistic','Investigative','Conventional'],field:'Kejuruteraan & Teknologi',grades:{'BM':'D','BI':'C','MT':'C+','SJ':'D','PAI':'G','MM':'C','FZ':'E','KM':'E','BO':'C'}},
  {id:'SBP5IK047',gender:'P',cat:'B40',pajsk:60,ll:'Basic',riasec:['Artistic','Enterprising','Realistic'],field:'Seni & Komunikasi',grades:{'BM':'C+','BI':'A','MT':'B','SJ':'A+','PAI':'G','MM':'E','FZ':'C','KM':'C+','BO':'B+'}},
  {id:'SBP5IK048',gender:'P',cat:'B40',pajsk:80,ll:'Medium',riasec:['Social','Enterprising','Realistic'],field:'Pendidikan & Perkhidmatan Sosial',grades:{'BM':'C','BI':'D','MT':'D','SJ':'D','PAI':'E','MM':'C+','FZ':'C+','KM':'A','BO':'D'}},
  {id:'SBP5IK049',gender:'P',cat:'B40',pajsk:88.2,ll:'High',riasec:['Realistic','Conventional','Investigative'],field:'Kejuruteraan & Teknologi',grades:{'BM':'C','BI':'C','MT':'E','SJ':'B','PAI':'B+','MM':'B+','FZ':'B','KM':'A','BO':'B+'}},
  {id:'SBP5IK050',gender:'P',cat:'M40',pajsk:96.4,ll:'High',riasec:['Enterprising','Realistic','Investigative'],field:'Perniagaan & Pengurusan',grades:{'BM':'A-','BI':'E','MT':'C','SJ':'D','PAI':'G','MM':'D','FZ':'G','KM':'G','BO':'C+'}},
];

function gp(g){ const v=Object.values(g).map(x=>GP_MAP[x]||0); return v.reduce((a,b)=>a+b,0)/v.length; }

const n=50;
const allGP=data.map(s=>gp(s.grades));
const avgGP=(allGP.reduce((a,b)=>a+b,0)/n).toFixed(2);
const minGP=Math.min(...allGP).toFixed(2);
const maxGP=Math.max(...allGP).toFixed(2);

const allPajsk=data.map(s=>s.pajsk);
const avgPajsk=(allPajsk.reduce((a,b)=>a+b,0)/n).toFixed(1);
const minPajsk=Math.min(...allPajsk).toFixed(1);
const maxPajsk=Math.max(...allPajsk).toFixed(1);

const rc={},fc={},gc={};
data.forEach(s=>{
  rc[s.riasec[0]]=(rc[s.riasec[0]]||0)+1;
  fc[s.field]=(fc[s.field]||0)+1;
  Object.values(s.grades).forEach(g=>{ gc[g]=(gc[g]||0)+1; });
});

// per-subject avg GP
const SUBJ=['BM','BI','MT','SJ','PAI','MM','FZ','KM','BO'];
const subNames={'BM':'Bahasa Melayu','BI':'Bahasa Inggeris','MT':'Matematik','SJ':'Sejarah','PAI':'Pendidikan Agama Islam','MM':'Matematik Tambahan','FZ':'Fizik','KM':'Kimia','BO':'Biologi'};
const subjAvg={};
SUBJ.forEach(s=>{
  const vals=data.map(d=>GP_MAP[d.grades[s]]||0);
  subjAvg[subNames[s]]=(vals.reduce((a,b)=>a+b,0)/n).toFixed(2);
});

const res={
  n,
  gender:{L:data.filter(s=>s.gender==='L').length, P:data.filter(s=>s.gender==='P').length},
  income:{B40:data.filter(s=>s.cat==='B40').length, M40:data.filter(s=>s.cat==='M40').length, T20:data.filter(s=>s.cat==='T20').length},
  leadership:{High:data.filter(s=>s.ll==='High').length, Medium:data.filter(s=>s.ll==='Medium').length, Basic:data.filter(s=>s.ll==='Basic').length},
  gp:{avg:avgGP,min:minGP,max:maxGP,
    band_0_2:allGP.filter(g=>g<=2).length,
    band_2_4:allGP.filter(g=>g>2&&g<=4).length,
    band_4_6:allGP.filter(g=>g>4&&g<=6).length,
    band_6plus:allGP.filter(g=>g>6).length},
  pajsk:{avg:avgPajsk,min:minPajsk,max:maxPajsk},
  riasecTop1:rc, fieldDist:fc, gradeDist:gc, subjAvg
};
console.log(JSON.stringify(res,null,2));
