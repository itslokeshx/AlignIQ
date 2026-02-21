export interface AcademicProfile {
  cgpa: number
  backlogs: number
  aptitude_score: number
  consistency: "low" | "medium" | "high"
}

export interface ExperienceProfile {
  internships: number
  projects: number
  hackathons: number
  leadership: boolean
}

export interface SkillsProfile {
  selected_skills: string[]
  self_rating: number
}

export interface IntentProfile {
  interested_domains: string[]
  target_role: string
  salary_expectation: number
  work_style: "remote" | "hybrid" | "onsite"
  risk_tolerance: "low" | "medium" | "high"
}

export interface StudentProfile {
  academic: AcademicProfile
  experience: ExperienceProfile
  skills: SkillsProfile
  intent: IntentProfile
}

export interface CRIResult {
  cri_total: number
  academic_reliability_index: number
  skill_depth_index: number
  experience_adequacy_index: number
  market_alignment_score: number
}

export interface MLPrediction {
  predicted_career: string
  confidence: number
  top_3_predictions: { role: string; probability: number }[]
  feature_importance: Record<string, number>
}

export interface AlignmentResult {
  passion_alignment_score: number
  role_alignment_score: number
  passion_vs_choice_score: number
  is_misaligned: boolean
}

export interface MarketResult {
  match_percentage: number
  matched_skills: string[]
  missing_skills: string[]
  top_demanded_skills: [string, number][]
}

export interface JobResult {
  title: string
  company: string
  location: string
  apply_url: string
  match_percentage: number
  salary: string | number
}

export interface AIRoadmapPhase {
  title: string
  duration: string
  actions: string[]
}

export interface AIResult {
  executive_summary: string
  roadmap: {
    phase_1: AIRoadmapPhase
    phase_2: AIRoadmapPhase
    phase_3: AIRoadmapPhase
  }
  skill_prescriptions: { skill: string; why: string; priority: string }[]
  projected_cri_after_roadmap: number
  probability_increase: string
}

export interface AnalysisResponse {
  cri: CRIResult
  ml: MLPrediction
  alignment: AlignmentResult
  market: MarketResult
  jobs: JobResult[]
  ai: AIResult
}
