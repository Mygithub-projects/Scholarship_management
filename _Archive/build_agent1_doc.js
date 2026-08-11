const docx = require('C:/Users/user/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  Bookmark, UnderlineType
} = docx;

// ── Colours ──────────────────────────────────────────────────────
const NAVY   = '0F2057';
const BLUE   = '1A56DB';
const TEAL   = '0E7490';
const GREEN  = '166534';
const PURPLE = '5B21B6';
const AMBER  = 'B45309';
const WHITE  = 'FFFFFF';
const LGRAY  = 'F1F5F9';
const MGRAY  = 'E2E8F0';
const DGRAY  = '334155';
const LBLUE  = 'EFF6FF';
const LGREEN = 'F0FDF4';
const LPURP  = 'F5F3FF';
const LAMBER = 'FFFBEB';

// ── Page (A4 DXA) ─────────────────────────────────────────────────
const PAGE_W  = 11906;
const PAGE_H  = 16838;
const MARGIN  = 1080;
const CONTENT = PAGE_W - MARGIN * 2;

// ── Shared helpers ─────────────────────────────────────────────────
function spacer(pt = 6) {
  return new Paragraph({ spacing: { line: pt * 20 }, children: [new TextRun('')] });
}

function hLine(color = MGRAY) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color, space: 1 } },
    spacing: { before: 40, after: 40 },
    children: [new TextRun('')]
  });
}

function cell(text, opts = {}) {
  const {
    w, bold = false, italic = false, size = 20, color = DGRAY,
    bg = WHITE, align = AlignmentType.LEFT, vAlign = VerticalAlign.CENTER,
    colspan = 1
  } = opts;
  const b = { style: BorderStyle.SINGLE, size: 4, color: MGRAY };
  return new TableCell({
    columnSpan: colspan,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    shading: { fill: bg, type: ShadingType.CLEAR },
    verticalAlign: vAlign,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    borders: { top: b, bottom: b, left: b, right: b },
    children: [new Paragraph({
      alignment: align,
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text, bold, italic, size, color, font: 'Arial' })]
    })]
  });
}

function hdrCell(text, bg = NAVY, opts = {}) {
  return cell(text, { bold: true, size: 19, color: WHITE, bg, ...opts });
}

function sh1(text, id) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new Bookmark({ id, children: [
      new TextRun({ text, font: 'Arial', size: 32, bold: true, color: NAVY })
    ]})]
  });
}

function sh2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 120 },
    children: [new TextRun({ text, font: 'Arial', size: 26, bold: true, color: BLUE })]
  });
}

function sh3(text, color = TEAL) {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, font: 'Arial', size: 22, bold: true, color })]
  });
}

function body(text, opts = {}) {
  const { size = 21, color = DGRAY, bold = false, italic = false, before = 60, after = 60, align = AlignmentType.LEFT } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before, after },
    children: [new TextRun({ text, size, color, bold, italic, font: 'Arial' })]
  });
}

function callout(text, bg = LBLUE, borderColor = BLUE) {
  return new Table({
    width: { size: CONTENT, type: WidthType.DXA },
    columnWidths: [CONTENT],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: CONTENT, type: WidthType.DXA },
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
        right: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
        left: { style: BorderStyle.THICK, size: 20, color: borderColor },
      },
      children: [new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text, font: 'Arial', size: 20, color: DGRAY })]
      })]
    })]})],
  });
}

