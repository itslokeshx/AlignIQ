// ─── Input Types ──────────────────────────────────────────────────────────────
export interface IdentityProfile {
  name: string;
  age: number;
  education_level: string;
  field_of_study: string;
  cgpa: number;
  consistency: "low" | "medium" | "high";
  backlogs: number;
}

export interface InterestsProfile {
  activities: string[];
  work_environments: string[];
  motivators: string[];
  topics: string[];
}

export interface ExperienceProfile {
  internships: number;
  projects: string[];
  competitions: string;
  leadership: boolean;
  leadership_desc: string;
  volunteer: boolean;
  volunteer_desc: string;
  clubs: string;
  awards: string;
  readiness_rating: number;
  earned_from_skill: boolean;
  earned_desc: string;
}

export interface SkillsProfile {
  selected_skills: string[];
  proficiency_rating: number;
  languages_known: string[];
}

export interface IntentProfile {
  target_domain: string;
  target_role: string;
  reasons: string[];
  salary_expectation: number;
  work_location: string;
  open_to_education: string;
}

export interface PersonalityProfile {
  answers: Record<string, "A" | "B">;
}

export interface StudentProfile {
  identity: IdentityProfile;
  interests: InterestsProfile;
  experience: ExperienceProfile;
  skills: SkillsProfile;
  intent: IntentProfile;
  personality: PersonalityProfile;
}

// ─── Response Types ────────────────────────────────────────────────────────────
export interface PersonalityScores {
  analytical_creative: number;
  independent_collaborative: number;
  theoretical_practical: number;
  stable_adaptive: number;
  specialist_generalist: number;
}

export interface InterestCluster {
  cluster: string;
  signal: "strong" | "moderate" | "emerging";
  activities: string[];
}

export interface InterestProfileResult {
  personality: PersonalityScores;
  interest_clusters: InterestCluster[];
  motivators: string[];
}

export interface BestFitCareer {
  role: string;
  score: number;
  why: string;
  strengths: string[];
  skills_to_develop: string[];
  salary_range: string;
  growth_trajectory: string;
  market_demand: string;
  second_fit: { role: string; score: number };
  third_fit: { role: string; score: number };
}

export interface RoadmapPhase {
  title: string;
  duration: string;
  actions: string[];
}

export interface ChosenCareerAnalysis {
  role: string;
  interest_match: number;
  skill_match: number;
  experience_match: number;
  alignment_score: number;
  role_description: string;
  market_data: {
    top_skills: [string, number][];
    avg_experience: string;
    entry_salary: string;
  };
  you_have: string[];
  missing_skills: string[];
  gap_severity: string;
  gap_timeline: string;
  roadmap: {
    phase_1: RoadmapPhase;
    phase_2: RoadmapPhase;
    phase_3: RoadmapPhase;
  };
}

export interface CRIResult {
  cri_total: number;
  academic_reliability_index: number;
  skill_depth_index: number;
  experience_adequacy_index: number;
  market_alignment_score: number;
  projected_cri: number;
}

export interface JobResult {
  title: string;
  company: string;
  location: string;
  apply_url: string;
  match_percentage: number;
  salary: string | number;
}

export interface AnalysisResponse {
  identity: {
    name: string;
    profile_id: string;
    generated_date: string;
  };
  interest_profile: InterestProfileResult;
  best_fit: BestFitCareer;
  chosen_career: ChosenCareerAnalysis;
  cri: CRIResult;
  jobs: JobResult[];
  executive_summary: string;
  action_checklist: string[];
}
