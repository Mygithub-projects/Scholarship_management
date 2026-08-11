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
      LBLUE='EFF6FF', LGREEN='F0FDF4', LPURP='F5F3FF', LAMBER='FFFBEB', LTEAL='F0FDFA', LRED='FEF2F2';

const PAGE_W=11906, PAGE_H=16838, MARGIN=900, CONTENT=PAGE_W-MARGIN*2;

function spacer(pt=4){ return new Paragraph({spacing:{line:pt*20},children:[new TextRun('')]}); }
function hLine(color=MGRAY){ return new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:6,color,space:1}},spacing:{before:30,after:30},children:[new TextRun('')]}); }

function cell(text,opts={}){
  const{w,bold=false,italic=false,size=18,color=DGRAY,bg=WHITE,align=AlignmentType.LEFT,colspan=1}=opts;
  const b={style:BorderStyle.SINGLE,size:3,color:MGRAY};
  return new TableCell({columnSpan:colspan,width:w?{size:w,type:WidthType.DXA}:undefined,
    shading:{fill:bg,type:ShadingType.CLEAR},verticalAlign:VerticalAlign.CENTER,
    margins:{top:80,bottom:80,left:120,right:120},
    borders:{top:b,bottom:b,left:b,right:b},
    children:[new Paragraph({alignment:align,spacing:{before:0,after:0},
      children:[new TextRun({text,bold,italic,size,color,font:'Arial'})]})]});
}
function hdrCell(text,bg=NAVY,opts={}){ return cell(text,{bold:true,size:17,color:WHITE,bg,...opts}); }

function sh(text,color=NAVY,size=26){
  return new Paragraph({spacing:{before:160,after:80},
    children:[new TextRun({text,font:'Arial',size,bold:true,color})]});
}
function body(text,opts={}){
  const{size=19,color=DGRAY,bold=false,italic=false,before=40,after=40}=opts;
  return new Paragraph({spacing:{before,after},children:[new TextRun({text,size,color,bold,italic,font:'Arial'})]});
}
function note(text,bg=LBLUE,bc=BLUE){
  return new Table({width:{size:CONTENT,type:WidthType.DXA},columnWidths:[CONTENT],
    rows:[new TableRow({children:[new TableCell({
      shading:{fill:bg,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:180,right:180},
      borders:{top:{style:BorderStyle.SINGLE,size:3,color:bc},bottom:{style:BorderStyle.SINGLE,size:3,color:bc},
               right:{style:BorderStyle.SINGLE,size:3,color:bc},left:{style:BorderStyle.THICK,size:18,color:bc}},
      children:[new Paragraph({spacing:{before:0,after:0},
        children:[new TextRun({text,font:'Arial',size:18,color:DGRAY})]})]
    })]})],
  });
}

