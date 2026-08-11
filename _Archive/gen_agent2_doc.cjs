const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, LevelFormat,
  BorderStyle, WidthType, ShadingType, PageNumber,
  TabStopType, TabStopPosition, VerticalAlign, PageBreak,
} = require('./node_modules/docx');
const fs = require('fs');

const NAVY='0F2057',BLUE='1A56DB',GREEN='059669',PURPLE='7C3AED';
const AMBER='B45309',RED='DC2626',DGRAY='374151',MGRAY='D1D5DB';
const WHITE='FFFFFF',BLACK='000000';
const BG_NAVY='EEF2FF',BG_GRN='ECFDF5',BG_BLU='EFF6FF',BG_PRP='FDF4FF';
const BG_AMB='FFF7ED',BG_RED='FEF2F2';

const b1=(c)=>({style:BorderStyle.SINGLE,size:4,color:c});
const allB=(c)=>({top:b1(c),bottom:b1(c),left:b1(c),right:b1(c)});

const sp  =()=>new Paragraph({children:[],spacing:{before:0,after:100}});
const sp2 =()=>new Paragraph({children:[],spacing:{before:0,after:220}});
const pb  =()=>new Paragraph({children:[new PageBreak()]});

const TNR=(t,o={})=>new TextRun({text:t,font:'Times New Roman',size:o.size||24,bold:o.bold||false,italics:o.italics||false,color:o.color||BLACK,...o});

const P=(t,o={})=>new Paragraph({
  children:[TNR(t,o)],
  alignment:o.align||AlignmentType.JUSTIFIED,
  spacing:{before:0,after:o.after||160,line:280},
  indent:o.indent?{firstLine:720}:{},
});

const H1=(t)=>new Paragraph({heading:HeadingLevel.HEADING_1,children:[TNR(t,{size:28,bold:true,color:NAVY})],spacing:{before:360,after:180}});
const H2=(t)=>new Paragraph({heading:HeadingLevel.HEADING_2,children:[TNR(t,{size:24,bold:true,color:NAVY})],spacing:{before:240,after:120}});

const caption=(t)=>new Paragraph({alignment:AlignmentType.CENTER,children:[TNR(t,{size:20,italics:true,color:DGRAY})],spacing:{before:80,after:200}});

const hCell=(t,w,bg,tc=WHITE,sz=20)=>new TableCell({
  borders:allB(BLACK),shading:{fill:bg,type:ShadingType.CLEAR},
  margins:{top:100,bottom:100,left:140,right:140},
  width:{size:w,type:WidthType.DXA},verticalAlign:VerticalAlign.CENTER,
  children:[new Paragraph({alignment:AlignmentType.CENTER,children:[TNR(t,{bold:true,size:sz,color:tc})]})],
});

const bCell=(t,w,bg=WHITE,color=BLACK,center=false,sz=20)=>new TableCell({
  borders:allB(MGRAY),shading:{fill:bg,type:ShadingType.CLEAR},
  margins:{top:80,bottom:80,left:140,right:140},
  width:{size:w,type:WidthType.DXA},verticalAlign:VerticalAlign.CENTER,
  children:[new Paragraph({alignment:center?AlignmentType.CENTER:AlignmentType.LEFT,children:[TNR(t,{size:sz,color})]})],
});

const mpCell=(lines,w,bg=WHITE)=>new TableCell({
  borders:allB(MGRAY),shading:{fill:bg,type:ShadingType.CLEAR},
  margins:{top:80,bottom:80,left:140,right:140},
  width:{size:w,type:WidthType.DXA},verticalAlign:VerticalAlign.TOP,
  children:lines.map(([t,c,bold,sz])=>new Paragraph({spacing:{before:0,after:50},children:[TNR(t,{size:sz||20,color:c||DGRAY,bold:bold||false})]})),
});

const calloutBox=(headerBg,headerText,bodyLines)=>new Table({
  width:{size:9360,type:WidthType.DXA},columnWidths:[9360],
  rows:[
    new TableRow({children:[new TableCell({
      borders:allB(headerBg),shading:{fill:headerBg,type:ShadingType.CLEAR},
      margins:{top:80,bottom:80,left:160,right:160},width:{size:9360,type:WidthType.DXA},
      children:[new Paragraph({alignment:AlignmentType.CENTER,children:[TNR(headerText,{bold:true,size:22,color:WHITE})]})],
    })]}),
    new TableRow({children:[new TableCell({
      borders:{top:{style:BorderStyle.NONE},bottom:b1(headerBg),left:b1(headerBg),right:b1(headerBg)},
      shading:{fill:'F8FAFF',type:ShadingType.CLEAR},
      margins:{top:80,bottom:100,left:200,right:200},width:{size:9360,type:WidthType.DXA},
      children:bodyLines.map(([t,c,bold])=>new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:60},
        children:[TNR(t,{size:20,color:c||DGRAY,bold:bold||false})]})),
    })]}),
  ],
});

