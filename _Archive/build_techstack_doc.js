const docx = require('C:/Users/user/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TableOfContents, Bookmark, UnderlineType
} = docx;

// ── Colours ──────────────────────────────────────────────────────
const NAVY   = '0F2057';
const BLUE   = '1A56DB';
const TEAL   = '0E7490';
const GREEN  = '166534';
const PURPLE = '5B21B6';
const ORANGE = 'B45309';
const WHITE  = 'FFFFFF';
const LGRAY  = 'F1F5F9';
const MGRAY  = 'E2E8F0';
const DGRAY  = '334155';

// ── A4 page (DXA) ────────────────────────────────────────────────
const PAGE_W   = 11906;
const PAGE_H   = 16838;
const MARGIN   = 1080;   // ~0.75 inch
const CONTENT  = PAGE_W - MARGIN * 2;  // 9746

// ── Helpers ──────────────────────────────────────────────────────
function spacer(pt = 6) {
  return new Paragraph({ spacing: { before: 0, after: 0, line: pt * 20 }, children: [new TextRun('')] });
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

  const border = { style: BorderStyle.SINGLE, size: 4, color: MGRAY };
  return new TableCell({
    columnSpan: colspan,
    width: w ? { size: w, type: WidthType.DXA } : undefined,
    shading: { fill: bg, type: ShadingType.CLEAR },
    verticalAlign: vAlign,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    borders: { top: border, bottom: border, left: border, right: border },
    children: [new Paragraph({
      alignment: align,
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text, bold, italic, size, color, font: 'Arial' })]
    })]
  });
}

function headerCell(text, opts = {}) {
  return cell(text, { bold: true, size: 19, color: WHITE, bg: NAVY, ...opts });
}

function subHeaderCell(text, opts = {}) {
  return cell(text, { bold: true, size: 18, color: WHITE, bg: BLUE, ...opts });
}

function altCell(text, i, opts = {}) {
  return cell(text, { bg: i % 2 === 0 ? WHITE : LGRAY, ...opts });
}

// ── Cover Page ────────────────────────────────────────────────────
function coverPage() {
  const lh = BorderStyle.SINGLE;
  return [
    spacer(80),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { bottom: { style: lh, size: 8, color: NAVY, space: 1 } },
      spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: 'KEMENTERIAN PENDIDIKAN MALAYSIA', bold: true, size: 22, color: NAVY, font: 'Arial', allCaps: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: 'DELIMa Platform  ·  PRESTIJ Programme', size: 20, color: BLUE, font: 'Arial' })]
    }),
    spacer(60),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { fill: NAVY, type: ShadingType.CLEAR },
      spacing: { before: 200, after: 200 },
      children: [new TextRun({ text: 'TECH STACK DOCUMENTATION', bold: true, size: 52, color: WHITE, font: 'Arial', allCaps: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { fill: BLUE, type: ShadingType.CLEAR },
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: 'Agentic AI-Powered Scholarship Matching System', bold: true, size: 26, color: WHITE, font: 'Arial' })]
    }),
    spacer(80),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: 'Prepared for:', size: 20, color: DGRAY, font: 'Arial', italic: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [new TextRun({ text: 'SBP Integrasi Kuantan', bold: true, size: 28, color: NAVY, font: 'Arial' })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: 'Kelas Ibnu Khaldun  |  Sesi 2025/2026', size: 22, color: DGRAY, font: 'Arial' })]
    }),
    hLine(NAVY),
    spacer(40),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [CONTENT / 2 | 0, CONTENT - (CONTENT / 2 | 0)],
      rows: [
        new TableRow({ children: [
          cell('Document Type', { w: CONTENT / 2 | 0, bold: true, bg: LGRAY, size: 19 }),
          cell('Technical Documentation', { w: CONTENT - (CONTENT / 2 | 0), size: 19 })
        ]}),
        new TableRow({ children: [
          cell('Version', { w: CONTENT / 2 | 0, bold: true, bg: LGRAY, size: 19 }),
          cell('v1.0  (June 2026)', { w: CONTENT - (CONTENT / 2 | 0), size: 19 })
        ]}),
        new TableRow({ children: [
          cell('Programme', { w: CONTENT / 2 | 0, bold: true, bg: LGRAY, size: 19 }),
          cell('PRESTIJ — DELIMa KPM', { w: CONTENT - (CONTENT / 2 | 0), size: 19 })
        ]}),
        new TableRow({ children: [
          cell('Target Audience', { w: CONTENT / 2 | 0, bold: true, bg: LGRAY, size: 19 }),
          cell('Trainers, Counsellors, Programme Evaluators', { w: CONTENT - (CONTENT / 2 | 0), size: 19 })
        ]}),
        new TableRow({ children: [
          cell('Development Tool', { w: CONTENT / 2 | 0, bold: true, bg: LGRAY, size: 19 }),
          cell('Claude Code (Anthropic AI)', { w: CONTENT - (CONTENT / 2 | 0), size: 19 })
        ]}),
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ── Section heading helper ────────────────────────────────────────
function sh1(text, id) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new Bookmark({ id, children: [new TextRun({ text, font: 'Arial', size: 32, bold: true, color: NAVY })] })]
  });
}

