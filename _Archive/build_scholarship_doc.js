const docx = require('C:/Users/user/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, Bookmark
} = docx;

const NAVY='0F2057', BLUE='1A56DB', TEAL='0E7490', GREEN='166534',
      PURPLE='5B21B6', AMBER='B45309', RED='9B1C1C', WHITE='FFFFFF',
      LGRAY='F1F5F9', MGRAY='E2E8F0', DGRAY='334155',
      LBLUE='EFF6FF', LGREEN='F0FDF4', LPURP='F5F3FF', LAMBER='FFFBEB', LTEAL='F0FDFA',
      LRED='FEF2F2';

const PAGE_W=11906, PAGE_H=16838, MARGIN=1080, CONTENT=PAGE_W-MARGIN*2;

function spacer(pt=6){ return new Paragraph({spacing:{line:pt*20},children:[new TextRun('')]}); }
function hLine(color=MGRAY){ return new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:6,color,space:1}},spacing:{before:40,after:40},children:[new TextRun('')]}); }

function cell(text,opts={}){
  const{w,bold=false,italic=false,size=20,color=DGRAY,bg=WHITE,align=AlignmentType.LEFT,vAlign=VerticalAlign.CENTER,colspan=1}=opts;
  const b={style:BorderStyle.SINGLE,size:4,color:MGRAY};
  return new TableCell({columnSpan:colspan,width:w?{size:w,type:WidthType.DXA}:undefined,
    shading:{fill:bg,type:ShadingType.CLEAR},verticalAlign:vAlign,
    margins:{top:100,bottom:100,left:140,right:140},
    borders:{top:b,bottom:b,left:b,right:b},
    children:[new Paragraph({alignment:align,spacing:{before:0,after:0},
      children:[new TextRun({text,bold,italic,size,color,font:'Arial'})]})]});
}
function hdrCell(text,bg=NAVY,opts={}){ return cell(text,{bold:true,size:19,color:WHITE,bg,...opts}); }

function sh1(text,id){
  return new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:320,after:160},
    children:[new Bookmark({id,children:[new TextRun({text,font:'Arial',size:32,bold:true,color:NAVY})]})]});
}
function sh2(text){
  return new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:220,after:120},
    children:[new TextRun({text,font:'Arial',size:26,bold:true,color:BLUE})]});
}
function sh3(text,color=TEAL){
  return new Paragraph({spacing:{before:180,after:80},
    children:[new TextRun({text,font:'Arial',size:22,bold:true,color})]});
}
function body(text,opts={}){
  const{size=21,color=DGRAY,bold=false,italic=false,before=60,after=60,align=AlignmentType.LEFT}=opts;
  return new Paragraph({alignment:align,spacing:{before,after},
    children:[new TextRun({text,size,color,bold,italic,font:'Arial'})]});
}
function callout(text,bg=LBLUE,borderColor=BLUE){
  return new Table({width:{size:CONTENT,type:WidthType.DXA},columnWidths:[CONTENT],
    rows:[new TableRow({children:[new TableCell({
      shading:{fill:bg,type:ShadingType.CLEAR},margins:{top:140,bottom:140,left:200,right:200},
      borders:{top:{style:BorderStyle.SINGLE,size:4,color:borderColor},bottom:{style:BorderStyle.SINGLE,size:4,color:borderColor},
               right:{style:BorderStyle.SINGLE,size:4,color:borderColor},left:{style:BorderStyle.THICK,size:20,color:borderColor}},
      children:[new Paragraph({spacing:{before:0,after:0},
        children:[new TextRun({text,font:'Arial',size:20,color:DGRAY})]})]
    })]})],
  });
}