/* ════════════════════════════════
   PIPELINE POSITION DIAGRAM
════════════════════════════════ */
const pipelineDiagram=()=>new Table({
  width:{size:9360,type:WidthType.DXA},columnWidths:[2600,320,2600,320,2600],
  rows:[
    new TableRow({children:[
      new TableCell({borders:allB(GREEN),shading:{fill:BG_GRN,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:120,right:120},width:{size:2600,type:WidthType.DXA},
        children:[
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:40},children:[TNR('Agent 1',{bold:true,size:20,color:GREEN})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:40},children:[TNR('Student Profiling',{size:18,color:DGRAY})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[TNR('output.json',{size:17,color:GREEN,bold:true})]}),
        ]}),
      new TableCell({borders:allB(WHITE),shading:{fill:WHITE,type:ShadingType.CLEAR},margins:{top:0,bottom:0,left:0,right:0},width:{size:320,type:WidthType.DXA},verticalAlign:VerticalAlign.CENTER,
        children:[new Paragraph({alignment:AlignmentType.CENTER,children:[TNR('->',{size:22,bold:true,color:MGRAY})]})]}),
      new TableCell({borders:allB(BLUE),shading:{fill:BG_BLU,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:120,right:120},width:{size:2600,type:WidthType.DXA},
        children:[
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:40},children:[TNR('Agent 2  (THIS)',{bold:true,size:20,color:BLUE})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:40},children:[TNR('Scholarship Matching',{size:18,color:DGRAY})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[TNR('matches.json',{size:17,color:BLUE,bold:true})]}),
        ]}),
      new TableCell({borders:allB(WHITE),shading:{fill:WHITE,type:ShadingType.CLEAR},margins:{top:0,bottom:0,left:0,right:0},width:{size:320,type:WidthType.DXA},verticalAlign:VerticalAlign.CENTER,
        children:[new Paragraph({alignment:AlignmentType.CENTER,children:[TNR('->',{size:22,bold:true,color:MGRAY})]})]}),
      new TableCell({borders:allB(PURPLE),shading:{fill:BG_PRP,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:120,right:120},width:{size:2600,type:WidthType.DXA},
        children:[
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:40},children:[TNR('Agent 3',{bold:true,size:20,color:PURPLE})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:40},children:[TNR('Report Generation',{size:18,color:DGRAY})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[TNR('report.json',{size:17,color:PURPLE,bold:true})]}),
        ]}),
    ]}),
  ],
});

/* ════════════════════════════════
   OPTIMISATION DIAGRAM
════════════════════════════════ */
const optDiagram=()=>new Table({
  width:{size:9360,type:WidthType.DXA},columnWidths:[4560,240,4560],
  rows:[
    new TableRow({children:[
      new TableCell({borders:allB(RED),shading:{fill:BG_RED,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:140,right:140},width:{size:4560,type:WidthType.DXA},
        children:[
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:60},children:[TNR('BEFORE  (Naive)',{bold:true,size:20,color:RED})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:40},children:[TNR('1 API call per student-scholarship pair',{size:18,color:DGRAY})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:40},children:[TNR('50 students x 10 scholarships',{size:18,color:DGRAY})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:60},children:[TNR('= 500 API calls',{bold:true,size:22,color:RED})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[TNR('~20 minutes',{size:18,italics:true,color:'991B1B'})]}),
        ]}),
      new TableCell({borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}},shading:{fill:WHITE,type:ShadingType.CLEAR},width:{size:240,type:WidthType.DXA},verticalAlign:VerticalAlign.CENTER,
        children:[new Paragraph({alignment:AlignmentType.CENTER,children:[TNR('->',{bold:true,size:24,color:NAVY})]})]}),
      new TableCell({borders:allB(GREEN),shading:{fill:BG_GRN,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:140,right:140},width:{size:4560,type:WidthType.DXA},
        children:[
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:60},children:[TNR('AFTER  (Batch)',{bold:true,size:20,color:GREEN})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:40},children:[TNR('1 API call per scholarship',{size:18,color:DGRAY})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:40},children:[TNR('All 50 students scored in one call',{size:18,color:DGRAY})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:60},children:[TNR('= 10 API calls only',{bold:true,size:22,color:GREEN})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[TNR('~1-2 minutes  (50x faster)',{size:18,italics:true,color:'065F46'})]}),
        ]}),
    ]}),
  ],
});

/* ════════════════════════════════
   BUILD DOCUMENT
════════════════════════════════ */
const ch=[];

