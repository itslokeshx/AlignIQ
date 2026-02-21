"""
ALIGNIQ — Market Engine Module
Adzuna API integration for real-time job market data.
"""

import os
import re
import requests
from collections import Counter


# Comprehensive list of known skills for pattern matching
ALL_KNOWN_SKILLS = [
    "Python", "JavaScript", "React", "Node.js", "SQL", "AWS",
    "Docker", "Machine Learning", "TensorFlow", "Java", "C++",
    "TypeScript", "Git", "Linux", "MongoDB", "PostgreSQL", "Flask",
    "Django", "FastAPI", "Kubernetes", "Azure", "GCP", "HTML", "CSS",
    "Pandas", "NumPy", "scikit-learn", "PyTorch", "Redis", "GraphQL",
    "Vue", "Next.js", "Firebase", "Tableau", "Power BI", "R",
    "Figma", "MATLAB", "Flutter", "Terraform", "CI/CD",
]


def fetch_jobs(role: str, location: str = "India", count: int = 10) -> list:
    """
    Fetch jobs from Adzuna API for a given role.

    For viva: Uses Adzuna's REST API with app_id and app_key authentication.
    Returns raw job listings that we then process for skill extraction.
    """
    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_APP_KEY")

    if not app_id or not app_key:
        print("[Market] Adzuna API keys not configured. Using mock data.")
        return _mock_jobs(role)

    params = {
        "app_id": app_id,
        "app_key": app_key,
        "what": role,
        "where": location,
        "results_per_page": count,
        "content-type": "application/json",
    }

    try:
        response = requests.get(
            "https://api.adzuna.com/v1/api/jobs/in/search/1",
            params=params,
            timeout=10,
        )
        response.raise_for_status()
        return response.json().get("results", [])
    except Exception as e:
        print(f"[Market] Adzuna API error: {e}. Using mock data.")
        return _mock_jobs(role)


def extract_skills_from_jobs(jobs: list) -> list:
    """
    Extract and count skill mentions from job descriptions.
    Returns top 10 most demanded skills as [(skill, count), ...].
    """
    skill_counter = Counter()
    for job in jobs:
        desc = job.get("description", "").lower()
        for skill in ALL_KNOWN_SKILLS:
            if skill.lower() in desc:
                skill_counter[skill] += 1
    return skill_counter.most_common(10)


def calculate_market_match(student_skills: list, job_skill_demand: list) -> dict:
    """
    Calculate how well student skills match market demand.

    For viva: We compare the student's skill set against skills extracted from
    real job descriptions. The match percentage shows market readiness.
    """
    demanded = [s[0].lower() for s in job_skill_demand]
    student = [s.lower() for s in student_skills]
    matched = [s for s in student if s in demanded]
    missing = [s for s in demanded if s not in student]
    match_pct = round(len(matched) / max(len(demanded), 1) * 100, 1)

    return {
        "match_percentage": match_pct,
        "matched_skills": matched,
        "missing_skills": missing[:5],
        "top_demanded_skills": job_skill_demand,
    }


def rank_jobs_by_match(jobs: list, student_skills: list) -> list:
    """
    Rank fetched jobs by how well they match the student's skills.
    Returns top 5 highest-match jobs.
    """
    ranked = []
    for job in jobs:
        desc = job.get("description", "").lower()
        student_lower = [s.lower() for s in student_skills]
        matches = sum(1 for skill in student_lower if skill in desc)
        match_pct = round(matches / max(len(student_skills), 1) * 100, 1)
        ranked.append({
            "title": job.get("title", "Unknown Role"),
            "company": job.get("company", {}).get("display_name", "N/A"),
            "location": job.get("location", {}).get("display_name", "N/A"),
            "apply_url": job.get("redirect_url", "#"),
            "match_percentage": match_pct,
            "salary": job.get("salary_min", "Not disclosed"),
        })
    return sorted(ranked, key=lambda x: x["match_percentage"], reverse=True)[:5]