// ────────────────────────────────────────────────────────────────────
// Scholarship data
// ────────────────────────────────────────────────────────────────────
const SCHOLARSHIPS = [
  {
    id:'BIA001', name:'JPA – Program Penajaan Nasional (PPN)',
    provider:'Jabatan Perkhidmatan Awam (JPA)', category:'Government',
    description:'Biasiswa bergengsi JPA untuk lepasan SPM terbaik ke universiti luar negara (USA / UK). Pinjaman boleh ubah kepada biasiswa sepenuhnya.',
    minGP:10, pajsk:82, bumiOnly:false, incomeReq:'All',
    amount:'Tajaan Penuh (Luar Negara)', deadline:45,
    riasec:['Investigative','Realistic','Enterprising','Social','Conventional'],
    fields:['Kejuruteraan & Teknologi','Sains & Perubatan','Perakaunan & Kewangan'],
    tags:['JPA','Luar Negara','Kerajaan','Prestij','Pinjaman Boleh Ubah'],
    color:BLUE, lightColor:LBLUE,
  },
  {
    id:'BIA002', name:'JPA – Program Khas LSPM (Dalam Negara)',
    provider:'Jabatan Perkhidmatan Awam (JPA)', category:'Government',
    description:'Program JPA untuk pelajar SPM cemerlang ke universiti awam atau swasta dalam negara. Semua bidang pengajian layak.',
    minGP:9, pajsk:80, bumiOnly:false, incomeReq:'All',
    amount:'Tajaan Penuh (Dalam Negara)', deadline:50,
    riasec:['Realistic','Investigative','Artistic','Social','Enterprising','Conventional'],
    fields:['Semua Bidang'],
    tags:['JPA','Dalam Negara','Kerajaan','Semua Bidang'],
    color:BLUE, lightColor:LBLUE,
  },
  {
    id:'BIA003', name:'JPA – Program Khas JPA MARA (PKJM)',
    provider:'JPA & MARA', category:'Government',
    description:'Program bersama JPA-MARA untuk pelajar Bumiputera terbaik ke universiti dalam dan luar negara.',
    minGP:5, pajsk:0, bumiOnly:true, incomeReq:'All',
    amount:'Pinjaman Boleh Ubah', deadline:60,
    riasec:['Realistic','Investigative','Artistic','Social','Enterprising','Conventional'],
    fields:['Semua Bidang'],
    tags:['JPA','MARA','Bumiputera','Dalam & Luar Negara'],
    color:GREEN, lightColor:LGREEN,
  },
  {
    id:'BIA004', name:'MARA – Young Talent Development Programme (YTP)',
    provider:'MARA', category:'Government',
    description:'Biasiswa bergengsi MARA untuk pelajar Bumiputera cemerlang ke universiti Top 10/30 dunia. Keutamaan B40.',
    minGP:8, pajsk:68, bumiOnly:true, incomeReq:'B40/M40',
    amount:'Tajaan Penuh', deadline:55,
    riasec:['Investigative','Realistic','Artistic','Social'],
    fields:['Kejuruteraan & Teknologi','Sains & Perubatan','Seni & Komunikasi','Pendidikan & Perkhidmatan Sosial'],
    tags:['MARA','Bumiputera','B40 Keutamaan','Top Universiti'],
    color:AMBER, lightColor:LAMBER,
  },
  {
    id:'BIA005', name:'PETRONAS Powering Knowledge Education Sponsorship (PESP)',
    provider:'PETRONAS', category:'Corporate (GLC)',
    description:'Biasiswa korporat PETRONAS untuk bidang kejuruteraan, sains data dan perniagaan ke UTP dan universiti prestij luar negara.',
    minGP:9, pajsk:82, bumiOnly:false, incomeReq:'All',
    amount:'Tajaan Penuh', deadline:40,
    riasec:['Realistic','Investigative','Enterprising','Conventional'],
    fields:['Kejuruteraan & Teknologi','Sains & Perubatan','Perniagaan & Pengurusan'],
    tags:['PETRONAS','Korporat','Kejuruteraan','GLC'],
    color:TEAL, lightColor:LTEAL,
  },
  {
    id:'BIA006', name:'Shell Malaysia Scholarship',
    provider:'Shell Malaysia', category:'Corporate (MNC)',
    description:'Biasiswa Shell untuk pelajar cemerlang dalam bidang kejuruteraan, geosains dan pengurusan perniagaan ke universiti prestij.',
    minGP:9, pajsk:80, bumiOnly:false, incomeReq:'All',
    amount:'Tajaan Penuh', deadline:35,
    riasec:['Realistic','Investigative','Enterprising','Conventional'],
    fields:['Kejuruteraan & Teknologi','Sains & Perubatan','Perniagaan & Pengurusan'],
    tags:['Shell','Korporat','Kejuruteraan','Antarabangsa'],
    color:RED, lightColor:LRED,
  },
  {
    id:'BIA007', name:'Khazanah Watan Scholarship Programme',
    provider:'Yayasan Khazanah', category:'Corporate (GLC)',
    description:'Program biasiswa Khazanah untuk pelajar cemerlang Bumiputera ke universiti awam dalam negara. Semua bidang layak.',
    minGP:7, pajsk:68, bumiOnly:true, incomeReq:'All',
    amount:'Tajaan Penuh', deadline:50,
    riasec:['Realistic','Investigative','Artistic','Social','Enterprising','Conventional'],
    fields:['Semua Bidang'],
    tags:['Khazanah','GLC','Bumiputera','Dalam Negara'],
    color:PURPLE, lightColor:LPURP,
  },
  {
    id:'BIA008', name:'Yayasan Tenaga Nasional (YTN) – TNB Prime Scholarship',
    provider:'Yayasan Tenaga Nasional (TNB)', category:'Corporate (GLC)',
    description:'Biasiswa TNB untuk bidang kejuruteraan elektrik, mekanikal, awam, IT dan pengurusan ke universiti dalam dan luar negara.',
    minGP:6, pajsk:68, bumiOnly:false, incomeReq:'All',
    amount:'Tajaan Penuh', deadline:45,
    riasec:['Realistic','Investigative','Conventional','Enterprising'],
    fields:['Kejuruteraan & Teknologi','Perakaunan & Kewangan','Perniagaan & Pengurusan'],
    tags:['TNB','GLC','Kejuruteraan','IT'],
    color:AMBER, lightColor:LAMBER,
  },
  {
    id:'BIA009', name:'Biasiswa Yayasan Pahang',
    provider:'Yayasan Pahang', category:'State Foundation',
    description:'Biasiswa kerajaan negeri Pahang untuk pelajar B40 anak Pahang ke peringkat diploma dan ijazah dalam negara.',
    minGP:3, pajsk:0, bumiOnly:false, incomeReq:'B40',
    amount:'Bantuan Kewangan (Separa)', deadline:60,
    riasec:['Realistic','Investigative','Artistic','Social','Enterprising','Conventional'],
    fields:['Semua Bidang'],
    tags:['Yayasan Pahang','Negeri','B40','Pahang'],
    color:GREEN, lightColor:LGREEN,
  },
  {
    id:'BIA010', name:'Biasiswa Yayasan UEM',
    provider:'Yayasan UEM', category:'Corporate (GLC)',
    description:'Biasiswa Yayasan UEM untuk bidang kejuruteraan, sains komputer dan pengurusan projek ke universiti dalam dan luar negara.',
    minGP:6, pajsk:68, bumiOnly:false, incomeReq:'All',
    amount:'Tajaan Penuh', deadline:40,
    riasec:['Realistic','Investigative','Conventional','Enterprising'],
    fields:['Kejuruteraan & Teknologi','Sains & Perubatan','Perniagaan & Pengurusan'],
    tags:['UEM','GLC','Kejuruteraan','Sains Komputer'],
    color:'475569', lightColor:LGRAY,
  },
];

