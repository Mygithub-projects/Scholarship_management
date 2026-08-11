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
const LTEAL  = 'F0FDFA';
const LRED   = 'FEF2F2';

const PAGE_W  = 11906;
const PAGE_H  = 16838;
const MARGIN  = 1080;
const CONTENT = PAGE_W - MARGIN * 2;

// ── Helpers ────────────────────────────────────────────────────────
function spacer(pt = 6) {
  return new Paragraph({ spacing: { line: pt * 20 }, children: [new TextRun('')] });
}
function hLine(color = MGRAY) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color, space: 1 } },
    spacing: { before: 40, after: 40 }, children: [new TextRun('')]
  });
}
function cell(text, opts = {}) {
  const { w, bold=false, italic=false, size=20, color=DGRAY, bg=WHITE,
          align=AlignmentType.LEFT, vAlign=VerticalAlign.CENTER, colspan=1 } = opts;
  const b = { style: BorderStyle.SINGLE, size: 4, color: MGRAY };
  return new TableCell({
    columnSpan: colspan, width: w ? { size: w, type: WidthType.DXA } : undefined,
    shading: { fill: bg, type: ShadingType.CLEAR }, verticalAlign: vAlign,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    borders: { top: b, bottom: b, left: b, right: b },
    children: [new Paragraph({
      alignment: align, spacing: { before: 0, after: 0 },
      children: [new TextRun({ text, bold, italic, size, color, font: 'Arial' })]
    })]
  });
}
function hdrCell(text, bg=NAVY, opts={}) {
  return cell(text, { bold: true, size: 19, color: WHITE, bg, ...opts });
}
function sh1(text, id) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 160 },
    children: [new Bookmark({ id, children: [
      new TextRun({ text, font: 'Arial', size: 32, bold: true, color: NAVY })
    ]})]
  });
}
function sh2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2, spacing: { before: 220, after: 120 },
    children: [new TextRun({ text, font: 'Arial', size: 26, bold: true, color: BLUE })]
  });
}
function body(text, opts = {}) {
  const { size=21, color=DGRAY, bold=false, italic=false, before=60, after=60,
          align=AlignmentType.LEFT } = opts;
  return new Paragraph({
    alignment: align, spacing: { before, after },
    children: [new TextRun({ text, size, color, bold, italic, font: 'Arial' })]
  });
}
function callout(text, bg=LBLUE, borderColor=BLUE) {
  return new Table({
    width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [CONTENT],
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
      alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: 'DELIMa Platform  ·  PRESTIJ Programme', size: 20, color: BLUE, font: 'Arial' })]
    }),
    spacer(40),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { fill: PURPLE, type: ShadingType.CLEAR },
      spacing: { before: 180, after: 0 },
      children: [new TextRun({ text: 'RIASEC', bold: true, size: 72, color: WHITE, font: 'Arial', allCaps: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { fill: BLUE, type: ShadingType.CLEAR },
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: 'Holland Code Career Interest Model', bold: true, size: 32, color: WHITE, font: 'Arial' })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { fill: TEAL, type: ShadingType.CLEAR },
      spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: 'Psychometric Component Documentation — IMK Dataset', size: 24, color: WHITE, font: 'Arial', italic: true })]
    }),
    spacer(40),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: 'Agentic AI-Powered Scholarship Matching System', bold: true, size: 24, color: NAVY, font: 'Arial' })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: 'SBP Integrasi Kuantan  |  Kelas Ibnu Khaldun  |  Sesi 2025/2026', size: 20, color: DGRAY, font: 'Arial' })]
    }),
    hLine(NAVY),
    spacer(20),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [CONTENT/2|0, CONTENT-(CONTENT/2|0)],
      rows: [
        new TableRow({ children: [cell('Document Type', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('Psychometric Component Documentation', { size: 19 })] }),
        new TableRow({ children: [cell('Model', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('RIASEC — Holland Code (John L. Holland, 1959)', { size: 19 })] }),
        new TableRow({ children: [cell('Dataset', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('IMK_IbnuKhaldun_DUMMY_v3.xlsx', { size: 19 })] }),
        new TableRow({ children: [cell('Instrument', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('Inventori Minat Kerjaya (IMK)', { size: 19 })] }),
        new TableRow({ children: [cell('Students Covered', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('50 students — SBP5IK001 to SBP5IK050', { size: 19 })] }),
        new TableRow({ children: [cell('Weight in Matching', { w: CONTENT/2|0, bold: true, bg: LGRAY, size: 19 }), cell('15% of total scholarship match score', { size: 19 })] }),
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 1. WHAT IS RIASEC?
// ═══════════════════════════════════════════════════════════════════
function whatIsRiasec() {
  return [
    sh1('1.  What is RIASEC?', 'what'),
    hLine(),
    body(
      'RIASEC is a career interest model developed by psychologist John L. Holland in 1959. ' +
      'It is one of the most widely used career assessment frameworks in the world, adopted by ' +
      'universities, career counsellors, and national education systems including Malaysia.'
    ),
    spacer(6),
    body(
      'The model proposes that people can be categorised into six personality types based on their ' +
      'interests, and that different careers attract different personality types. The six letters in ' +
      'RIASEC each represent one personality type.'
    ),
    spacer(6),
    callout(
      'In this system, RIASEC is used to measure what kind of work environment and career a student ' +
      'is naturally drawn to — and to match that profile with scholarships that fund studies in ' +
      'aligned fields.',
      LPURP, PURPLE
    ),
    spacer(10),

    sh2('1.1  The Six RIASEC Types'),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [600, 400, 1800, 3200, 4746],
      rows: [
        new TableRow({ children: [
          hdrCell('Code', NAVY, { w: 600, align: AlignmentType.CENTER }),
          hdrCell('Letter', NAVY, { w: 400, align: AlignmentType.CENTER }),
          hdrCell('Type', NAVY, { w: 1800 }),
          hdrCell('Key Traits', NAVY, { w: 3200 }),
          hdrCell('Example Career Paths', NAVY, { w: 4746 }),
        ]}),
        new TableRow({ children: [
          cell('R', { w: 600, bold: true, size: 28, color: WHITE, bg: '0369A1', align: AlignmentType.CENTER }),
          cell('R', { w: 400, bold: true, bg: LBLUE, align: AlignmentType.CENTER }),
          cell('Realistic', { w: 1800, bold: true, bg: LBLUE }),
          cell('Practical, hands-on, mechanical, athletic', { w: 3200, bg: LBLUE }),
          cell('Engineer, Technician, Pilot, Architect, Soldier', { w: 4746, bg: LBLUE }),
        ]}),
        new TableRow({ children: [
          cell('I', { w: 600, bold: true, size: 28, color: WHITE, bg: '065F46', align: AlignmentType.CENTER }),
          cell('I', { w: 400, bold: true, bg: LGREEN, align: AlignmentType.CENTER }),
          cell('Investigative', { w: 1800, bold: true, bg: LGREEN }),
          cell('Analytical, curious, scientific, logical', { w: 3200, bg: LGREEN }),
          cell('Doctor, Scientist, Researcher, Pharmacist, Data Analyst', { w: 4746, bg: LGREEN }),
        ]}),
        new TableRow({ children: [
          cell('A', { w: 600, bold: true, size: 28, color: WHITE, bg: PURPLE, align: AlignmentType.CENTER }),
          cell('A', { w: 400, bold: true, bg: LPURP, align: AlignmentType.CENTER }),
          cell('Artistic', { w: 1800, bold: true, bg: LPURP }),
          cell('Creative, expressive, imaginative, intuitive', { w: 3200, bg: LPURP }),
          cell('Graphic Designer, Architect, Writer, Musician, Film Director', { w: 4746, bg: LPURP }),
        ]}),
        new TableRow({ children: [
          cell('S', { w: 600, bold: true, size: 28, color: WHITE, bg: AMBER, align: AlignmentType.CENTER }),
          cell('S', { w: 400, bold: true, bg: LAMBER, align: AlignmentType.CENTER }),
          cell('Social', { w: 1800, bold: true, bg: LAMBER }),
          cell('Helpful, cooperative, empathetic, communicative', { w: 3200, bg: LAMBER }),
          cell('Teacher, Counsellor, Nurse, Social Worker, Psychologist', { w: 4746, bg: LAMBER }),
        ]}),
        new TableRow({ children: [
          cell('E', { w: 600, bold: true, size: 28, color: WHITE, bg: RED, align: AlignmentType.CENTER }),
          cell('E', { w: 400, bold: true, bg: LRED, align: AlignmentType.CENTER }),
          cell('Enterprising', { w: 1800, bold: true, bg: LRED }),
          cell('Persuasive, ambitious, leadership-oriented, competitive', { w: 3200, bg: LRED }),
          cell('Lawyer, Entrepreneur, Manager, Politician, Banker', { w: 4746, bg: LRED }),
        ]}),
        new TableRow({ children: [
          cell('K', { w: 600, bold: true, size: 28, color: WHITE, bg: TEAL, align: AlignmentType.CENTER }),
          cell('K', { w: 400, bold: true, bg: LTEAL, align: AlignmentType.CENTER }),
          cell('Conventional', { w: 1800, bold: true, bg: LTEAL }),
          cell('Organised, detail-oriented, systematic, rule-following', { w: 3200, bg: LTEAL }),
          cell('Accountant, Actuary, Administrator, Data Entry, Auditor', { w: 4746, bg: LTEAL }),
        ]}),
      ]
    }),
    spacer(6),
    body(
      'Note: In the original Holland model, the sixth type is "Conventional" with the letter C. ' +
      'In the Malaysian IMK instrument, this is labelled K (Konvensional) to align with Bahasa Malaysia terminology.',
      { italic: true, size: 18, color: DGRAY }
    ),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 2. IMK INSTRUMENT
// ═══════════════════════════════════════════════════════════════════
function imkInstrument() {
  return [
    sh1('2.  The IMK Instrument', 'imk'),
    hLine(),
    body(
      'IMK stands for Inventori Minat Kerjaya — a career interest inventory used by the Malaysian ' +
      'Ministry of Education. Students complete this assessment as part of their school counselling ' +
      'programme. It measures how strongly a student leans toward each of the six RIASEC dimensions.'
    ),
    spacer(6),
    body(
      'The assessment presents students with a series of activities, occupations, and competencies. ' +
      'Students rate how much they enjoy or are interested in each item. The system then tallies the ' +
      'scores for each RIASEC dimension.'
    ),
    spacer(8),

    sh2('2.1  IMK Dataset Structure'),
    body('The file IMK_IbnuKhaldun_DUMMY_v3.xlsx contains one row per student with the following columns:'),
    spacer(6),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [1800, 1400, 2600, 4046],
      rows: [
        new TableRow({ children: [
          hdrCell('Column', NAVY, { w: 1800 }),
          hdrCell('Data Type', NAVY, { w: 1400 }),
          hdrCell('Example Value', NAVY, { w: 2600 }),
          hdrCell('Description', NAVY, { w: 4046 }),
        ]}),
        new TableRow({ children: [cell('Student ID', { w: 1800, bold: true, bg: LGRAY }), cell('String', { w: 1400, bg: LGRAY, italic: true }), cell('SBP5IK001', { w: 2600, bg: LGRAY }), cell('Unique student identifier — used to link with other datasets', { w: 4046, bg: LGRAY })] }),
        new TableRow({ children: [cell('Score R', { w: 1800, bold: true }), cell('Number (0–100)', { w: 1400, italic: true }), cell('72', { w: 2600 }), cell('Realistic dimension score', { w: 4046 })] }),
        new TableRow({ children: [cell('Score I', { w: 1800, bold: true, bg: LGRAY }), cell('Number (0–100)', { w: 1400, bg: LGRAY, italic: true }), cell('85', { w: 2600, bg: LGRAY }), cell('Investigative dimension score', { w: 4046, bg: LGRAY })] }),
        new TableRow({ children: [cell('Score A', { w: 1800, bold: true }), cell('Number (0–100)', { w: 1400, italic: true }), cell('91', { w: 2600 }), cell('Artistic dimension score', { w: 4046 })] }),
        new TableRow({ children: [cell('Score S', { w: 1800, bold: true, bg: LGRAY }), cell('Number (0–100)', { w: 1400, bg: LGRAY, italic: true }), cell('68', { w: 2600, bg: LGRAY }), cell('Social dimension score', { w: 4046, bg: LGRAY })] }),
        new TableRow({ children: [cell('Score E', { w: 1800, bold: true }), cell('Number (0–100)', { w: 1400, italic: true }), cell('77', { w: 2600 }), cell('Enterprising dimension score', { w: 4046 })] }),
        new TableRow({ children: [cell('Score K', { w: 1800, bold: true, bg: LGRAY }), cell('Number (0–100)', { w: 1400, bg: LGRAY, italic: true }), cell('60', { w: 2600, bg: LGRAY }), cell('Conventional (Konvensional) dimension score', { w: 4046, bg: LGRAY })] }),
      ]
    }),
    spacer(8),

    sh2('2.2  How the Holland Code is Derived'),
    body(
      'A student\'s Holland Code is not just one letter — it is the top three RIASEC dimensions ' +
      'ranked from highest score to lowest. This three-letter code gives a more nuanced picture ' +
      'of the student\'s interests than a single type alone.'
    ),
    spacer(6),
    callout(
      'Step 1: List all 6 scores  →  R=72, I=85, A=91, S=68, E=77, K=60\n' +
      'Step 2: Sort from highest to lowest  →  A(91) > I(85) > E(77) > R(72) > S(68) > K(60)\n' +
      'Step 3: Take top 3  →  Holland Code = A - I - E\n' +
      'Result: This student is primarily Artistic, secondarily Investigative, and thirdly Enterprising.',
      LPURP, PURPLE
    ),
    spacer(8),

    sh2('2.3  Holland Code to Career Field Mapping'),
    body('The system maps the top (first) RIASEC code to a field of interest and a dream career suggestion:'),
    spacer(6),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [600, 1800, 3000, 4346],
      rows: [
        new TableRow({ children: [
          hdrCell('Code', NAVY, { w: 600, align: AlignmentType.CENTER }),
          hdrCell('Type', NAVY, { w: 1800 }),
          hdrCell('Field of Interest', NAVY, { w: 3000 }),
          hdrCell('Dream Career Suggestion', NAVY, { w: 4346 }),
        ]}),
        new TableRow({ children: [cell('R', { w: 600, bold: true, bg: LBLUE, align: AlignmentType.CENTER }), cell('Realistic', { w: 1800, bg: LBLUE }), cell('Kejuruteraan & Teknologi', { w: 3000, bg: LBLUE }), cell('Jurutera / Juruteknik', { w: 4346, bg: LBLUE })] }),
        new TableRow({ children: [cell('I', { w: 600, bold: true, bg: LGREEN, align: AlignmentType.CENTER }), cell('Investigative', { w: 1800, bg: LGREEN }), cell('Sains & Perubatan', { w: 3000, bg: LGREEN }), cell('Doktor / Saintis / Penyelidik', { w: 4346, bg: LGREEN })] }),
        new TableRow({ children: [cell('A', { w: 600, bold: true, bg: LPURP, align: AlignmentType.CENTER }), cell('Artistic', { w: 1800, bg: LPURP }), cell('Seni & Komunikasi', { w: 3000, bg: LPURP }), cell('Pereka Grafik / Arkitek', { w: 4346, bg: LPURP })] }),
        new TableRow({ children: [cell('S', { w: 600, bold: true, bg: LAMBER, align: AlignmentType.CENTER }), cell('Social', { w: 1800, bg: LAMBER }), cell('Pendidikan & Khidmat Sosial', { w: 3000, bg: LAMBER }), cell('Guru / Kaunselor / Jururawat', { w: 4346, bg: LAMBER })] }),
        new TableRow({ children: [cell('E', { w: 600, bold: true, bg: LRED, align: AlignmentType.CENTER }), cell('Enterprising', { w: 1800, bg: LRED }), cell('Perniagaan & Kepimpinan', { w: 3000, bg: LRED }), cell('Usahawan / Pengurus / Peguam', { w: 4346, bg: LRED })] }),
        new TableRow({ children: [cell('K', { w: 600, bold: true, bg: LTEAL, align: AlignmentType.CENTER }), cell('Conventional', { w: 1800, bg: LTEAL }), cell('Perakaunan & Pentadbiran', { w: 3000, bg: LTEAL }), cell('Akauntan / Juruaudit / Pentadbir', { w: 4346, bg: LTEAL })] }),
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 3. HOW RIASEC IS USED IN THE SYSTEM
// ═══════════════════════════════════════════════════════════════════
function riasecInSystem() {
  return [
    sh1('3.  How RIASEC is Used in the System', 'usage'),
    hLine(),
    body(
      'RIASEC data flows through all three agents in the pipeline. Each agent uses it differently:'
    ),
    spacer(8),

    sh2('3.1  In Agent 1 — Student Profiling Agent'),
    body('Agent 1 reads the six raw IMK scores and performs three actions:'),
    spacer(6),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [600, 2800, 6346],
      rows: [
        new TableRow({ children: [hdrCell('Step', NAVY, { w: 600, align: AlignmentType.CENTER }), hdrCell('Action', NAVY, { w: 2800 }), hdrCell('Output', NAVY, { w: 6346 })] }),
        new TableRow({ children: [
          cell('1', { w: 600, bold: true, align: AlignmentType.CENTER, bg: LPURP }),
          cell('Sort scores', { w: 2800, bold: true, bg: LPURP }),
          cell('Ranks all 6 scores from highest to lowest', { w: 6346, bg: LPURP }),
        ]}),
        new TableRow({ children: [
          cell('2', { w: 600, bold: true, align: AlignmentType.CENTER }),
          cell('Extract top 3', { w: 2800, bold: true }),
          cell('Sets riasecType = ["Artistic", "Investigative", "Enterprising"] (example)', { w: 6346 }),
        ]}),
        new TableRow({ children: [
          cell('3', { w: 600, bold: true, align: AlignmentType.CENTER, bg: LPURP }),
          cell('Map to career field', { w: 2800, bold: true, bg: LPURP }),
          cell('Sets fieldOfInterest = "Seni & Komunikasi" and dreamCareer = "Pereka Grafik / Arkitek" based on top code (A)', { w: 6346, bg: LPURP }),
        ]}),
      ]
    }),
    spacer(8),

    sh2('3.2  In Agent 2 — Scholarship Matching Agent'),
    body(
      'Agent 2 compares the student\'s riasecType (top-3 codes) against each scholarship\'s ' +
      'preferredRiasec list. If there is an overlap, the student earns points in the ' +
      'Psychometric dimension (15% of total match score).'
    ),
    spacer(6),
    callout(
      'Example: Student Holland Code = [Artistic, Investigative, Enterprising]\n' +
      'Scholarship X prefers: [Investigative, Realistic]\n' +
      'Overlap found: Investigative → Psychometric score awarded for this scholarship',
      LGREEN, GREEN
    ),
    spacer(8),

    sh2('3.3  In Agent 3 — Recommendation Agent'),
    body(
      'Agent 3 uses the fieldOfInterest and dreamCareer values in the written recommendation ' +
      'output. These appear in the reasoning shown to the student — for example: ' +
      '"This scholarship aligns with your interest in Seni & Komunikasi and your aspiration ' +
      'to become a Pereka Grafik."'
    ),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 4. RIASEC AND SCHOLARSHIP MATCHING
// ═══════════════════════════════════════════════════════════════════
function riasecMatching() {
  return [
    sh1('4.  RIASEC and Scholarship Matching', 'matching'),
    hLine(),
    body(
      'Each of the 10 scholarships in the system has a list of preferred RIASEC types. ' +
      'This represents the fields of study that the scholarship typically funds. ' +
      'The table below shows the RIASEC preferences for all 10 scholarships:'
    ),
    spacer(8),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [800, 3400, 5546],
      rows: [
        new TableRow({ children: [
          hdrCell('ID', NAVY, { w: 800 }),
          hdrCell('Scholarship', NAVY, { w: 3400 }),
          hdrCell('Preferred RIASEC Types (Fields Funded)', NAVY, { w: 5546 }),
        ]}),
        new TableRow({ children: [cell('BIA001', { w: 800, bold: true, bg: LGRAY }), cell('JPA – Program Penajaan Nasional (PPN)', { w: 3400, bg: LGRAY }), cell('Investigative (I), Realistic (R), Enterprising (E) — Science, Engineering, Law, Medicine', { w: 5546, bg: LGRAY })] }),
        new TableRow({ children: [cell('BIA002', { w: 800, bold: true }), cell('JPA – Program Khas Lepasan SPM LSPM', { w: 3400 }), cell('Investigative (I), Conventional (K), Social (S) — Science, Admin, Education', { w: 5546 })] }),
        new TableRow({ children: [cell('BIA003', { w: 800, bold: true, bg: LGRAY }), cell('JPA – Program Khas JPA MARA (PKJM)', { w: 3400, bg: LGRAY }), cell('Investigative (I), Realistic (R) — STEM fields, Technical', { w: 5546, bg: LGRAY })] }),
        new TableRow({ children: [cell('BIA004', { w: 800, bold: true }), cell('MARA – Young Talent Development (YTP)', { w: 3400 }), cell('Realistic (R), Investigative (I), Enterprising (E) — Engineering, Business, Technology', { w: 5546 })] }),
        new TableRow({ children: [cell('BIA005', { w: 800, bold: true, bg: LGRAY }), cell('PETRONAS PESP Sponsorship', { w: 3400, bg: LGRAY }), cell('Realistic (R), Investigative (I) — Engineering, Petroleum, Science', { w: 5546, bg: LGRAY })] }),
        new TableRow({ children: [cell('BIA006', { w: 800, bold: true }), cell('Shell Malaysia Scholarship', { w: 3400 }), cell('Realistic (R), Investigative (I), Enterprising (E) — Engineering, Science, Business', { w: 5546 })] }),
        new TableRow({ children: [cell('BIA007', { w: 800, bold: true, bg: LGRAY }), cell('Khazanah Watan Scholarship', { w: 3400, bg: LGRAY }), cell('Investigative (I), Enterprising (E), Conventional (K) — Finance, Law, Business', { w: 5546, bg: LGRAY })] }),
        new TableRow({ children: [cell('BIA008', { w: 800, bold: true }), cell('YTN – TNB Prime Scholarship', { w: 3400 }), cell('Realistic (R), Investigative (I) — Electrical Engineering, Energy Technology', { w: 5546 })] }),
        new TableRow({ children: [cell('BIA009', { w: 800, bold: true, bg: LGRAY }), cell('Biasiswa Yayasan Pahang', { w: 3400, bg: LGRAY }), cell('All types accepted — open to all fields for Pahang B40 students', { w: 5546, bg: LGRAY })] }),
        new TableRow({ children: [cell('BIA010', { w: 800, bold: true }), cell('Biasiswa Yayasan UEM', { w: 3400 }), cell('Realistic (R), Investigative (I), Enterprising (E) — Engineering, Construction, Business', { w: 5546 })] }),
      ]
    }),
    spacer(8),
    callout(
      'Observation: Most scholarships prefer Realistic (R) and Investigative (I) types — reflecting ' +
      'the strong demand for STEM graduates in Malaysia. Students with Artistic (A) or Social (S) ' +
      'profiles may score lower on the psychometric dimension for most scholarships, but will still ' +
      'be matched based on the other four dimensions (Academic, PAJSK, Aspiration, Income).',
      LAMBER, AMBER
    ),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 5. WEIGHT IN THE MATCHING FORMULA
// ═══════════════════════════════════════════════════════════════════
function weightSection() {
  return [
    sh1('5.  Weight in the Matching Formula', 'weight'),
    hLine(),
    body(
      'The RIASEC psychometric dimension contributes 15% to the total scholarship match score. ' +
      'It is one of five dimensions used by Agent 2 to calculate how well a student fits each scholarship.'
    ),
    spacer(8),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [500, 2800, 1600, 5000 - 154],
      rows: [
        new TableRow({ children: [
          hdrCell('#', NAVY, { w: 500, align: AlignmentType.CENTER }),
          hdrCell('Dimension', NAVY, { w: 2800 }),
          hdrCell('Weight', NAVY, { w: 1600, align: AlignmentType.CENTER }),
          hdrCell('Data Source', NAVY, { w: 4846 }),
        ]}),
        new TableRow({ children: [cell('1', { w: 500, align: AlignmentType.CENTER, bg: LGRAY }), cell('Academic Performance', { w: 2800, bg: LGRAY }), cell('35%', { w: 1600, align: AlignmentType.CENTER, color: NAVY, bg: LGRAY }), cell('SPM grades + GP score', { w: 4846, bg: LGRAY })] }),
        new TableRow({ children: [cell('2', { w: 500, align: AlignmentType.CENTER }), cell('PAJSK Co-curricular', { w: 2800 }), cell('20%', { w: 1600, align: AlignmentType.CENTER, color: NAVY }), cell('PAJSK markah + pencapaian', { w: 4846 })] }),
        new TableRow({ children: [
          cell('3', { w: 500, bold: true, align: AlignmentType.CENTER, bg: LPURP }),
          cell('Psychometric — RIASEC', { w: 2800, bold: true, bg: LPURP }),
          cell('15%', { w: 1600, bold: true, align: AlignmentType.CENTER, color: PURPLE, bg: LPURP }),
          cell('IMK Holland Code (top-3 RIASEC types)  ← This document', { w: 4846, bold: true, bg: LPURP }),
        ]}),
        new TableRow({ children: [cell('4', { w: 500, align: AlignmentType.CENTER, bg: LGRAY }), cell('Career Aspiration', { w: 2800, bg: LGRAY }), cell('15%', { w: 1600, align: AlignmentType.CENTER, color: NAVY, bg: LGRAY }), cell('fieldOfInterest + dreamCareer (derived from RIASEC top code)', { w: 4846, bg: LGRAY })] }),
        new TableRow({ children: [cell('5', { w: 500, align: AlignmentType.CENTER }), cell('Parent / Family Background', { w: 2800 }), cell('15%', { w: 1600, align: AlignmentType.CENTER, color: NAVY }), cell('Per-capita income → B40 / M40 / T20', { w: 4846 })] }),
        new TableRow({ children: [
          cell('', { w: 500, bg: NAVY }),
          cell('TOTAL', { w: 2800, bold: true, bg: NAVY, color: WHITE }),
          cell('100%', { w: 1600, bold: true, align: AlignmentType.CENTER, bg: NAVY, color: WHITE }),
          cell('', { w: 4846, bg: NAVY }),
        ]}),
      ]
    }),
    spacer(8),
    callout(
      'Note: The Career Aspiration dimension (15%) is also derived from RIASEC data — it uses the ' +
      'fieldOfInterest and dreamCareer values that were mapped from the student\'s top RIASEC code. ' +
      'This means RIASEC data effectively influences 30% of the total match score (15% direct + 15% indirect).',
      LGREEN, GREEN
    ),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 6. EXAMPLE — FULL RIASEC PROFILE
// ═══════════════════════════════════════════════════════════════════
function exampleProfile() {
  return [
    sh1('6.  Example: Full RIASEC Profile', 'example'),
    hLine(),
    body('The following is a real example showing how RIASEC data is processed for Student SBP5IK001:'),
    spacer(8),

    sh2('Step 1 — Raw IMK Scores (from dataset)'),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [1000, 1400, 1400, 1400, 1400, 1400, 2746],
      rows: [
        new TableRow({ children: [
          hdrCell('Dimension', NAVY, { w: 1000 }),
          hdrCell('R', NAVY, { w: 1400, align: AlignmentType.CENTER }),
          hdrCell('I', NAVY, { w: 1400, align: AlignmentType.CENTER }),
          hdrCell('A', NAVY, { w: 1400, align: AlignmentType.CENTER }),
          hdrCell('S', NAVY, { w: 1400, align: AlignmentType.CENTER }),
          hdrCell('E', NAVY, { w: 1400, align: AlignmentType.CENTER }),
          hdrCell('K', NAVY, { w: 2746, align: AlignmentType.CENTER }),
        ]}),
        new TableRow({ children: [
          cell('Score', { w: 1000, bold: true, bg: LGRAY }),
          cell('68', { w: 1400, align: AlignmentType.CENTER, bg: LBLUE }),
          cell('72', { w: 1400, align: AlignmentType.CENTER, bg: LBLUE }),
          cell('91', { w: 1400, bold: true, align: AlignmentType.CENTER, bg: LPURP, color: PURPLE }),
          cell('55', { w: 1400, align: AlignmentType.CENTER, bg: LBLUE }),
          cell('63', { w: 1400, align: AlignmentType.CENTER, bg: LBLUE }),
          cell('48', { w: 2746, align: AlignmentType.CENTER, bg: LBLUE }),
        ]}),
      ]
    }),
    spacer(6),

    sh2('Step 2 — Sort & Derive Holland Code'),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [600, 1600, 1600, 7046 - 454],
      rows: [
        new TableRow({ children: [hdrCell('Rank', NAVY, { w: 600, align: AlignmentType.CENTER }), hdrCell('Type', NAVY, { w: 1600 }), hdrCell('Score', NAVY, { w: 1600, align: AlignmentType.CENTER }), hdrCell('Included in Holland Code?', NAVY, { w: 6592 })] }),
        new TableRow({ children: [cell('1st', { w: 600, bold: true, bg: LPURP, align: AlignmentType.CENTER }), cell('Artistic (A)', { w: 1600, bold: true, bg: LPURP, color: PURPLE }), cell('91', { w: 1600, bold: true, align: AlignmentType.CENTER, bg: LPURP }), cell('YES — Top code (maps to Seni & Komunikasi)', { w: 6592, bold: true, bg: LPURP })] }),
        new TableRow({ children: [cell('2nd', { w: 600, bold: true, bg: LGREEN, align: AlignmentType.CENTER }), cell('Investigative (I)', { w: 1600, bold: true, bg: LGREEN, color: GREEN }), cell('72', { w: 1600, bold: true, align: AlignmentType.CENTER, bg: LGREEN }), cell('YES — Second code', { w: 6592, bold: true, bg: LGREEN })] }),
        new TableRow({ children: [cell('3rd', { w: 600, bold: true, bg: LBLUE, align: AlignmentType.CENTER }), cell('Realistic (R)', { w: 1600, bold: true, bg: LBLUE, color: BLUE }), cell('68', { w: 1600, bold: true, align: AlignmentType.CENTER, bg: LBLUE }), cell('YES — Third code', { w: 6592, bold: true, bg: LBLUE })] }),
        new TableRow({ children: [cell('4th', { w: 600, align: AlignmentType.CENTER }), cell('Enterprising (E)', { w: 1600 }), cell('63', { w: 1600, align: AlignmentType.CENTER }), cell('No — outside top 3', { w: 6592, color: DGRAY, italic: true })] }),
        new TableRow({ children: [cell('5th', { w: 600, align: AlignmentType.CENTER, bg: LGRAY }), cell('Social (S)', { w: 1600, bg: LGRAY }), cell('55', { w: 1600, align: AlignmentType.CENTER, bg: LGRAY }), cell('No — outside top 3', { w: 6592, color: DGRAY, italic: true, bg: LGRAY })] }),
        new TableRow({ children: [cell('6th', { w: 600, align: AlignmentType.CENTER }), cell('Conventional (K)', { w: 1600 }), cell('48', { w: 1600, align: AlignmentType.CENTER }), cell('No — outside top 3', { w: 6592, color: DGRAY, italic: true })] }),
      ]
    }),
    spacer(6),

    sh2('Step 3 — Final Output (stored in Student Profile)'),
    new Table({
      width: { size: CONTENT, type: WidthType.DXA },
      columnWidths: [2800, 7046],
      rows: [
        new TableRow({ children: [hdrCell('Field', NAVY, { w: 2800 }), hdrCell('Value', NAVY, { w: 7046 })] }),
        new TableRow({ children: [cell('riasecType', { w: 2800, bold: true, bg: LGRAY, italic: true }), cell('["Artistic", "Investigative", "Realistic"]', { w: 7046, bg: LGRAY })] }),
        new TableRow({ children: [cell('fieldOfInterest', { w: 2800, bold: true, italic: true }), cell('Seni & Komunikasi', { w: 7046 })] }),
        new TableRow({ children: [cell('preferredField', { w: 2800, bold: true, bg: LGRAY, italic: true }), cell('Seni & Komunikasi', { w: 7046, bg: LGRAY })] }),
        new TableRow({ children: [cell('dreamCareer', { w: 2800, bold: true, italic: true }), cell('Pereka Grafik / Arkitek', { w: 7046 })] }),
      ]
    }),
    spacer(10),
    hLine(NAVY),
    body('End of Document — RIASEC: Holland Code Career Interest Model', { color: DGRAY, italic: true, align: AlignmentType.CENTER, before: 120, after: 60, size: 19 }),
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
        border: { bottom: b6 }, spacing: { before: 0, after: 100 },
        children: [
          new TextRun({ text: 'RIASEC — Holland Code Documentation  |  Psychometric Component', size: 17, color: NAVY, font: 'Arial' }),
          new TextRun({ text: '\tDELIMa KPM  ·  PRESTIJ Programme', size: 17, color: DGRAY, font: 'Arial' }),
        ],
        tabStops: [{ type: docx.TabStopType.RIGHT, position: docx.TabStopPosition.MAX }]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        border: { top: b6 }, spacing: { before: 80, after: 0 },
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
      ...whatIsRiasec(),
      ...imkInstrument(),
      ...riasecInSystem(),
      ...riasecMatching(),
      ...weightSection(),
      ...exampleProfile(),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = 'C:/Users/user/Documents/AI Agentic Schollarship Final/RIASEC_Psychometric_Documentation.docx';
  fs.writeFileSync(out, buf);
  console.log('Done:', out, '| Size:', (buf.length / 1024).toFixed(1), 'KB');
});
