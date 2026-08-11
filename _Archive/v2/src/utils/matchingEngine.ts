import {
  StudentProfile,
  Scholarship,
  CalculatedMatch,
  MatchBreakdown,
  PotentialAnalysis,
  CareerPathway,
  SpmGrade,
  RiasecType,
} from '../types';
import { CAREER_PATHWAYS } from '../data/mockData';

const GRADE_POINTS: Record<SpmGrade, number> = {
  'A+': 10,
  'A': 9,
  'A-': 8,
  'B+': 7,
  'B': 6,
  'C+': 5,
  'C': 4,
  'D': 3,
  'E': 2,
  'G': 1,
};

export function evaluateAcademicScore(student: StudentProfile): {
  score: number;
  aCount: number;
  aPlusCount: number;
  totalSubjects: number;
  summary: string;
} {
  const grades = Object.values(student.spmGrades) as SpmGrade[];
  const totalSubjects = grades.length;
  const maxPoints = totalSubjects * 10;
  const totalPoints = grades.reduce((sum, g) => sum + (GRADE_POINTS[g] ?? 2), 0);
  const score = (totalPoints / maxPoints) * 100;

  const aPlusCount = grades.filter(g => g === 'A+').length;
  const aCount = grades.filter(g => g === 'A+' || g === 'A' || g === 'A-').length;

  const summary = `${aPlusCount}A+ ${aCount - aPlusCount}A dalam ${totalSubjects} mata pelajaran`;
  return { score, aCount, aPlusCount, totalSubjects, summary };
}

function computeAcademicFactor(student: StudentProfile, scholarship: Scholarship): number {
  const { aCount, score } = evaluateAcademicScore(student);
  // Check minimum A count requirement
  if (aCount < scholarship.minSpmRequirement) {
    const deficit = scholarship.minSpmRequirement - aCount;
    return Math.max(10, score - deficit * 8);
  }
  const surplus = aCount - scholarship.minSpmRequirement;
  return Math.min(100, score + surplus * 2);
}

function computePajskFactor(student: StudentProfile, scholarship: Scholarship): number {
  const diff = student.pajskScore - scholarship.pajskRequirement;
  if (diff >= 10) return 100;
  if (diff >= 0) return 80 + diff * 2;
  return Math.max(0, 80 + diff * 5);
}

function computePsychometricFactor(student: StudentProfile, scholarship: Scholarship): number {
  const studentRiasec = new Set<RiasecType>(student.riasecType);
  const matches = scholarship.preferredRiasec.filter(r => studentRiasec.has(r)).length;
  if (matches >= 2) return 100;
  if (matches === 1) return 80;
  return 55;
}

function computeAspirationFactor(student: StudentProfile, scholarship: Scholarship): number {
  const fieldMatch = scholarship.preferredFields.some(
    f => f.toLowerCase().includes(student.preferredField.toLowerCase()) ||
         student.preferredField.toLowerCase().includes(f.toLowerCase())
  );
  let score = fieldMatch ? 100 : 65;

  // Boost if dreamCareer aligns with scholarship field
  const careerBoost = scholarship.preferredFields.some(
    f => student.dreamCareer.toLowerCase().includes(f.toLowerCase()) ||
         f.toLowerCase().split(' ').some(w => student.dreamCareer.toLowerCase().includes(w))
  );
  if (careerBoost) score = Math.min(100, score + 10);
  return score;
}

function computeParentBackgroundFactor(student: StudentProfile, scholarship: Scholarship): number {
  const req = scholarship.parentCategoryRequired;
  const cat = student.parentCategory;

  if (req === 'All') return 100;
  if (req === 'B40') {
    if (cat === 'B40') return 100;
    if (cat === 'M40') return 60;
    return 20;
  }
  if (req === 'B40/M40') {
    if (cat === 'B40' || cat === 'M40') return 100;
    return 30;
  }
  if (req === 'M40') {
    if (cat === 'M40') return 100;
    if (cat === 'B40') return 85;
    return 50;
  }
  if (req === 'T20') {
    if (cat === 'T20') return 100;
    return 70;
  }
  return 80;
}

