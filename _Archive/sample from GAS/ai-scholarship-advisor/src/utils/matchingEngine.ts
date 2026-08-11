import { StudentProfile, Scholarship, CalculatedMatch, PotentialAnalysis, CareerPathway } from "../types";
import { SCHOLARSHIPS, CAREER_PATHWAYS } from "../data/mockData";

// Utility to count SPM grades has been defined
export function evaluateAcademicScore(spmGrades: { [subject: string]: string }): {
  score: number;
  aPlusCount: number;
  aCount: number;
  aMinusCount: number;
  summary: string;
} {
  let totalPoints = 0;
  let subjectCount = 0;
  let aPlusCount = 0;
  let aCount = 0;
  let aMinusCount = 0;

  for (const subject in spmGrades) {
    const grade = spmGrades[subject];
    subjectCount++;
    if (grade === "A+") {
      totalPoints += 10;
      aPlusCount++;
    } else if (grade === "A" || grade === "A ") {
      totalPoints += 9;
      aCount++;
    } else if (grade === "A-") {
      totalPoints += 8;
      aMinusCount++;
    } else if (grade === "B+" || grade === "B") {
      totalPoints += 7;
    } else if (grade === "B-" || grade === "C+" || grade === "C") {
      totalPoints += 5;
    } else {
      totalPoints += 3;
    }
  }

  const maxPoints = subjectCount * 10;
  const rawPercentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

  let summary = `${aPlusCount}A+`;
  if (aCount > 0) summary += `, ${aCount}A`;
  if (aMinusCount > 0) summary += `, ${aMinusCount}A-`;
  if (subjectCount === aPlusCount) summary = "Straight A+";

  return {
    score: Math.round(rawPercentage),
    aPlusCount,
    aCount,
    aMinusCount,
    summary
  };
}

// Logic to evaluate Student Potential Vectors
export function calculateStudentPotentials(student: StudentProfile): PotentialAnalysis {
  const acad = evaluateAcademicScore(student.spmGrades);
  
  // STEM potential: derived from Math, Add Math, Physics, Chemistry, Biology, Sciences
  let stemSubjects = ["Mathematics", "Add Mathematics", "Physics", "Chemistry", "Biology"];
  let stemPoints = 0;
  let stemCount = 0;
  for (const sub of stemSubjects) {
    if (student.spmGrades[sub]) {
      const g = student.spmGrades[sub];
      stemCount++;
      if (g === "A+") stemPoints += 10;
      else if (g === "A") stemPoints += 9;
      else if (g === "A-") stemPoints += 8;
      else if (g.startsWith("B")) stemPoints += 6;
      else stemPoints += 4;
    }
  }
  const stemScore = stemCount > 0 ? (stemPoints / (stemCount * 10)) * 100 : 70;

  // Leadership potential: derived from PAJSK achievement levels, and leadership attributes
  let leadScore = 60;
  if (student.leadershipLevel === "High") leadScore = 95;
  else if (student.leadershipLevel === "Medium") leadScore = 80;
  
  if (student.pajskScore > 90) leadScore += 5;
  leadScore = Math.min(leadScore, 100);

  // Innovation potential: driven by STEM, RIASEC Investigative/Artistic, key achievements
  let innovScore = 50;
  if (student.riasecType.includes("Investigative")) innovScore += 20;
  if (student.riasecType.includes("Artistic")) innovScore += 15;
  if (student.keyAchievements.some(a => a.toLowerCase().includes("robotic") || a.toLowerCase().includes("science") || a.toLowerCase().includes("hackathon"))) {
    innovScore += 15;
  }
  innovScore = Math.min(innovScore, 98);

  // Communication potential: driven by PAJSK, RIASEC Social/Enterprising, and Debate/Public speaking achievements
  let commScore = 55;
  if (student.riasecType.includes("Social")) commScore += 15;
  if (student.riasecType.includes("Enterprising")) commScore += 15;
  if (student.keyAchievements.some(a => a.toLowerCase().includes("debate") || a.toLowerCase().includes("public speaking") || a.toLowerCase().includes("prefect") || a.toLowerCase().includes("council"))) {
    commScore += 15;
  }
  commScore = Math.min(commScore, 96);

  return {
    stem: Math.round(stemScore),
    leadership: Math.round(leadScore),
    innovation: Math.round(innovScore),
    communication: Math.round(commScore)
  };
}