// ═══════════════════════════════════════════════════════════════════
// COVER PAGE
// ═══════════════════════════════════════════════════════════════════
function coverPage() {
  return [
    spacer(80),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 1 } },
      spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: 'KEMENTERIAN PENDIDIKAN MALAYSIA', bold: true, size: 22, color: NAVY, font: 'Arial', allCaps: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: 'DELIMa Platform  ·  PRESTIJ Programme', size: 20, color: BLUE, font: 'Arial' })]
    }),
    spacer(40),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { fill: NAVY, type: ShadingType.CLEAR },
      spacing: { before: 180, after: 0 },
      children: [new TextRun({ text: 'AGENT 1', bold: true, size: 64, color: WHITE, font: 'Arial', allCaps: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { fill: BLUE, type: ShadingType.CLEAR },
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: 'Student Profiling Agent', bold: true, size: 36, color: WHITE, font: 'Arial' })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { fill: TEAL, type: ShadingType.CLEAR },
      spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: 'Technical Documentation', size: 24, color: WHITE, font: 'Arial', italic: true })]
    }),
    spacer(40),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: 'Agentic AI-Powered Scholarship Matching System', bold: true, size: 24, color: NAVY, font: 'Arial' })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: 'SBP Integrasi Kuantan  |  Kelas Ibnu Khaldun  |  Sesi 2025/2026', size: 20, color: DGRAY, font: 'Arial' })]
    }),
    hLine(NAVY),
    spacer(20),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [CONTENT / 2 | 0, CONTENT - (CONTENT / 2 | 0)],
      rows: [
        new TableRow({ children: [cell('Document Type', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('Technical Documentation — Agent 1 of 3', { w: CONTENT-(CONTENT/2|0), size: 19 })] }),
        new TableRow({ children: [cell('Version', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('v1.0  (June 2026)', { size: 19 })] }),
        new TableRow({ children: [cell('Agent Position', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('Agent 1 of 3 in the Pipeline', { size: 19 })] }),
        new TableRow({ children: [cell('Agent Role', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('Student Profiling Agent', { size: 19 })] }),
        new TableRow({ children: [cell('Data Coverage', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('50 students, 5 datasets, 9 SPM subjects', { size: 19 })] }),
        new TableRow({ children: [cell('Output To', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('Agent 2 — Scholarship Matching Agent', { size: 19 })] }),
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 1. WHAT IS AGENT 1?
// ═══════════════════════════════════════════════════════════════════
function whatIsAgent1() {
  return [
    sh1('1.  What is Agent 1?', 'what'),
    hLine(),
    body(
      'Agent 1 is the first component in a three-agent pipeline. Its sole responsibility is to ' +
      'read and consolidate all data about a single student from five separate Excel datasets, ' +
      'and combine them into one complete, structured profile that the next agent can use for matching.'
    ),
    spacer(6),
    body(
      'Think of Agent 1 as a "data collector and organiser." When a student logs in, this agent ' +
      'goes to each of the five datasets, finds that student\'s row, extracts the relevant ' +
      'information, calculates derived values (such as GP score and leadership level), and assembles ' +
      'everything into a single unified record called the Consolidated Student Profile.'
    ),
    spacer(10),
    callout(
      'Key principle: Agent 1 does NOT make any recommendations or judgements. It only reads, ' +
      'calculates, and organises data. All decision-making happens in Agents 2 and 3.',
      LBLUE, BLUE
    ),
    spacer(10),

    // Pipeline position
    sh2('1.1  Position in the Pipeline'),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [3200, 600, 3200, 600, 3106],
      rows: [
        new TableRow({ children: [
          cell('AGENT 1\nStudent Profiling Agent', { w: 3200, bold: true, bg: NAVY, color: WHITE, size: 22, align: AlignmentType.CENTER, vAlign: VerticalAlign.CENTER }),
          cell('→', { w: 600, bold: true, size: 28, color: BLUE, align: AlignmentType.CENTER }),
          cell('AGENT 2\nScholarship Matching Agent', { w: 3200, size: 20, bg: LGRAY, align: AlignmentType.CENTER, vAlign: VerticalAlign.CENTER }),
          cell('→', { w: 600, bold: true, size: 28, color: BLUE, align: AlignmentType.CENTER }),
          cell('AGENT 3\nRecommendation Agent', { w: 3106, size: 20, bg: LGRAY, align: AlignmentType.CENTER, vAlign: VerticalAlign.CENTER }),
        ]}),
        new TableRow({ children: [
          cell('Reads 5 datasets → Builds profile', { w: 3200, italic: true, size: 18, color: TEAL, align: AlignmentType.CENTER }),
          cell('', { w: 600 }),
          cell('Scores 10 scholarships', { w: 3200, italic: true, size: 18, color: DGRAY, align: AlignmentType.CENTER }),
          cell('', { w: 600 }),
          cell('Generates ranked output', { w: 3106, italic: true, size: 18, color: DGRAY, align: AlignmentType.CENTER }),
        ]}),
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 2. INPUT DATA SOURCES
// ═══════════════════════════════════════════════════════════════════
function inputSources() {
  return [
    sh1('2.  Input Data Sources', 'input'),
    hLine(),
    body(
      'Agent 1 reads from five Excel (.xlsx) files stored in the /Data/ folder. Each file contains ' +
      'a different dimension of student data. The agent reads all five files for every login.'
    ),
    spacer(8),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [400, 1400, 2400, 3000, 2546],
      rows: [
        new TableRow({ children: [
          hdrCell('#',     NAVY, { w: 400,  align: AlignmentType.CENTER }),
          hdrCell('Label', NAVY, { w: 1400 }),
          hdrCell('File Name', NAVY, { w: 2400 }),
          hdrCell('What It Contains', NAVY, { w: 3000 }),
          hdrCell('Key Fields Used', NAVY, { w: 2546 }),
        ]}),
        new TableRow({ children: [
          cell('1', { w: 400, bold: true, bg: LBLUE, align: AlignmentType.CENTER }),
          cell('SPM Results', { w: 1400, bold: true, bg: LBLUE }),
          cell('Peperiksaan_SPM_IbnuKhaldun\n_DUMMY_v4.xlsx', { w: 2400, size: 18, bg: LBLUE }),
          cell('SPM examination results for 9 subjects per student', { w: 3000, bg: LBLUE }),
          cell('Student ID, password, gender, 9 subject grades', { w: 2546, bg: LBLUE }),
        ]}),
        new TableRow({ children: [
          cell('2', { w: 400, bold: true, align: AlignmentType.CENTER }),
          cell('PAJSK', { w: 1400, bold: true }),
          cell('DATA_PAJSK_5IK_DUMMY_v3.xlsx', { w: 2400, size: 18 }),
          cell('Co-curricular activities, positions held, and competition achievements', { w: 3000 }),
          cell('Sports, club, uniform body, markah (out of 110), pencapaian', { w: 2546 }),
        ]}),
        new TableRow({ children: [
          cell('3', { w: 400, bold: true, bg: LBLUE, align: AlignmentType.CENTER }),
          cell('Psychometric (IMK)', { w: 1400, bold: true, bg: LBLUE }),
          cell('IMK_IbnuKhaldun_DUMMY_v3.xlsx', { w: 2400, size: 18, bg: LBLUE }),
          cell('Inventori Minat Kerjaya — career interest scores across 6 RIASEC dimensions', { w: 3000, bg: LBLUE }),
          cell('R, I, A, S, E, K scores → top-3 Holland Code', { w: 2546, bg: LBLUE }),
        ]}),
        new TableRow({ children: [
          cell('4', { w: 400, bold: true, align: AlignmentType.CENTER }),
          cell('Family Income', { w: 1400, bold: true }),
          cell('Income_Penjaga_5IK_DUMMY_v1.xlsx', { w: 2400, size: 18 }),
          cell('Monthly household income and per-capita income of student\'s guardian/parent', { w: 3000 }),
          cell('Per-capita monthly income (RM) → B40 / M40 / T20', { w: 2546 }),
        ]}),
        new TableRow({ children: [
          cell('5', { w: 400, bold: true, bg: LBLUE, align: AlignmentType.CENTER }),
          cell('Scholarship DB', { w: 1400, bold: true, bg: LBLUE }),
          cell('Dataset_Biasiswa_PRESTIJ_v3.xlsx', { w: 2400, size: 18, bg: LBLUE }),
          cell('Details of 10 available scholarships — criteria, provider, requirements', { w: 3000, bg: LBLUE }),
          cell('Passed to Agent 2 as-is (not modified by Agent 1)', { w: 2546, bg: LBLUE }),
        ]}),
      ]
    }),
    spacer(6),
    body('Note: Dataset 5 (Scholarship Database) is loaded by Agent 1 but is not processed — it is passed directly to Agent 2 unchanged.', { italic: true, size: 18, color: DGRAY }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 3. DATA PROCESSING LOGIC
// ═══════════════════════════════════════════════════════════════════
function processingLogic() {
  return [
    sh1('3.  Data Processing Logic', 'logic'),
    hLine(),
    body(
      'After reading the raw data, Agent 1 applies a set of calculation rules to derive meaningful ' +
      'values from the raw numbers. The four main processing steps are described below.'
    ),
    spacer(8),

    // 3.1 SPM GP Score
    sh2('3.1  SPM Grade Point (GP) Calculation'),
    body(
      'Each SPM grade is converted to a numerical grade point. The system then calculates an ' +
      'average GP score across all subjects. This single number is used by Agent 2 for academic matching.'
    ),
    spacer(6),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [1800, 1400, 6546],
      rows: [
        new TableRow({ children: [hdrCell('SPM Grade', NAVY, { w: 1800, align: AlignmentType.CENTER }), hdrCell('Grade Point', NAVY, { w: 1400, align: AlignmentType.CENTER }), hdrCell('What It Means', NAVY, { w: 6546 })] }),
        ...([['A+', '10', 'Excellent — highest achievable grade'],
             ['A',  '9',  'Excellent'],
             ['A-', '8',  'Very Good'],
             ['B+', '7',  'Good'],
             ['B',  '6',  'Good'],
             ['C+', '5',  'Credit'],
             ['C',  '4',  'Credit — minimum pass for most scholarships'],
             ['D',  '3',  'Pass'],
             ['E',  '2',  'Fail'],
             ['G',  '1',  'Fail'],
        ].map(([g, p, m], i) => new TableRow({ children: [
          cell(g,  { w: 1800, bold: true, bg: i % 2 === 0 ? WHITE : LGRAY, align: AlignmentType.CENTER }),
          cell(p,  { w: 1400, bold: true, bg: i % 2 === 0 ? WHITE : LGRAY, align: AlignmentType.CENTER, color: NAVY }),
          cell(m,  { w: 6546, bg: i % 2 === 0 ? WHITE : LGRAY }),
        ]}))),
      ]
    }),
    spacer(6),
    callout(
      'Formula: GP Score = Sum of all subject grade points ÷ Number of subjects taken\n' +
      'Example: A student with A+(10), A(9), A-(8), B+(7), B(6), C+(5), C+(5), A(9), A(9) = 68 ÷ 9 = 7.56',
      LGREEN, GREEN
    ),
    spacer(6),
    body('SPM Subjects in v4 Dataset (9 subjects):', { bold: true, before: 80 }),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [400, 2400, 400, 2400, 400, 4106],
      rows: [
        new TableRow({ children: [
          cell('1', { w: 400, bold: true, bg: LGRAY, align: AlignmentType.CENTER }),
          cell('Bahasa Melayu', { w: 2400, bg: LGRAY }),
          cell('4', { w: 400, bold: true, bg: LGRAY, align: AlignmentType.CENTER }),
          cell('Sejarah', { w: 2400, bg: LGRAY }),
          cell('7', { w: 400, bold: true, bg: LGRAY, align: AlignmentType.CENTER }),
          cell('Fizik', { w: 4106, bg: LGRAY }),
        ]}),
        new TableRow({ children: [
          cell('2', { w: 400, bold: true, align: AlignmentType.CENTER }),
          cell('Bahasa Inggeris', { w: 2400 }),
          cell('5', { w: 400, bold: true, align: AlignmentType.CENTER }),
          cell('Pendidikan Agama Islam', { w: 2400 }),
          cell('8', { w: 400, bold: true, align: AlignmentType.CENTER }),
          cell('Kimia', { w: 4106 }),
        ]}),
        new TableRow({ children: [
          cell('3', { w: 400, bold: true, bg: LGRAY, align: AlignmentType.CENTER }),
          cell('Matematik', { w: 2400, bg: LGRAY }),
          cell('6', { w: 400, bold: true, bg: LGRAY, align: AlignmentType.CENTER }),
          cell('Matematik Tambahan', { w: 2400, bg: LGRAY }),
          cell('9', { w: 400, bold: true, bg: LGRAY, align: AlignmentType.CENTER }),
          cell('Biologi', { w: 4106, bg: LGRAY }),
        ]}),
      ]
    }),
    spacer(8),

    // 3.2 PAJSK
    sh2('3.2  PAJSK Score Calculation'),
    body(
      'The PAJSK dataset records each student\'s co-curricular participation. The raw score is ' +
      'given as markah out of a maximum of 110. Agent 1 converts this into a percentage and ' +
      'then assigns a leadership level category.'
    ),
    spacer(6),
    callout(
      'Formula: PAJSK Percentage = (markah ÷ 110) × 100\n' +
      'Example: A student with markah = 77 → (77 ÷ 110) × 100 = 70.0%',
      LAMBER, AMBER
    ),
    spacer(6),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2400, 2200, 5146],
      rows: [
        new TableRow({ children: [hdrCell('PAJSK Percentage', NAVY, { w: 2400 }), hdrCell('Leadership Level', NAVY, { w: 2200 }), hdrCell('What It Means', NAVY, { w: 5146 })] }),
        new TableRow({ children: [cell('85% and above', { w: 2400, bold: true }), cell('High', { w: 2200, bold: true, color: GREEN }), cell('Very active, holds senior positions at state or national level', { w: 5146 })] }),
        new TableRow({ children: [cell('70% – 84%', { w: 2400, bold: true, bg: LGRAY }), cell('Medium', { w: 2200, bold: true, color: AMBER, bg: LGRAY }), cell('Active, holds positions at school or district level', { w: 5146, bg: LGRAY })] }),
        new TableRow({ children: [cell('Below 70%', { w: 2400, bold: true }), cell('Basic', { w: 2200, bold: true, color: DGRAY }), cell('Participates but does not hold significant positions', { w: 5146 })] }),
      ]
    }),
    spacer(6),
    body('PAJSK also extracts: name of sports activity, club, uniformed body, positions held (e.g. Naib Pengerusi), level of competition (e.g. Kebangsaan), and special awards (Anugerah Khas).', { size: 19, italic: true, color: DGRAY }),
    spacer(8),

    // 3.3 RIASEC
    sh2('3.3  RIASEC Psychometric Processing'),
    body(
      'The IMK (Inventori Minat Kerjaya) dataset provides six numerical scores — one for each ' +
      'RIASEC dimension. Agent 1 sorts these scores from highest to lowest and takes the top ' +
      'three as the student\'s Holland Code. This code is later used to match the student\'s ' +
      'personality type to scholarship preferences.'
    ),
    spacer(6),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [600, 1800, 7346],
      rows: [
        new TableRow({ children: [hdrCell('Code', NAVY, { w: 600, align: AlignmentType.CENTER }), hdrCell('Type', NAVY, { w: 1800 }), hdrCell('Typical Career Interests', NAVY, { w: 7346 })] }),
        new TableRow({ children: [cell('R', { w: 600, bold: true, bg: LGRAY, align: AlignmentType.CENTER }), cell('Realistic', { w: 1800, bold: true, bg: LGRAY }), cell('Engineering, mechanics, hands-on technical work', { w: 7346, bg: LGRAY })] }),
        new TableRow({ children: [cell('I', { w: 600, bold: true, align: AlignmentType.CENTER }), cell('Investigative', { w: 1800, bold: true }), cell('Science, research, analysis, medicine', { w: 7346 })] }),
        new TableRow({ children: [cell('A', { w: 600, bold: true, bg: LGRAY, align: AlignmentType.CENTER }), cell('Artistic', { w: 1800, bold: true, bg: LGRAY }), cell('Design, creative arts, architecture, communications', { w: 7346, bg: LGRAY })] }),
        new TableRow({ children: [cell('S', { w: 600, bold: true, align: AlignmentType.CENTER }), cell('Social', { w: 1800, bold: true }), cell('Teaching, counselling, social work, healthcare', { w: 7346 })] }),
        new TableRow({ children: [cell('E', { w: 600, bold: true, bg: LGRAY, align: AlignmentType.CENTER }), cell('Enterprising', { w: 1800, bold: true, bg: LGRAY }), cell('Business, management, law, entrepreneurship', { w: 7346, bg: LGRAY })] }),
        new TableRow({ children: [cell('K', { w: 600, bold: true, align: AlignmentType.CENTER }), cell('Conventional', { w: 1800, bold: true }), cell('Accounting, administration, data management, finance', { w: 7346 })] }),
      ]
    }),
    spacer(6),
    callout(
      'Example: If a student scores R=72, I=85, A=91, S=68, E=77, K=60 → top 3 are A(91), I(85), E(77) → Holland Code = A-I-E\n' +
      'This is mapped to: fieldOfInterest = "Seni & Komunikasi", preferredField = "Seni & Komunikasi", dreamCareer = "Pereka Grafik / Arkitek"',
      LPURP, PURPLE
    ),
    spacer(8),

    // 3.4 Income
    sh2('3.4  Family Income Classification'),
    body(
      'The income dataset contains the guardian\'s monthly household income. Agent 1 calculates ' +
      'the per-capita income (household income divided by number of dependants) and classifies ' +
      'the family into one of three national income categories.'
    ),
    spacer(6),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [1800, 3200, 2400, 2346],
      rows: [
        new TableRow({ children: [hdrCell('Category', NAVY, { w: 1800 }), hdrCell('Per-Capita Monthly Income', NAVY, { w: 3200 }), hdrCell('Group', NAVY, { w: 2400 }), hdrCell('Scholarship Impact', NAVY, { w: 2346 })] }),
        new TableRow({ children: [cell('B40', { w: 1800, bold: true, color: GREEN }), cell('Below RM 1,500 per month', { w: 3200 }), cell('Bottom 40% of households', { w: 2400 }), cell('Highest priority for need-based scholarships', { w: 2346 })] }),
        new TableRow({ children: [cell('M40', { w: 1800, bold: true, color: AMBER, bg: LGRAY }), cell('RM 1,500 – RM 4,999 per month', { w: 3200, bg: LGRAY }), cell('Middle 40% of households', { w: 2400, bg: LGRAY }), cell('Eligible for most scholarships', { w: 2346, bg: LGRAY })] }),
        new TableRow({ children: [cell('T20', { w: 1800, bold: true, color: DGRAY }), cell('RM 5,000 and above per month', { w: 3200 }), cell('Top 20% of households', { w: 2400 }), cell('Merit-based scholarships only', { w: 2346 })] }),
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 4. TECH STACK USED BY AGENT 1
// ═══════════════════════════════════════════════════════════════════
function techStack() {
  return [
    sh1('4.  Tech Stack Used by Agent 1', 'tech'),
    hLine(),
    body(
      'Agent 1 is implemented entirely in TypeScript within the React frontend. ' +
      'There is no separate server, Python script, or API call involved. Everything runs ' +
      'inside the user\'s web browser when they log in.'
    ),
    spacer(8),

    sh2('4.1  TypeScript — Data Structure Definition'),
    body(
      'TypeScript is used to define the exact shape of the data that Agent 1 produces. ' +
      'This is called an interface — a blueprint that describes every field in the ' +
      'Consolidated Student Profile and what type of value each field must hold.'
    ),
    spacer(6),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2600, 2000, 5146],
      rows: [
        new TableRow({ children: [hdrCell('Field Name', NAVY, { w: 2600 }), hdrCell('Data Type', NAVY, { w: 2000 }), hdrCell('What It Stores', NAVY, { w: 5146 })] }),
        new TableRow({ children: [cell('id', { w: 2600, bold: true, bg: LGRAY }), cell('string', { w: 2000, bg: LGRAY, italic: true }), cell('Student ID, e.g. "SBP5IK001"', { w: 5146, bg: LGRAY })] }),
        new TableRow({ children: [cell('password', { w: 2600, bold: true }), cell('string (SULIT)', { w: 2000, italic: true, color: 'C0392B' }), cell('Login password — confidential, not displayed', { w: 5146 })] }),
        new TableRow({ children: [cell('name', { w: 2600, bold: true, bg: LGRAY }), cell('string', { w: 2000, bg: LGRAY, italic: true }), cell('Full name of the student', { w: 5146, bg: LGRAY })] }),
        new TableRow({ children: [cell('gender', { w: 2600, bold: true }), cell('"L" | "P"', { w: 2000, italic: true }), cell('L = Lelaki, P = Perempuan', { w: 5146 })] }),
        new TableRow({ children: [cell('spmGrades', { w: 2600, bold: true, bg: LGRAY }), cell('Record<string, string>', { w: 2000, bg: LGRAY, italic: true }), cell('Dictionary of subject → grade, e.g. { "Fizik": "A+" }', { w: 5146, bg: LGRAY })] }),
        new TableRow({ children: [cell('gpScore', { w: 2600, bold: true }), cell('number', { w: 2000, italic: true }), cell('Average grade point (0.0 – 10.0)', { w: 5146 })] }),
        new TableRow({ children: [cell('pajskScore', { w: 2600, bold: true, bg: LGRAY }), cell('number', { w: 2000, bg: LGRAY, italic: true }), cell('Co-curricular percentage (0.0 – 100.0)', { w: 5146, bg: LGRAY })] }),
        new TableRow({ children: [cell('leadershipLevel', { w: 2600, bold: true }), cell('"High" | "Medium" | "Basic"', { w: 2000, italic: true }), cell('Derived from PAJSK percentage', { w: 5146 })] }),
        new TableRow({ children: [cell('riasecType', { w: 2600, bold: true, bg: LGRAY }), cell('string[]', { w: 2000, bg: LGRAY, italic: true }), cell('Top-3 RIASEC codes, e.g. ["Artistic", "Investigative", "Enterprising"]', { w: 5146, bg: LGRAY })] }),
        new TableRow({ children: [cell('fieldOfInterest', { w: 2600, bold: true }), cell('string', { w: 2000, italic: true }), cell('Field mapped from top RIASEC code', { w: 5146 })] }),
        new TableRow({ children: [cell('dreamCareer', { w: 2600, bold: true, bg: LGRAY }), cell('string', { w: 2000, bg: LGRAY, italic: true }), cell('Career suggestion based on RIASEC profile', { w: 5146, bg: LGRAY })] }),
        new TableRow({ children: [cell('parentCategory', { w: 2600, bold: true }), cell('"B40" | "M40" | "T20"', { w: 2000, italic: true }), cell('Income group derived from per-capita calculation', { w: 5146 })] }),
        new TableRow({ children: [cell('keyAchievements', { w: 2600, bold: true, bg: LGRAY }), cell('string[]', { w: 2000, bg: LGRAY, italic: true }), cell('List of notable achievements from PAJSK data', { w: 5146, bg: LGRAY })] }),
        new TableRow({ children: [cell('pajskData', { w: 2600, bold: true }), cell('PajskData object', { w: 2000, italic: true }), cell('Full PAJSK breakdown — sukan, kelab, badan beruniform, markah', { w: 5146 })] }),
      ]
    }),
    spacer(8),

    sh2('4.2  mockData.ts — Pre-Processed Data File'),
    body(
      'Rather than reading Excel files at runtime (which would require a server), all five ' +
      'datasets are pre-processed and stored in a TypeScript file called mockData.ts. ' +
      'This file contains the data for all 50 students, already cleaned and structured, ' +
      'ready for Agent 1 to use instantly when a student logs in.'
    ),
    spacer(6),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2800, 7046],
      rows: [
        new TableRow({ children: [hdrCell('File', NAVY, { w: 2800 }), hdrCell('Role', NAVY, { w: 7046 })] }),
        new TableRow({ children: [cell('mockData.ts', { w: 2800, bold: true, bg: LGRAY }), cell('Contains the STUDENTS array (50 entries) and SCHOLARSHIPS array (10 entries) — pre-built from all 5 Excel files', { w: 7046, bg: LGRAY })] }),
        new TableRow({ children: [cell('pajskData.ts', { w: 2800, bold: true }), cell('Contains the PAJSK_MAP — detailed co-curricular records for all 50 students, indexed by Student ID', { w: 7046 })] }),
        new TableRow({ children: [cell('types.ts', { w: 2800, bold: true, bg: LGRAY }), cell('Defines the TypeScript interfaces: StudentProfile, PajskData, Scholarship — the data blueprints', { w: 7046, bg: LGRAY })] }),
      ]
    }),
    spacer(6),
    callout(
      'Why pre-process? Browsers cannot directly open files on a computer\'s hard drive for security reasons. ' +
      'Pre-processing converts the Excel data into a TypeScript file that is bundled into the web app at build time. ' +
      'The result: instant data access with zero network requests.',
      LBLUE, BLUE
    ),
    spacer(8),

    sh2('4.3  applyPajskData() — The Agent 1 Function'),
    body(
      'The core function of Agent 1 is called applyPajskData(). It runs once when a student ' +
      'logs in. Here is what it does, step by step, in plain language:'
    ),
    spacer(6),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [600, 2600, 6546],
      rows: [
        new TableRow({ children: [hdrCell('Step', NAVY, { w: 600, align: AlignmentType.CENTER }), hdrCell('Action', NAVY, { w: 2600 }), hdrCell('Plain Language Explanation', NAVY, { w: 6546 })] }),
        new TableRow({ children: [
          cell('1', { w: 600, bold: true, align: AlignmentType.CENTER, bg: LBLUE }),
          cell('Receive student object', { w: 2600, bold: true, bg: LBLUE }),
          cell('The function receives the base student record from mockData.ts — name, SPM grades, income category, RIASEC scores', { w: 6546, bg: LBLUE }),
        ]}),
        new TableRow({ children: [
          cell('2', { w: 600, bold: true, align: AlignmentType.CENTER }),
          cell('Look up PAJSK record', { w: 2600, bold: true }),
          cell('It searches PAJSK_MAP using the student\'s ID as the key — like looking up a row in a table', { w: 6546 }),
        ]}),
        new TableRow({ children: [
          cell('3', { w: 600, bold: true, align: AlignmentType.CENTER, bg: LBLUE }),
          cell('Merge PAJSK data', { w: 2600, bold: true, bg: LBLUE }),
          cell('It copies all PAJSK fields (pajskScore, leadershipLevel, keyAchievements, pajskData) into the student object', { w: 6546, bg: LBLUE }),
        ]}),
        new TableRow({ children: [
          cell('4', { w: 600, bold: true, align: AlignmentType.CENTER }),
          cell('Return full profile', { w: 2600, bold: true }),
          cell('It returns the completed Consolidated Student Profile — ready to be passed to Agent 2', { w: 6546 }),
        ]}),
      ]
    }),
    spacer(6),
    body('The function is called in App.tsx at login time:', { bold: true, before: 80 }),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [CONTENT],
      rows: [new TableRow({ children: [new TableCell({
        width: { size: CONTENT, type: WidthType.DXA },
        shading: { fill: '1E293B', type: ShadingType.CLEAR },
        margins: { top: 140, bottom: 140, left: 200, right: 200 },
        borders: { top: { style: BorderStyle.SINGLE, size: 4, color: TEAL }, bottom: { style: BorderStyle.SINGLE, size: 4, color: TEAL }, left: { style: BorderStyle.THICK, size: 20, color: TEAL }, right: { style: BorderStyle.SINGLE, size: 4, color: TEAL } },
        children: [
          new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: '// Agent 1 runs here — on login', font: 'Courier New', size: 18, color: '94A3B8', italic: true })] }),
          new Paragraph({ spacing: { before: 0, after: 0 }, children: [
            new TextRun({ text: 'const fullProfile = ', font: 'Courier New', size: 18, color: 'E2E8F0' }),
            new TextRun({ text: 'applyPajskData', font: 'Courier New', size: 18, color: '7DD3FC' }),
            new TextRun({ text: '(student);', font: 'Courier New', size: 18, color: 'E2E8F0' }),
          ]})
        ]
      })]})],
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 5. OUTPUT — CONSOLIDATED STUDENT PROFILE
// ═══════════════════════════════════════════════════════════════════
function outputProfile() {
  return [
    sh1('5.  Output: Consolidated Student Profile', 'output'),
    hLine(),
    body(
      'After processing all five datasets, Agent 1 produces a single Consolidated Student Profile. ' +
      'This is a structured data object — a complete record of one student across all dimensions. ' +
      'It is the only thing Agent 2 receives as input.'
    ),
    spacer(8),
    sh2('5.1  Example Profile (Student SBP5IK001)'),
    body('The table below shows a real example of what Agent 1 produces for Student SBP5IK001:'),
    spacer(6),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [1600, 2000, 6146],
      rows: [
        new TableRow({ children: [hdrCell('Dimension', NAVY, { w: 1600 }), hdrCell('Field', NAVY, { w: 2000 }), hdrCell('Value', NAVY, { w: 6146 })] }),
        // Identity
        new TableRow({ children: [cell('Identity', { w: 1600, bold: true, bg: LBLUE, vAlign: VerticalAlign.CENTER }), cell('Student ID', { w: 2000, bg: LBLUE }), cell('SBP5IK001', { w: 6146, bg: LBLUE })] }),
        new TableRow({ children: [cell('', { w: 1600, bg: LBLUE }), cell('Name', { w: 2000, bg: LBLUE }), cell('AHMAD FARIS BIN MOHD AZRI', { w: 6146, bg: LBLUE })] }),
        new TableRow({ children: [cell('', { w: 1600, bg: LBLUE }), cell('Gender', { w: 2000, bg: LBLUE }), cell('L (Lelaki)', { w: 6146, bg: LBLUE })] }),
        new TableRow({ children: [cell('', { w: 1600, bg: LBLUE }), cell('School', { w: 2000, bg: LBLUE }), cell('SBP Integrasi Kuantan, Pahang', { w: 6146, bg: LBLUE })] }),
        // Academic
        new TableRow({ children: [cell('Academic\n(SPM v4)', { w: 1600, bold: true, vAlign: VerticalAlign.CENTER }), cell('GP Score', { w: 2000 }), cell('9.44 (calculated from 9 subjects)', { w: 6146 })] }),
        new TableRow({ children: [cell('', { w: 1600 }), cell('SPM Grades', { w: 2000 }), cell('BM: A+, BI: A+, Math: A+, Add Math: A+, Sejarah: A+, PAI: A+, Fizik: A+, Kimia: A+, Bio: A+', { w: 6146 })] }),
        // PAJSK
        new TableRow({ children: [cell('PAJSK\n(v3)', { w: 1600, bold: true, bg: LGRAY, vAlign: VerticalAlign.CENTER }), cell('Score', { w: 2000, bg: LGRAY }), cell('70.0% (markah 77 ÷ 110)', { w: 6146, bg: LGRAY })] }),
        new TableRow({ children: [cell('', { w: 1600, bg: LGRAY }), cell('Leadership Level', { w: 2000, bg: LGRAY }), cell('Medium (70% ≥ 70%, < 85%)', { w: 6146, bg: LGRAY })] }),
        new TableRow({ children: [cell('', { w: 1600, bg: LGRAY }), cell('Sports', { w: 2000, bg: LGRAY }), cell('SILAT — Bendahari, Peringkat Negeri', { w: 6146, bg: LGRAY })] }),
        new TableRow({ children: [cell('', { w: 1600, bg: LGRAY }), cell('Club', { w: 2000, bg: LGRAY }), cell('Kelab Komputer ICT — Naib Pengerusi, Peringkat Kebangsaan', { w: 6146, bg: LGRAY })] }),
        new TableRow({ children: [cell('', { w: 1600, bg: LGRAY }), cell('Achievement', { w: 2000, bg: LGRAY }), cell('JOHAN [NEGERI] – SILAT', { w: 6146, bg: LGRAY })] }),
        // Psychometric
        new TableRow({ children: [cell('Psychometric\n(IMK v3)', { w: 1600, bold: true, vAlign: VerticalAlign.CENTER }), cell('RIASEC Top-3', { w: 2000 }), cell('Artistic (A) → Realistic (R) → Conventional (K)', { w: 6146 })] }),
        new TableRow({ children: [cell('', { w: 1600 }), cell('Field of Interest', { w: 2000 }), cell('Seni & Komunikasi', { w: 6146 })] }),
        new TableRow({ children: [cell('', { w: 1600 }), cell('Dream Career', { w: 2000 }), cell('Pereka Grafik / Arkitek', { w: 6146 })] }),
        // Income
        new TableRow({ children: [cell('Income\n(v1)', { w: 1600, bold: true, bg: LGRAY, vAlign: VerticalAlign.CENTER }), cell('Category', { w: 2000, bg: LGRAY }), cell('B40 (per-capita income below RM 1,500/month)', { w: 6146, bg: LGRAY })] }),
      ]
    }),
    spacer(10),
    callout(
      'This complete profile is passed as a single object to Agent 2 (Scholarship Matching Agent). ' +
      'Agent 2 uses every field in this profile to calculate match scores against the 10 scholarships.',
      LGREEN, GREEN
    ),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 6. SECURITY & PRIVACY