/* ── COVER ── */
ch.push(
  new Paragraph({spacing:{before:560,after:0},children:[]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:60},children:[TNR('PRESTIJ',{size:56,bold:true,color:NAVY})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:80},children:[TNR('Agentic AI-Powered Scholarship Matching System',{size:26,bold:true,color:BLUE})]}),
  new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:8,color:NAVY}},children:[],spacing:{before:100,after:300}}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:60},children:[TNR('AGENT 2  —  SCHOLARSHIP MATCHING',{size:30,bold:true,color:NAVY})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:400},children:[TNR('Technical Documentation',{size:22,italics:true,color:DGRAY})]}),
  ...([
    ['Institution','SBP Integrasi Kuantan — Kelas Ibnu Khaldun'],
    ['Cohort',     '50 Form Five Students  (SBP5IK001 – SBP5IK050)'],
    ['Language',   'Python 3.12  +  Groq API  (llama-3.3-70b-versatile)'],
    ['Web UI',     'Flask 3.1  —  DELIMa-styled  —  localhost:5000'],
    ['Output',     'matches.json  —  500 match records  (50 x 10 scholarships)'],
    ['Date',       'June 2025'],
  ].map(([k,v])=>new Paragraph({
    alignment:AlignmentType.CENTER,spacing:{before:0,after:60},
    children:[TNR(k+': ',{bold:true,size:22,color:NAVY}),TNR(v,{size:22,color:DGRAY})],
  }))),
  pb(),
);

/* ── PAGE 2: OVERVIEW + PIPELINE POSITION ── */
ch.push(
  H1('1.  Overview'),
  P('Agent 2 is the second component of the PRESTIJ three-agent pipeline. It receives the 50 student profiles produced by Agent 1 (output.json), evaluates each student against 10 scholarships from the Biasiswa database, and generates a ranked list of scholarship matches using a five-factor weighted scoring model. The aspiration factor — the only qualitative dimension — is evaluated using the Groq API (llama-3.3-70b-versatile), a free large language model service.', {indent:true}),
  P('The key architectural innovation in Agent 2 is its batch processing strategy: instead of making one API call per student-scholarship pair (which would require 500 calls and approximately 20 minutes), Agent 2 groups all 50 students into a single prompt per scholarship, reducing the total API calls to 10 and completing the full matching process in approximately 1–2 minutes.', {indent:true}),
  sp(),
  H2('1.1  Position in the PRESTIJ Pipeline'),
  sp(),
  pipelineDiagram(),
  caption('Figure 1: Agent 2 in the PRESTIJ Three-Agent Pipeline'),
  sp(),

  H2('1.2  Key Facts'),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[3200,6160],
    rows:[
      new TableRow({children:[hCell('Property',3200,NAVY),hCell('Detail',6160,NAVY)]}),
      ...([
        ['File',           'Agent2/agent2.py'],
        ['Web UI',         'Agent2/app.py  (Flask)  —  localhost:5000'],
        ['Input',          'Agent1/output.json  (50 student profiles from Agent 1)'],
        ['Scholarship DB', 'Data/Biasiswa/Dataset_Biasiswa_PRESTIJ_v5.xlsx  (10 scholarships)'],
        ['LLM Provider',   'Groq API — free tier  (llama-3.3-70b-versatile)'],
        ['API Calls',      '10 batch calls (1 per scholarship, scores all 50 students at once)'],
        ['Output',         'Agent2/matches.json  (500 match records, top-5 per student)'],
        ['Runtime',        '~1-2 minutes (optimised batch mode)'],
      ]).map(([k,v],i)=>new TableRow({children:[
        bCell(k,3200,i%2===0?WHITE:'F9FAFB',NAVY),
        bCell(v,6160,i%2===0?WHITE:'F9FAFB'),
      ]})),
    ],
  }),
  caption('Table 1: Agent 2 Key Properties'),
  pb(),
);