// ────────────────────────────────────────────────────────────────────
// COVER
// ────────────────────────────────────────────────────────────────────
function cover(){
  return[
    spacer(80),
    new Paragraph({alignment:AlignmentType.CENTER,border:{bottom:{style:BorderStyle.SINGLE,size:8,color:NAVY,space:1}},
      spacing:{before:0,after:200},children:[new TextRun({text:'KEMENTERIAN PENDIDIKAN MALAYSIA',bold:true,size:22,color:NAVY,font:'Arial',allCaps:true})]}),
    new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:80},
      children:[new TextRun({text:'DELIMa Platform  ·  PRESTIJ Programme',size:20,color:BLUE,font:'Arial'})]}),
    spacer(30),
    new Paragraph({alignment:AlignmentType.CENTER,shading:{fill:NAVY,type:ShadingType.CLEAR},spacing:{before:160,after:0},
      children:[new TextRun({text:'SCHOLARSHIP DATABASE',bold:true,size:52,color:WHITE,font:'Arial',allCaps:true})]}),
    new Paragraph({alignment:AlignmentType.CENTER,shading:{fill:BLUE,type:ShadingType.CLEAR},spacing:{before:0,after:0},
      children:[new TextRun({text:'Technical Documentation',bold:true,size:30,color:WHITE,font:'Arial'})]}),
    new Paragraph({alignment:AlignmentType.CENTER,shading:{fill:TEAL,type:ShadingType.CLEAR},spacing:{before:0,after:200},
      children:[new TextRun({text:'Agentic AI-Powered Scholarship Matching System',size:22,color:WHITE,font:'Arial',italic:true})]}),
    hLine(NAVY), spacer(20),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[CONTENT/2|0,CONTENT-(CONTENT/2|0)],
      rows:[
        new TableRow({children:[cell('Programme',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('PRESTIJ — AI-Powered Scholarship Advisory',{size:19})]}),
        new TableRow({children:[cell('Platform',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('DELIMa KPM (SBP Integrasi Kuantan)',{size:19})]}),
        new TableRow({children:[cell('Scholarships Documented',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('10 scholarships (BIA001 – BIA010)',{size:19})]}),
        new TableRow({children:[cell('Categories Covered',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('Government · Corporate (GLC) · Corporate (MNC) · State Foundation',{size:19})]}),
        new TableRow({children:[cell('Integration',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('Agent 2 (Matching Engine) — 5-dimension weighted scoring',{size:19})]}),
        new TableRow({children:[cell('Report Version',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('v1.0  (June 2026)',{size:19})]}),
      ]
    }),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ────────────────────────────────────────────────────────────────────
// 1. OVERVIEW
// ────────────────────────────────────────────────────────────────────
function overview(){
  return[
    sh1('1.  Scholarship Database Overview','overview'),
    hLine(),
    body('The PRESTIJ system contains a curated database of 10 scholarships relevant to SPM leavers from SBP Integrasi Kuantan. These scholarships span four categories: government programmes, GLC (Government-Linked Company) scholarships, multinational company scholarships, and state foundation grants. Each scholarship is stored as a structured data object consumed by Agent 2 (Scholarship Matching Agent).'),
    spacer(8),
    sh2('1.1  Scholarship Categories'),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[2200,1200,1400,CONTENT-4800],
      rows:[
        new TableRow({children:[hdrCell('Category',NAVY,{w:2200}),hdrCell('Count',NAVY,{w:1200,align:AlignmentType.CENTER}),hdrCell('IDs',NAVY,{w:1400}),hdrCell('Examples',NAVY,{w:CONTENT-4800})]}),
        new TableRow({children:[cell('Government',{w:2200,bold:true,color:BLUE,bg:LBLUE}),cell('3',{w:1200,bold:true,align:AlignmentType.CENTER,color:BLUE,bg:LBLUE}),cell('BIA001–BIA003',{w:1400,bg:LBLUE,size:18}),cell('JPA PPN, JPA LSPM, JPA-MARA PKJM',{w:CONTENT-4800,bg:LBLUE})]}),
        new TableRow({children:[cell('Corporate (GLC)',{w:2200,bold:true,color:TEAL}),cell('5',{w:1200,bold:true,align:AlignmentType.CENTER,color:TEAL}),cell('BIA004, BIA005, BIA007–BIA010',{w:1400,size:18}),cell('MARA YTP, PETRONAS PESP, Khazanah, TNB, UEM',{w:CONTENT-4800})]}),
        new TableRow({children:[cell('Corporate (MNC)',{w:2200,bold:true,color:RED,bg:LRED}),cell('1',{w:1200,bold:true,align:AlignmentType.CENTER,color:RED,bg:LRED}),cell('BIA006',{w:1400,bg:LRED,size:18}),cell('Shell Malaysia Scholarship',{w:CONTENT-4800,bg:LRED})]}),
        new TableRow({children:[cell('State Foundation',{w:2200,bold:true,color:GREEN,bg:LGREEN}),cell('1',{w:1200,bold:true,align:AlignmentType.CENTER,color:GREEN,bg:LGREEN}),cell('BIA009',{w:1400,bg:LGREEN,size:18}),cell('Biasiswa Yayasan Pahang',{w:CONTENT-4800,bg:LGREEN})]}),
        new TableRow({children:[cell('Total',{w:2200,bold:true,bg:LGRAY}),cell('10',{w:1200,bold:true,align:AlignmentType.CENTER,bg:LGRAY,color:NAVY}),cell('BIA001–BIA010',{w:1400,bg:LGRAY,size:18}),cell('',{w:CONTENT-4800,bg:LGRAY})]}),
      ]
    }),
    spacer(8),
    sh2('1.2  Scholarship Object Schema'),
    body('Each scholarship in the database is a TypeScript object with the following fields used by Agent 2:'),
    spacer(4),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[2400,1800,CONTENT-4200],
      rows:[
        new TableRow({children:[hdrCell('Field',NAVY,{w:2400}),hdrCell('Type',NAVY,{w:1800}),hdrCell('Description',NAVY,{w:CONTENT-4200})]}),
        ...([
          ['id','string','Unique scholarship code — BIA001 to BIA010'],
          ['name','string','Full official scholarship name'],
          ['provider','string','Awarding organisation'],
          ['description','string','Plain-language description shown to students'],
          ['minSpmRequirement','number','Minimum number of A-grade subjects required'],
          ['pajskRequirement','number','Minimum PAJSK score (%) required — 0 means no requirement'],
          ['preferredRiasec','string[]','Preferred RIASEC types — matched against student Holland Code'],
          ['preferredFields','string[]','Preferred fields of interest — matched against student fieldOfInterest'],
          ['parentCategoryRequired','"All"|"B40"|"B40/M40"','Income group eligibility restriction'],
          ['bumiputeraOnly','boolean','If true, Bumiputera applicants only'],
          ['deadlineDays','number','Days from current date until application deadline'],
          ['amount','string','Scholarship value description'],
          ['tags','string[]','Keywords used for display and filtering in the UI'],
        ]).map(([f,t,d],i)=>new TableRow({children:[
          cell(f,{w:2400,bold:true,italic:true,bg:i%2===0?WHITE:LGRAY,size:19}),
          cell(t,{w:1800,italic:true,bg:i%2===0?WHITE:LGRAY,size:19,color:TEAL}),
          cell(d,{w:CONTENT-4200,bg:i%2===0?WHITE:LGRAY,size:19}),
        ]}))
      ]
    }),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ────────────────────────────────────────────────────────────────────
// 2. MASTER COMPARISON TABLE
// ────────────────────────────────────────────────────────────────────
function masterTable(){
  return[
    sh1('2.  Master Scholarship Comparison','master'),
    hLine(),
    body('The table below provides a quick-reference comparison of all 10 scholarships across the key eligibility and matching criteria.'),
    spacer(6),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},
      columnWidths:[520,2600,900,900,900,900,CONTENT-6720],
      rows:[
        new TableRow({children:[
          hdrCell('ID',NAVY,{w:520,align:AlignmentType.CENTER}),
          hdrCell('Scholarship Name',NAVY,{w:2600}),
          hdrCell('Min A-Grades',NAVY,{w:900,align:AlignmentType.CENTER}),
          hdrCell('Min PAJSK',NAVY,{w:900,align:AlignmentType.CENTER}),
          hdrCell('Bumi Only',NAVY,{w:900,align:AlignmentType.CENTER}),
          hdrCell('Income',NAVY,{w:900,align:AlignmentType.CENTER}),
          hdrCell('Award Value',NAVY,{w:CONTENT-6720}),
        ]}),
        ...SCHOLARSHIPS.map((s,i)=>new TableRow({children:[
          cell(s.id,{w:520,bold:true,size:18,align:AlignmentType.CENTER,bg:i%2===0?WHITE:LGRAY,color:NAVY}),
          cell(s.name,{w:2600,size:18,bg:i%2===0?WHITE:LGRAY}),
          cell(s.minGP===0?'None':`${s.minGP}+`,{w:900,bold:true,align:AlignmentType.CENTER,size:18,color:s.minGP>=9?RED:s.minGP>=7?AMBER:s.minGP>=5?TEAL:GREEN,bg:i%2===0?WHITE:LGRAY}),
          cell(s.pajsk===0?'None':`${s.pajsk}%`,{w:900,bold:true,align:AlignmentType.CENTER,size:18,color:s.pajsk>=80?RED:s.pajsk>=68?AMBER:GREEN,bg:i%2===0?WHITE:LGRAY}),
          cell(s.bumiOnly?'Yes':'No',{w:900,bold:true,align:AlignmentType.CENTER,size:18,color:s.bumiOnly?RED:GREEN,bg:i%2===0?WHITE:LGRAY}),
          cell(s.incomeReq,{w:900,align:AlignmentType.CENTER,size:18,bold:s.incomeReq!=='All',color:s.incomeReq==='B40'?RED:s.incomeReq==='B40/M40'?AMBER:DGRAY,bg:i%2===0?WHITE:LGRAY}),
          cell(s.amount,{w:CONTENT-6720,size:18,bg:i%2===0?WHITE:LGRAY}),
        ]}))
      ]
    }),
    spacer(6),
    callout('Min A-Grades = minimum number of A/A+/A- grades in SPM. PAJSK = minimum co-curricular percentage. "None" means no requirement for that criterion.','FFF7ED',AMBER),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ────────────────────────────────────────────────────────────────────
// 3. INDIVIDUAL PROFILES
// ────────────────────────────────────────────────────────────────────
function scholarshipProfiles(){
  const sections = [];
  sections.push(sh1('3.  Individual Scholarship Profiles','profiles'));
  sections.push(hLine());
  sections.push(body('This section provides a detailed technical profile for each scholarship, including all eligibility criteria, preferred RIASEC profiles, supported fields of interest, and system integration notes.'));

  SCHOLARSHIPS.forEach((s, idx)=>{
    const C1=2200, C2=CONTENT-C1;
    const secColor=s.color, secLight=s.lightColor;

    sections.push(spacer(10));
    // scholarship header bar
    sections.push(new Paragraph({
      shading:{fill:NAVY,type:ShadingType.CLEAR},
      spacing:{before:200,after:0},
      children:[new TextRun({text:`  ${s.id}  `,bold:true,size:26,color:WHITE,font:'Arial',highlight:'none'}),
                new TextRun({text:s.name,bold:true,size:22,color:WHITE,font:'Arial'})]}));
    sections.push(new Paragraph({
      shading:{fill:secColor,type:ShadingType.CLEAR},
      spacing:{before:0,after:0},
      children:[new TextRun({text:`  ${s.provider}  ·  ${s.category}  ·  Deadline: ${s.deadline} days from application`,size:19,color:WHITE,font:'Arial'})]}));
    sections.push(new Paragraph({
      shading:{fill:secLight,type:ShadingType.CLEAR},
      spacing:{before:0,after:80},
      border:{bottom:{style:BorderStyle.SINGLE,size:4,color:secColor,space:1}},
      children:[new TextRun({text:`  ${s.description}`,size:19,color:DGRAY,font:'Arial',italic:true})]}));

    // eligibility table
    sections.push(new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[C1,C2],
      rows:[
        new TableRow({children:[hdrCell('Eligibility Criterion',secColor,{w:C1}),hdrCell('Requirement',secColor,{w:C2})]}),
        new TableRow({children:[
          cell('Minimum SPM A-Grades Required',{w:C1,bold:true,bg:LGRAY}),
          cell(s.minGP===0?'No minimum requirement — open to all SPM results':`Minimum ${s.minGP} subjects graded A, A+, or A-`,{w:C2,bg:LGRAY,bold:s.minGP>0,color:s.minGP>=9?RED:s.minGP>=7?AMBER:DGRAY}),
        ]}),
        new TableRow({children:[
          cell('Minimum PAJSK Score',{w:C1,bold:true}),
          cell(s.pajsk===0?'No PAJSK requirement':`${s.pajsk}% minimum — equivalent to ${s.pajsk>=82?'High':s.pajsk>=70?'Medium to High':'Basic to Medium'} leadership level`,{w:C2,bold:s.pajsk>0,color:s.pajsk>=80?RED:s.pajsk>=68?AMBER:DGRAY}),
        ]}),
        new TableRow({children:[
          cell('Bumiputera Requirement',{w:C1,bold:true,bg:LGRAY}),
          cell(s.bumiOnly?'Bumiputera applicants only':'Open to all races — no Bumiputera restriction',{w:C2,bg:LGRAY,bold:s.bumiOnly,color:s.bumiOnly?RED:GREEN}),
        ]}),
        new TableRow({children:[
          cell('Income Group Eligibility',{w:C1,bold:true}),
          cell(s.incomeReq==='All'?'Open to B40, M40, and T20 — no income restriction':s.incomeReq==='B40'?'B40 households only (per-capita income below RM 1,500/month)':'B40 and M40 households (per-capita income below RM 5,000/month)',{w:C2,bold:s.incomeReq!=='All',color:s.incomeReq==='B40'?RED:s.incomeReq==='B40/M40'?AMBER:DGRAY}),
        ]}),
        new TableRow({children:[
          cell('Award Value',{w:C1,bold:true,bg:LGRAY}),
          cell(s.amount,{w:C2,bg:LGRAY,bold:true,color:TEAL}),
        ]}),
      ]
    }));
    sections.push(spacer(4));

    // RIASEC & fields table
    sections.push(new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[C1,C2],
      rows:[
        new TableRow({children:[hdrCell('Matching Dimension',DGRAY,{w:C1}),hdrCell('Detail',DGRAY,{w:C2})]}),
        new TableRow({children:[
          cell('Preferred RIASEC Types',{w:C1,bold:true,bg:LGRAY}),
          cell(s.riasec.join('  ·  '),{w:C2,bg:LGRAY,size:18,color:secColor,bold:true}),
        ]}),
        new TableRow({children:[
          cell('Preferred Fields of Interest',{w:C1,bold:true}),
          cell(s.fields.join('\n'),{w:C2,size:18}),
        ]}),
        new TableRow({children:[
          cell('Tags (UI / Filter)',{w:C1,bold:true,bg:LGRAY}),
          cell(s.tags.join('  ·  '),{w:C2,bg:LGRAY,size:17,italic:true,color:DGRAY}),
        ]}),
      ]
    }));

    if(idx < SCHOLARSHIPS.length-1 && (idx+1)%3===0){
      sections.push(new Paragraph({children:[new PageBreak()]}));
    }
  });
  sections.push(new Paragraph({children:[new PageBreak()]}));
  return sections;
}