def get_market_trends() -> dict:
    """
    Aggregate skill demand data across multiple roles for the Market Intelligence page.
    """
    roles = ["Software Engineer", "Data Scientist", "DevOps Engineer",
             "Frontend Developer", "ML Engineer", "Backend Developer"]

    all_skill_counts = Counter()
    domain_scores = {}

    for role in roles:
        jobs = fetch_jobs(role, count=5)
        skills = extract_skills_from_jobs(jobs)
        for skill, count in skills:
            all_skill_counts[skill] += count

    # Top 10 demanded skills overall
    top_skills = all_skill_counts.most_common(10)

    # Domain competitiveness (estimated from skill demand density)
    domain_role_map = {
        "AI/ML": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "scikit-learn"],
        "Web Development": ["JavaScript", "React", "Node.js", "TypeScript", "HTML", "CSS"],
        "Data Science": ["Python", "SQL", "Pandas", "Tableau", "R"],
        "Cloud/DevOps": ["AWS", "Docker", "Kubernetes", "Linux", "Terraform"],
        "Cybersecurity": ["Linux", "Python", "Networking"],
        "Core Engineering": ["C++", "MATLAB", "Embedded Systems"],
    }

    for domain, domain_skills in domain_role_map.items():
        score = sum(all_skill_counts.get(s, 0) for s in domain_skills)
        domain_scores[domain] = min(100, score * 5)  # Scale to 0-100

    return {
        "top_skills": top_skills,
        "domain_competitiveness": domain_scores,
    }


def _mock_jobs(role: str) -> list:
    """
    Generate mock job data when Adzuna API is unavailable.
    """
    mock_descriptions = {
        "default": [
            {
                "title": f"Junior {role}",
                "company": {"display_name": "TechCorp India"},
                "location": {"display_name": "Bangalore, India"},
                "redirect_url": "https://example.com/apply/1",
                "salary_min": 600000,
                "description": "Looking for Python JavaScript React SQL Git Docker AWS experience. Strong problem solving skills required. Machine Learning basics preferred.",
            },
            {
                "title": f"Associate {role}",
                "company": {"display_name": "InnovateTech"},
                "location": {"display_name": "Hyderabad, India"},
                "redirect_url": "https://example.com/apply/2",
                "salary_min": 800000,
                "description": "Requirements: Python Java TypeScript React Node.js PostgreSQL Docker Kubernetes CI/CD. Experience with cloud platforms AWS Azure preferred.",
            },
            {
                "title": f"{role}",
                "company": {"display_name": "DataDrive Solutions"},
                "location": {"display_name": "Pune, India"},
                "redirect_url": "https://example.com/apply/3",
                "salary_min": 1000000,
                "description": "Must have Python SQL TensorFlow scikit-learn Machine Learning experience. Proficient in Git Linux Docker. Knowledge of Flask Django FastAPI.",
            },
            {
                "title": f"Senior {role}",
                "company": {"display_name": "CloudFirst Systems"},
                "location": {"display_name": "Mumbai, India"},
                "redirect_url": "https://example.com/apply/4",
                "salary_min": 1500000,
                "description": "Expert in JavaScript React TypeScript Node.js. Experience with AWS Docker Kubernetes. Leadership skills, project management. MongoDB Redis GraphQL.",
            },
            {
                "title": f"{role} Intern",
                "company": {"display_name": "StartupHub"},
                "location": {"display_name": "Remote, India"},
                "redirect_url": "https://example.com/apply/5",
                "salary_min": 300000,
                "description": "Looking for Python JavaScript HTML CSS Git basics. Willingness to learn React Flask. Knowledge of SQL MongoDB is a plus.",
            },
            {
                "title": f"{role} — Entry Level",
                "company": {"display_name": "Wipro Digital"},
                "location": {"display_name": "Chennai, India"},
                "redirect_url": "https://example.com/apply/6",
                "salary_min": 500000,
                "description": "Requires Python Java C++ SQL. Experience with Linux Git. Understanding of data structures and algorithms. AWS basics preferred.",
            },
            {
                "title": f"Graduate {role}",
                "company": {"display_name": "Infosys BPM"},
                "location": {"display_name": "Bangalore, India"},
                "redirect_url": "https://example.com/apply/7",
                "salary_min": 450000,
                "description": "Fresh graduates welcome. Python JavaScript SQL HTML CSS React. Basic understanding of Machine Learning TensorFlow. Git version control.",
            },
            {
                "title": f"{role} Trainee",
                "company": {"display_name": "TCS Innovation Labs"},
                "location": {"display_name": "Noida, India"},
                "redirect_url": "https://example.com/apply/8",
                "salary_min": 400000,
                "description": "Training provided. Must know Python or Java. SQL basics. Exposure to Docker Linux AWS cloud. Willingness to learn React Node.js.",
            },
        ],
    }
    return mock_descriptions.get(role, mock_descriptions["default"])