/* ── PAGE 3: TECHNOLOGY STACK ── */
ch.push(
  H1('2.  Technology Stack'),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[2000,2000,5360],
    rows:[
      new TableRow({children:[hCell('Technology',2000,NAVY),hCell('Version',2000,NAVY),hCell('Purpose in Agent 2',5360,NAVY)]}),
      ...([
        ['Python',         '3.12',   'Core programming language for all Agent 2 logic'],
        ['groq',           '1.5.0',  'Official Groq Python SDK — connects to LLM for aspiration scoring'],
        ['openpyxl',       '3.1+',   'Reads Biasiswa_v5.xlsx Excel file into Python data structures'],
        ['Flask',          '3.1.3',  'Lightweight web framework — serves the DELIMa-styled Web UI'],
        ['json (stdlib)',  'built-in','Reads output.json (Agent 1), writes matches.json (output)'],
        ['threading (stdlib)','built-in','Runs Agent 2 matching in background while UI stays responsive'],
        ['Groq LLM Model', 'llama-3.3-70b-versatile','Scores student aspiration vs scholarship fields semantically'],
      ]).map(([t,v,p],i)=>new TableRow({children:[
        bCell(t,2000,i%2===0?WHITE:'F9FAFB',NAVY,false,19),
        bCell(v,2000,i%2===0?WHITE:'F9FAFB','6B7280',true,19),
        bCell(p,5360,i%2===0?WHITE:'F9FAFB',DGRAY,false,19),
      ]})),
    ],
  }),
  caption('Table 2: Agent 2 Technology Stack'),
  sp(),

  H2('2.1  Why Groq Instead of Other LLM Providers'),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[2400,2200,2200,2560],
    rows:[
      new TableRow({children:[hCell('Provider',2400,NAVY),hCell('Cost',2200,NAVY),hCell('Speed',2200,NAVY),hCell('Used In PRESTIJ',2560,NAVY)]}),
      new TableRow({children:[bCell('Groq (llama-3.3-70b)',2400,BG_GRN,GREEN),bCell('Free tier',2200,'D1FAE5','065F46',true),bCell('Very fast (~0.3s/call)',2200,'D1FAE5','065F46',true),bCell('Agent 2 + Agent 3',2560)]}),
      new TableRow({children:[bCell('Anthropic Claude',2400),bCell('Paid',2200),bCell('~1s/call',2200),bCell('Original design (optional)',2560)]}),
      new TableRow({children:[bCell('OpenAI GPT-4',2400),bCell('Paid',2200),bCell('~1s/call',2200),bCell('Not used',2560)]}),
    ],
  }),
  caption('Table 3: LLM Provider Comparison'),
  pb(),
);

/* ── PAGE 4: BATCH OPTIMISATION ── */
ch.push(
  H1('3.  Batch Optimisation Strategy'),
  P('The most critical design decision in Agent 2 is the batch aspiration scoring strategy. This directly determines whether the system is practical for institutional use or not.', {indent:true}),
  sp(),
  H2('3.1  The Problem — Naive Approach'),
  P('A straightforward implementation would make one LLM API call per student-scholarship pair to evaluate whether the student\'s aspirations match the scholarship\'s field requirements. With 50 students and 10 scholarships, this produces 500 API calls. At an average of 2-3 seconds per call (including network latency), this would take approximately 20 minutes — unacceptable for a real-time interactive system.', {indent:true}),
  sp(),
  H2('3.2  The Solution — Batch Per Scholarship'),
  P('Agent 2 restructures the API calls by inverting the loop: instead of one call per pair, it makes one call per scholarship, with all 50 students included in a single prompt. The LLM returns a JSON array of 50 scores in one response. This reduces the total API calls from 500 to 10 — a 50x reduction in API usage and execution time.', {indent:true}),
  sp(),
  optDiagram(),
  caption('Figure 2: Batch Optimisation — 500 API Calls Reduced to 10'),
  sp(),

  H2('3.3  Batch Prompt Structure'),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[9360],
    rows:[
      new TableRow({children:[new TableCell({
        borders:allB(NAVY),shading:{fill:'0F172A',type:ShadingType.CLEAR},
        margins:{top:120,bottom:120,left:200,right:200},width:{size:9360,type:WidthType.DXA},
        children:[
          new Paragraph({spacing:{before:0,after:60},children:[TNR('You are a scholarship matching assistant.',{size:19,color:'94A3B8'})]}),
          new Paragraph({spacing:{before:0,after:60},children:[TNR('Scholarship fields: Kejuruteraan / Geosains / Data Science',{size:19,color:'93C5FD'})]}),
          new Paragraph({spacing:{before:0,after:60},children:[TNR('Score each student\'s aspiration match (0-100).',{size:19,color:'94A3B8'})]}),
          new Paragraph({spacing:{before:0,after:60},children:[TNR('Students: [{id:"SBP5IK001", interest:"Sains & Teknologi", career:"Jurutera"},...]',{size:19,color:'FCD34D'})]}),
          new Paragraph({spacing:{before:0,after:0},children:[TNR('Return ONLY JSON: [{"id":"SBP5IK001","score":85},{"id":"SBP5IK002","score":40},...]',{size:19,color:'6EE7B7'})]}),
        ],
      })]}),
    ],
  }),
  caption('Figure 3: Batch Prompt Template (1 call returns 50 scores)'),
  pb(),
);

