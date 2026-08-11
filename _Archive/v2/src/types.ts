export type SpmGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E' | 'G';

export interface PajskData {
  sukan: string;
  jawatanSukan: string;
  peringkatSukan: string;
  kelab: string;
  jawatanKelab: string;
  peringkatKelab: string;
  badanBeruniform: string;
  jawatanBB: string;
  peringkatBB: string;
  pencapaian: string;      // e.g. "JOHAN [NEGERI]"
  penyertaan: number;      // participation count
  prestasi: number;        // performance score
  markah: number;          // raw score out of 110
  peratus: number;         // percentage 0-100
  anugerahKhas: string;    // special award or ""
}
export type RiasecType = 'Realistic' | 'Investigative' | 'Artistic' | 'Social' | 'Enterprising' | 'Conventional';
export type LeadershipLevel = 'Basic' | 'Medium' | 'High';
export type ParentCategory = 'B40' | 'M40' | 'T20';
export type AgentStatus = 'idle' | 'running' | 'done' | 'error';

export interface StudentProfile {
  id: string;
  password?: string;   // login credential — do not expose in UI
  name: string;
  gender?: 'L' | 'P';
  icNumber: string;
  state: string;
  avatar: string;
  school: string;
  email: string;
  parentCategory: ParentCategory;
  dreamCareer: string;
  preferredField: string;
  spmGrades: Record<string, SpmGrade>;
  pajskScore: number; // percentage 0-100 (derived from PAJSK markah/110*100)
  pajskData?: PajskData; // real PAJSK breakdown from Excel
  gpScore?: number;   // GP from SPM Excel (1.00 best → 4.00 worst)
  riasecType: RiasecType[];
  fieldOfInterest: string;
  leadershipLevel: LeadershipLevel;
  keyAchievements: string[];
  ethnicity: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  minSpmRequirement: number; // min number of A grades
  pajskRequirement: number;  // min PAJSK score
  preferredRiasec: RiasecType[];
  preferredFields: string[];
  parentCategoryRequired: 'B40' | 'B40/M40' | 'M40' | 'T20' | 'All';
  bumiputeraOnly?: boolean;
  deadlineDays: number;
  amount: string;
  tags: string[];
  bannerGradient: string;
}

export interface MatchBreakdown {
  academic: number;      // 35%
  pajsk: number;         // 20%
  psychometric: number;  // 15%
  aspiration: number;    // 15%
  parentBackground: number; // 15%
}

export interface CalculatedMatch {
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  score: number;
  breakdown: MatchBreakdown;
  reasons: string[];
  eligible: boolean;
}

export interface AgentState {
  id: string;
  name: string;
  nameBm: string;
  description: string;
  status: AgentStatus;
  progress: number;
  output: string;
  icon: string;
}

export interface PotentialAnalysis {
  stem: number;
  leadership: number;
  innovation: number;
  communication: number;
}

export interface CareerPathway {
  id: string;
  name: string;
  description: string;
  matchPercentage: number;
  subjectsNeeded: string[];
  riasecAlignment: RiasecType[];
}

export interface NotificationStatus {
  sent: boolean;
  email: string;
  timestamp: string;
  topScholarship: string;
  matchScore: number;
}

export type Language = 'en' | 'bm';
export type ActiveTab = 'dashboard' | 'profil' | 'biasiswa' | 'ejen' | 'laporan';
