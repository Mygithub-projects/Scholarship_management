const docx = require('C:/Users/user/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat, Bookmark
} = docx;

const NAVY='0F2057', BLUE='1A56DB', TEAL='0E7490', GREEN='166534',
      PURPLE='5B21B6', AMBER='B45309', RED='9B1C1C', WHITE='FFFFFF',
      LGRAY='F1F5F9', MGRAY='E2E8F0', DGRAY='334155',
      LBLUE='EFF6FF', LGREEN='F0FDF4', LPURP='F5F3FF', LAMBER='FFFBEB', LTEAL='F0FDFA';

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
function body(text,opts={}){
  const{size=21,color=DGRAY,bold=false,italic=false,before=60,after=60,align=AlignmentType.LEFT}=opts;
  return new Paragraph({alignment:align,spacing:{before,after},
    children:[new TextRun({text,size,color,bold,italic,font:'Arial'})]});
}
function callout(text,bg=LBLUE,borderColor=BLUE){
  return new Table({width:{size:CONTENT,type:WidthType.DXA},columnWidths:[CONTENT],
    rows:[new TableRow({children:[new TableCell({
      width:{size:CONTENT,type:WidthType.DXA},shading:{fill:bg,type:ShadingType.CLEAR},
      margins:{top:140,bottom:140,left:200,right:200},
      borders:{top:{style:BorderStyle.SINGLE,size:4,color:borderColor},bottom:{style:BorderStyle.SINGLE,size:4,color:borderColor},
               right:{style:BorderStyle.SINGLE,size:4,color:borderColor},left:{style:BorderStyle.THICK,size:20,color:borderColor}},
      children:[new Paragraph({spacing:{before:0,after:0},
        children:[new TextRun({text,font:'Arial',size:20,color:DGRAY})]})]
    })]})],
  });
}

// ── Bar chart as table ──────────────────────────────────────────────
function barChart(items, maxVal, totalW) {
  // items = [{label, value, color}]
  const LABEL_W = 2800, VAL_W = 600, BAR_W = totalW - LABEL_W - VAL_W;
  return new Table({
    width:{size:totalW,type:WidthType.DXA},
    columnWidths:[LABEL_W, BAR_W, VAL_W],
    rows: items.map((item,i) => {
      const pct = Math.round((item.value / maxVal) * BAR_W);
      const rest = BAR_W - pct;
      const rowBg = i%2===0?WHITE:LGRAY;
      return new TableRow({children:[
        cell(item.label, {w:LABEL_W, size:19, bg:rowBg}),
        // bar cell (split into filled + empty using nested table)
        new TableCell({
          width:{size:BAR_W,type:WidthType.DXA},
          shading:{fill:rowBg,type:ShadingType.CLEAR},
          margins:{top:80,bottom:80,left:60,right:60},
          borders:{top:{style:BorderStyle.SINGLE,size:3,color:MGRAY},bottom:{style:BorderStyle.SINGLE,size:3,color:MGRAY},
                   left:{style:BorderStyle.SINGLE,size:3,color:MGRAY},right:{style:BorderStyle.SINGLE,size:3,color:MGRAY}},
          children:[new Table({
            width:{size:BAR_W-120,type:WidthType.DXA},
            columnWidths:[pct>0?pct:1, rest>0?rest:1],
            rows:[new TableRow({children:[
              new TableCell({
                width:{size:pct>0?pct:1,type:WidthType.DXA},
                shading:{fill:item.color||BLUE,type:ShadingType.CLEAR},
                borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}},
                children:[new Paragraph({spacing:{before:0,after:0},children:[new TextRun({text:' ',size:12})]})]
              }),
              new TableCell({
                width:{size:rest>0?rest:1,type:WidthType.DXA},
                shading:{fill:'E2E8F0',type:ShadingType.CLEAR},
                borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}},
                children:[new Paragraph({spacing:{before:0,after:0},children:[new TextRun({text:' ',size:12})]})]
              }),
            ]})]
          })]
        }),
        cell(`${item.value}`, {w:VAL_W, bold:true, size:19, color:item.color||NAVY, align:AlignmentType.CENTER, bg:rowBg}),
      ]});
    })
  });
}