/* ── PAGE 5-6: 5-FACTOR MODEL ── */
ch.push(
  H1('4.  Five-Factor Matching Model'),
  P('Agent 2 computes a match score M for each student-scholarship pair using a weighted formula across five factors. Four factors are computed deterministically using rule-based logic (no API calls required). Only the aspiration factor invokes the Groq LLM.', {indent:true}),
  sp(),
  new Paragraph({
    alignment:AlignmentType.CENTER,spacing:{before:100,after:200},
    children:[TNR('M  =  (Academic x 0.35)  +  (PAJSK x 0.20)  +  (Psychometric x 0.15)  +  (Aspiration x 0.15)  +  (Income x 0.15)',{size:21,italics:true,color:NAVY})],
  }),

  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[500,2400,900,5560],
    rows:[
      new TableRow({children:[hCell('#',500,NAVY),hCell('Factor',2400,NAVY),hCell('Weight',900,NAVY),hCell('Computation Logic',5560,NAVY)]}),
      new TableRow({children:[
        bCell('1',500,BG_BLU,BLUE,true),
        bCell('Academic',2400,BG_BLU,BLUE),
        bCell('35%',900,'DBEAFE',NAVY,true),
        mpCell([
          ['Convert: student_gp = 10 - gpScore  (A+=0, G=9 scale)'],
          ['If scholarship min_gp = 0: only A+ average qualifies (strict)'],
          ['If scholarship min_gp = 9: open to all (no requirement)'],
          ['Otherwise: score 70+ if eligible, penalised if below threshold'],
        ],5560),
      ]}),
      new TableRow({children:[
        bCell('2',500,BG_GRN,GREEN,true),
        bCell('Co-Curricular (PAJSK)',2400,BG_GRN,GREEN),
        bCell('20%',900,'D1FAE5',NAVY,true),
        mpCell([
          ['student pajskScore is 0-100 (%)'],
          ['scholarship min_pajsk is 0-10 scale -> multiply by 10'],
          ['score 70+ if student meets or exceeds requirement'],
          ['penalised proportionally if below threshold'],
        ],5560),
      ]}),
      new TableRow({children:[
        bCell('3',500,BG_PRP,PURPLE,true),
        bCell('Psychometric (RIASEC)',2400,BG_PRP,PURPLE),
        bCell('15%',900,'F3E8FF',NAVY,true),
        mpCell([
          ['Compare student hollandCode (e.g. "ARC") with scholarship RIASEC codes'],
          ['2+ letters overlap = 100  |  1 letter overlap = 80  |  0 = 55'],
          ['Scholarship "Semua" (open to all types) = 80 (no API call needed)'],
        ],5560),
      ]}),
      new TableRow({children:[
        bCell('4',500,BG_AMB,AMBER,true),
        bCell('Aspiration  (LLM)',2400,BG_AMB,AMBER),
        bCell('15%',900,'FEF3C7',NAVY,true),
        mpCell([
          ['Uses Groq LLM (llama-3.3-70b) — batch mode: 1 call per scholarship'],
          ['Prompt includes student fieldOfInterest + dreamCareer'],
          ['LLM returns semantic match score 0-100'],
          ['Fallback = 70 if API call fails'],
          ['"Semua Bidang" scholarships skip API call entirely = 80'],
        ],5560),
      ]}),
      new TableRow({children:[
        bCell('5',500,BG_RED,RED,true),
        bCell('Income Category',2400,BG_RED,RED),
        bCell('15%',900,'FEE2E2',NAVY,true),
        mpCell([
          ['Match student parentCategory (B40/M40/T20) to scholarship income_cat'],
          ['B40=90, M40=85, T20=80 for open scholarships'],
          ['100 if exact category match  |  30 if outside requirement'],
        ],5560),
      ]}),
    ],
  }),
  caption('Table 4: Five-Factor Matching Model — Weights and Computation Logic'),
  sp(),

  H2('4.1  Eligibility Rule'),
  calloutBox(NAVY,'Eligibility Check — Two Hard Conditions',[
    ['eligible = true  ONLY IF  student meets BOTH conditions simultaneously:','374151'],
    ['(1)  student GP (0-9 scale)  <=  scholarship min_gp','0F2057',true],
    ['(2)  student pajskScore (%)  >=  scholarship min_pajsk x 10','0F2057',true],
    ['A high total score does NOT override eligibility. Students who fail either condition','374151'],
    ['are marked eligible = false and excluded from the top-5 recommended list.','374151'],
  ]),
  pb(),
);