// ────────────────────────────────────────────────────────────────────
// 4. MATCHING FORMULA
// ────────────────────────────────────────────────────────────────────
function matchingFormula(){
  return[
    sh1('4.  Scholarship Matching Formula','formula'),
    hLine(),
    body('Agent 2 computes a match score for each student–scholarship pair using a weighted formula across five dimensions. The score determines the ranking and recommendation order presented to the student.'),
    spacer(8),
    sh2('4.1  Five-Dimension Weighted Formula'),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[500,2400,1000,CONTENT-3900],
      rows:[
        new TableRow({children:[hdrCell('#',NAVY,{w:500,align:AlignmentType.CENTER}),hdrCell('Dimension',NAVY,{w:2400}),hdrCell('Weight',NAVY,{w:1000,align:AlignmentType.CENTER}),hdrCell('How Agent 2 Computes It',NAVY,{w:CONTENT-3900})]}),
        new TableRow({children:[cell('1',{w:500,bold:true,align:AlignmentType.CENTER,bg:LGREEN}),cell('Academic Performance (SPM GP Score)',{w:2400,bold:true,bg:LGREEN}),cell('35%',{w:1000,bold:true,align:AlignmentType.CENTER,color:GREEN,bg:LGREEN}),cell('Normalised GP score × 35. Checks minSpmRequirement: if student fails to meet it, this dimension returns 0.',{w:CONTENT-3900,bg:LGREEN})]}),
        new TableRow({children:[cell('2',{w:500,bold:true,align:AlignmentType.CENTER}),cell('PAJSK Co-curricular Score',{w:2400,bold:true}),cell('20%',{w:1000,bold:true,align:AlignmentType.CENTER,color:TEAL}),cell('Normalised PAJSK% × 20. Checks pajskRequirement: if student is below threshold, this dimension returns 0.',{w:CONTENT-3900})]}),
        new TableRow({children:[cell('3',{w:500,bold:true,align:AlignmentType.CENTER,bg:LPURP}),cell('Psychometric Match (RIASEC)',{w:2400,bold:true,bg:LPURP}),cell('15%',{w:1000,bold:true,align:AlignmentType.CENTER,color:PURPLE,bg:LPURP}),cell('Top-3 Holland Codes compared to preferredRiasec. 1st match = full score, 2nd = partial, 3rd = lower partial.',{w:CONTENT-3900,bg:LPURP})]}),
        new TableRow({children:[cell('4',{w:500,bold:true,align:AlignmentType.CENTER}),cell('Career Aspiration & Field of Interest',{w:2400,bold:true}),cell('15%',{w:1000,bold:true,align:AlignmentType.CENTER,color:BLUE}),cell('student.fieldOfInterest checked against preferredFields array. Exact match = full score.',{w:CONTENT-3900})]}),
        new TableRow({children:[cell('5',{w:500,bold:true,align:AlignmentType.CENTER,bg:LAMBER}),cell('Parent / Family Background',{w:2400,bold:true,bg:LAMBER}),cell('15%',{w:1000,bold:true,align:AlignmentType.CENTER,color:AMBER,bg:LAMBER}),cell('student.parentCategory vs parentCategoryRequired. Mismatch = 0 (hard disqualification). Bumiputera flag also checked here.',{w:CONTENT-3900,bg:LAMBER})]}),
        new TableRow({children:[cell('',{w:500,bg:LGRAY}),cell('TOTAL',{w:2400,bold:true,bg:LGRAY,color:NAVY}),cell('100%',{w:1000,bold:true,align:AlignmentType.CENTER,bg:LGRAY,color:NAVY}),cell('Final score 0–100. Top 3 scholarships by score are presented to the student.',{w:CONTENT-3900,bg:LGRAY})]}),
      ]
    }),
    spacer(8),
    sh2('4.2  Eligibility Hard Gates'),
    body('Some criteria act as hard gates — a student fails them entirely and the scholarship is excluded from results regardless of other scores:'),
    spacer(4),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[2800,1600,CONTENT-4400],
      rows:[
        new TableRow({children:[hdrCell('Hard Gate',NAVY,{w:2800}),hdrCell('Dataset Field',NAVY,{w:1600}),hdrCell('Exclusion Rule',NAVY,{w:CONTENT-4400})]}),
        new TableRow({children:[cell('Bumiputera Only',{w:2800,bold:true,bg:LGRAY}),cell('bumiputeraOnly',{w:1600,italic:true,bg:LGRAY,size:19}),cell('If true and student is not Bumiputera, scholarship is excluded. Affects BIA003, BIA004, BIA007.',{w:CONTENT-4400,bg:LGRAY})]}),
        new TableRow({children:[cell('Income Category',{w:2800,bold:true}),cell('parentCategoryRequired',{w:1600,italic:true,size:19}),cell('If "B40" → only B40 students qualify. If "B40/M40" → T20 students are excluded. "All" = no restriction.',{w:CONTENT-4400})]}),
        new TableRow({children:[cell('Minimum SPM A-Grades',{w:2800,bold:true,bg:LGRAY}),cell('minSpmRequirement',{w:1600,italic:true,bg:LGRAY,size:19}),cell('If student has fewer A-grade subjects than required, academic dimension score = 0 (effectively excluded).',{w:CONTENT-4400,bg:LGRAY})]}),
        new TableRow({children:[cell('Minimum PAJSK Score',{w:2800,bold:true}),cell('pajskRequirement',{w:1600,italic:true,size:19}),cell('If student PAJSK% is below threshold and threshold > 0, PAJSK dimension score = 0.',{w:CONTENT-4400})]}),
      ]
    }),
    spacer(6),
    callout('A student that fails a hard gate on income or Bumiputera status will receive a score of 0 for that scholarship — it will not appear in their top-3 recommendations even if their academic performance is excellent.',LRED,RED),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ────────────────────────────────────────────────────────────────────