// ════════════════════════════════════════════════════════════════════
// COVER
// ════════════════════════════════════════════════════════════════════
function cover(){
  return[
    spacer(80),
    new Paragraph({alignment:AlignmentType.CENTER,border:{bottom:{style:BorderStyle.SINGLE,size:8,color:NAVY,space:1}},
      spacing:{before:0,after:200},children:[new TextRun({text:'KEMENTERIAN PENDIDIKAN MALAYSIA',bold:true,size:22,color:NAVY,font:'Arial',allCaps:true})]}),
    new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:80},
      children:[new TextRun({text:'DELIMa Platform  ·  PRESTIJ Programme',size:20,color:BLUE,font:'Arial'})]}),
    spacer(30),
    new Paragraph({alignment:AlignmentType.CENTER,shading:{fill:NAVY,type:ShadingType.CLEAR},spacing:{before:160,after:0},
      children:[new TextRun({text:'STUDENT DATASET',bold:true,size:52,color:WHITE,font:'Arial',allCaps:true})]}),
    new Paragraph({alignment:AlignmentType.CENTER,shading:{fill:BLUE,type:ShadingType.CLEAR},spacing:{before:0,after:0},
      children:[new TextRun({text:'Technical Report',bold:true,size:30,color:WHITE,font:'Arial'})]}),
    new Paragraph({alignment:AlignmentType.CENTER,shading:{fill:TEAL,type:ShadingType.CLEAR},spacing:{before:0,after:200},
      children:[new TextRun({text:'Agentic AI-Powered Scholarship Matching System',size:22,color:WHITE,font:'Arial',italic:true})]}),
    hLine(NAVY), spacer(20),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[CONTENT/2|0,CONTENT-(CONTENT/2|0)],
      rows:[
        new TableRow({children:[cell('School',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('SBP Integrasi Kuantan, Pahang',{size:19})]}),
        new TableRow({children:[cell('Class',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('Kelas Ibnu Khaldun',{size:19})]}),
        new TableRow({children:[cell('Session',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('2025 / 2026',{size:19})]}),
        new TableRow({children:[cell('Total Records',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('50 students (SBP5IK001 – SBP5IK050)',{size:19})]}),
        new TableRow({children:[cell('Data Dimensions',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('5 datasets — Academic, Co-curricular, Psychometric, Income, Scholarship',{size:19})]}),
        new TableRow({children:[cell('Report Version',{w:CONTENT/2|0,bold:true,bg:LGRAY,size:19}),cell('v1.0  (June 2026)',{size:19})]}),
        new TableRow({children:[cell('Security',{w:CONTENT/2|0,bold:true,bg:LAMBER,size:19,color:AMBER}),cell('Student passwords (SULIT) are excluded from this report',{size:19,bg:LAMBER,color:AMBER})]}),
      ]
    }),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ════════════════════════════════════════════════════════════════════
// 1. DATASET OVERVIEW
// ════════════════════════════════════════════════════════════════════
function datasetOverview(){
  return[
    sh1('1.  Dataset Overview','overview'),
    hLine(),
    body('This report provides a technical analysis of the student dataset used in the Agentic AI-Powered Scholarship Matching System. The dataset covers 50 students from Kelas Ibnu Khaldun at SBP Integrasi Kuantan and is compiled from five distinct Excel source files.'),
    spacer(8),
    sh2('1.1  Source Files'),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[400,2600,3000,1200,2546],
      rows:[
        new TableRow({children:[hdrCell('#',NAVY,{w:400,align:AlignmentType.CENTER}),hdrCell('Dataset',NAVY,{w:2600}),hdrCell('File',NAVY,{w:3000}),hdrCell('Records',NAVY,{w:1200,align:AlignmentType.CENTER}),hdrCell('Fields Extracted',NAVY,{w:2546})]}),
        new TableRow({children:[cell('1',{w:400,bold:true,bg:LBLUE,align:AlignmentType.CENTER}),cell('SPM Results',{w:2600,bold:true,bg:LBLUE}),cell('Peperiksaan_SPM_IbnuKhaldun_DUMMY_v4.xlsx',{w:3000,size:17,bg:LBLUE}),cell('50',{w:1200,align:AlignmentType.CENTER,bg:LBLUE}),cell('Student ID, password, gender, 9 SPM grades',{w:2546,bg:LBLUE})]}),
        new TableRow({children:[cell('2',{w:400,bold:true,align:AlignmentType.CENTER}),cell('PAJSK Co-curricular',{w:2600,bold:true}),cell('DATA_PAJSK_5IK_DUMMY_v3.xlsx',{w:3000,size:17}),cell('50',{w:1200,align:AlignmentType.CENTER}),cell('Markah (max 110), activities, pencapaian',{w:2546})]}),
        new TableRow({children:[cell('3',{w:400,bold:true,bg:LBLUE,align:AlignmentType.CENTER}),cell('Psychometric (IMK)',{w:2600,bold:true,bg:LBLUE}),cell('IMK_IbnuKhaldun_DUMMY_v3.xlsx',{w:3000,size:17,bg:LBLUE}),cell('50',{w:1200,align:AlignmentType.CENTER,bg:LBLUE}),cell('RIASEC scores (R, I, A, S, E, K)',{w:2546,bg:LBLUE})]}),
        new TableRow({children:[cell('4',{w:400,bold:true,align:AlignmentType.CENTER}),cell('Family Income',{w:2600,bold:true}),cell('Income_Penjaga_5IK_DUMMY_v1.xlsx',{w:3000,size:17}),cell('50',{w:1200,align:AlignmentType.CENTER}),cell('Per-capita income → B40 / M40 / T20',{w:2546})]}),
        new TableRow({children:[cell('5',{w:400,bold:true,bg:LBLUE,align:AlignmentType.CENTER}),cell('Scholarship Database',{w:2600,bold:true,bg:LBLUE}),cell('Dataset_Biasiswa_PRESTIJ_v3.xlsx',{w:3000,size:17,bg:LBLUE}),cell('10',{w:1200,align:AlignmentType.CENTER,bg:LBLUE}),cell('Scholarship criteria, RIASEC preference, GP threshold',{w:2546,bg:LBLUE})]}),
      ]
    }),
    spacer(8),
    sh2('1.2  Data Schema — StudentProfile Object'),
    body('After processing, each student is represented as a single TypeScript object (StudentProfile) with the following fields:'),
    spacer(6),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[2200,1800,1400,4346],
      rows:[
        new TableRow({children:[hdrCell('Field',NAVY,{w:2200}),hdrCell('Type',NAVY,{w:1800}),hdrCell('Source Dataset',NAVY,{w:1400}),hdrCell('Description',NAVY,{w:4346})]}),
        new TableRow({children:[cell('id',{w:2200,bold:true,bg:LGRAY,italic:true}),cell('string',{w:1800,bg:LGRAY,italic:true}),cell('SPM v4',{w:1400,bg:LGRAY}),cell('Unique student identifier (SBP5IK001–SBP5IK050)',{w:4346,bg:LGRAY})]}),
        new TableRow({children:[cell('name',{w:2200,bold:true,italic:true}),cell('string',{w:1800,italic:true}),cell('SPM v4',{w:1400}),cell('Full name in uppercase',{w:4346})]}),
        new TableRow({children:[cell('gender',{w:2200,bold:true,bg:LGRAY,italic:true}),cell('"L" | "P"',{w:1800,bg:LGRAY,italic:true}),cell('SPM v4',{w:1400,bg:LGRAY}),cell('Lelaki or Perempuan',{w:4346,bg:LGRAY})]}),
        new TableRow({children:[cell('spmGrades',{w:2200,bold:true,italic:true}),cell('Record<string, string>',{w:1800,italic:true}),cell('SPM v4',{w:1400}),cell('Dictionary of 9 subjects → SPM grade (A+ to G)',{w:4346})]}),
        new TableRow({children:[cell('gpScore',{w:2200,bold:true,bg:LGRAY,italic:true}),cell('number',{w:1800,bg:LGRAY,italic:true}),cell('Calculated',{w:1400,bg:LGRAY}),cell('Average grade point across all 9 subjects (0.0–10.0)',{w:4346,bg:LGRAY})]}),
        new TableRow({children:[cell('pajskScore',{w:2200,bold:true,italic:true}),cell('number',{w:1800,italic:true}),cell('PAJSK v3',{w:1400}),cell('Co-curricular percentage: (markah ÷ 110) × 100',{w:4346})]}),
        new TableRow({children:[cell('leadershipLevel',{w:2200,bold:true,bg:LGRAY,italic:true}),cell('"High"|"Medium"|"Basic"',{w:1800,bg:LGRAY,italic:true}),cell('Calculated',{w:1400,bg:LGRAY}),cell('Derived from pajskScore: ≥85%=High, ≥70%=Medium, <70%=Basic',{w:4346,bg:LGRAY})]}),
        new TableRow({children:[cell('riasecType',{w:2200,bold:true,italic:true}),cell('string[]',{w:1800,italic:true}),cell('IMK v3',{w:1400}),cell('Top-3 Holland Code types sorted by score descending',{w:4346})]}),
        new TableRow({children:[cell('fieldOfInterest',{w:2200,bold:true,bg:LGRAY,italic:true}),cell('string',{w:1800,bg:LGRAY,italic:true}),cell('Calculated',{w:1400,bg:LGRAY}),cell('Career field mapped from top RIASEC code',{w:4346,bg:LGRAY})]}),
        new TableRow({children:[cell('dreamCareer',{w:2200,bold:true,italic:true}),cell('string',{w:1800,italic:true}),cell('Calculated',{w:1400}),cell('Career suggestion mapped from top RIASEC code',{w:4346})]}),
        new TableRow({children:[cell('parentCategory',{w:2200,bold:true,bg:LGRAY,italic:true}),cell('"B40"|"M40"|"T20"',{w:1800,bg:LGRAY,italic:true}),cell('Income v1',{w:1400,bg:LGRAY}),cell('Income group based on per-capita monthly income',{w:4346,bg:LGRAY})]}),
        new TableRow({children:[cell('keyAchievements',{w:2200,bold:true,italic:true}),cell('string[]',{w:1800,italic:true}),cell('PAJSK v3',{w:1400}),cell('Notable achievements from co-curricular data',{w:4346})]}),
        new TableRow({children:[cell('pajskData',{w:2200,bold:true,bg:LGRAY,italic:true}),cell('PajskData object',{w:1800,bg:LGRAY,italic:true}),cell('PAJSK v3',{w:1400,bg:LGRAY}),cell('Full PAJSK record: sukan, kelab, badan beruniform, markah, jawatan, peringkat',{w:4346,bg:LGRAY})]}),
      ]
    }),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ════════════════════════════════════════════════════════════════════
// 2. DEMOGRAPHICS
// ════════════════════════════════════════════════════════════════════
function demographics(){
  return[
    sh1('2.  Student Demographics','demographics'),
    hLine(),
    body('The following section presents the demographic composition of the 50 students in the dataset across three dimensions: gender, family income category, and data source.'),
    spacer(8),
    sh2('2.1  Gender Distribution'),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[2400,1400,1400,CONTENT-5200],
      rows:[
        new TableRow({children:[hdrCell('Gender',NAVY,{w:2400}),hdrCell('Count',NAVY,{w:1400,align:AlignmentType.CENTER}),hdrCell('Percentage',NAVY,{w:1400,align:AlignmentType.CENTER}),hdrCell('',NAVY,{w:CONTENT-5200})]}),
        new TableRow({children:[cell('Male (Lelaki)',{w:2400,bold:true}),cell('22',{w:1400,bold:true,align:AlignmentType.CENTER,color:BLUE}),cell('44%',{w:1400,align:AlignmentType.CENTER}),cell('',{w:CONTENT-5200})]}),
        new TableRow({children:[cell('Female (Perempuan)',{w:2400,bold:true,bg:LGRAY}),cell('28',{w:1400,bold:true,align:AlignmentType.CENTER,color:PURPLE,bg:LGRAY}),cell('56%',{w:1400,align:AlignmentType.CENTER,bg:LGRAY}),cell('',{w:CONTENT-5200,bg:LGRAY})]}),
        new TableRow({children:[cell('Total',{w:2400,bold:true,bg:LBLUE}),cell('50',{w:1400,bold:true,align:AlignmentType.CENTER,bg:LBLUE,color:NAVY}),cell('100%',{w:1400,align:AlignmentType.CENTER,bg:LBLUE}),cell('',{w:CONTENT-5200,bg:LBLUE})]}),
      ]
    }),
    spacer(8),
    sh2('2.2  Family Income Category Distribution'),
    body('Students are classified into three national income groups based on their household per-capita monthly income. B40 is the bottom 40%, M40 the middle 40%, and T20 the top 20%.'),
    spacer(6),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[2000,1400,1400,1800,CONTENT-6600],
      rows:[
        new TableRow({children:[hdrCell('Category',NAVY,{w:2000}),hdrCell('Count',NAVY,{w:1400,align:AlignmentType.CENTER}),hdrCell('%',NAVY,{w:1400,align:AlignmentType.CENTER}),hdrCell('Per-Capita Income (RM/month)',NAVY,{w:1800}),hdrCell('Scholarship Priority',NAVY,{w:CONTENT-6600})]}),
        new TableRow({children:[cell('B40 — Bottom 40%',{w:2000,bold:true,color:GREEN}),cell('27',{w:1400,bold:true,align:AlignmentType.CENTER,color:GREEN}),cell('54%',{w:1400,align:AlignmentType.CENTER}),cell('Below RM 1,500',{w:1800}),cell('Highest — eligible for all need-based scholarships',{w:CONTENT-6600})]}),
        new TableRow({children:[cell('M40 — Middle 40%',{w:2000,bold:true,color:AMBER,bg:LGRAY}),cell('13',{w:1400,bold:true,align:AlignmentType.CENTER,color:AMBER,bg:LGRAY}),cell('26%',{w:1400,align:AlignmentType.CENTER,bg:LGRAY}),cell('RM 1,500 – RM 4,999',{w:1800,bg:LGRAY}),cell('Moderate — eligible for most scholarships',{w:CONTENT-6600,bg:LGRAY})]}),
        new TableRow({children:[cell('T20 — Top 20%',{w:2000,bold:true,color:BLUE}),cell('10',{w:1400,bold:true,align:AlignmentType.CENTER,color:BLUE}),cell('20%',{w:1400,align:AlignmentType.CENTER}),cell('RM 5,000 and above',{w:1800}),cell('Merit-based scholarships only',{w:CONTENT-6600})]}),
        new TableRow({children:[cell('Total',{w:2000,bold:true,bg:LBLUE}),cell('50',{w:1400,bold:true,align:AlignmentType.CENTER,bg:LBLUE,color:NAVY}),cell('100%',{w:1400,align:AlignmentType.CENTER,bg:LBLUE}),cell('',{w:1800,bg:LBLUE}),cell('',{w:CONTENT-6600,bg:LBLUE})]}),
      ]
    }),
    spacer(6),
    callout('54% of students (27 out of 50) are from B40 households — the majority. This means the system will prioritise need-based and government-backed scholarships for more than half the class.',LGREEN,GREEN),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ════════════════════════════════════════════════════════════════════