/* ── PAGE 7: DATA SOURCES ── */
ch.push(
  H1('5.  Data Sources'),
  H2('5.1  Input — output.json (from Agent 1)'),
  P('Agent 2 reads the output.json file produced by Agent 1. This file contains 50 complete student profiles, each including all five data dimensions required for the matching model.', {indent:true}),
  sp(),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[2800,6560],
    rows:[
      new TableRow({children:[hCell('Field',2800,NAVY),hCell('Used For',6560,NAVY)]}),
      ...([
        ['gpScore',        'Academic factor — converted to 0-9 scale for comparison with scholarship min_gp'],
        ['pajskScore',     'PAJSK factor — percentage compared against scholarship min_pajsk threshold'],
        ['hollandCode',    'Psychometric factor — 3-letter RIASEC code compared with scholarship Holland codes'],
        ['fieldOfInterest','Aspiration factor — sent to Groq LLM in batch prompt'],
        ['dreamCareer',    'Aspiration factor — sent to Groq LLM in batch prompt'],
        ['parentCategory', 'Income factor — B40/M40/T20 matched to scholarship income requirement'],
      ]).map(([f,u],i)=>new TableRow({children:[
        bCell(f,2800,i%2===0?WHITE:'F9FAFB',NAVY,false,19),
        bCell(u,6560,i%2===0?WHITE:'F9FAFB',DGRAY,false,19),
      ]})),
    ],
  }),
  caption('Table 5: Fields from output.json Used by Agent 2'),
  sp(),

  H2('5.2  Scholarship Database — Biasiswa_v5.xlsx'),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[2400,6960],
    rows:[
      new TableRow({children:[hCell('Column',2400,NAVY),hCell('Purpose',6960,NAVY)]}),
      ...([
        ['min_gp',       'Minimum academic requirement (0-9 scale: 0=A+ only, 9=open to all)'],
        ['min_pajsk',    'Minimum co-curricular score (0-10 scale, multiply x10 for percentage)'],
        ['Kod Holland',  'Preferred student personality codes e.g. "IRA / IRE / ESA"'],
        ['BIDANG_PENGAJIAN','Preferred fields of study — used in Groq LLM aspiration prompt'],
        ['KATEGORI_PENDAPATAN','Target income group: B40, M40, T20, or all three'],
        ['URL_PERMOHONAN','Direct application URL — included in matches.json output'],
      ]).map(([c,p],i)=>new TableRow({children:[
        bCell(c,2400,i%2===0?WHITE:'F9FAFB',NAVY,false,19),
        bCell(p,6960,i%2===0?WHITE:'F9FAFB',DGRAY,false,19),
      ]})),
    ],
  }),
  caption('Table 6: Biasiswa_v5.xlsx Key Columns Used by Agent 2'),
  pb(),
);

/* ── PAGE 8: DATA FLOW + OUTPUT ── */
ch.push(
  H1('6.  Data Flow — Step by Step'),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[500,2400,6460],
    rows:[
      new TableRow({children:[hCell('Step',500,NAVY),hCell('Action',2400,NAVY),hCell('Detail',6460,NAVY)]}),
      ...([
        ['1','Load data',              'Read output.json (50 profiles) + Biasiswa_v5.xlsx (10 scholarships)'],
        ['2','Batch aspiration scoring','For each scholarship: send all 50 students in one Groq API call. Receive 50 aspiration scores. Total: 10 API calls.'],
        ['3','Rule-based scoring',     'For all 500 pairs: compute academic, PAJSK, psychometric, and income scores using deterministic formulas — no API calls.'],
        ['4','Weighted total',         'Apply formula: M = (academic x 0.35) + (pajsk x 0.20) + (psychometric x 0.15) + (aspiration x 0.15) + (income x 0.15)'],
        ['5','Eligibility check',      'Flag eligible = true only if student meets BOTH min_gp AND min_pajsk for the scholarship.'],
        ['6','Sort + top-5',           'Sort each student\'s 10 matches by totalScore descending. Extract top-5 eligible matches (or top-5 overall if none eligible).'],
        ['7','Write output',           'Save matches.json to Agent2/ folder with all 500 records and top-5 per student.'],
      ]).map(([s,a,d],i)=>new TableRow({children:[
        bCell(s,500,i%2===0?WHITE:'F9FAFB',NAVY,true),
        bCell(a,2400,i%2===0?WHITE:'F9FAFB',NAVY),
        bCell(d,6460,i%2===0?WHITE:'F9FAFB'),
      ]})),
    ],
  }),
  caption('Table 7: Agent 2 Data Flow — 7 Steps'),
  sp(),

  H2('6.1  Output Format — matches.json'),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[9360],
    rows:[
      new TableRow({children:[new TableCell({
        borders:allB(NAVY),shading:{fill:'0F172A',type:ShadingType.CLEAR},
        margins:{top:120,bottom:120,left:200,right:200},width:{size:9360,type:WidthType.DXA},
        children:[
          new Paragraph({spacing:{before:0,after:40},children:[TNR('{',{size:19,color:'94A3B8'})]}),
          new Paragraph({spacing:{before:0,after:40},children:[TNR('  "agent": "Agent 2 — Scholarship Matching Agent",',{size:19,color:'94A3B8'})]}),
          new Paragraph({spacing:{before:0,after:40},children:[TNR('  "totalStudents": 50,  "totalScholarships": 10,  "totalMatches": 500,',{size:19,color:'94A3B8'})]}),
          new Paragraph({spacing:{before:0,after:40},children:[TNR('  "results": [',{size:19,color:'94A3B8'})]}),
          new Paragraph({spacing:{before:0,after:40},children:[TNR('    { "studentId": "SBP5IK001", "studentName": "AHMAD FARIS ...",',{size:19,color:'FCD34D'})]}),
          new Paragraph({spacing:{before:0,after:40},children:[TNR('      "top5": [',{size:19,color:'FCD34D'})]}),
          new Paragraph({spacing:{before:0,after:40},children:[TNR('        { "scholarshipId": "BIA005", "scholarshipName": "PETRONAS PESP",',{size:19,color:'6EE7B7'})]}),
          new Paragraph({spacing:{before:0,after:40},children:[TNR('          "eligible": true,  "totalScore": 87.25,',{size:19,color:'6EE7B7'})]}),
          new Paragraph({spacing:{before:0,after:40},children:[TNR('          "breakdown": { "academic":92, "pajsk":78, "psychometric":100,',{size:19,color:'6EE7B7'})]}),
          new Paragraph({spacing:{before:0,after:60},children:[TNR('                         "aspiration":85, "income":90 } }',{size:19,color:'6EE7B7'})]}),
          new Paragraph({spacing:{before:0,after:0},children:[TNR('      ]  }  ]  }',{size:19,color:'94A3B8'})]}),
        ],
      })]}),
    ],
  }),
  caption('Figure 4: matches.json Output Structure (sample)'),
  pb(),
);