// ── DATA ──────────────────────────────────────────────────────────────
const S = [
  {id:'BIA001',name:'JPA – Program Penajaan Nasional (PPN)',provider:'JPA',cat:'Government',
   minGP:10,pajsk:82,bumi:false,income:'All',amount:'Tajaan Penuh (Luar Negara)',deadline:45,
   riasec:'I, R, E, S, K',fields:'Kejuruteraan, Sains & Perubatan, Perakaunan'},
  {id:'BIA002',name:'JPA – LSPM (Dalam Negara)',provider:'JPA',cat:'Government',
   minGP:9,pajsk:80,bumi:false,income:'All',amount:'Tajaan Penuh (Dalam Negara)',deadline:50,
   riasec:'R, I, A, S, E, K',fields:'Semua Bidang'},
  {id:'BIA003',name:'JPA – Program Khas JPA MARA (PKJM)',provider:'JPA & MARA',cat:'Government',
   minGP:5,pajsk:0,bumi:true,income:'All',amount:'Pinjaman Boleh Ubah',deadline:60,
   riasec:'R, I, A, S, E, K',fields:'Semua Bidang'},
  {id:'BIA004',name:'MARA – Young Talent Development Programme (YTP)',provider:'MARA',cat:'Government',
   minGP:8,pajsk:68,bumi:true,income:'B40/M40',amount:'Tajaan Penuh',deadline:55,
   riasec:'I, R, A, S',fields:'Kejuruteraan, Sains, Seni, Pendidikan'},
  {id:'BIA005',name:'PETRONAS PESP',provider:'PETRONAS',cat:'GLC',
   minGP:9,pajsk:82,bumi:false,income:'All',amount:'Tajaan Penuh',deadline:40,
   riasec:'R, I, E, K',fields:'Kejuruteraan, Sains, Perniagaan'},
  {id:'BIA006',name:'Shell Malaysia Scholarship',provider:'Shell Malaysia',cat:'MNC',
   minGP:9,pajsk:80,bumi:false,income:'All',amount:'Tajaan Penuh',deadline:35,
   riasec:'R, I, E, K',fields:'Kejuruteraan, Sains, Perniagaan'},
  {id:'BIA007',name:'Khazanah Watan Scholarship',provider:'Yayasan Khazanah',cat:'GLC',
   minGP:7,pajsk:68,bumi:true,income:'All',amount:'Tajaan Penuh',deadline:50,
   riasec:'R, I, A, S, E, K',fields:'Semua Bidang'},
  {id:'BIA008',name:'YTN – TNB Prime Scholarship',provider:'Yayasan TNB',cat:'GLC',
   minGP:6,pajsk:68,bumi:false,income:'All',amount:'Tajaan Penuh',deadline:45,
   riasec:'R, I, K, E',fields:'Kejuruteraan, Perakaunan, Perniagaan'},
  {id:'BIA009',name:'Biasiswa Yayasan Pahang',provider:'Yayasan Pahang',cat:'State',
   minGP:3,pajsk:0,bumi:false,income:'B40',amount:'Bantuan Kewangan (Separa)',deadline:60,
   riasec:'R, I, A, S, E, K',fields:'Semua Bidang'},
  {id:'BIA010',name:'Biasiswa Yayasan UEM',provider:'Yayasan UEM',cat:'GLC',
   minGP:6,pajsk:68,bumi:false,income:'All',amount:'Tajaan Penuh',deadline:40,
   riasec:'R, I, K, E',fields:'Kejuruteraan, Sains, Perniagaan'},
];