// 5. RIASEC–SCHOLARSHIP MAPPING
// ────────────────────────────────────────────────────────────────────
function riasecMapping(){
  return[
    sh1('5.  RIASEC–Scholarship Alignment Matrix','riasec'),
    hLine(),
    body('The matrix below shows which scholarships accept each RIASEC type as a preferred match. A tick (✓) indicates the RIASEC type appears in that scholarship\'s preferredRiasec array. Students with that top RIASEC code will receive a higher psychometric match score.'),
    spacer(6),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},
      columnWidths:[2200,900,900,900,900,900,900],
      rows:[
        new TableRow({children:[
          hdrCell('Scholarship',NAVY,{w:2200}),
          hdrCell('R',BLUE,{w:900,align:AlignmentType.CENTER}),
          hdrCell('I',GREEN,{w:900,align:AlignmentType.CENTER}),
          hdrCell('A',PURPLE,{w:900,align:AlignmentType.CENTER}),
          hdrCell('S',AMBER,{w:900,align:AlignmentType.CENTER}),
          hdrCell('E',RED,{w:900,align:AlignmentType.CENTER}),
          hdrCell('K',TEAL,{w:900,align:AlignmentType.CENTER}),
        ]}),
        ...SCHOLARSHIPS.map((s,i)=>{
          const has=type=>s.riasec.includes(type)?'✓':'–';
          return new TableRow({children:[
            cell(`${s.id}  ${s.name}`,{w:2200,size:17,bg:i%2===0?WHITE:LGRAY}),
            ...[['Realistic',BLUE],['Investigative',GREEN],['Artistic',PURPLE],['Social',AMBER],['Enterprising',RED],['Conventional',TEAL]].map(([t,c])=>
              cell(has(t),{w:900,bold:has(t)==='✓',size:20,align:AlignmentType.CENTER,color:has(t)==='✓'?c:'C0CAD8',bg:has(t)==='✓'?(i%2===0?WHITE:LGRAY):(i%2===0?WHITE:LGRAY)})
            ),
          ]});
        })
      ]
    }),
    spacer(6),
    sh2('5.1  Coverage Summary by RIASEC Type'),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[1200,1600,1600,CONTENT-4400],
      rows:[
        new TableRow({children:[hdrCell('RIASEC Type',NAVY,{w:1200}),hdrCell('Code',NAVY,{w:1600}),hdrCell('Scholarships Accepting',NAVY,{w:1600,align:AlignmentType.CENTER}),hdrCell('Scholarships',NAVY,{w:CONTENT-4400})]}),
        ...([
          ['Realistic','R','9/10',BLUE,'BIA001–BIA010 (all except none)','BIA001,BIA002,BIA003,BIA004,BIA005,BIA006,BIA007,BIA008,BIA009,BIA010'],
          ['Investigative','I','9/10',GREEN,'Almost all — BIA001–BIA010','BIA001,BIA002,BIA003,BIA004,BIA005,BIA006,BIA007,BIA008,BIA009,BIA010'],
          ['Enterprising','E','8/10',RED,'BIA001,BIA002,BIA003,BIA005,BIA006,BIA007,BIA008,BIA009,BIA010','–'],
          ['Conventional','K','7/10',TEAL,'BIA001,BIA002,BIA003,BIA005,BIA006,BIA007,BIA008,BIA009,BIA010','–'],
          ['Social','S','6/10',AMBER,'BIA001,BIA002,BIA003,BIA004,BIA007,BIA009','–'],
          ['Artistic','A','5/10',PURPLE,'BIA002,BIA003,BIA004,BIA007,BIA009','–'],
        ]).map(([type,code,count,c,desc],i)=>new TableRow({children:[
          cell(type,{w:1200,bold:true,color:c,bg:i%2===0?WHITE:LGRAY}),
          cell(code,{w:1600,bold:true,align:AlignmentType.CENTER,color:c,bg:i%2===0?WHITE:LGRAY}),
          cell(count,{w:1600,bold:true,align:AlignmentType.CENTER,color:c,bg:i%2===0?WHITE:LGRAY}),
          cell(desc,{w:CONTENT-4400,size:17,bg:i%2===0?WHITE:LGRAY}),
        ]}))
      ]
    }),
    callout('Realistic (R) and Investigative (I) students have the broadest scholarship eligibility — matching 9 out of 10 scholarships. Artistic (A) students have the narrowest match at 5 out of 10. This aligns with the dataset: Realistic is also the most common student RIASEC type (26% of class).',LGREEN,GREEN),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ────────────────────────────────────────────────────────────────────
