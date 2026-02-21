// ─── Input Types (4-step streamlined form) ───────────────────────────────────

/** Step 1 — Academic Profile */
export interface AcademicProfile {
  name: string;
  field_of_study: string;
  cgpa: number;
  consistency: "low" | "medium" | "high";
  backlogs: number;
}

/** Step 2 — Experience & Skills (merged) */
export interface ExperienceSkillsProfile {
  selected_skills: string[];
  proficiency_rating: number;
  languages_known: string[];
  internships: number;
  projects: number;
  leadership: boolean;
  competitions: boolean;
  volunteer: boolean;
  earned_from_skill: boolean;
  readiness_rating: number;
}

/** Step 3 — Career Goal (merged intent + interests) */
export interface CareerGoalProfile {
  target_domain: string;
  target_role: string;
  activities: string[];
}

/** Step 4 — Personality (unchanged) */
export interface PersonalityProfile {
  answers: Record<string, "A" | "B">;
}

export interface StudentProfile {
  academic: AcademicProfile;
  experience_skills: ExperienceSkillsProfile;
  career_goal: CareerGoalProfile;
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

export interface Resource {
  title: string;
  platform: string;
  type: "course" | "practice";
  url: string;
}

export interface EnrichedAction {
  action: string;
  resources: Resource[];
}

export interface RoadmapPhase {
  title: string;
  duration: string;
  actions: (string | EnrichedAction)[];
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
  bridge_sentence: string;
}
