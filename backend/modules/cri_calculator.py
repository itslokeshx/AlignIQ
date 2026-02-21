"""
ALIGNIQ — CRI Calculator Module
Computes Career Readiness Index (CRI) — the custom innovation metric.

Formula:
CRI = (Academic Score × 0.25) + (Skill Score × 0.30) + (Experience Score × 0.25) + (Market Match Score × 0.20)
"""


def calculate_academic_score(cgpa: float, aptitude_score: float, backlogs: int, consistency: str) -> float:
    """
    Academic Score (out of 100):
    = (cgpa/10 × 50) + (aptitude_score/100 × 30) + backlog_penalty + consistency_bonus
    """
    base = (cgpa / 10.0) * 50.0
    aptitude = (aptitude_score / 100.0) * 30.0

    # Backlog penalty: -10 per backlog, max -30
    backlog_penalty = max(-30, backlogs * -10)

    # Consistency bonus: high=20, medium=10, low=0
    consistency_bonus_map = {"high": 20, "medium": 10, "low": 0}
    consistency_bonus = consistency_bonus_map.get(consistency, 10)

    score = base + aptitude + backlog_penalty + consistency_bonus
    return max(0, min(100, score))


def calculate_skill_score(languages: list, frameworks: list, tools: list, self_rating: int) -> float:
    """
    Skill Score (out of 100):
    = (len(languages) × 5) + (len(frameworks) × 7) + (len(tools) × 5) + (self_rating × 3)
    Capped at 100.
    """
    score = (len(languages) * 5) + (len(frameworks) * 7) + (len(tools) * 5) + (self_rating * 3)
    return min(100, max(0, score))


def calculate_experience_score(internships: int, projects: int, hackathons: int, leadership: bool) -> float:
    """
    Experience Score (out of 100):
    = (internships × 20) + (projects × 10) + (hackathons × 8) + (leadership × 12)
    Capped at 100.
    """
    score = (internships * 20) + (projects * 10) + (hackathons * 8) + (12 if leadership else 0)
    return min(100, max(0, score))


def calculate_cri(data: dict, market_match_percentage: float) -> dict:
    """
    Calculate the full CRI breakdown.

    Args:
        data: Raw student profile from frontend
        market_match_percentage: Percentage from market analysis

    Returns:
        Full CRI result with sub-indices
    """
    academic = data.get("academic", {})
    experience = data.get("experience", {})
    skills = data.get("skills", {})

    # Calculate sub-scores
    academic_score = calculate_academic_score(
        cgpa=academic.get("cgpa", 0),
        aptitude_score=academic.get("aptitude_score", 0),
        backlogs=academic.get("backlogs", 0),
        consistency=academic.get("consistency", "medium"),
    )

    # For skill score, we categorize selected_skills into languages/frameworks/tools
    # Simplified: split selected_skills into categories
    all_selected = skills.get("selected_skills", [])
    known_languages = ["Python", "JavaScript", "C++", "Java", "TypeScript", "R", "C", "SQL"]
    known_frameworks = ["React", "Node.js", "TensorFlow", "PyTorch", "scikit-learn", "Flask",
                        "Django", "FastAPI", "Vue", "Next.js", "Flutter", "Firebase", "Pandas",
                        "Keras", "GraphQL"]
    known_tools = ["Git", "Docker", "Kubernetes", "AWS", "Linux", "MongoDB", "Redis",
                   "Figma", "MATLAB", "Tableau", "Azure"]

    languages = [s for s in all_selected if s in known_languages]
    frameworks = [s for s in all_selected if s in known_frameworks]
    tools = [s for s in all_selected if s in known_tools]

    skill_score = calculate_skill_score(
        languages=languages,
        frameworks=frameworks,
        tools=tools,
        self_rating=skills.get("self_rating", 5),
    )

    experience_score = calculate_experience_score(
        internships=experience.get("internships", 0),
        projects=experience.get("projects", 0),
        hackathons=experience.get("hackathons", 0),
        leadership=experience.get("leadership", False),
    )

    market_score = market_match_percentage

    # CRI Formula: weighted sum
    cri_total = round(
        (academic_score * 0.25) +
        (skill_score * 0.30) +
        (experience_score * 0.25) +
        (market_score * 0.20),
        1
    )

    return {
        "cri_total": cri_total,
        "academic_reliability_index": round(academic_score, 1),
        "skill_depth_index": round(skill_score, 1),
        "experience_adequacy_index": round(experience_score, 1),
        "market_alignment_score": round(market_score, 1),
    }