// ═══════════════════════════════════════════════════════════════════
function security() {
  return [
    sh1('6.  Security & Privacy', 'security'),
    hLine(),
    body(
      'The system handles personal student data and must comply with the Personal Data Protection ' +
      'Act 2010 (PDPA). The following safeguards are implemented at the Agent 1 level.'
    ),
    spacer(8),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2800, 7046],
      rows: [
        new TableRow({ children: [hdrCell('Safeguard', NAVY, { w: 2800 }), hdrCell('Implementation', NAVY, { w: 7046 })] }),
        new TableRow({ children: [
          cell('Student ID & Password are SULIT', { w: 2800, bold: true, bg: LGRAY }),
          cell('Passwords are stored only in mockData.ts and used solely for login validation. They are never displayed, logged, or sent anywhere.', { w: 7046, bg: LGRAY })
        ]}),
        new TableRow({ children: [
          cell('Per-student data isolation', { w: 2800, bold: true }),
          cell('After login, Agent 1 loads only the logged-in student\'s data. No other student\'s profile is accessible in the active session.', { w: 7046 })
        ]}),
        new TableRow({ children: [
          cell('No data transmission', { w: 2800, bold: true, bg: LGRAY }),
          cell('All data processing happens in the browser only. No student data is sent to any external server, API, or third-party service.', { w: 7046, bg: LGRAY })
        ]}),
        new TableRow({ children: [
          cell('No persistent storage', { w: 2800, bold: true }),
          cell('No student data is written to localStorage, cookies, or any browser storage. All data is cleared when the browser tab is closed.', { w: 7046 })
        ]}),
      ]
    }),
    spacer(10),
    callout(
      '⚠  NOTICE — PDPA 2010\nStudent IDs and passwords are SULIT (confidential) and are to be used for login system purposes only. ' +
      'They must not be shared, displayed publicly, printed in full, or distributed outside of authorised system administrators.',
      LAMBER, AMBER
    ),
    spacer(10),
    hLine(NAVY),
    body('End of Document — Agent 1: Student Profiling Agent', { color: DGRAY, italic: true, align: AlignmentType.CENTER, before: 120, after: 60, size: 19 }),
  ];
}

