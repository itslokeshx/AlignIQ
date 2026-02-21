"""
ALIGNIQ — Profile Processor Module
Converts raw frontend form data to structured feature vectors for ML model.
"""

import numpy as np

# Skill-to-domain mapping dictionary (explainable in viva)
DOMAIN_SKILLS = {
    "AI/ML": ["Python", "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "Keras", "OpenCV"],
    "Web Development": ["JavaScript", "React", "Node.js", "HTML", "CSS", "TypeScript", "Vue", "Next.js"],
    "Data Science": ["Python", "R", "SQL", "Pandas", "Tableau", "Power BI", "Statistics"],
    "Cloud/DevOps": ["AWS", "Docker", "Kubernetes", "Linux", "Terraform", "CI/CD", "Azure"],
    "Cybersecurity": ["Networking", "Linux", "Python", "Ethical Hacking", "Wireshark", "Cryptography"],
    "Core Engineering": ["C", "C++", "Embedded Systems", "MATLAB", "VLSI", "Microcontrollers"],
}

# All unique domain names (ordered)
ALL_DOMAINS = list(DOMAIN_SKILLS.keys())


def encode_skills_to_domain_vector(skills: list) -> np.ndarray:
    """
    Encode a list of skills into a domain vector.
    Each element represents coverage of that domain (0-1).
    """
    vector = []
    for domain in ALL_DOMAINS:
        domain_skill_set = [s.lower() for s in DOMAIN_SKILLS[domain]]
        student_lower = [s.lower() for s in skills]
        matches = sum(1 for s in student_lower if s in domain_skill_set)
        coverage = matches / max(len(domain_skill_set), 1)
        vector.append(coverage)
    return np.array(vector)


def encode_role_to_domain_vector(target_role: str) -> np.ndarray:
    """
    Map a target role to a domain vector based on role-domain associations.
    """
    role_domain_map = {
        "ML Engineer": {"AI/ML": 0.9, "Data Science": 0.5, "Cloud/DevOps": 0.2},
        "AI Researcher": {"AI/ML": 1.0, "Data Science": 0.4},
        "Data Scientist": {"Data Science": 0.9, "AI/ML": 0.6, "Cloud/DevOps": 0.1},
        "Data Analyst": {"Data Science": 0.8, "Web Development": 0.2},
        "Frontend Developer": {"Web Development": 0.9},
        "Backend Developer": {"Web Development": 0.7, "Cloud/DevOps": 0.4},
        "Full Stack Developer": {"Web Development": 0.9, "Cloud/DevOps": 0.3},
        "DevOps Engineer": {"Cloud/DevOps": 0.9, "Web Development": 0.2},
        "Cloud Architect": {"Cloud/DevOps": 1.0},
        "Cybersecurity Analyst": {"Cybersecurity": 0.9, "Cloud/DevOps": 0.3},
        "Embedded Systems Engineer": {"Core Engineering": 0.9},
        "Mobile Developer": {"Web Development": 0.7, "Cloud/DevOps": 0.2},
        "Software Engineer": {"Web Development": 0.5, "Cloud/DevOps": 0.3, "Data Science": 0.2},
        "Product Manager": {"Web Development": 0.3, "Data Science": 0.3, "AI/ML": 0.2},
        "UX Designer": {"Web Development": 0.5},
    }

    vector = np.zeros(len(ALL_DOMAINS))
    mapping = role_domain_map.get(target_role, {})

    # Fallback: if role not found, try partial matching
    if not mapping:
        role_lower = target_role.lower()
        for known_role, domain_map in role_domain_map.items():
            if known_role.lower() in role_lower or role_lower in known_role.lower():
                mapping = domain_map
                break

    # Default to even distribution if still no match
    if not mapping:
        mapping = {d: 0.3 for d in ALL_DOMAINS}

    for i, domain in enumerate(ALL_DOMAINS):
        vector[i] = mapping.get(domain, 0.0)

    return vector


def encode_domains_to_vector(interested_domains: list) -> np.ndarray:
    """
    Encode interested domains into a binary domain vector.
    """
    vector = np.zeros(len(ALL_DOMAINS))
    for i, domain in enumerate(ALL_DOMAINS):
        if domain in interested_domains:
            vector[i] = 1.0
    return vector


def process_profile(data: dict) -> dict:
    """
    Process raw form data into a structured profile for ML model.
    Returns a dictionary with normalized features.
    """
    academic = data.get("academic", {})
    experience = data.get("experience", {})
    skills = data.get("skills", {})
    intent = data.get("intent", {})

    # Normalize CGPA (0-10 → 0-1)
    cgpa_norm = academic.get("cgpa", 0) / 10.0

    # Encode backlogs (0-3)
    backlogs = min(academic.get("backlogs", 0), 3)

    # Aptitude score (0-100 → 0-1)
    aptitude_norm = academic.get("aptitude_score", 0) / 100.0

    # Consistency encoding
    consistency_map = {"low": 0, "medium": 1, "high": 2}
    consistency = consistency_map.get(academic.get("consistency", "medium"), 1)

    # Experience features
    internships = min(experience.get("internships", 0), 3)
    projects = min(experience.get("projects", 0), 10)
    hackathons = min(experience.get("hackathons", 0), 10)
    leadership = 1 if experience.get("leadership", False) else 0

    # Skills count
    all_skills = skills.get("selected_skills", [])
    skills_count = len(all_skills)
    self_rating = skills.get("self_rating", 5)

    return {
        "cgpa_norm": cgpa_norm,
        "backlogs": backlogs,
        "aptitude_norm": aptitude_norm,
        "consistency": consistency,
        "internships": internships,
        "projects": projects,
        "hackathons": hackathons,
        "leadership": leadership,
        "skills_count": skills_count,
        "self_rating": self_rating,
        # Raw data needed by other modules
        "all_skills": all_skills,
        "interested_domains": intent.get("interested_domains", []),
        "target_role": intent.get("target_role", ""),
    }