// 6. CLASS ELIGIBILITY ESTIMATE
// ────────────────────────────────────────────────────────────────────
function eligibilityEstimate(){
  return[
    sh1('6.  Class Eligibility Estimate','eligibility'),
    hLine(),
    body('Using the known student dataset statistics, this section estimates how many of the 50 students in Kelas Ibnu Khaldun are likely to qualify for each scholarship based on their academic and co-curricular profiles.'),
    spacer(8),
    sh2('6.1  Estimated Eligible Students per Scholarship'),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[600,2600,1400,1600,CONTENT-6200],
      rows:[
        new TableRow({children:[hdrCell('ID',NAVY,{w:600,align:AlignmentType.CENTER}),hdrCell('Scholarship',NAVY,{w:2600}),hdrCell('Key Barrier',NAVY,{w:1400}),hdrCell('Est. Eligible',NAVY,{w:1600,align:AlignmentType.CENTER}),hdrCell('Basis of Estimate',NAVY,{w:CONTENT-6200})]}),
        ...[
          ['BIA001','JPA PPN','GP ≥10 + PAJSK ≥82%','~2–5 students','Only 2 students scored perfect GP 10.0; ~12 students have High PAJSK (≥85%). Intersection is small.'],
          ['BIA002','JPA LSPM','GP ≥9 + PAJSK ≥80%','~8–12 students','GP ≥9 roughly top 20%; 40 students have PAJSK ≥70%. Overlap estimated at ~10.'],
          ['BIA003','JPA-MARA PKJM','Bumiputera only, GP ≥5','~30–35 students','Low GP threshold; Bumiputera restriction reduces pool. Class from SBP = predominantly Bumiputera.'],
          ['BIA004','MARA YTP','Bumiputera, GP ≥8, B40/M40','~10–15 students','B40+M40 = 40 students. Among those, GP ≥8 estimated ~20–25. Bumiputera reduces further.'],
          ['BIA005','PETRONAS PESP','GP ≥9 + PAJSK ≥82%','~5–8 students','Same threshold as BIA001 but open to all races. No income restriction — slightly wider than BIA001.'],
          ['BIA006','Shell Malaysia','GP ≥9 + PAJSK ≥80%','~5–10 students','Same academic bar as BIA002 but narrower fields (Eng/Sci/Business only). RIASEC R/I/E/K required.'],
          ['BIA007','Khazanah Watan','Bumiputera, GP ≥7','~20–25 students','GP ≥7 covers roughly top 50%. Bumiputera restriction applies. No income restriction.'],
          ['BIA008','TNB Prime','GP ≥6 + PAJSK ≥68%','~25–30 students','GP ≥6 covers majority of class. PAJSK ≥68% — most students meet this. Narrower fields.'],
          ['BIA009','Yayasan Pahang','B40 + GP ≥3','~27 students','B40 = 27 students. GP ≥3 is a very low threshold — almost all B40 students qualify.'],
          ['BIA010','Yayasan UEM','GP ≥6 + PAJSK ≥68%','~25–30 students','Similar to BIA008. Open to all races. Narrower fields than some government scholarships.'],
        ].map(([id,name,barrier,est,basis],i)=>new TableRow({children:[
          cell(id,{w:600,bold:true,size:18,align:AlignmentType.CENTER,bg:i%2===0?WHITE:LGRAY,color:NAVY}),
          cell(name,{w:2600,size:17,bg:i%2===0?WHITE:LGRAY}),
          cell(barrier,{w:1400,size:17,bg:i%2===0?WHITE:LGRAY,color:AMBER,bold:true}),
          cell(est,{w:1600,size:17,bold:true,align:AlignmentType.CENTER,color:GREEN,bg:i%2===0?WHITE:LGRAY}),
          cell(basis,{w:CONTENT-6200,size:17,bg:i%2===0?WHITE:LGRAY,italic:true}),
        ]}))
      ]
    }),
    spacer(6),
    callout('These are estimates based on class averages — actual eligibility is computed per student by Agent 2 using exact individual scores. The estimates above help understand the competitive landscape before running the pipeline.',LBLUE,BLUE),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ────────────────────────────────────────────────────────────────────