// ═══════════════════════════════════════════════════════════════════
// ASSEMBLE
// ═══════════════════════════════════════════════════════════════════
const b6 = { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 1 };

const doc = new Document({
  numbering: {
    config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 600, hanging: 300 } } } }] }]
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 21 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial', color: NAVY },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Arial', color: BLUE },
        paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        border: { bottom: b6 },
        spacing: { before: 0, after: 100 },
        children: [
          new TextRun({ text: 'Agent 1: Student Profiling Agent  |  Tech Stack Documentation', size: 17, color: NAVY, font: 'Arial' }),
          new TextRun({ text: '\tDELIMa KPM  ·  PRESTIJ Programme', size: 17, color: DGRAY, font: 'Arial' }),
        ],
        tabStops: [{ type: docx.TabStopType.RIGHT, position: docx.TabStopPosition.MAX }]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        border: { top: b6 },
        spacing: { before: 80, after: 0 },
        children: [
          new TextRun({ text: 'SBP Integrasi Kuantan  |  Kelas Ibnu Khaldun  |  Sesi 2025/2026', size: 17, color: DGRAY, font: 'Arial' }),
          new TextRun({ text: '\tPage ', size: 17, color: DGRAY, font: 'Arial' }),
          new TextRun({ children: [PageNumber.CURRENT], size: 17, color: NAVY, font: 'Arial' }),
          new TextRun({ text: ' of ', size: 17, color: DGRAY, font: 'Arial' }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 17, color: NAVY, font: 'Arial' }),
        ],
        tabStops: [{ type: docx.TabStopType.RIGHT, position: docx.TabStopPosition.MAX }]
      })] })
    },
    children: [
      ...coverPage(),
      ...whatIsAgent1(),
      ...inputSources(),
      ...processingLogic(),
      ...techStack(),
      ...outputProfile(),
      ...security(),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = 'C:/Users/user/Documents/AI Agentic Schollarship Final/Agent1_StudentProfiling_Documentation.docx';
  fs.writeFileSync(out, buf);
  console.log('Done:', out, '| Size:', (buf.length / 1024).toFixed(1), 'KB');
});