// ── PAGE 1: COVER + OVERVIEW ──────────────────────────────────────────
function page1(){
  return[
    // cover block
    new Paragraph({alignment:AlignmentType.CENTER,shading:{fill:NAVY,type:ShadingType.CLEAR},spacing:{before:100,after:0},
      children:[new TextRun({text:'  SCHOLARSHIP DATABASE — Technical Documentation  ',bold:true,size:40,color:WHITE,font:'Arial'})]}),
    new Paragraph({alignment:AlignmentType.CENTER,shading:{fill:BLUE,type:ShadingType.CLEAR},spacing:{before:0,after:0},
      children:[new TextRun({text:'  PRESTIJ Programme  ·  Agentic AI-Powered Scholarship Matching System  ',bold:true,size:22,color:WHITE,font:'Arial'})]}),
    new Paragraph({alignment:AlignmentType.CENTER,shading:{fill:TEAL,type:ShadingType.CLEAR},spacing:{before:0,after:120},
      children:[new TextRun({text:'  SBP Integrasi Kuantan, Kelas Ibnu Khaldun  ·  DELIMa KPM  ·  Version 1.0, June 2026  ',size:19,color:WHITE,font:'Arial',italic:true})]}),
    spacer(6),

    // 4-column summary
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[CONTENT/4|0,CONTENT/4|0,CONTENT/4|0,CONTENT-(CONTENT/4|0)*3],
      rows:[new TableRow({children:[
        new TableCell({shading:{fill:LBLUE,type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:160,right:160},
          borders:{top:{style:BorderStyle.SINGLE,size:4,color:BLUE},bottom:{style:BorderStyle.SINGLE,size:4,color:BLUE},left:{style:BorderStyle.SINGLE,size:4,color:BLUE},right:{style:BorderStyle.SINGLE,size:4,color:BLUE}},
          children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[new TextRun({text:'10',bold:true,size:40,color:BLUE,font:'Arial'})]}),
                    new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[new TextRun({text:'Scholarships',size:18,color:DGRAY,font:'Arial'})]})]
        }),
        new TableCell({shading:{fill:LGREEN,type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:160,right:160},
          borders:{top:{style:BorderStyle.SINGLE,size:4,color:GREEN},bottom:{style:BorderStyle.SINGLE,size:4,color:GREEN},left:{style:BorderStyle.SINGLE,size:4,color:GREEN},right:{style:BorderStyle.SINGLE,size:4,color:GREEN}},
          children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[new TextRun({text:'4',bold:true,size:40,color:GREEN,font:'Arial'})]}),
                    new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[new TextRun({text:'Categories',size:18,color:DGRAY,font:'Arial'})]})]
        }),
        new TableCell({shading:{fill:LPURP,type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:160,right:160},
          borders:{top:{style:BorderStyle.SINGLE,size:4,color:PURPLE},bottom:{style:BorderStyle.SINGLE,size:4,color:PURPLE},left:{style:BorderStyle.SINGLE,size:4,color:PURPLE},right:{style:BorderStyle.SINGLE,size:4,color:PURPLE}},
          children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[new TextRun({text:'5',bold:true,size:40,color:PURPLE,font:'Arial'})]}),
                    new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[new TextRun({text:'Matching Dimensions',size:18,color:DGRAY,font:'Arial'})]})]
        }),
        new TableCell({shading:{fill:LAMBER,type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:160,right:160},
          borders:{top:{style:BorderStyle.SINGLE,size:4,color:AMBER},bottom:{style:BorderStyle.SINGLE,size:4,color:AMBER},left:{style:BorderStyle.SINGLE,size:4,color:AMBER},right:{style:BorderStyle.SINGLE,size:4,color:AMBER}},
          children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[new TextRun({text:'50',bold:true,size:40,color:AMBER,font:'Arial'})]}),
                    new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[new TextRun({text:'Students Profiled',size:18,color:DGRAY,font:'Arial'})]})]
        }),
      ]})]
    }),
    spacer(8),

    // schema
    sh('1.  Scholarship Object Schema — Fields Used by Agent 2',NAVY,24),
    hLine(),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[2000,1600,CONTENT-3600],
      rows:[
        new TableRow({children:[hdrCell('Field',NAVY,{w:2000}),hdrCell('Type',NAVY,{w:1600}),hdrCell('Description',NAVY,{w:CONTENT-3600})]}),
        ...([
          ['id / name / provider','string','Unique ID (BIA001–BIA010), full scholarship name, and awarding organisation'],
          ['minSpmRequirement','number','Minimum number of A-grade SPM subjects (A+, A, A–). 0 = no requirement.'],
          ['pajskRequirement','number','Minimum PAJSK score (%). 0 = no requirement.'],
          ['preferredRiasec','string[]','RIASEC types that match this scholarship — compared against student Holland Code (weight 15%)'],
          ['preferredFields','string[]','Preferred fields of interest — compared against student fieldOfInterest (weight 15%)'],
          ['parentCategoryRequired','"All" | "B40" | "B40/M40"','Income eligibility. Hard gate — mismatch = 0 score.'],
          ['bumiputeraOnly','boolean','If true, non-Bumiputera students are excluded. Hard gate.'],
          ['amount / deadlineDays','string / number','Award value description and days until application deadline'],
        ]).map(([f,t,d],i)=>new TableRow({children:[
          cell(f,{w:2000,bold:true,italic:true,size:17,bg:i%2===0?WHITE:LGRAY}),
          cell(t,{w:1600,size:17,italic:true,color:TEAL,bg:i%2===0?WHITE:LGRAY}),
          cell(d,{w:CONTENT-3600,size:17,bg:i%2===0?WHITE:LGRAY}),
        ]}))
      ]
    }),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ── PAGE 2–3: MASTER TABLE ──────────────────────────────────────────
