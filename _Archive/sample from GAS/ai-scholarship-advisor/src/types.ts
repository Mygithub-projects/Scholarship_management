export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  spmGrades: { [subject: string]: string };
  pajskScore: number; // Percentage (e.g., 92)
  riasecType: string[]; // e.g. ["Investigative", "Realistic"]
  fieldOfInterest: string;
  leadershipLevel: "High" | "Medium" | "Basic";
  keyAchievements: string[];
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  minSpmRequirement: string;
  pajskRequirement: number; // Minimum PAJSK percentage
  preferredRiasec: string[];
  fieldOfStudyPattern: string[]; // Which fields match this scholarship
  deadlineDays: number;
  tags: string[];
  bannerGradient: string;
}

export interface CalculatedMatch {
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  score: number;
  breakdown: {
    academic: number;
    pajsk: number;
    careerFit: number;
    leadership: number;
  };
  reasons: string[];
}

export type AgentStatus = "idle" | "running" | "completed";

export interface AgentState {
  id: string;
  name: string;
  title: string;
  status: AgentStatus;
  progress: number; // 0 to 100
  log: string;
}

export interface PotentialAnalysis {
  stem: number; // Percentage
  leadership: number; // Percentage
  innovation: number; // Percentage
  communication: number; // Percentage
}

export interface CareerPathway {
  id: string;
  name: string;
  description: string;
  matchPercentage: number;
  subjectsNeeded: string[];
  riasecAlignment: string[];
}