// Full matching logic mapping structural weights to output
export function computeScholarshipMatches(student: StudentProfile): CalculatedMatch[] {
  const acadEvaluation = evaluateAcademicScore(student.spmGrades);
  const potential = calculateStudentPotentials(student);

  return SCHOLARSHIPS.map(sch => {
    // 1. Academic Fit (40%)
    let academicScore = 0;
    const totalAsObj = acadEvaluation.aPlusCount + acadEvaluation.aCount + acadEvaluation.aMinusCount;

    if (sch.id === "jpa-khas") {
      // JPA has rigid straight A+ / 9A+ preferences
      academicScore = (acadEvaluation.aPlusCount >= 9) ? 100 : (totalAsObj >= 9 ? 85 : 60);
    } else if (sch.id === "khazanah-global") {
      // straight As
      academicScore = (acadEvaluation.aPlusCount + acadEvaluation.aCount >= 8 && acadEvaluation.aMinusCount === 0) ? 100 : (totalAsObj >= 8 ? 80 : 50);
    } else {
      // standard linear scaling
      academicScore = Math.min(100, acadEvaluation.score + 10);
    }

    // 2. PAJSK Fit (25%)
    let pajskDiff = student.pajskScore - sch.pajskRequirement;
    let pajskScore = 60;
    if (pajskDiff >= 10) pajskScore = 100;
    else if (pajskDiff >= 0) pajskScore = 80 + pajskDiff * 2;
    else pajskScore = Math.max(0, 80 + pajskDiff * 5); // penalize under-achievement slightly

    // 3. Career Interest & Subject Alignment (20%)
    let careerFit = 50;
    // count overlap in RIASEC
    const matchingRiasecCount = student.riasecType.filter(type => sch.preferredRiasec.includes(type)).length;
    if (matchingRiasecCount === 2) careerFit = 100;
    else if (matchingRiasecCount === 1) careerFit = 85;
    else careerFit = 60;

    // Field match
    const fieldMatch = sch.fieldOfStudyPattern.includes(student.fieldOfInterest);
    if (!fieldMatch) {
      careerFit = Math.max(30, careerFit - 25);
    }

    // 4. Leadership Alignment (15%)
    let leadershipScore = 50;
    if (student.leadershipLevel === "High") {
      leadershipScore = 100;
    } else if (student.leadershipLevel === "Medium") {
      leadershipScore = 80;
    } else {
      leadershipScore = 60;
    }

    // Total weighted score
    const weighted = Math.round(
      academicScore * 0.40 +
      pajskScore * 0.25 +
      careerFit * 0.20 +
      leadershipScore * 0.15
    );

    // Dynamic bullet explanations based on reasons
    const reasons: string[] = [];
    if (academicScore >= 90) {
      reasons.push(`Outstanding SPM performance (${acadEvaluation.summary}) aligns perfectly with ${sch.provider}'s selective benchmark.`);
    } else if (academicScore >= 75) {
      reasons.push(`Meets academic eligibility criteria with a balanced subject average.`);
    } else {
      reasons.push(`May require special scholastic reviews due to high minimum requirement thresholds.`);
    }

    if (student.pajskScore >= sch.pajskRequirement) {
      reasons.push(`Outstanding PAJSK score of ${student.pajskScore}% exceeds the prerequisite threshold of ${sch.pajskRequirement}% for extra-curricular capacity.`);
    }

    if (fieldMatch) {
      reasons.push(`Field target of "${student.fieldOfInterest}" directly correlates with sponsored modules.`);
    } else {
      reasons.push(`Secondary qualification because of misalignment in preferred field paths.`);
    }

    if (matchingRiasecCount >= 1) {
      reasons.push(`Your career personality profile (${student.riasecType.join("-")}) overlaps with the preferred ${sch.preferredRiasec.join("/")} index.`);
    }

    return {
      scholarshipId: sch.id,
      scholarshipName: sch.name,
      provider: sch.provider,
      score: Math.min(100, Math.max(10, weighted)),
      breakdown: {
        academic: Math.round(academicScore),
        pajsk: Math.round(pajskScore),
        careerFit: Math.round(careerFit),
        leadership: Math.round(leadershipScore)
      },
      reasons
    };
  }).sort((a, b) => b.score - a.score);
}