function buildReasons(
  student: StudentProfile,
  scholarship: Scholarship,
  breakdown: MatchBreakdown
): string[] {
  const reasons: string[] = [];
  const { aCount } = evaluateAcademicScore(student);

  if (breakdown.academic >= 85) {
    reasons.push(`Pencapaian akademik cemerlang (${aCount}A) melebihi syarat minimum ${scholarship.minSpmRequirement}A`);
  } else if (breakdown.academic >= 65) {
    reasons.push(`Pencapaian akademik memenuhi syarat (${aCount}A berbanding syarat ${scholarship.minSpmRequirement}A)`);
  } else {
    reasons.push(`Pencapaian akademik di bawah syarat optimum (${aCount}A, syarat ${scholarship.minSpmRequirement}A)`);
  }

  if (breakdown.pajsk >= 80) {
    reasons.push(`Skor PAJSK ${student.pajskScore} mengatasi keperluan kokurikulum (${scholarship.pajskRequirement})`);
  } else {
    reasons.push(`Skor PAJSK ${student.pajskScore} perlu ditingkatkan (keperluan: ${scholarship.pajskRequirement})`);
  }

  const riasecMatch = scholarship.preferredRiasec.filter(r => student.riasecType.includes(r));
  if (riasecMatch.length > 0) {
    reasons.push(`Profil psikometrik RIASEC sepadan: ${riasecMatch.join(', ')}`);
  } else {
    reasons.push('Profil RIASEC kurang sepadan dengan fokus biasiswa');
  }

  if (breakdown.aspiration >= 90) {
    reasons.push(`Aspirasi kerjaya "${student.dreamCareer}" sangat selaras dengan bidang biasiswa`);
  } else if (breakdown.aspiration >= 75) {
    reasons.push(`Bidang pilihan "${student.preferredField}" sepadan dengan fokus biasiswa`);
  } else {
    reasons.push(`Bidang minat "${student.preferredField}" berbeza sedikit daripada fokus biasiswa`);
  }

  const catLabel = { B40: 'B40', M40: 'M40', T20: 'T20' }[student.parentCategory];
  if (breakdown.parentBackground >= 90) {
    reasons.push(`Kategori pendapatan keluarga ${catLabel} layak sepenuhnya (syarat: ${scholarship.parentCategoryRequired})`);
  } else if (breakdown.parentBackground >= 60) {
    reasons.push(`Kategori ${catLabel} memenuhi sebahagian syarat (syarat: ${scholarship.parentCategoryRequired})`);
  } else {
    reasons.push(`Kategori ${catLabel} tidak memenuhi syarat keutamaan (syarat: ${scholarship.parentCategoryRequired})`);
  }

  return reasons;
}