// 7. SUMMARY
// ────────────────────────────────────────────────────────────────────
function summary(){
  return[
    sh1('7.  Summary & System Design Notes','summary'),
    hLine(),
    body('Key findings and design decisions regarding the scholarship database as used in the PRESTIJ system:'),
    spacer(6),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[600,3400,CONTENT-4000],
      rows:[
        new TableRow({children:[hdrCell('#',NAVY,{w:600,align:AlignmentType.CENTER}),hdrCell('Finding / Design Decision',NAVY,{w:3400}),hdrCell('Impact on System',NAVY,{w:CONTENT-4000})]}),
        ...([
          ['1','BIA009 (Yayasan Pahang) has the most accessible threshold (GP ≥3, B40 only, no PAJSK requirement)','All 27 B40 students will likely receive BIA009 as a recommendation — serves as a safety-net scholarship'],
          ['2','BIA001 (JPA PPN) has the most demanding threshold (GP = 10, PAJSK ≥82%)','Only top 2–5 students will qualify — creates a prestige tier that rewards excellence'],
          ['3','5 out of 10 scholarships restrict to Bumiputera applicants','System must apply bumiputeraOnly flag strictly; non-Bumiputera students receive different recommendation sets'],
          ['4','Realistic (R) students (26% of class) have the widest scholarship match pool','Engineering and Technology students are best served by the current database'],
          ['5','Artistic (A) students are underserved — only 5 scholarships accept A as preferred RIASEC','A future database expansion should include more arts, design, and communication scholarships'],
          ['6','PAJSK requirement of 0 in BIA003 and BIA009 means co-curricular performance is irrelevant for those scholarships','Students with low PAJSK scores still have viable scholarship pathways through these two scholarships'],
          ['7','All 10 scholarships include a tags array used by the UI for filtering and display','Tags are searchable in the DELIMa interface — students can filter by keyword (e.g. "GLC", "Bumiputera", "Luar Negara")'],
          ['8','The scholarship database is static (version v3) — no live API connection in current implementation','Future versions could integrate live scholarship portals (JPA, MARA official APIs) to refresh criteria dynamically'],
        ]).map(([n,f,imp],i)=>new TableRow({children:[
          cell(n,{w:600,bold:true,align:AlignmentType.CENTER,bg:i%2===0?WHITE:LGRAY,color:NAVY}),
          cell(f,{w:3400,bold:true,bg:i%2===0?WHITE:LGRAY}),
          cell(imp,{w:CONTENT-4000,size:19,bg:i%2===0?WHITE:LGRAY}),
        ]}))
      ]
    }),
    spacer(10),
    hLine(NAVY),
    body('End of Report — Scholarship Database Technical Documentation  |  PRESTIJ, DELIMa KPM',{color:DGRAY,italic:true,align:AlignmentType.CENTER,before:120,after:60,size:19}),
  ];
}