/* ── PAGE 9: WEB UI ── */
ch.push(
  H1('7.  Web UI — DELIMa-Styled Interface'),
  P('Agent 2 includes a Flask-based web interface (app.py) that provides a DELIMa KPM-aligned user interface for running the matching pipeline and viewing results. The UI is accessible at http://localhost:5000 by double-clicking RUN AGENT 2.bat.', {indent:true}),
  sp(),

  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[2400,6960],
    rows:[
      new TableRow({children:[hCell('UI Component',2400,NAVY),hCell('Function',6960,NAVY)]}),
      ...([
        ['API Key Input',   'Password field for Groq API key — set once, never stored to disk'],
        ['Run Agent 2 button','Triggers the pipeline — disables after click to prevent double-run'],
        ['Progress Bar',    'Live percentage bar — updates every 1.5 seconds via polling'],
        ['Status Badge',    'Animated dot indicator: Idle / Running / Complete / Error'],
        ['Log Console',     'Dark terminal-style scrolling log — colour-coded: green=OK, yellow=warning, blue=done'],
        ['Student Selector','Dropdown of all 50 students — select any to view their results'],
        ['Results Table',   'Shows top-5 scholarships with: total score, bar chart, eligibility, factor breakdown chips, Apply link'],
        ['Summary Cards',   'Three cards showing total students processed, scholarships evaluated, match records generated'],
      ]).map(([c,f],i)=>new TableRow({children:[
        bCell(c,2400,i%2===0?WHITE:'F9FAFB',NAVY,false,19),
        bCell(f,6960,i%2===0?WHITE:'F9FAFB',DGRAY,false,19),
      ]})),
    ],
  }),
  caption('Table 8: Agent 2 Web UI Components'),
  sp(),

  H2('7.1  Design System Alignment'),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[2800,6560],
    rows:[
      new TableRow({children:[hCell('Design Element',2800,NAVY),hCell('Value / Specification',6560,NAVY)]}),
      ...([
        ['Primary colour','Navy #0F2057 (header bar, section headers, primary text)'],
        ['Secondary colour','Blue #1A56DB (buttons, links, score bars, badges)'],
        ['Font family',  'Outfit (Google Fonts) — same as DELIMa KPM portal'],
        ['Status colours','Green #059669 (eligible/success), Red #DC2626 (error), Amber (warning)'],
        ['Factor chips', 'Colour-coded per factor: Blue=Academic, Green=PAJSK, Purple=Psychometric, Amber=Aspiration, Red=Income'],
        ['Log console',  'Dark background #0F172A with colour-coded text — matches developer tool aesthetic'],
      ]).map(([e,v],i)=>new TableRow({children:[
        bCell(e,2800,i%2===0?WHITE:'F9FAFB',NAVY,false,19),
        bCell(v,6560,i%2===0?WHITE:'F9FAFB',DGRAY,false,19),
      ]})),
    ],
  }),
  caption('Table 9: Web UI DELIMa Design System Alignment'),
  pb(),
);