export function computeScholarshipMatches(
  student: StudentProfile,
  scholarships: Scholarship[]
): CalculatedMatch[] {
  return scholarships
    .map(scholarship => {
      // Check bumiputera restriction
      const isBumi = ['Melayu', 'Iban', 'Kadazan', 'Orang Asli'].includes(student.ethnicity);
      if (scholarship.bumiputeraOnly && !isBumi) {
        return {
          scholarshipId: scholarship.id,
          scholarshipName: scholarship.name,
          provider: scholarship.provider,
          score: 0,
          breakdown: { academic: 0, pajsk: 0, psychometric: 0, aspiration: 0, parentBackground: 0 },
          reasons: ['Biasiswa ini khusus untuk pelajar Bumiputera sahaja.'],
          eligible: false,
        };
      }

      const academic = computeAcademicFactor(student, scholarship);
      const pajsk = computePajskFactor(student, scholarship);
      const psychometric = computePsychometricFactor(student, scholarship);
      const aspiration = computeAspirationFactor(student, scholarship);
      const parentBackground = computeParentBackgroundFactor(student, scholarship);

      const breakdown: MatchBreakdown = { academic, pajsk, psychometric, aspiration, parentBackground };

      const score =
        academic * 0.35 +
        pajsk * 0.20 +
        psychometric * 0.15 +
        aspiration * 0.15 +
        parentBackground * 0.15;

      const reasons = buildReasons(student, scholarship, breakdown);
      const { aCount } = evaluateAcademicScore(student);
      const eligible = aCount >= scholarship.minSpmRequirement && student.pajskScore >= scholarship.pajskRequirement;

      return {
        scholarshipId: scholarship.id,
        scholarshipName: scholarship.name,
        provider: scholarship.provider,
        score: Math.round(score * 10) / 10,
        breakdown,
        reasons,
        eligible,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function calculateStudentPotentials(student: StudentProfile): PotentialAnalysis {
  const grades = student.spmGrades;
  const getGradeScore = (subject: string): number => {
    const g = grades[subject] as SpmGrade | undefined;
    return g ? GRADE_POINTS[g] * 10 : 0;
  };

  const stemSubjects = ['Matematik', 'Matematik Tambahan', 'Fizik', 'Kimia', 'Biologi', 'Sains Komputer'];
  const stemScores = stemSubjects.map(getGradeScore).filter(s => s > 0);
  const stemAvg = stemScores.length > 0 ? stemScores.reduce((a, b) => a + b, 0) / stemScores.length : 50;

  const riasecBonus = student.riasecType.includes('Investigative') || student.riasecType.includes('Realistic') ? 8 : 0;
  const stem = Math.min(100, Math.round(stemAvg + riasecBonus));

  const leadershipMap: Record<string, number> = { High: 90, Medium: 70, Basic: 50 };
  const leadershipBase = leadershipMap[student.leadershipLevel] ?? 60;
  const pajskBonus = student.pajskScore > 85 ? 8 : student.pajskScore > 75 ? 4 : 0;
  const leadership = Math.min(100, Math.round(leadershipBase + pajskBonus));

  const artisticBonus = student.riasecType.includes('Artistic') ? 12 : 0;
  const enterpriseBonus = student.riasecType.includes('Enterprising') ? 8 : 0;
  const achievementBonus = student.keyAchievements.length * 3;
  const innovation = Math.min(100, Math.round(60 + artisticBonus + enterpriseBonus + achievementBonus));

  const langBm = getGradeScore('Bahasa Melayu');
  const langEn = getGradeScore('Bahasa Inggeris');
  const socialBonus = student.riasecType.includes('Social') ? 10 : 0;
  const communication = Math.min(100, Math.round((langBm + langEn) / 2 + socialBonus));

  return { stem, leadership, innovation, communication };
}

export function computeCareerPathways(student: StudentProfile): CareerPathway[] {
  const grades = student.spmGrades;
  const getGradeScore = (subject: string): number => {
    const g = grades[subject] as SpmGrade | undefined;
    return g ? GRADE_POINTS[g] : 0;
  };

  return CAREER_PATHWAYS.map(pathway => {
    const subjectScores = pathway.subjectsNeeded.map(getGradeScore).filter(s => s > 0);
    const subjectAvg = subjectScores.length > 0
      ? subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length
      : 5;

    const riasecMatches = pathway.riasecAlignment.filter(r => student.riasecType.includes(r)).length;
    const riasecScore = riasecMatches === 2 ? 100 : riasecMatches === 1 ? 75 : 40;

    const fieldMatch = pathway.name.toLowerCase().includes(student.preferredField.toLowerCase()) ||
      student.preferredField.toLowerCase().split(' ').some(w => pathway.name.toLowerCase().includes(w));

    const matchPercentage = Math.round(
      (subjectAvg / 10) * 40 +
      riasecScore * 0.40 +
      (fieldMatch ? 20 : 0)
    );

    return { ...pathway, matchPercentage: Math.min(100, matchPercentage) };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export function getAIReasoning(
  student: StudentProfile,
  matches: CalculatedMatch[],
  lang: 'en' | 'bm'
): string {
  const top = matches[0];
  const second = matches[1];
  const { aCount, aPlusCount } = evaluateAcademicScore(student);

  if (lang === 'bm') {
    return `Berdasarkan analisis 6-agen komprehensif, ${student.name} menunjukkan profil yang sangat kukuh. ` +
      `Pencapaian akademik ${aPlusCount}A+ dan ${aCount}A keseluruhan menunjukkan kecemerlangan dalam bidang yang dipilih. ` +
      `Skor PAJSK ${student.pajskScore}/100 mencerminkan penglibatan aktif dalam kokurikulum dan kepimpinan yang baik. ` +
      `Profil psikometrik RIASEC (${student.riasecType.join('/')}) sangat selaras dengan aspirasi kerjaya sebagai ${student.dreamCareer}. ` +
      `Bidang pilihan "${student.preferredField}" dan latar belakang keluarga (${student.parentCategory}) turut diambil kira dalam padanan ini. ` +
      `Cadangan utama: **${top?.scholarshipName}** (skor ${top?.score.toFixed(1)}%) ` +
      `${second ? `dan **${second.scholarshipName}** (skor ${second.score.toFixed(1)}%)` : ''} ` +
      `berdasarkan semua 5 faktor penilaian holistik.`;
  }

  return `Based on comprehensive 6-agent analysis, ${student.name} demonstrates a strong overall profile. ` +
    `Academic achievement of ${aPlusCount}A+ and ${aCount}A overall shows excellent performance in selected subjects. ` +
    `PAJSK score of ${student.pajskScore}/100 reflects active co-curricular participation and strong leadership qualities. ` +
    `The RIASEC psychometric profile (${student.riasecType.join('/')}) aligns well with the career aspiration of becoming a ${student.dreamCareer}. ` +
    `The preferred field "${student.preferredField}" and family background category (${student.parentCategory}) were also factored into the matching. ` +
    `Top recommendation: **${top?.scholarshipName}** (score ${top?.score.toFixed(1)}%) ` +
    `${second ? `and **${second.scholarshipName}** (score ${second.score.toFixed(1)}%)` : ''} ` +
    `based on all 5 holistic evaluation factors.`;
}