// 3. ACADEMIC PERFORMANCE
// ════════════════════════════════════════════════════════════════════
function academic(){
  return[
    sh1('3.  Academic Performance Analysis','academic'),
    hLine(),
    body('Academic performance is measured by SPM grades across 9 subjects. The system converts each grade to a numerical grade point (A+=10, G=1) and calculates a GP Score per student. This dimension carries the highest weight (35%) in the scholarship matching formula.'),
    spacer(8),
    sh2('3.1  GP Score Distribution'),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[2400,1400,1400,CONTENT-5200],
      rows:[
        new TableRow({children:[hdrCell('Metric',NAVY,{w:2400}),hdrCell('Value',NAVY,{w:1400,align:AlignmentType.CENTER}),hdrCell('',NAVY,{w:1400}),hdrCell('Interpretation',NAVY,{w:CONTENT-5200})]}),
        new TableRow({children:[cell('Class Average GP Score',{w:2400,bold:true}),cell('6.39',{w:1400,bold:true,align:AlignmentType.CENTER,color:BLUE}),cell('',{w:1400}),cell('Equivalent to approximately B+ average across all subjects',{w:CONTENT-5200})]}),
        new TableRow({children:[cell('Highest GP Score',{w:2400,bold:true,bg:LGRAY}),cell('10.00',{w:1400,bold:true,align:AlignmentType.CENTER,color:GREEN,bg:LGRAY}),cell('',{w:1400,bg:LGRAY}),cell('2 students achieved perfect A+ in all 9 subjects',{w:CONTENT-5200,bg:LGRAY})]}),
        new TableRow({children:[cell('Lowest GP Score',{w:2400,bold:true}),cell('3.11',{w:1400,bold:true,align:AlignmentType.CENTER,color:AMBER}),cell('',{w:1400}),cell('Mix of passes and failures — still active in the system',{w:CONTENT-5200})]}),
      ]
    }),
    spacer(6),
    body('GP Score Bands (number of students per range):',{bold:true,before:80}),
    spacer(4),
    barChart([
      {label:'GP 0.0 – 2.0  (Weak)',value:0,color:'94A3B8'},
      {label:'GP 2.1 – 4.0  (Below Average)',value:3,color:RED},
      {label:'GP 4.1 – 6.0  (Average)',value:23,color:AMBER},
      {label:'GP 6.1 – 10.0  (Good to Excellent)',value:24,color:GREEN},
    ], 24, CONTENT),
    spacer(8),
    sh2('3.2  Average GP Score by Subject'),
    body('The table below shows the class average grade point for each of the 9 SPM subjects, ranked from highest to lowest:'),
    spacer(6),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[400,2800,1400,CONTENT-4600],
      rows:[
        new TableRow({children:[hdrCell('#',NAVY,{w:400,align:AlignmentType.CENTER}),hdrCell('Subject',NAVY,{w:2800}),hdrCell('Class Avg GP',NAVY,{w:1400,align:AlignmentType.CENTER}),hdrCell('Observation',NAVY,{w:CONTENT-4600})]}),
        ...[
          ['1','Kimia (Chemistry)','7.04','Strongest subject — highest average, many students scored A/A+'],
          ['2','Fizik (Physics)','6.54','Second strongest — science strand performing well'],
          ['3','Biologi (Biology)','6.48','Consistent with science stream results'],
          ['4','Pendidikan Agama Islam','6.42','Strong performance across the class'],
          ['5','Matematik Tambahan','6.26','Additional Maths — good average despite difficulty'],
          ['6','Bahasa Inggeris','6.24','English — room for improvement compared to science subjects'],
          ['7','Bahasa Melayu','6.22','Malay language — similar pattern to English'],
          ['8','Matematik','6.18','Core Maths — consistent but slightly below science subjects'],
          ['9','Sejarah (History)','6.14','Lowest average — notable variation across students'],
        ].map(([n,s,g,obs],i)=>new TableRow({children:[
          cell(n,{w:400,bold:true,align:AlignmentType.CENTER,bg:i%2===0?WHITE:LGRAY}),
          cell(s,{w:2800,bold:true,bg:i%2===0?WHITE:LGRAY}),
          cell(g,{w:1400,bold:true,align:AlignmentType.CENTER,color:parseFloat(g)>=7?GREEN:parseFloat(g)>=6?BLUE:AMBER,bg:i%2===0?WHITE:LGRAY}),
          cell(obs,{w:CONTENT-4600,size:18,bg:i%2===0?WHITE:LGRAY}),
        ]}))
      ]
    }),
    spacer(8),
    sh2('3.3  Overall Grade Distribution (All 9 Subjects × 50 Students = 450 grades)'),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[800,800,1400,CONTENT-3000],
      rows:[
        new TableRow({children:[hdrCell('Grade',NAVY,{w:800,align:AlignmentType.CENTER}),hdrCell('Count',NAVY,{w:800,align:AlignmentType.CENTER}),hdrCell('% of Total',NAVY,{w:1400,align:AlignmentType.CENTER}),hdrCell('Grade Point',NAVY,{w:CONTENT-3000,align:AlignmentType.CENTER})]}),
        ...([['A+',81,'18.0%','10'],['A',60,'13.3%','9'],['A-',39,'8.7%','8'],['B+',48,'10.7%','7'],['B',46,'10.2%','6'],['C+',50,'11.1%','5'],['C',42,'9.3%','4'],['D',33,'7.3%','3'],['E',34,'7.6%','2'],['G',17,'3.8%','1']]
          .map(([g,c,p,gp],i)=>new TableRow({children:[
            cell(g,{w:800,bold:true,align:AlignmentType.CENTER,bg:['A+','A','A-'].includes(g)?LGREEN:['B+','B'].includes(g)?LBLUE:['C+','C'].includes(g)?LAMBER:['D','E','G'].includes(g)?'FEF2F2':LGRAY}),
            cell(String(c),{w:800,bold:true,align:AlignmentType.CENTER}),
            cell(p,{w:1400,align:AlignmentType.CENTER}),
            cell(gp,{w:CONTENT-3000,bold:true,align:AlignmentType.CENTER,color:['A+','A','A-'].includes(g)?GREEN:['B+','B'].includes(g)?BLUE:AMBER}),
          ]})))
      ]
    }),
    callout('A-grade (A+, A, A-) collectively account for 180 out of 450 grades = 40.0% of all grades. Combined with B-grades (94 grades = 20.9%), over 60% of all grades fall in the B range or above.',LGREEN,GREEN),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ════════════════════════════════════════════════════════════════════