function page2(){
  const C=[520,2560,760,760,700,700,720,CONTENT-6720];
  return[
    sh('2.  Master Scholarship Reference Table',NAVY,24),
    hLine(),
    body('All 10 scholarships — eligibility, RIASEC preference, supported fields, and award value at a glance.',{before:40,after:80}),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:C,
      rows:[
        new TableRow({children:[
          hdrCell('ID',NAVY,{w:C[0],align:AlignmentType.CENTER}),
          hdrCell('Name & Provider',NAVY,{w:C[1]}),
          hdrCell('Min A',NAVY,{w:C[2],align:AlignmentType.CENTER}),
          hdrCell('PAJSK',NAVY,{w:C[3],align:AlignmentType.CENTER}),
          hdrCell('Bumi',NAVY,{w:C[4],align:AlignmentType.CENTER}),
          hdrCell('Income',NAVY,{w:C[5],align:AlignmentType.CENTER}),
          hdrCell('Cat.',NAVY,{w:C[6],align:AlignmentType.CENTER}),
          hdrCell('Award',NAVY,{w:C[7]}),
        ]}),
        ...S.map((s,i)=>new TableRow({children:[
          cell(s.id,{w:C[0],bold:true,size:16,align:AlignmentType.CENTER,bg:i%2===0?WHITE:LGRAY,color:NAVY}),
          new TableCell({width:{size:C[1],type:WidthType.DXA},shading:{fill:i%2===0?WHITE:LGRAY,type:ShadingType.CLEAR},
            margins:{top:80,bottom:80,left:120,right:120},
            borders:{top:{style:BorderStyle.SINGLE,size:3,color:MGRAY},bottom:{style:BorderStyle.SINGLE,size:3,color:MGRAY},left:{style:BorderStyle.SINGLE,size:3,color:MGRAY},right:{style:BorderStyle.SINGLE,size:3,color:MGRAY}},
            children:[
              new Paragraph({spacing:{before:0,after:0},children:[new TextRun({text:s.name,bold:true,size:16,font:'Arial',color:DGRAY})]}),
              new Paragraph({spacing:{before:0,after:0},children:[new TextRun({text:s.provider,size:15,font:'Arial',color:TEAL,italic:true})]}),
            ]
          }),
          cell(s.minGP===0?'–':`${s.minGP}+`,{w:C[2],bold:true,align:AlignmentType.CENTER,size:17,color:s.minGP>=9?RED:s.minGP>=7?AMBER:s.minGP>=5?TEAL:GREEN,bg:i%2===0?WHITE:LGRAY}),
          cell(s.pajsk===0?'–':`${s.pajsk}%`,{w:C[3],bold:true,align:AlignmentType.CENTER,size:17,color:s.pajsk>=80?RED:s.pajsk>=68?AMBER:GREEN,bg:i%2===0?WHITE:LGRAY}),
          cell(s.bumi?'Yes':'No',{w:C[4],bold:true,align:AlignmentType.CENTER,size:17,color:s.bumi?RED:GREEN,bg:i%2===0?WHITE:LGRAY}),
          cell(s.income,{w:C[5],size:16,align:AlignmentType.CENTER,bold:s.income!=='All',color:s.income==='B40'?RED:s.income==='B40/M40'?AMBER:DGRAY,bg:i%2===0?WHITE:LGRAY}),
          cell(s.cat,{w:C[6],size:15,align:AlignmentType.CENTER,color:TEAL,bg:i%2===0?WHITE:LGRAY}),
          cell(s.amount,{w:C[7],size:15,bg:i%2===0?WHITE:LGRAY}),
        ]}))
      ]
    }),
    spacer(6),
    note('Min A = minimum number of A/A+/A– SPM grades required.  PAJSK = minimum co-curricular percentage.  "–" means no requirement.  Red = high threshold.  Bumi Yes = Bumiputera applicants only.','FFF7ED',AMBER),
    spacer(8),

    // RIASEC matrix — compact
    sh('3.  RIASEC–Scholarship Alignment Matrix',NAVY,24),
    hLine(),
    body('✓ = this RIASEC type appears in the scholarship\'s preferred list (higher psychometric match score).',{before:40,after:80}),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},
      columnWidths:[2560,700,700,700,700,700,700,CONTENT-6760],
      rows:[
        new TableRow({children:[
          hdrCell('Scholarship',NAVY,{w:2560}),
          hdrCell('R',BLUE,{w:700,align:AlignmentType.CENTER}),
          hdrCell('I',GREEN,{w:700,align:AlignmentType.CENTER}),
          hdrCell('A',PURPLE,{w:700,align:AlignmentType.CENTER}),
          hdrCell('S',AMBER,{w:700,align:AlignmentType.CENTER}),
          hdrCell('E',RED,{w:700,align:AlignmentType.CENTER}),
          hdrCell('K',TEAL,{w:700,align:AlignmentType.CENTER}),
          hdrCell('Preferred Fields',NAVY,{w:CONTENT-6760}),
        ]}),
        ...S.map((s,i)=>{
          const ri=s.riasec.split(', ');
          const has=t=>ri.includes(t)?'✓':'–';
          const cols=[[BLUE,'R'],[GREEN,'I'],[PURPLE,'A'],[AMBER,'S'],[RED,'E'],[TEAL,'K']];
          return new TableRow({children:[
            cell(`${s.id}  ${s.name}`,{w:2560,size:15,bg:i%2===0?WHITE:LGRAY}),
            ...cols.map(([c,t])=>cell(has(t),{w:700,bold:has(t)==='✓',size:18,align:AlignmentType.CENTER,color:has(t)==='✓'?c:'C0CAD8',bg:i%2===0?WHITE:LGRAY})),
            cell(s.fields,{w:CONTENT-6760,size:15,bg:i%2===0?WHITE:LGRAY}),
          ]});
        }),
        new TableRow({children:[
          hdrCell('Coverage (out of 10)',DGRAY,{w:2560}),
          ...[
            [9,BLUE],[9,GREEN],[5,PURPLE],[6,AMBER],[8,RED],[7,TEAL]
          ].map(([n,c])=>hdrCell(`${n}/10`,c,{w:700,align:AlignmentType.CENTER})),
          hdrCell('',DGRAY,{w:CONTENT-6760}),
        ]})
      ]
    }),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ── PAGE 4: MATCHING FORMULA + HARD GATES ──────────────────────────