// ────────────────────────────────────────────────────────────────────
// ASSEMBLE
// ────────────────────────────────────────────────────────────────────
const b6={style:BorderStyle.SINGLE,size:6,color:NAVY,space:1};
const doc=new Document({
  styles:{
    default:{document:{run:{font:'Arial',size:21}}},
    paragraphStyles:[
      {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,
       run:{size:32,bold:true,font:'Arial',color:NAVY},paragraph:{spacing:{before:320,after:160},outlineLevel:0}},
      {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,
       run:{size:26,bold:true,font:'Arial',color:BLUE},paragraph:{spacing:{before:220,after:120},outlineLevel:1}},
    ]
  },
  sections:[{
    properties:{page:{size:{width:PAGE_W,height:PAGE_H},margin:{top:MARGIN,right:MARGIN,bottom:MARGIN,left:MARGIN}}},
    headers:{default:new Header({children:[new Paragraph({
      border:{bottom:b6},spacing:{before:0,after:100},
      children:[
        new TextRun({text:'Scholarship Database Technical Documentation  |  PRESTIJ',size:17,color:NAVY,font:'Arial'}),
        new TextRun({text:'\tSBP Integrasi Kuantan  ·  DELIMa KPM',size:17,color:DGRAY,font:'Arial'}),
      ],tabStops:[{type:docx.TabStopType.RIGHT,position:docx.TabStopPosition.MAX}]
    })]})},
    footers:{default:new Footer({children:[new Paragraph({
      border:{top:b6},spacing:{before:80,after:0},
      children:[
        new TextRun({text:'For internal academic and system use only',size:17,color:DGRAY,font:'Arial'}),
        new TextRun({text:'\tPage ',size:17,color:DGRAY,font:'Arial'}),
        new TextRun({children:[PageNumber.CURRENT],size:17,color:NAVY,font:'Arial'}),
        new TextRun({text:' of ',size:17,color:DGRAY,font:'Arial'}),
        new TextRun({children:[PageNumber.TOTAL_PAGES],size:17,color:NAVY,font:'Arial'}),
      ],tabStops:[{type:docx.TabStopType.RIGHT,position:docx.TabStopPosition.MAX}]
    })]})},
    children:[
      ...cover(),
      ...overview(),
      ...masterTable(),
      ...scholarshipProfiles(),
      ...matchingFormula(),
      ...riasecMapping(),
      ...eligibilityEstimate(),
      ...summary(),
    ]
  }]
});

Packer.toBuffer(doc).then(buf=>{
  const out='C:/Users/user/Documents/AI Agentic Schollarship Final/ScholarshipDatabase_TechnicalDoc.docx';
  fs.writeFileSync(out,buf);
  console.log('Done:',out,'| Size:',(buf.length/1024).toFixed(1),'KB');
});