// 4. CO-CURRICULAR (PAJSK)
// ════════════════════════════════════════════════════════════════════
function pajsk(){
  return[
    sh1('4.  Co-Curricular Performance (PAJSK)','pajsk'),
    hLine(),
    body('PAJSK (Penilaian Aktiviti Jasmani, Sukan dan Kokurikulum) measures each student\'s involvement in three co-curricular categories: sports, clubs, and uniformed bodies. The raw markah (max 110) is converted to a percentage and a leadership level. This dimension carries 20% weight in the matching formula.'),
    spacer(8),
    sh2('4.1  PAJSK Score Summary'),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[2600,1600,CONTENT-4200],
      rows:[
        new TableRow({children:[hdrCell('Metric',NAVY,{w:2600}),hdrCell('Value',NAVY,{w:1600,align:AlignmentType.CENTER}),hdrCell('Context',NAVY,{w:CONTENT-4200})]}),
        new TableRow({children:[cell('Class Average PAJSK Score',{w:2600,bold:true}),cell('78.3%',{w:1600,bold:true,align:AlignmentType.CENTER,color:TEAL}),cell('Above the Medium threshold (70%) — strong co-curricular participation',{w:CONTENT-4200})]}),
        new TableRow({children:[cell('Highest PAJSK Score',{w:2600,bold:true,bg:LGRAY}),cell('96.4%',{w:1600,bold:true,align:AlignmentType.CENTER,color:GREEN,bg:LGRAY}),cell('3 students achieved 96.4% — among the highest possible',{w:CONTENT-4200,bg:LGRAY})]}),
        new TableRow({children:[cell('Lowest PAJSK Score',{w:2600,bold:true}),cell('59.1%',{w:1600,bold:true,align:AlignmentType.CENTER,color:AMBER}),cell('Below 70% threshold — classified as Basic leadership level',{w:CONTENT-4200})]}),
        new TableRow({children:[cell('Max Markah (denominator)',{w:2600,bold:true,bg:LGRAY}),cell('110',{w:1600,bold:true,align:AlignmentType.CENTER,bg:LGRAY}),cell('Formula: PAJSK% = (markah ÷ 110) × 100',{w:CONTENT-4200,bg:LGRAY})]}),
      ]
    }),
    spacer(8),
    sh2('4.2  Leadership Level Distribution'),
    body('Leadership level is a derived field calculated from the PAJSK percentage score:'),
    spacer(4),
    barChart([
      {label:'High   (≥ 85%)',value:12,color:GREEN},
      {label:'Medium (70% – 84%)',value:28,color:TEAL},
      {label:'Basic  (< 70%)',value:10,color:AMBER},
    ], 28, CONTENT),
    spacer(6),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[2000,1200,1400,CONTENT-4600],
      rows:[
        new TableRow({children:[hdrCell('Level',NAVY,{w:2000}),hdrCell('Count',NAVY,{w:1200,align:AlignmentType.CENTER}),hdrCell('% of Class',NAVY,{w:1400,align:AlignmentType.CENTER}),hdrCell('Scholarship Impact',NAVY,{w:CONTENT-4600})]}),
        new TableRow({children:[cell('High (≥ 85%)',{w:2000,bold:true,color:GREEN}),cell('12',{w:1200,bold:true,align:AlignmentType.CENTER,color:GREEN}),cell('24%',{w:1400,align:AlignmentType.CENTER}),cell('Meets PAJSK requirement for top scholarships (JPA PPN ≥82%, Khazanah ≥85%)',{w:CONTENT-4600})]}),
        new TableRow({children:[cell('Medium (70% – 84%)',{w:2000,bold:true,color:TEAL,bg:LGRAY}),cell('28',{w:1200,bold:true,align:AlignmentType.CENTER,color:TEAL,bg:LGRAY}),cell('56%',{w:1400,align:AlignmentType.CENTER,bg:LGRAY}),cell('Meets requirement for most scholarships (JPA LSPM ≥80%, Shell ≥75%)',{w:CONTENT-4600,bg:LGRAY})]}),
        new TableRow({children:[cell('Basic (< 70%)',{w:2000,bold:true,color:AMBER}),cell('10',{w:1200,bold:true,align:AlignmentType.CENTER,color:AMBER}),cell('20%',{w:1400,align:AlignmentType.CENTER}),cell('May not meet strict PAJSK thresholds — matched on other dimensions',{w:CONTENT-4600})]}),
      ]
    }),
    callout('80% of students (40 out of 50) have reached at least Medium leadership level. Only 20% are at Basic level — indicating a generally active co-curricular culture in this class.',LTEAL,TEAL),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ════════════════════════════════════════════════════════════════════