function sh2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 120 },
    children: [new TextRun({ text, font: 'Arial', size: 26, bold: true, color: BLUE })]
  });
}

function body(text, opts = {}) {
  const { size = 22, color = DGRAY, bold = false, italic = false, indent = 0, before = 60, after = 60 } = opts;
  return new Paragraph({
    indent: indent ? { left: indent } : undefined,
    spacing: { before, after },
    children: [new TextRun({ text, size, color, bold, italic, font: 'Arial' })]
  });
}

function bullet(text, opts = {}) {
  const { size = 21, color = DGRAY, bold = false } = opts;
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size, color, bold, font: 'Arial' })]
  });
}

// ── 1. Executive Summary ──────────────────────────────────────────
function execSummary() {
  return [
    sh1('1.  Executive Summary', 'exec'),
    hLine(),
    body(
      'The Agentic AI-Powered Scholarship Matching System is a client-side web application developed ' +
      'under the PRESTIJ Programme on the DELIMa KPM platform. It automates the process of identifying ' +
      'the most suitable post-SPM scholarships for students based on five data dimensions: academic ' +
      'performance, co-curricular achievement, psychometric profile, career aspiration, and family ' +
      'income background.'
    ),
    spacer(4),
    body(
      'The system covers 50 students from Kelas Ibnu Khaldun, SBP Integrasi Kuantan (Session 2025/2026), ' +
      'each identified via a secure login using a unique Student ID and confidential password (SULIT). ' +
      'Upon login, the system loads the student\'s real data from five Excel datasets and runs a ' +
      'three-agent AI pipeline to produce a personalised ranked list of scholarship recommendations.'
    ),
    spacer(4),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [3000, 6746],
      rows: [
        new TableRow({ children: [headerCell('Attribute', { w: 3000 }), headerCell('Details', { w: 6746 })] }),
        new TableRow({ children: [cell('System Name', { w: 3000, bold: true, bg: LGRAY }), cell('Agentic AI-Powered Scholarship Matching System', { w: 6746 })] }),
        new TableRow({ children: [cell('Platform', { w: 3000, bold: true, bg: LGRAY }), cell('DELIMa KPM — PRESTIJ Programme', { w: 6746 })] }),
        new TableRow({ children: [cell('School', { w: 3000, bold: true, bg: LGRAY }), cell('SBP Integrasi Kuantan — Kelas Ibnu Khaldun', { w: 6746 })] }),
        new TableRow({ children: [cell('Students Covered', { w: 3000, bold: true, bg: LGRAY }), cell('50 students (SBP5IK001 – SBP5IK050)', { w: 6746 })] }),
        new TableRow({ children: [cell('Scholarships Matched', { w: 3000, bold: true, bg: LGRAY }), cell('10 scholarships (Biasiswa v3 Dataset)', { w: 6746 })] }),
        new TableRow({ children: [cell('AI Architecture', { w: 3000, bold: true, bg: LGRAY }), cell('3-Agent pipeline (Profiling → Matching → Recommendation)', { w: 6746 })] }),
        new TableRow({ children: [cell('Data Compliance', { w: 3000, bold: true, bg: LGRAY }), cell('PDPA 2010 — Student IDs & Passwords are SULIT (confidential)', { w: 6746 })] }),
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ── 2. System Overview ────────────────────────────────────────────
function systemOverview() {
  const steps = [
    ['1', 'Student Login', 'The student enters their unique Student ID and confidential password (SULIT). The system authenticates the credentials and loads only that student\'s data — no other student\'s records are accessible.'],
    ['2', 'Frontend Interface', 'A React Single Page Application (SPA) styled to the DELIMa KPM design system presents the student\'s profile, scholarship dashboard, agent pipeline, and recommendation report.'],
    ['3', 'Client-Side Logic', 'All data processing and matching logic runs entirely within the user\'s web browser. There is no separate backend server or API. The system operates as a standalone client-side application.'],
    ['4', 'Dataset Loading', 'Five Excel (.xlsx) files — covering SPM results, PAJSK co-curricular data, psychometric IMK scores, family income, and scholarship details — are pre-processed and embedded into the application at build time as TypeScript data files.'],
    ['5', '3 AI Agents Execute', 'A sequential three-agent pipeline runs in-browser: Agent 1 consolidates the student profile; Agent 2 matches the profile against ten scholarships; Agent 3 generates ranked recommendations with reasoning.'],
    ['6', 'Output Delivered', 'The student receives a personalised ranked list of scholarships complete with match scores, eligibility status, and specific reasons for each recommendation.'],
  ];

  return [
    sh1('2.  System Overview', 'sysoverview'),
    hLine(),
    body('The diagram below illustrates the six-stage operational flow of the system, from student login through to the delivery of scholarship recommendations.'),
    spacer(8),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [700, 2200, 6846],
      rows: [
        new TableRow({ children: [
          headerCell('Step', { w: 700, align: AlignmentType.CENTER }),
          headerCell('Stage', { w: 2200 }),
          headerCell('Description', { w: 6846 }),
        ]}),
        ...steps.map(([num, stage, desc], i) =>
          new TableRow({ children: [
            cell(num, { w: 700, bold: true, size: 22, color: NAVY, bg: i % 2 === 0 ? '#EFF6FF' : LGRAY, align: AlignmentType.CENTER }),
            cell(stage, { w: 2200, bold: true, size: 20, bg: i % 2 === 0 ? '#EFF6FF' : LGRAY }),
            cell(desc, { w: 6846, size: 19, bg: i % 2 === 0 ? WHITE : '#F8FAFF' }),
          ]})
        )
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ── 3. Tech Stack Components ──────────────────────────────────────
function techStackComponents() {
  return [
    sh1('3.  Tech Stack Components', 'techstack'),
    hLine(),
    body('The system is built on five core technology components. Each is described in detail below, including the specific tools and libraries used and the purpose each component serves within the overall architecture.'),

    // ── 3.1 Frontend ──
    sh2('3.1  Frontend'),
    body(
      'The frontend is a modern Single Page Application (SPA) built with React 18 and TypeScript, ' +
      'bundled via Vite 6. It is styled using Tailwind CSS v4 and the Outfit typeface to match the ' +
      'DELIMa KPM design system. Icons are provided by the lucide-react library.',
      { before: 80, after: 80 }
    ),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2800, 3500, 3446],
      rows: [
        new TableRow({ children: [subHeaderCell('Technology', { w: 2800 }), subHeaderCell('Version', { w: 3500 }), subHeaderCell('Role', { w: 3446 })] }),
        new TableRow({ children: [cell('React', { w: 2800, bold: true, bg: LGRAY }), cell('18', { w: 3500 }), cell('UI component framework', { w: 3446 })] }),
        new TableRow({ children: [cell('TypeScript', { w: 2800, bold: true, bg: LGRAY }), cell('5.x', { w: 3500 }), cell('Static typing for reliability', { w: 3446 })] }),
        new TableRow({ children: [cell('Vite', { w: 2800, bold: true, bg: LGRAY }), cell('6.x', { w: 3500 }), cell('Build tool and dev server', { w: 3446 })] }),
        new TableRow({ children: [cell('Tailwind CSS', { w: 2800, bold: true, bg: LGRAY }), cell('v4 (@import style)', { w: 3500 }), cell('Utility-first styling', { w: 3446 })] }),
        new TableRow({ children: [cell('lucide-react', { w: 2800, bold: true, bg: LGRAY }), cell('Latest', { w: 3500 }), cell('Icon library', { w: 3446 })] }),
        new TableRow({ children: [cell('Outfit (Google Fonts)', { w: 2800, bold: true, bg: LGRAY }), cell('—', { w: 3500 }), cell('DELIMa brand typeface', { w: 3446 })] }),
      ]
    }),
    spacer(8),

    // ── 3.2 Backend ──
    sh2('3.2  Backend'),
    body(
      'This system has no separate backend server. All application logic, data processing, and ' +
      'scholarship matching runs entirely within the user\'s web browser (client-side). There is ' +
      'no Python server, REST API, or database connection. This architecture was chosen for ' +
      'simplicity, portability, and ease of deployment within the DELIMa platform.',
      { before: 80, after: 80 }
    ),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [3200, 6546],
      rows: [
        new TableRow({ children: [subHeaderCell('Item', { w: 3200 }), subHeaderCell('Detail', { w: 6546 })] }),
        new TableRow({ children: [cell('Architecture', { w: 3200, bold: true, bg: LGRAY }), cell('Client-side only — Single Page Application (SPA)', { w: 6546 })] }),
        new TableRow({ children: [cell('Server / API', { w: 3200, bold: true, bg: LGRAY }), cell('None — no Python, no Node.js server, no REST API', { w: 6546 })] }),
        new TableRow({ children: [cell('State Management', { w: 3200, bold: true, bg: LGRAY }), cell('React useState, useCallback, useMemo hooks', { w: 6546 })] }),
        new TableRow({ children: [cell('Data Access', { w: 3200, bold: true, bg: LGRAY }), cell('TypeScript data files (pre-processed from Excel at build time)', { w: 6546 })] }),
      ]
    }),
    spacer(8),

    // ── 3.3 Dataset ──
    sh2('3.3  Dataset'),
    body(
      'All student and scholarship data is sourced from five Microsoft Excel (.xlsx) files. These ' +
      'files were processed and converted into TypeScript data files during the build process. ' +
      'The xlsx npm package was used for parsing. Raw Excel files are stored in the /Data/ directory.',
      { before: 80, after: 80 }
    ),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2000, 2600, 1200, 4000 - 54],
      rows: [
        new TableRow({ children: [
          subHeaderCell('Dataset', { w: 2000 }),
          subHeaderCell('File Name', { w: 2600 }),
          subHeaderCell('Records', { w: 1200, align: AlignmentType.CENTER }),
          subHeaderCell('Contents', { w: 3946 }),
        ]}),
        new TableRow({ children: [
          cell('SPM Results', { w: 2000, bold: true, bg: LGRAY }),
          cell('Peperiksaan_SPM_IbnuKhaldun_DUMMY_v4.xlsx', { w: 2600, size: 17 }),
          cell('50 students', { w: 1200, align: AlignmentType.CENTER }),
          cell('Student ID, password, gender, SPM grades (9 subjects), GP score', { w: 3946 }),
        ]}),
        new TableRow({ children: [
          cell('PAJSK Co-curricular', { w: 2000, bold: true, bg: LGRAY }),
          cell('DATA_PAJSK_5IK_DUMMY_v3.xlsx', { w: 2600, size: 17 }),
          cell('50 students', { w: 1200, align: AlignmentType.CENTER }),
          cell('Sports, club, uniformed body, positions, peringkat, markah, pencapaian', { w: 3946 }),
        ]}),
        new TableRow({ children: [
          cell('Psychometric (IMK)', { w: 2000, bold: true, bg: LGRAY }),
          cell('IMK_IbnuKhaldun_DUMMY_v3.xlsx', { w: 2600, size: 17 }),
          cell('50 students', { w: 1200, align: AlignmentType.CENTER }),
          cell('RIASEC Holland Code scores (R, I, A, S, E, K) and top-3 code', { w: 3946 }),
        ]}),
        new TableRow({ children: [
          cell('Family Income', { w: 2000, bold: true, bg: LGRAY }),
          cell('Income_Penjaga_5IK_DUMMY_v1.xlsx', { w: 2600, size: 17 }),
          cell('50 students', { w: 1200, align: AlignmentType.CENTER }),
          cell('Monthly per-capita income (RM) → B40 / M40 / T20 classification', { w: 3946 }),
        ]}),
        new TableRow({ children: [
          cell('Scholarship Data', { w: 2000, bold: true, bg: LGRAY }),
          cell('Dataset_Biasiswa_PRESTIJ_v3.xlsx', { w: 2600, size: 17 }),
          cell('10 scholarships', { w: 1200, align: AlignmentType.CENTER }),
          cell('Scholarship name, provider, GP threshold, PAJSK minimum, RIASEC fit, income requirement', { w: 3946 }),
        ]}),
      ]
    }),
    spacer(8),

    // ── 3.4 AI Agents ──
    sh2('3.4  AI Agents'),
    body(
      'The scholarship matching process is carried out by a pipeline of three AI agents that execute ' +
      'sequentially in the browser. Each agent receives the output of the previous agent as its input. ' +
      'The pipeline is fully deterministic — no external AI API calls are made at runtime.',
      { before: 80, after: 80 }
    ),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [700, 2500, 3300, 3246],
      rows: [
        new TableRow({ children: [
          subHeaderCell('#', { w: 700, align: AlignmentType.CENTER }),
          subHeaderCell('Agent Name', { w: 2500 }),
          subHeaderCell('Input', { w: 3300 }),
          subHeaderCell('Output', { w: 3246 }),
        ]}),
        new TableRow({ children: [
          cell('1', { w: 700, bold: true, align: AlignmentType.CENTER, bg: LGRAY }),
          cell('Student Profiling Agent', { w: 2500, bold: true, bg: LGRAY }),
          cell('student_profile + student_assessment (all 5 datasets)', { w: 3300 }),
          cell('Consolidated Student Profile (single unified record)', { w: 3246 }),
        ]}),
        new TableRow({ children: [
          cell('2', { w: 700, bold: true, align: AlignmentType.CENTER, bg: '#EFF6FF' }),
          cell('Scholarship Matching Agent', { w: 2500, bold: true, bg: '#EFF6FF' }),
          cell('Consolidated Student Profile + scholarship_database (10 scholarships)', { w: 3300, bg: '#EFF6FF' }),
          cell('Ranked Scholarship Matches (scored list)', { w: 3246, bg: '#EFF6FF' }),
        ]}),
        new TableRow({ children: [
          cell('3', { w: 700, bold: true, align: AlignmentType.CENTER, bg: LGRAY }),
          cell('Recommendation & Reasoning Agent', { w: 2500, bold: true, bg: LGRAY }),
          cell('Ranked Scholarship Matches (from Agent 2)', { w: 3300 }),
          cell('recommendation_output (ranked list + reasons + eligibility)', { w: 3246 }),
        ]}),
      ]
    }),
    spacer(8),

    // ── 3.5 Development Tool ──
    sh2('3.5  Development Tool'),
    body(
      'The entire system was designed, developed, and debugged using Claude Code — an AI coding ' +
      'assistant developed by Anthropic. Claude Code assisted with TypeScript implementation, ' +
      'Excel data integration, React component architecture, and troubleshooting.',
      { before: 80, after: 80 }
    ),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [3000, 6746],
      rows: [
        new TableRow({ children: [subHeaderCell('Tool', { w: 3000 }), subHeaderCell('Details', { w: 6746 })] }),
        new TableRow({ children: [cell('Claude Code', { w: 3000, bold: true, bg: LGRAY }), cell('Anthropic AI — primary development assistant (code, debug, data integration)', { w: 6746 })] }),
        new TableRow({ children: [cell('Visual Studio Code', { w: 3000, bold: true, bg: LGRAY }), cell('Code editor and terminal environment', { w: 6746 })] }),
        new TableRow({ children: [cell('Node.js / npm', { w: 3000, bold: true, bg: LGRAY }), cell('JavaScript runtime and package management', { w: 6746 })] }),
        new TableRow({ children: [cell('xlsx (npm package)', { w: 3000, bold: true, bg: LGRAY }), cell('Excel .xlsx parsing for data extraction', { w: 6746 })] }),
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ── 4. 3-Agent AI Pipeline ────────────────────────────────────────
function agentPipeline() {
  return [
    sh1('4.  3-Agent AI Pipeline', 'agents'),
    hLine(),
    body(
      'The scholarship matching process follows a strict sequential pipeline. Each of the three agents ' +
      'performs a distinct role and passes its output directly to the next agent. The pipeline runs ' +
      'entirely in the browser with no external API calls.'
    ),
    spacer(8),

    // Agent 1
    sh2('4.1  Agent 1 — Student Profiling Agent'),
    body('This agent consolidates all raw data from the five datasets into a single, unified student profile that can be evaluated against scholarship criteria.', { before: 60, after: 80 }),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2400, 7346],
      rows: [
        new TableRow({ children: [headerCell('Attribute', { w: 2400 }), headerCell('Detail', { w: 7346 })] }),
        new TableRow({ children: [cell('Role', { w: 2400, bold: true, bg: LGRAY }), cell('Consolidate all student data into a standardised profile', { w: 7346 })] }),
        new TableRow({ children: [cell('Input — student_profile', { w: 2400, bold: true, bg: LGRAY }), cell('SPM grades (9 subjects), GP score, gender, school, ethnicity', { w: 7346 })] }),
        new TableRow({ children: [cell('Input — student_assessment', { w: 2400, bold: true, bg: LGRAY }), cell('PAJSK markah/peratus, RIASEC Holland Code, per-capita income (B40/M40/T20), career aspiration', { w: 7346 })] }),
        new TableRow({ children: [cell('Output', { w: 2400, bold: true, bg: '#EFF6FF' }), cell('Consolidated Student Profile — a single unified object combining all input dimensions', { w: 7346, bg: '#EFF6FF', bold: true })] }),
      ]
    }),
    spacer(10),

    // Agent 2
    sh2('4.2  Agent 2 — Scholarship Matching Agent'),
    body('This agent compares the consolidated student profile against all ten scholarships in the database, calculating a weighted match score for each using five dimensions.', { before: 60, after: 80 }),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2400, 7346],
      rows: [
        new TableRow({ children: [headerCell('Attribute', { w: 2400 }), headerCell('Detail', { w: 7346 })] }),
        new TableRow({ children: [cell('Role', { w: 2400, bold: true, bg: LGRAY }), cell('Match student profile against scholarship database and compute scores', { w: 7346 })] }),
        new TableRow({ children: [cell('Input', { w: 2400, bold: true, bg: LGRAY }), cell('Consolidated Student Profile (from Agent 1) + scholarship_database (10 scholarships)', { w: 7346 })] }),
        new TableRow({ children: [cell('Matching Dimensions', { w: 2400, bold: true, bg: LGRAY }), cell('Academic (35%) · PAJSK (20%) · Psychometric (15%) · Aspiration (15%) · Parent Background (15%)', { w: 7346 })] }),
        new TableRow({ children: [cell('Output', { w: 2400, bold: true, bg: '#EFF6FF' }), cell('Ranked Scholarship Matches — list of scholarships sorted by total match score (0–100)', { w: 7346, bg: '#EFF6FF', bold: true })] }),
      ]
    }),
    spacer(10),

    // Agent 3
    sh2('4.3  Agent 3 — Recommendation & Reasoning Agent'),
    body('This agent produces the final output — a human-readable ranked scholarship recommendation report with eligibility status and specific reasoning for each scholarship.', { before: 60, after: 80 }),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2400, 7346],
      rows: [
        new TableRow({ children: [headerCell('Attribute', { w: 2400 }), headerCell('Detail', { w: 7346 })] }),
        new TableRow({ children: [cell('Role', { w: 2400, bold: true, bg: LGRAY }), cell('Generate final recommendations with reasoning and eligibility assessment', { w: 7346 })] }),
        new TableRow({ children: [cell('Input', { w: 2400, bold: true, bg: LGRAY }), cell('Ranked Scholarship Matches (from Agent 2)', { w: 7346 })] }),
        new TableRow({ children: [cell('Output', { w: 2400, bold: true, bg: '#EFF6FF' }), cell('recommendation_output — ranked list with match score, eligibility flag, and written reasons per scholarship', { w: 7346, bg: '#EFF6FF', bold: true })] }),
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ── 5. Matching Weight Distribution ──────────────────────────────
function matchingWeights() {
  return [
    sh1('5.  Matching Weight Distribution', 'weights'),
    hLine(),
    body(
      'The Scholarship Matching Agent (Agent 2) calculates a composite match score (0–100) for each ' +
      'scholarship using five weighted dimensions. The weights reflect the relative importance of each ' +
      'dimension in determining scholarship suitability.'
    ),
    spacer(8),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [500, 2600, 1400, 5246],
      rows: [
        new TableRow({ children: [
          subHeaderCell('#', { w: 500, align: AlignmentType.CENTER }),
          subHeaderCell('Dimension', { w: 2600 }),
          subHeaderCell('Weight', { w: 1400, align: AlignmentType.CENTER }),
          subHeaderCell('Data Source', { w: 5246 }),
        ]}),
        new TableRow({ children: [
          cell('1', { w: 500, bold: true, align: AlignmentType.CENTER }),
          cell('Academic Performance', { w: 2600, bold: true }),
          cell('35%', { w: 1400, bold: true, align: AlignmentType.CENTER, color: NAVY }),
          cell('SPM grades (9 subjects) + GP score — Peperiksaan_SPM_IbnuKhaldun_DUMMY_v4.xlsx', { w: 5246 }),
        ]}),
        new TableRow({ children: [
          cell('2', { w: 500, bold: true, align: AlignmentType.CENTER, bg: LGRAY }),
          cell('PAJSK Co-curricular', { w: 2600, bold: true, bg: LGRAY }),
          cell('20%', { w: 1400, bold: true, align: AlignmentType.CENTER, color: NAVY, bg: LGRAY }),
          cell('PAJSK markah (out of 110), pencapaian, sukan, kelab, badan beruniform — DATA_PAJSK_5IK_DUMMY_v3.xlsx', { w: 5246, bg: LGRAY }),
        ]}),
        new TableRow({ children: [
          cell('3', { w: 500, bold: true, align: AlignmentType.CENTER }),
          cell('Psychometric (RIASEC)', { w: 2600, bold: true }),
          cell('15%', { w: 1400, bold: true, align: AlignmentType.CENTER, color: NAVY }),
          cell('Holland Code (top-3 RIASEC letters) from Inventori Minat Kerjaya (IMK) — IMK_IbnuKhaldun_DUMMY_v3.xlsx', { w: 5246 }),
        ]}),
        new TableRow({ children: [
          cell('4', { w: 500, bold: true, align: AlignmentType.CENTER, bg: LGRAY }),
          cell('Career Aspiration', { w: 2600, bold: true, bg: LGRAY }),
          cell('15%', { w: 1400, bold: true, align: AlignmentType.CENTER, color: NAVY, bg: LGRAY }),
          cell('Dream career + preferred field (derived from RIASEC top code)', { w: 5246, bg: LGRAY }),
        ]}),
        new TableRow({ children: [
          cell('5', { w: 500, bold: true, align: AlignmentType.CENTER }),
          cell('Parent/Family Background', { w: 2600, bold: true }),
          cell('15%', { w: 1400, bold: true, align: AlignmentType.CENTER, color: NAVY }),
          cell('Per-capita income → B40 / M40 / T20 classification — Income_Penjaga_5IK_DUMMY_v1.xlsx', { w: 5246 }),
        ]}),
        new TableRow({ children: [
          cell('', { w: 500, bg: NAVY }),
          cell('TOTAL', { w: 2600, bold: true, bg: NAVY, color: WHITE }),
          cell('100%', { w: 1400, bold: true, align: AlignmentType.CENTER, bg: NAVY, color: WHITE }),
          cell('', { w: 5246, bg: NAVY }),
        ]}),
      ]
    }),
    spacer(10),
    body('Income Classification Thresholds (per-capita monthly, RM):', { bold: true, before: 100 }),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2000, 4000, 3746],
      rows: [
        new TableRow({ children: [subHeaderCell('Category', { w: 2000 }), subHeaderCell('Per-Capita Monthly Income (RM)', { w: 4000 }), subHeaderCell('Scholarship Eligibility', { w: 3746 })] }),
        new TableRow({ children: [cell('B40 (Bottom 40%)', { w: 2000, bold: true, bg: LGRAY }), cell('Below RM 1,500', { w: 4000 }), cell('Highest priority for income-based scholarships', { w: 3746 })] }),
        new TableRow({ children: [cell('M40 (Middle 40%)', { w: 2000, bold: true, bg: LGRAY }), cell('RM 1,500 – RM 4,999', { w: 4000 }), cell('Eligible for most scholarships', { w: 3746 })] }),
        new TableRow({ children: [cell('T20 (Top 20%)', { w: 2000, bold: true, bg: LGRAY }), cell('RM 5,000 and above', { w: 4000 }), cell('Merit-based scholarships only', { w: 3746 })] }),
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ── 6. Scholarship Database ───────────────────────────────────────
function scholarshipDatabase() {
  const scholarships = [
    ['BIA001', 'JPA – Program Penajaan Nasional (PPN)', 'JPA', 'Kerajaan', 'Semua', 'Full (Overseas)'],
    ['BIA002', 'JPA – Program Khas Lepasan SPM LSPM', 'JPA', 'Kerajaan', 'Semua', 'Full (Local)'],
    ['BIA003', 'JPA – Program Khas JPA MARA (PKJM)', 'JPA & MARA', 'Kerajaan', 'Bumiputera', 'Full (Local & Overseas)'],
    ['BIA004', 'MARA – Young Talent Development (YTP)', 'MARA', 'Kerajaan', 'Bumiputera B40', 'Full'],
    ['BIA005', 'PETRONAS PESP Sponsorship', 'PETRONAS', 'Korporat', 'Semua', 'Full'],
    ['BIA006', 'Shell Malaysia Scholarship', 'Shell Malaysia', 'Korporat', 'Semua', 'Full'],
    ['BIA007', 'Khazanah Watan Scholarship', 'Yayasan Khazanah', 'Korporat/GLC', 'Bumiputera', 'Full'],
    ['BIA008', 'YTN – TNB Prime Scholarship', 'Yayasan Tenaga Nasional', 'Korporat/GLC', 'Semua', 'Full'],
    ['BIA009', 'Biasiswa Yayasan Pahang', 'Yayasan Pahang', 'Kerajaan Negeri', 'B40 (Pahang)', 'Partial'],
    ['BIA010', 'Biasiswa Yayasan UEM', 'Yayasan UEM', 'Korporat/GLC', 'Semua', 'Full'],
  ];

  return [
    sh1('6.  Scholarship Database', 'scholarships'),
    hLine(),
    body('The system matches each student against ten scholarships sourced from the Dataset_Biasiswa_PRESTIJ_v3.xlsx file. The table below lists all ten scholarships included in the database.'),
    spacer(8),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [800, 2800, 1600, 1400, 1500, 1646],
      rows: [
        new TableRow({ children: [
          subHeaderCell('ID', { w: 800 }),
          subHeaderCell('Scholarship Name', { w: 2800 }),
          subHeaderCell('Provider', { w: 1600 }),
          subHeaderCell('Category', { w: 1400 }),
          subHeaderCell('Eligibility', { w: 1500 }),
          subHeaderCell('Award', { w: 1646 }),
        ]}),
        ...scholarships.map(([id, name, prov, cat, elig, award], i) =>
          new TableRow({ children: [
            cell(id, { w: 800, bold: true, bg: i % 2 === 0 ? WHITE : LGRAY, size: 18 }),
            cell(name, { w: 2800, bg: i % 2 === 0 ? WHITE : LGRAY, size: 18 }),
            cell(prov, { w: 1600, bg: i % 2 === 0 ? WHITE : LGRAY, size: 18 }),
            cell(cat, { w: 1400, bg: i % 2 === 0 ? WHITE : LGRAY, size: 18 }),
            cell(elig, { w: 1500, bg: i % 2 === 0 ? WHITE : LGRAY, size: 18 }),
            cell(award, { w: 1646, bg: i % 2 === 0 ? WHITE : LGRAY, size: 18 }),
          ]})
        )
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ── 7. Key Benefits & Conclusion ─────────────────────────────────
function conclusion() {
  const benefits = [
    ['Personalised Recommendations', 'Each student receives a unique ranked scholarship list based on their own real data across five dimensions — not a generic list.'],
    ['Secure & Private', 'Student IDs and passwords are SULIT (confidential). Login ensures each student can only view their own data, in compliance with PDPA 2010.'],
    ['Data-Driven & Fair', 'The matching engine uses a transparent five-dimension weighted formula, ensuring consistent and objective results for all students.'],
    ['No Server Required', 'The entire system runs in the browser. No server infrastructure, no database, and no Python backend are required — making deployment simple.'],
    ['Real Data Integration', 'All five datasets are sourced from actual school records (SPM v4, PAJSK v3, IMK v3, Pendapatan v1, Biasiswa v3) for accurate, up-to-date matching.'],
    ['Scalable', 'Currently supports 50 students. The architecture can be extended to cover additional classes, schools, or sessions with minimal changes.'],
  ];

  return [
    sh1('7.  Key Benefits & Conclusion', 'conclusion'),
    hLine(),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2600, 7146],
      rows: [
        new TableRow({ children: [headerCell('Benefit', { w: 2600 }), headerCell('Description', { w: 7146 })] }),
        ...benefits.map(([b, d], i) =>
          new TableRow({ children: [
            cell(b, { w: 2600, bold: true, bg: i % 2 === 0 ? LGRAY : '#EFF6FF' }),
            cell(d, { w: 7146, bg: i % 2 === 0 ? WHITE : '#F8FAFF' }),
          ]})
        )
      ]
    }),
    spacer(12),
    sh2('Conclusion'),
    body(
      'This system demonstrates how a modern client-side web application, built with React and TypeScript, ' +
      'can serve as an effective agentic AI tool for educational decision support. By integrating five ' +
      'real datasets and running a three-agent matching pipeline entirely in the browser, the system ' +
      'provides 50 students of Kelas Ibnu Khaldun with personalised, data-driven scholarship guidance — ' +
      'without requiring any server infrastructure or external AI API calls at runtime.',
      { before: 80, after: 80 }
    ),
    body(
      'The PRESTIJ Programme, delivered through the DELIMa KPM platform, exemplifies how AI-powered ' +
      'tools can be deployed practically within the Malaysian national education system to empower ' +
      'students in making informed decisions about their academic futures.',
      { before: 40, after: 120 }
    ),
    hLine(NAVY),
    body('End of Document', { color: DGRAY, italic: true, align: AlignmentType.CENTER, before: 120, after: 60, size: 19 }),
  ];
}

// ── Assemble Document ─────────────────────────────────────────────
const border6 = { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 1 };

const doc = new Document({
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 600, hanging: 300 } } }
      }]
    }]
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial', color: NAVY },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 }
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Arial', color: BLUE },
        paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 }
      },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: border6 },
            spacing: { before: 0, after: 100 },
            children: [
              new TextRun({ text: 'Tech Stack Documentation  |  Agentic AI-Powered Scholarship Matching System', size: 17, color: NAVY, font: 'Arial' }),
              new TextRun({ text: '\tDELIMa KPM  ·  PRESTIJ Programme', size: 17, color: DGRAY, font: 'Arial' }),
            ],
            tabStops: [{ type: docx.TabStopType.RIGHT, position: docx.TabStopPosition.MAX }]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: border6 },
            spacing: { before: 80, after: 0 },
            children: [
              new TextRun({ text: 'SBP Integrasi Kuantan  |  Kelas Ibnu Khaldun  |  Sesi 2025/2026', size: 17, color: DGRAY, font: 'Arial' }),
              new TextRun({ text: '\tPage ', size: 17, color: DGRAY, font: 'Arial' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 17, color: NAVY, font: 'Arial' }),
              new TextRun({ text: ' of ', size: 17, color: DGRAY, font: 'Arial' }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 17, color: NAVY, font: 'Arial' }),
            ],
            tabStops: [{ type: docx.TabStopType.RIGHT, position: docx.TabStopPosition.MAX }]
          })
        ]
      })
    },
    children: [
      ...coverPage(),
      // TOC
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 0, after: 160 },
        children: [new TextRun({ text: 'Table of Contents', font: 'Arial', size: 32, bold: true, color: NAVY })]
      }),
      new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }),
      new Paragraph({ children: [new PageBreak()] }),
      ...execSummary(),
      ...systemOverview(),
      ...techStackComponents(),
      ...agentPipeline(),
      ...matchingWeights(),
      ...scholarshipDatabase(),
      ...conclusion(),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = 'C:/Users/user/Documents/AI Agentic Schollarship Final/TechStack_Documentation_PRESTIJ.docx';
  fs.writeFileSync(out, buf);
  console.log('Done:', out, '| Size:', (buf.length / 1024).toFixed(1), 'KB');
});