// Visual dynamic pathway calculation
export function computeCareerPathways(student: StudentProfile): CareerPathway[] {
  return CAREER_PATHWAYS.map(cp => {
    let match = 50;
    // evaluate grade in key subjects
    let subjectsPoints = 0;
    cp.subjectsNeeded.forEach(sub => {
      const g = student.spmGrades[sub];
      if (g) {
        if (g === "A+") subjectsPoints += 20;
        else if (g === "A") subjectsPoints += 17;
        else if (g === "A-") subjectsPoints += 14;
        else if (g.startsWith("B")) subjectsPoints += 10;
        else subjectsPoints += 5;
      } else {
        subjectsPoints += 5; // not taken
      }
    });

    const maxSubPoints = cp.subjectsNeeded.length * 20;
    const subPct = maxSubPoints > 0 ? (subjectsPoints / maxSubPoints) * 50 : 20; // up to 50%

    // Riasec match (up to 50%)
    const riasecMatchCount = student.riasecType.filter(type => cp.riasecAlignment.includes(type)).length;
    const riasecPct = riasecMatchCount === 2 ? 50 : (riasecMatchCount === 1 ? 40 : 25);

    const fFit = student.fieldOfInterest.toLowerCase().substring(0, 10);
    const cFit = cp.name.toLowerCase().substring(0, 10);
    let semanticBoost = 0;
    if (fFit.includes("engineer") && cFit.includes("engineer")) semanticBoost = 10;
    if (fFit.includes("medicine") && cFit.includes("clinical")) semanticBoost = 10;
    if (fFit.includes("computer") && cFit.includes("applied AI")) semanticBoost = 10;
    if (fFit.includes("finance") && cFit.includes("fintech")) semanticBoost = 10;
    if (fFit.includes("humanities") && cFit.includes("public")) semanticBoost = 10;

    const totalScore = Math.min(100, Math.round(subPct + riasecPct + semanticBoost));

    return {
      ...cp,
      matchPercentage: totalScore
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}

// Generate the narrative explanation corresponding to Agent 4 (Reasoning Agent)
export function getAIReasoning(student: StudentProfile, matches: CalculatedMatch[]): string {
  const acad = evaluateAcademicScore(student.spmGrades);
  const primeMatch = matches[0];
  const secondMatch = matches[1];

  if (!primeMatch) return "Analysis pending profiling completion.";

  const STEM_STRONG = student.spmGrades["Add Mathematics"] === "A+" || student.spmGrades["Physics"] === "A+";

  let reasoning = `Based on our comprehensive cognitive profiling, ${student.name} demonstrates strategic academic capability. `;
  
  if (acad.aPlusCount >= 7) {
    reasoning += `With an exceptional scholastic record containing ${acad.summary}, they demonstrate elite competency, especially in analytical spheres. `;
  } else {
    reasoning += `With a highly competent scholastic record containing ${acad.summary}, they exhibit high resilience and practical learning capabilities. `;
  }

  reasoning += `The PAJSK co-curricular index shows excellent capability at ${student.pajskScore}%, reinforced by a "${student.leadershipLevel}" rating in team orchestration roles (e.g., "${student.keyAchievements[0]}"). `;

  reasoning += `\n\nUnder our Psychometric Matching engine (RIASEC Profile: **${student.riasecType.join(" & ")}**), the student exhibits a strong alignment to **${student.fieldOfInterest}**. `;

  reasoning += `Therefore, **${primeMatch.scholarshipName}** (Match Score: **${primeMatch.score}%**) is recommended as the prime trajectory, followed by **${secondMatch.scholarshipName}** (Match Score: **${secondMatch.score}%**). `;

  if (STEM_STRONG && student.riasecType.includes("Investigative")) {
    reasoning += `The quantitative mastery (shown by solid grades in Advanced Mathematics and Physics) specifically suits the high technical requirements preferred by ${primeMatch.provider}.`;
  } else {
    reasoning += `The creative analytical focus coupled with robust social or enterprising competencies makes them structurally eligible for multi-disciplinary tracks at ${primeMatch.provider}.`;
  }

  return reasoning;
}