// 5. PSYCHOMETRIC PROFILE (RIASEC)
// ════════════════════════════════════════════════════════════════════
function psychometric(){
  return[
    sh1('5.  Psychometric Profile (RIASEC / IMK)','riasec'),
    hLine(),
    body('Each student\'s career interest profile is determined by the Inventori Minat Kerjaya (IMK), which produces scores across six RIASEC dimensions. The top three codes form the student\'s Holland Code. The primary (top-1) code determines the student\'s field of interest and dream career. This dimension carries 15% weight in the matching formula.'),
    spacer(8),
    sh2('5.1  Distribution of Primary RIASEC Type (Top-1 Code)'),
    body('The chart below shows how many students have each RIASEC type as their dominant (highest-scoring) dimension:'),
    spacer(4),
    barChart([
      {label:'Realistic (R)     — Engineering / Technical',value:13,color:BLUE},
      {label:'Enterprising (E)  — Business / Leadership',value:11,color:RED},
      {label:'Artistic (A)      — Design / Creative',value:9,color:PURPLE},
      {label:'Social (S)        — Education / Social Work',value:8,color:AMBER},
      {label:'Conventional (K)  — Accounting / Finance',value:6,color:TEAL},
      {label:'Investigative (I) — Science / Research',value:3,color:GREEN},
    ], 13, CONTENT),
    spacer(8),
    sh2('5.2  Field of Interest Distribution'),
    body('The primary RIASEC code maps to a field of interest. The table shows how students are distributed across the six available fields:'),
    spacer(6),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[2800,1400,1600,CONTENT-5800],
      rows:[
        new TableRow({children:[hdrCell('Field of Interest',NAVY,{w:2800}),hdrCell('Count',NAVY,{w:1400,align:AlignmentType.CENTER}),hdrCell('% of Class',NAVY,{w:1600,align:AlignmentType.CENTER}),hdrCell('RIASEC Code',NAVY,{w:CONTENT-5800})]}),
        new TableRow({children:[cell('Kejuruteraan & Teknologi',{w:2800,bold:true}),cell('13',{w:1400,bold:true,align:AlignmentType.CENTER,color:BLUE}),cell('26%',{w:1600,align:AlignmentType.CENTER}),cell('Realistic (R)',{w:CONTENT-5800})]}),
        new TableRow({children:[cell('Perniagaan & Pengurusan',{w:2800,bold:true,bg:LGRAY}),cell('11',{w:1400,bold:true,align:AlignmentType.CENTER,color:RED,bg:LGRAY}),cell('22%',{w:1600,align:AlignmentType.CENTER,bg:LGRAY}),cell('Enterprising (E)',{w:CONTENT-5800,bg:LGRAY})]}),
        new TableRow({children:[cell('Seni & Komunikasi',{w:2800,bold:true}),cell('9',{w:1400,bold:true,align:AlignmentType.CENTER,color:PURPLE}),cell('18%',{w:1600,align:AlignmentType.CENTER}),cell('Artistic (A)',{w:CONTENT-5800})]}),
        new TableRow({children:[cell('Pendidikan & Perkhidmatan Sosial',{w:2800,bold:true,bg:LGRAY}),cell('8',{w:1400,bold:true,align:AlignmentType.CENTER,color:AMBER,bg:LGRAY}),cell('16%',{w:1600,align:AlignmentType.CENTER,bg:LGRAY}),cell('Social (S)',{w:CONTENT-5800,bg:LGRAY})]}),
        new TableRow({children:[cell('Perakaunan & Kewangan',{w:2800,bold:true}),cell('6',{w:1400,bold:true,align:AlignmentType.CENTER,color:TEAL}),cell('12%',{w:1600,align:AlignmentType.CENTER}),cell('Conventional (K)',{w:CONTENT-5800})]}),
        new TableRow({children:[cell('Sains & Perubatan',{w:2800,bold:true,bg:LGRAY}),cell('3',{w:1400,bold:true,align:AlignmentType.CENTER,color:GREEN,bg:LGRAY}),cell('6%',{w:1600,align:AlignmentType.CENTER,bg:LGRAY}),cell('Investigative (I)',{w:CONTENT-5800,bg:LGRAY})]}),
        new TableRow({children:[cell('Total',{w:2800,bold:true,bg:LBLUE}),cell('50',{w:1400,bold:true,align:AlignmentType.CENTER,bg:LBLUE,color:NAVY}),cell('100%',{w:1600,align:AlignmentType.CENTER,bg:LBLUE}),cell('',{w:CONTENT-5800,bg:LBLUE})]}),
      ]
    }),
    spacer(6),
    callout('Realistic (R) is the most common primary type at 26%, aligning with the class\'s strong science performance (Kimia and Fizik as top subjects). Only 3 students (6%) have Investigative (I) as their top type — suggesting interest in research/medicine is less common despite strong science grades.',LPURP,PURPLE),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ════════════════════════════════════════════════════════════════════