function page3(){
  return[
    sh('4.  Scholarship Matching Formula (Agent 2)',NAVY,24),
    hLine(),
    body('Agent 2 computes a 0–100 match score for every student–scholarship pair. The top 3 scholarships by score are recommended to the student.',{before:40,after:80}),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[400,2400,880,CONTENT-3680],
      rows:[
        new TableRow({children:[hdrCell('#',NAVY,{w:400,align:AlignmentType.CENTER}),hdrCell('Dimension',NAVY,{w:2400}),hdrCell('Weight',NAVY,{w:880,align:AlignmentType.CENTER}),hdrCell('How It Is Computed',NAVY,{w:CONTENT-3680})]}),
        new TableRow({children:[cell('1',{w:400,bold:true,align:AlignmentType.CENTER,bg:LGREEN}),cell('Academic Performance (SPM GP Score)',{w:2400,bold:true,bg:LGREEN}),cell('35%',{w:880,bold:true,align:AlignmentType.CENTER,color:GREEN,bg:LGREEN}),cell('Normalised GP × 35. Fails minSpmRequirement → dimension = 0',{w:CONTENT-3680,bg:LGREEN})]}),
        new TableRow({children:[cell('2',{w:400,bold:true,align:AlignmentType.CENTER}),cell('PAJSK Co-curricular Score',{w:2400,bold:true}),cell('20%',{w:880,bold:true,align:AlignmentType.CENTER,color:TEAL}),cell('Normalised PAJSK% × 20. Below pajskRequirement → dimension = 0',{w:CONTENT-3680})]}),
        new TableRow({children:[cell('3',{w:400,bold:true,align:AlignmentType.CENTER,bg:LPURP}),cell('Psychometric — RIASEC Match',{w:2400,bold:true,bg:LPURP}),cell('15%',{w:880,bold:true,align:AlignmentType.CENTER,color:PURPLE,bg:LPURP}),cell('Student top-3 Holland Codes vs preferredRiasec. 1st=full, 2nd=partial, 3rd=lower',{w:CONTENT-3680,bg:LPURP})]}),
        new TableRow({children:[cell('4',{w:400,bold:true,align:AlignmentType.CENTER}),cell('Career Aspiration & Field of Interest',{w:2400,bold:true}),cell('15%',{w:880,bold:true,align:AlignmentType.CENTER,color:BLUE}),cell('student.fieldOfInterest vs preferredFields array — exact match = full score',{w:CONTENT-3680})]}),
        new TableRow({children:[cell('5',{w:400,bold:true,align:AlignmentType.CENTER,bg:LAMBER}),cell('Family Background (Income + Bumiputera)',{w:2400,bold:true,bg:LAMBER}),cell('15%',{w:880,bold:true,align:AlignmentType.CENTER,color:AMBER,bg:LAMBER}),cell('Hard gate: income mismatch or Bumiputera flag fails → score = 0 for this scholarship',{w:CONTENT-3680,bg:LAMBER})]}),
        new TableRow({children:[cell('',{w:400,bg:LGRAY}),cell('TOTAL',{w:2400,bold:true,bg:LGRAY,color:NAVY}),cell('100%',{w:880,bold:true,align:AlignmentType.CENTER,bg:LGRAY,color:NAVY}),cell('Top 3 scoring scholarships → presented to student via Agent 3',{w:CONTENT-3680,bg:LGRAY})]}),
      ]
    }),
    spacer(6),
    note('Hard Gates: bumiputeraOnly = true blocks non-Bumiputera (affects BIA003, BIA004, BIA007).  parentCategoryRequired "B40" blocks M40/T20 students (BIA009).  "B40/M40" blocks T20 students (BIA004).  Any hard gate failure → scholarship excluded from results regardless of academic score.',LRED,RED),
    spacer(10),

    sh('5.  Class Eligibility Estimate & Key Findings',NAVY,24),
    hLine(),
    body('Estimated number of students from Kelas Ibnu Khaldun (n=50) likely to qualify, based on known class statistics.',{before:40,after:80}),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[580,2400,1200,CONTENT-4180],
      rows:[
        new TableRow({children:[hdrCell('ID',NAVY,{w:580,align:AlignmentType.CENTER}),hdrCell('Scholarship',NAVY,{w:2400}),hdrCell('Est. Eligible',NAVY,{w:1200,align:AlignmentType.CENTER}),hdrCell('Key Constraint',NAVY,{w:CONTENT-4180})]}),
        ...([
          ['BIA001','JPA PPN','~2–5','GP=10 + PAJSK≥82% — very high bar; only top performers'],
          ['BIA002','JPA LSPM','~8–12','GP≥9 + PAJSK≥80% — open all races, within-country'],
          ['BIA003','JPA-MARA PKJM','~30–35','GP≥5 only; Bumiputera — low academic bar, broad access'],
          ['BIA004','MARA YTP','~10–15','GP≥8 + B40/M40 + Bumiputera — top world universities'],
          ['BIA005','PETRONAS PESP','~5–8','GP≥9 + PAJSK≥82% — STEM focus, open all races'],
          ['BIA006','Shell Malaysia','~5–10','GP≥9 + PAJSK≥80% — narrow fields, shortest deadline (35 days)'],
          ['BIA007','Khazanah Watan','~20–25','GP≥7 + Bumiputera — no income restriction, broad fields'],
          ['BIA008','TNB Prime','~25–30','GP≥6 + PAJSK≥68% — engineering/IT focus, open all races'],
          ['BIA009','Yayasan Pahang','~27','GP≥3 + B40 only — safety-net; all 27 B40 students likely qualify'],
          ['BIA010','Yayasan UEM','~25–30','GP≥6 + PAJSK≥68% — similar to BIA008, GLC-backed'],
        ]).map(([id,name,est,key],i)=>new TableRow({children:[
          cell(id,{w:580,bold:true,size:16,align:AlignmentType.CENTER,bg:i%2===0?WHITE:LGRAY,color:NAVY}),
          cell(name,{w:2400,size:16,bg:i%2===0?WHITE:LGRAY}),
          cell(est,{w:1200,bold:true,size:17,align:AlignmentType.CENTER,color:GREEN,bg:i%2===0?WHITE:LGRAY}),
          cell(key,{w:CONTENT-4180,size:16,italic:true,bg:i%2===0?WHITE:LGRAY}),
        ]}))
      ]
    }),
    spacer(6),
    note('BIA009 acts as a safety-net — all 27 B40 students qualify. BIA001 is the most prestigious with the smallest eligible pool. Realistic (R) & Investigative (I) students have the broadest match (9/10 scholarships). Artistic (A) students match only 5/10 — database may need expansion for arts/design scholarships.',LGREEN,GREEN),
    spacer(10),
    hLine(NAVY),
    body('End of Report — Scholarship Database Technical Documentation  |  PRESTIJ, DELIMa KPM, SBP Integrasi Kuantan  |  v1.0 June 2026',{color:DGRAY,italic:true,before:100,after:40,size:17}),
  ];
}