/* ── PAGE 10: FILES + QUICK START ── */
ch.push(
  H1('8.  File Structure'),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[3200,2400,3760],
    rows:[
      new TableRow({children:[hCell('File',3200,NAVY),hCell('Location',2400,NAVY),hCell('Purpose',3760,NAVY)]}),
      ...([
        ['agent2.py',         'Agent2/',     'Core matching engine — loads data, scores all 500 pairs, writes matches.json'],
        ['app.py',            'Agent2/',     'Flask web server — DELIMa UI, progress tracking, results display'],
        ['RUN AGENT 2.bat',   'Agent2/',     'Double-click launcher — opens browser + starts Flask server'],
        ['matches.json',      'Agent2/',     'Output file — 500 match records, top-5 per student (created after run)'],
        ['output.json',       'Agent1/',     'Input from Agent 1 — 50 student profiles (must exist before running)'],
        ['Biasiswa_v5.xlsx',  'Data/Biasiswa/','Scholarship database — 10 scholarships with criteria'],
      ]).map(([f,l,p],i)=>new TableRow({children:[
        bCell(f,3200,i%2===0?WHITE:'F9FAFB',NAVY,false,19),
        bCell(l,2400,i%2===0?WHITE:'F9FAFB',BLUE,false,19),
        bCell(p,3760,i%2===0?WHITE:'F9FAFB',DGRAY,false,19),
      ]})),
    ],
  }),
  caption('Table 10: Agent 2 File Structure'),
  sp(),

  H1('9.  Quick Start Guide'),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[500,2800,6060],
    rows:[
      new TableRow({children:[hCell('Step',500,NAVY),hCell('Action',2800,NAVY),hCell('Detail',6060,NAVY)]}),
      ...([
        ['1','Ensure Agent 1 is complete','Verify Agent1/output.json exists and contains 50 student profiles'],
        ['2','Get Groq API key','Go to console.groq.com -> Sign up free -> API Keys -> Create key (starts with gsk_...)'],
        ['3','Launch the UI','Double-click Agent2/RUN AGENT 2.bat — browser opens at http://localhost:5000'],
        ['4','Paste API key','Enter your Groq API key in the password field and click Run Agent 2'],
        ['5','Monitor progress','Watch the progress bar and live log — expect completion in 1-2 minutes'],
        ['6','View results','Select any student from the dropdown to see their top-5 scholarship matches'],
        ['7','Proceed to Agent 3','matches.json is now ready — Agent 3 will read it to generate bilingual reports'],
      ]).map(([s,a,d],i)=>new TableRow({children:[
        bCell(s,500,i%2===0?WHITE:'F9FAFB',NAVY,true),
        bCell(a,2800,i%2===0?WHITE:'F9FAFB',NAVY),
        bCell(d,6060,i%2===0?WHITE:'F9FAFB'),
      ]})),
    ],
  }),
  caption('Table 11: Agent 2 Quick Start Guide — 7 Steps'),
  sp(),

  calloutBox(GREEN,'Agent 2 Complete — What Happens Next',[
    ['matches.json is saved to Agent2/ folder with all 500 match records.','374151'],
    ['Agent 3 (Report Generation) reads matches.json and generates','374151'],
    ['a personalised bilingual BM + English scholarship report for each of the 50 students.','374151'],
    ['AgentPipeline.tsx (the Orchestrator) automatically triggers Agent 3','0F2057',true],
    ['once Agent 2 completes — the student only ever clicks "Run" once.','0F2057',true],
  ]),
  sp2(),
  new Paragraph({
    border:{top:{style:BorderStyle.SINGLE,size:4,color:MGRAY}},children:[],spacing:{before:0,after:60},
  }),
  new Paragraph({
    alignment:AlignmentType.CENTER,spacing:{before:60,after:0},
    children:[TNR('PRESTIJ  ·  Agent 2 — Scholarship Matching  ·  SBP Integrasi Kuantan  ·  2025',{size:18,italics:true,color:'9CA3AF'})],
  }),
);

/* ════════════ COMPILE ════════════ */
const doc=new Document({
  styles:{
    default:{document:{run:{font:'Times New Roman',size:24,color:BLACK}}},
    paragraphStyles:[
      {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,
        run:{size:28,bold:true,font:'Times New Roman',color:NAVY},paragraph:{spacing:{before:360,after:180},outlineLevel:0}},
      {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,
        run:{size:24,bold:true,font:'Times New Roman',color:NAVY},paragraph:{spacing:{before:240,after:120},outlineLevel:1}},
    ],
  },
  numbering:{config:[{reference:'bullets',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]}]},
  sections:[{
    properties:{page:{size:{width:11906,height:16838},margin:{top:1440,right:1260,bottom:1440,left:1260}}},
    headers:{default:new Header({children:[new Paragraph({
      children:[
        new TextRun({text:'PRESTIJ — Agent 2: Scholarship Matching Documentation',font:'Times New Roman',size:18,italics:true,color:DGRAY}),
        new TextRun({text:'\t'}),
        new TextRun({text:'SBP Integrasi Kuantan  ·  2025',font:'Times New Roman',size:18,color:DGRAY}),
      ],
      tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],
      border:{bottom:{style:BorderStyle.SINGLE,size:4,color:MGRAY}},
    })]})},
    footers:{default:new Footer({children:[new Paragraph({
      alignment:AlignmentType.CENTER,
      children:[new TextRun({children:[PageNumber.CURRENT],font:'Times New Roman',size:18,color:DGRAY})],
    })]})},
    children:ch,
  }],
});

const out='C:\\Users\\user\\Documents\\AI Agentic Schollarship Final\\PRESTIJ_Agent2_Documentation.docx';
Packer.toBuffer(doc).then(buf=>{fs.writeFileSync(out,buf);console.log('Done:',out);}).catch(e=>{console.error(e);process.exit(1);});