// 6. SYSTEM MATCHING READINESS
// ════════════════════════════════════════════════════════════════════
function matchingReadiness(){
  return[
    sh1('6.  System Matching Readiness','matching'),
    hLine(),
    body('This section assesses how well the student dataset is positioned for scholarship matching across all five dimensions used by Agent 2 (Scholarship Matching Agent).'),
    spacer(8),
    sh2('6.1  Five-Dimension Match Readiness Overview'),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[500,2600,1200,1200,CONTENT-5500],
      rows:[
        new TableRow({children:[hdrCell('#',NAVY,{w:500,align:AlignmentType.CENTER}),hdrCell('Dimension',NAVY,{w:2600}),hdrCell('Weight',NAVY,{w:1200,align:AlignmentType.CENTER}),hdrCell('Class Readiness',NAVY,{w:1200,align:AlignmentType.CENTER}),hdrCell('Notes',NAVY,{w:CONTENT-5500})]}),
        new TableRow({children:[cell('1',{w:500,bold:true,align:AlignmentType.CENTER,bg:LGREEN}),cell('Academic Performance (SPM)',{w:2600,bold:true,bg:LGREEN}),cell('35%',{w:1200,bold:true,align:AlignmentType.CENTER,bg:LGREEN,color:NAVY}),cell('Strong',{w:1200,bold:true,align:AlignmentType.CENTER,bg:LGREEN,color:GREEN}),cell('Avg GP 6.39; 24 students above GP 6.0 — well-positioned for most scholarships',{w:CONTENT-5500,bg:LGREEN})]}),
        new TableRow({children:[cell('2',{w:500,bold:true,align:AlignmentType.CENTER}),cell('PAJSK Co-curricular',{w:2600,bold:true}),cell('20%',{w:1200,bold:true,align:AlignmentType.CENTER,color:NAVY}),cell('Good',{w:1200,bold:true,align:AlignmentType.CENTER,color:TEAL}),cell('Avg 78.3%; 80% at Medium/High — 40 students meet PAJSK thresholds',{w:CONTENT-5500})]}),
        new TableRow({children:[cell('3',{w:500,bold:true,align:AlignmentType.CENTER,bg:LPURP}),cell('Psychometric — RIASEC',{w:2600,bold:true,bg:LPURP}),cell('15%',{w:1200,bold:true,align:AlignmentType.CENTER,bg:LPURP,color:NAVY}),cell('Good',{w:1200,bold:true,align:AlignmentType.CENTER,bg:LPURP,color:PURPLE}),cell('All 6 RIASEC types represented; Realistic & Enterprising dominant (47% of students)',{w:CONTENT-5500,bg:LPURP})]}),
        new TableRow({children:[cell('4',{w:500,bold:true,align:AlignmentType.CENTER}),cell('Career Aspiration',{w:2600,bold:true}),cell('15%',{w:1200,bold:true,align:AlignmentType.CENTER,color:NAVY}),cell('Covered',{w:1200,bold:true,align:AlignmentType.CENTER,color:BLUE}),cell('All 50 students have fieldOfInterest and dreamCareer derived from RIASEC top code',{w:CONTENT-5500})]}),
        new TableRow({children:[cell('5',{w:500,bold:true,align:AlignmentType.CENTER,bg:LGREEN}),cell('Parent / Family Background',{w:2600,bold:true,bg:LGREEN}),cell('15%',{w:1200,bold:true,align:AlignmentType.CENTER,bg:LGREEN,color:NAVY}),cell('Complete',{w:1200,bold:true,align:AlignmentType.CENTER,bg:LGREEN,color:GREEN}),cell('All 50 students have parentCategory (54% B40, 26% M40, 20% T20)',{w:CONTENT-5500,bg:LGREEN})]}),
      ]
    }),
    spacer(8),
    sh2('6.2  Data Completeness'),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[3000,1600,1600,CONTENT-6200],
      rows:[
        new TableRow({children:[hdrCell('Field',NAVY,{w:3000}),hdrCell('Records Present',NAVY,{w:1600,align:AlignmentType.CENTER}),hdrCell('Completeness',NAVY,{w:1600,align:AlignmentType.CENTER}),hdrCell('Status',NAVY,{w:CONTENT-6200})]}),
        new TableRow({children:[cell('Student ID (id)',{w:3000,bold:true,bg:LGRAY}),cell('50 / 50',{w:1600,align:AlignmentType.CENTER,bg:LGRAY}),cell('100%',{w:1600,bold:true,align:AlignmentType.CENTER,color:GREEN,bg:LGRAY}),cell('Complete',{w:CONTENT-6200,color:GREEN,bold:true,bg:LGRAY})]}),
        new TableRow({children:[cell('SPM Grades (9 subjects)',{w:3000,bold:true}),cell('50 / 50',{w:1600,align:AlignmentType.CENTER}),cell('100%',{w:1600,bold:true,align:AlignmentType.CENTER,color:GREEN}),cell('Complete',{w:CONTENT-6200,color:GREEN,bold:true})]}),
        new TableRow({children:[cell('PAJSK Score & Level',{w:3000,bold:true,bg:LGRAY}),cell('50 / 50',{w:1600,align:AlignmentType.CENTER,bg:LGRAY}),cell('100%',{w:1600,bold:true,align:AlignmentType.CENTER,color:GREEN,bg:LGRAY}),cell('Complete',{w:CONTENT-6200,color:GREEN,bold:true,bg:LGRAY})]}),
        new TableRow({children:[cell('RIASEC Holland Code (top-3)',{w:3000,bold:true}),cell('50 / 50',{w:1600,align:AlignmentType.CENTER}),cell('100%',{w:1600,bold:true,align:AlignmentType.CENTER,color:GREEN}),cell('Complete',{w:CONTENT-6200,color:GREEN,bold:true})]}),
        new TableRow({children:[cell('Family Income Category',{w:3000,bold:true,bg:LGRAY}),cell('50 / 50',{w:1600,align:AlignmentType.CENTER,bg:LGRAY}),cell('100%',{w:1600,bold:true,align:AlignmentType.CENTER,color:GREEN,bg:LGRAY}),cell('Complete',{w:CONTENT-6200,color:GREEN,bold:true,bg:LGRAY})]}),
        new TableRow({children:[cell('Key Achievements (PAJSK)',{w:3000,bold:true}),cell('50 / 50',{w:1600,align:AlignmentType.CENTER}),cell('100%',{w:1600,bold:true,align:AlignmentType.CENTER,color:GREEN}),cell('Complete — minimum 2 achievements per student',{w:CONTENT-6200,color:GREEN,bold:true})]}),
      ]
    }),
    spacer(6),
    callout('All 50 student records are complete across all required fields. There are no missing values or null entries in any dimension used by the matching pipeline. The dataset is ready for full pipeline execution.',LGREEN,GREEN),
    new Paragraph({children:[new PageBreak()]}),
  ];
}