// ── ASSEMBLE ──────────────────────────────────────────────────────────
const b6={style:BorderStyle.SINGLE,size:6,color:NAVY,space:1};
const doc=new Document({
  styles:{
    default:{document:{run:{font:'Arial',size:20}}},
  },
  sections:[{
    properties:{page:{size:{width:PAGE_W,height:PAGE_H},margin:{top:MARGIN,right:MARGIN,bottom:MARGIN,left:MARGIN}}},
    headers:{default:new Header({children:[new Paragraph({
      border:{bottom:b6},spacing:{before:0,after:80},
      children:[
        new TextRun({text:'Scholarship Database Technical Documentation  |  PRESTIJ',size:16,color:NAVY,font:'Arial'}),
        new TextRun({text:'\tSBP Integrasi Kuantan  ·  DELIMa KPM',size:16,color:DGRAY,font:'Arial'}),
      ],tabStops:[{type:docx.TabStopType.RIGHT,position:docx.TabStopPosition.MAX}]
    })]})},
    footers:{default:new Footer({children:[new Paragraph({
      border:{top:b6},spacing:{before:60,after:0},
      children:[
        new TextRun({text:'For internal academic and system use only',size:16,color:DGRAY,font:'Arial'}),
        new TextRun({text:'\tPage ',size:16,color:DGRAY,font:'Arial'}),
        new TextRun({children:[PageNumber.CURRENT],size:16,color:NAVY,font:'Arial'}),
        new TextRun({text:' of ',size:16,color:DGRAY,font:'Arial'}),
        new TextRun({children:[PageNumber.TOTAL_PAGES],size:16,color:NAVY,font:'Arial'}),
      ],tabStops:[{type:docx.TabStopType.RIGHT,position:docx.TabStopPosition.MAX}]
    })]})},
    children:[
      ...page1(),
      ...page2(),
      ...page3(),
    ]
  }]
});

Packer.toBuffer(doc).then(buf=>{
  const out='C:/Users/user/Documents/AI Agentic Schollarship Final/ScholarshipDatabase_Compact.docx';
  fs.writeFileSync(out,buf);
  console.log('Done:',out,'| Size:',(buf.length/1024).toFixed(1),'KB');
});