// ════════════════════════════════════════════════════════════════════
// 7. SUMMARY
// ════════════════════════════════════════════════════════════════════
function summary(){
  return[
    sh1('7.  Summary & Key Findings','summary'),
    hLine(),
    new Table({
      width:{size:CONTENT,type:WidthType.DXA},columnWidths:[600,3200,CONTENT-3800],
      rows:[
        new TableRow({children:[hdrCell('#',NAVY,{w:600,align:AlignmentType.CENTER}),hdrCell('Finding',NAVY,{w:3200}),hdrCell('Implication for the System',NAVY,{w:CONTENT-3800})]}),
        ...([
          ['1','54% of students are B40','More than half the class qualifies for need-based and government-funded scholarships (JPA, MARA, Yayasan Pahang)'],
          ['2','Class average GP is 6.39 (≈B+)','Majority of students meet the GP threshold for mid-tier scholarships; ~48% meet the threshold for top scholarships (GP ≥7.0)'],
          ['3','80% of students are at Medium or High PAJSK level','Strong co-curricular participation — most students will receive meaningful PAJSK scores in the matching formula'],
          ['4','Realistic (R) is the dominant RIASEC type (26%)','Strong alignment with Engineering and Technology scholarships (PETRONAS, TNB, Shell) that prefer R/I types'],
          ['5','Investigative (I) is the least common type (6%)','Only 3 students lean towards Science/Research/Medicine — may limit competition for some top medical scholarships'],
          ['6','Kimia (GP 7.04) is the strongest subject','Science strand is competitive — students have a strong base for STEM-focused scholarships'],
          ['7','All 50 records are 100% complete','No data gaps — Agent 1 can build a complete consolidated profile for every student without fallback logic'],
          ['8','All 6 RIASEC types are represented','The system will produce diverse scholarship recommendations across all field categories'],
        ]).map(([n,f,imp],i)=>new TableRow({children:[
          cell(n,{w:600,bold:true,align:AlignmentType.CENTER,bg:i%2===0?WHITE:LGRAY}),
          cell(f,{w:3200,bold:true,bg:i%2===0?WHITE:LGRAY}),
          cell(imp,{w:CONTENT-3800,size:19,bg:i%2===0?WHITE:LGRAY}),
        ]}))
      ]
    }),
    spacer(10),
    hLine(NAVY),
    body('End of Report — Student Dataset Technical Report  |  Kelas Ibnu Khaldun, SBP Integrasi Kuantan',{color:DGRAY,italic:true,align:AlignmentType.CENTER,before:120,after:60,size:19}),
  ];
}

// ════════════════════════════════════════════════════════════════════
// ASSEMBLE
// ════════════════════════════════════════════════════════════════════
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
        new TextRun({text:'Student Dataset Technical Report  |  Kelas Ibnu Khaldun',size:17,color:NAVY,font:'Arial'}),
        new TextRun({text:'\tSBP Integrasi Kuantan  ·  PRESTIJ Programme',size:17,color:DGRAY,font:'Arial'}),
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
      ...datasetOverview(),
      ...demographics(),
      ...academic(),
      ...pajsk(),
      ...psychometric(),
      ...matchingReadiness(),
      ...summary(),
    ]
  }]
});

Packer.toBuffer(doc).then(buf=>{
  const out='C:/Users/user/Documents/AI Agentic Schollarship Final/StudentDataset_TechnicalReport.docx';
  fs.writeFileSync(out,buf);
  console.log('Done:',out,'| Size:',(buf.length/1024).toFixed(1),'KB');
});
