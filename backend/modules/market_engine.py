"""
ALIGNIQ — Market Engine Module
Adzuna API integration for real-time job market data.
Universal: works for all fields, not just tech.
"""

import os
import re
import requests
from collections import Counter


# ── Universal skill list — covers all 12 domains ──────────────────────────────
# NOTE: "R" removed — single-letter matching causes false positives across
# all job descriptions. Use "R Programming" instead.
ALL_KNOWN_SKILLS = [
    # Technology & Engineering
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "Vue", "Next.js",
    "HTML", "CSS", "SQL", "NoSQL", "Java", "C++", "C#", "Golang", "Rust", "Swift",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Linux", "Git", "CI/CD",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "scikit-learn",
    "Pandas", "NumPy", "MongoDB", "PostgreSQL", "Redis", "GraphQL",
    "Flask", "Django", "FastAPI", "Terraform", "MATLAB", "Flutter",
    "Embedded Systems", "VLSI", "AutoCAD", "SolidWorks", "ANSYS",
    "Tableau", "Power BI", "R Programming", "Figma", "Firebase",
    # Business & Management
    "MS Excel", "PowerPoint", "Business Analysis", "Project Management",
    "Agile", "Scrum", "Market Research", "Financial Modeling",
    "Strategic Planning", "CRM", "ERP", "Salesforce", "Negotiation",
    "Operations Management", "Supply Chain", "Business Communication",
    # Creative & Design
    "Adobe Photoshop", "Illustrator", "InDesign", "After Effects",
    "Premiere Pro", "UI/UX Design", "Typography", "3D Modeling",
    "SketchUp", "Canva", "Brand Identity", "User Research",
    "Motion Graphics", "Color Theory", "Storyboarding",
    # Healthcare & Medicine
    "Patient Care", "Clinical Assessment", "First Aid", "CPR",
    "Medical Documentation", "Pharmacology", "Anatomy", "Diagnosis",
    "Lab Techniques", "EMR", "Nursing", "Surgical Assistance",
    "Medical Research", "Public Health", "Epidemiology",
    # Law & Policy
    "Legal Research", "Contract Drafting", "Case Analysis", "Legal Writing",
    "Litigation", "Compliance", "Due Diligence", "Arbitration",
    "Policy Analysis", "Corporate Law", "Criminal Law",
    # Sports & Wellness
    "Coaching", "Athletic Training", "Sports Nutrition", "Injury Prevention",
    "Fitness Assessment", "Performance Analysis", "Physical Training",
    "Sports Psychology", "Event Management", "Team Management",
    "Yoga", "Personal Training",
    # Media & Communication
    "Content Creation", "Video Editing", "Copywriting", "SEO",
    "Social Media Marketing", "Journalism", "Storytelling", "Public Speaking",
    "Photography", "Podcast Production", "Script Writing", "Broadcasting",
    "Google Analytics", "Digital Marketing",
    # Finance & Economics
    "Financial Accounting", "Tally", "GST", "Taxation", "Auditing",
    "Investment Analysis", "Risk Management", "Budgeting", "Forecasting",
    "Bloomberg Terminal", "Portfolio Management", "Derivatives",
    # Education & Social
    "Curriculum Design", "Teaching", "Lesson Planning",
    "Classroom Management", "Student Assessment", "eLearning",
    "Community Engagement", "Counseling", "Grant Writing",
    # Science & Research
    "Research Methodology", "Statistical Analysis", "Scientific Writing",
    "Bioinformatics", "Molecular Biology", "Chemistry", "Physics",
    "Data Collection", "PCR", "Spectroscopy",
    # Arts & Culture
    "Music Theory", "Composition", "Film Production", "Art Direction",
    "Animation", "Illustration", "Music Production",
    # Trades & Skilled Work
    "Event Planning", "Hospitality Management", "Culinary Arts",
    "Real Estate", "Inventory Management", "CNC Machining",
]

# ── Domain → representative skills (for competitiveness scoring) ──────────────
DOMAIN_SKILL_MAP = {
    "Technology & Engineering": [
        "Python", "JavaScript", "Java", "Machine Learning", "Docker",
        "SQL", "AWS", "Git", "Linux", "Embedded Systems",
    ],
    "Business & Management": [
        "Business Analysis", "Project Management", "MS Excel",
        "Strategic Planning", "CRM", "Agile", "Market Research",
    ],
    "Creative & Design": [
        "UI/UX Design", "Adobe Photoshop", "Figma", "Illustrator",
        "Motion Graphics", "Brand Identity", "3D Modeling",
    ],
    "Healthcare & Medicine": [
        "Patient Care", "Clinical Assessment", "Lab Techniques",
        "Medical Documentation", "Pharmacology", "Nursing",
    ],
    "Law & Policy": [
        "Legal Research", "Contract Drafting", "Litigation",
        "Compliance", "Policy Analysis", "Legal Writing",
    ],
    "Sports & Wellness": [
        "Coaching", "Athletic Training", "Sports Nutrition",
        "Fitness Assessment", "Performance Analysis", "Yoga",
    ],
    "Media & Communication": [
        "Content Creation", "Video Editing", "SEO",
        "Digital Marketing", "Journalism", "Public Speaking",
    ],
    "Finance & Economics": [
        "Financial Accounting", "Financial Modeling", "Auditing",
        "Taxation", "Risk Management", "Investment Analysis",
    ],
    "Education & Social": [
        "Teaching", "Curriculum Design", "Counseling",
        "eLearning", "Community Engagement",
    ],
    "Science & Research": [
        "Research Methodology", "Statistical Analysis",
        "Molecular Biology", "Scientific Writing", "Bioinformatics",
    ],
    "Arts & Culture": [
        "Music Theory", "Film Production", "Animation",
        "Music Production", "Art Direction",
    ],
    "Trades & Skilled Work": [
        "Event Planning", "Culinary Arts", "Hospitality Management",
        "Real Estate", "CNC Machining",
    ],
}

# ── Role → domain keyword hints (for role-aware mock descriptions) ─────────────
ROLE_DOMAIN_HINTS: dict[str, str] = {
    # Technology
    "software": "tech", "developer": "tech", "engineer": "tech",
    "data scientist": "tech", "devops": "tech", "frontend": "tech",
    "backend": "tech", "ml engineer": "tech", "cloud": "tech",
    "cybersecurity": "tech", "embedded": "tech", "network": "tech",
    # Business
    "business analyst": "business", "product manager": "business",
    "manager": "business", "consultant": "business", "entrepreneur": "business",
    "operations": "business", "supply chain": "business", "hr": "business",
    # Creative
    "designer": "creative", "ux": "creative", "ui": "creative",
    "architect": "creative", "filmmaker": "creative", "animator": "creative",
    # Healthcare
    "doctor": "healthcare", "nurse": "healthcare", "pharmacist": "healthcare",
    "surgeon": "healthcare", "physician": "healthcare", "dentist": "healthcare",
    "psychologist": "healthcare", "physiotherapist": "healthcare",
    # Law
    "lawyer": "law", "judge": "law", "legal": "law", "advocate": "law",
    "compliance": "law", "policy": "law",
    # Sports
    "athlete": "sports", "coach": "sports", "trainer": "sports",
    "yoga": "sports", "fitness": "sports", "sports": "sports",
    "athletic": "sports", "esports": "sports",
    # Media
    "journalist": "media", "content creator": "media", "marketer": "media",
    "seo": "media", "copywriter": "media", "broadcaster": "media",
    # Finance
    "accountant": "finance", "auditor": "finance", "analyst": "finance",
    "banker": "finance", "trader": "finance", "actuary": "finance",
    "financial": "finance",
    # Education
    "teacher": "education", "professor": "education", "counselor": "education",
    "librarian": "education", "instructor": "education",
    # Science
    "scientist": "science", "researcher": "science", "biologist": "science",
    "chemist": "science", "physicist": "science", "geologist": "science",
    # Arts
    "musician": "arts", "artist": "arts", "painter": "arts",
    "photographer": "arts", "poet": "arts", "dancer": "arts",
    # Trades
    "chef": "trades", "event": "trades", "hotel": "trades",
    "pilot": "trades", "real estate": "trades",
}

# ── Domain-specific mock job descriptions ─────────────────────────────────────
MOCK_DESCRIPTIONS_BY_DOMAIN: dict[str, list[str]] = {
    "tech": [
        "Proficiency in Python SQL Machine Learning Docker AWS Git required. Experience with TensorFlow scikit-learn Pandas NumPy preferred. Linux and Kubernetes a plus.",
        "Must know JavaScript React TypeScript Node.js HTML CSS. CI/CD Git AWS Azure experience. PostgreSQL MongoDB Redis knowledge desirable.",
        "Strong Java C++ SQL background. Embedded Systems VLSI knowledge. Linux Git Docker. AWS cloud experience preferred. MATLAB a plus.",
        "Python Machine Learning Deep Learning PyTorch TensorFlow. Data Analysis SQL Pandas NumPy. Git Linux Docker CI/CD pipeline experience.",
        "Full-stack: JavaScript React Node.js TypeScript. SQL NoSQL MongoDB. Git Docker AWS. GraphQL REST APIs. Agile Scrum.",
    ],
    "business": [
        "MS Excel PowerPoint Business Analysis Project Management. Agile Scrum CRM ERP. Market Research Financial Modeling. Strong Business Communication Negotiation.",
        "Strategic Planning Operations Management Supply Chain. MS Excel Power BI Tableau. Business Analysis Market Research. CRM Salesforce experience.",
        "Project Management Agile Scrum. Financial Modeling MS Excel. Business Communication Leadership Negotiation. ERP systems experience.",
    ],
    "creative": [
        "Figma Adobe Photoshop Illustrator UI/UX Design. User Research Typography Brand Identity. Wireframing Prototyping. Motion Graphics After Effects.",
        "Adobe Photoshop InDesign Illustrator Premiere Pro. Brand Identity Typography Color Theory. 3D Modeling SketchUp. Motion Graphics Animation.",
        "UI/UX Design Figma User Research. Storyboarding Typography. Adobe Photoshop Illustrator. Color Theory Brand Identity experience.",
    ],
    "healthcare": [
        "Patient Care Clinical Assessment First Aid CPR. Medical Documentation EMR Pharmacology Anatomy. Lab Techniques Diagnosis Nursing.",
        "Clinical Assessment Diagnosis Medical Documentation. Patient Care Nursing Anatomy. Lab Techniques EMR. Public Health Epidemiology basics.",
        "First Aid CPR Patient Care Medical Research. Pharmacology Anatomy Surgical Assistance. Medical Documentation EMR systems.",
    ],
    "law": [
        "Legal Research Contract Drafting Case Analysis Legal Writing. Litigation Compliance Due Diligence. Corporate Law Arbitration Negotiation.",
        "Policy Analysis Legal Research Compliance. Contract Drafting Legal Writing Litigation. Corporate Law Criminal Law Due Diligence.",
        "Legal Research Compliance Contract Drafting. Arbitration Mediation Negotiation. Policy Analysis Due Diligence Legal Writing.",
    ],
    "sports": [
        "Coaching Athletic Training Sports Nutrition Injury Prevention. Fitness Assessment Performance Analysis Physical Training Team Management.",
        "Personal Training Yoga Fitness Assessment Athletic Training. Sports Nutrition Injury Prevention Coaching Event Management.",
        "Performance Analysis Team Management Sports Psychology. Coaching Athletic Training Injury Prevention. Event Management Physical Training.",
    ],
    "media": [
        "Content Creation Video Editing SEO Digital Marketing. Social Media Marketing Copywriting Storytelling. Google Analytics Public Speaking Photography.",
        "Journalism Copywriting Public Speaking Storytelling. Video Editing Photography Script Writing. Social Media Marketing SEO Google Analytics.",
        "Digital Marketing SEO Content Creation Social Media Marketing. Google Analytics Copywriting Broadcasting Podcast Production.",
    ],
    "finance": [
        "Financial Accounting Tally GST Taxation Auditing. Financial Modeling Investment Analysis Risk Management. Budgeting Forecasting MS Excel.",
        "Auditing Risk Management Financial Modeling. Taxation GST Financial Accounting. Portfolio Management Derivatives Bloomberg Terminal.",
        "Financial Modeling Investment Analysis Portfolio Management. Derivatives Risk Management Forecasting. Financial Accounting Auditing Taxation.",
    ],
    "education": [
        "Teaching Curriculum Design Lesson Planning Classroom Management. Student Assessment eLearning Content Creation Public Speaking.",
        "Curriculum Design Teaching eLearning Student Assessment. Counseling Community Engagement Grant Writing. Lesson Planning Classroom Management.",
        "Counseling Teaching Community Engagement. Curriculum Design eLearning Student Assessment. Grant Writing Lesson Planning.",
    ],
    "science": [
        "Research Methodology Statistical Analysis Scientific Writing. Molecular Biology Lab Techniques Bioinformatics PCR Spectroscopy Data Collection.",
        "Bioinformatics Molecular Biology Research Methodology. Statistical Analysis Data Collection Scientific Writing. PCR Spectroscopy Chemistry Physics.",
        "Statistical Analysis Scientific Writing Research Methodology. Bioinformatics Lab Techniques Data Collection. Chemistry Physics Molecular Biology.",
    ],
    "arts": [
        "Music Theory Composition Performance Music Production. Film Production Art Direction Animation Illustration. Storyboarding Script Writing.",
        "Film Production Art Direction Animation Music Production. Music Theory Composition Illustration. Storyboarding Photography.",
        "Animation Illustration Art Direction. Music Theory Music Production Composition. Film Production Script Writing Photography.",
    ],
    "trades": [
        "Event Planning Hospitality Management Culinary Arts. Real Estate Inventory Management. Customer Service Communication Leadership.",
        "Culinary Arts Event Planning Hospitality Management. CNC Machining Inventory Management. Customer Service Communication.",
        "Hospitality Management Event Planning Real Estate. Customer Service Inventory Management Leadership Communication.",
    ],
}


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


def _strip_html(text: str) -> str:
    """Remove HTML tags from a string."""
    return re.sub(r"<[^>]+>", " ", text)


def extract_skills_from_jobs(jobs: list) -> list:
    """
    Extract and count skill mentions from job descriptions.
    Uses simple substring matching after stripping HTML.
    Skills shorter than 3 chars use word-boundary matching to avoid false positives.
    Returns top 10 most demanded skills as [(skill, count), ...].
    """
    skill_counter = Counter()
    for job in jobs:
        raw = job.get("description", "") + " " + job.get("title", "")
        desc = _strip_html(raw).lower()
        for skill in ALL_KNOWN_SKILLS:
            skill_lower = skill.lower()
            # Short skills (<=3 chars like SQL, CSS, Git) use word-boundary
            # to avoid false positives; longer skills use simple substring
            if len(skill_lower) <= 3:
                if re.search(r"\b" + re.escape(skill_lower) + r"\b", desc):
                    skill_counter[skill] += 1
            else:
                if skill_lower in desc:
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


def get_market_trends(roles: list | None = None) -> dict:
    """
    Aggregate skill demand data across multiple roles for the Market Intelligence page.
    """
    roles_to_scan = roles or [
        "Software Engineer",
        "Data Scientist",
        "DevOps Engineer",
        "Frontend Developer",
        "ML Engineer",
        "Backend Developer",
    ]

    all_skill_counts = Counter()
    domain_scores = {}

    for role in roles_to_scan:
        jobs = fetch_jobs(role, count=5)
        skills = extract_skills_from_jobs(jobs)
        for skill, count in skills:
            all_skill_counts[skill] += count

    # Top 10 demanded skills overall
    top_skills = all_skill_counts.most_common(10)

    # Domain competitiveness — computed from universal DOMAIN_SKILL_MAP
    # Only include domains that have a non-zero score (relevant to scanned roles)
    for domain, domain_skills in DOMAIN_SKILL_MAP.items():
        score = sum(all_skill_counts.get(s, 0) for s in domain_skills)
        if score > 0:
            domain_scores[domain] = min(100, score * 8)  # Scale to 0-100

    return {
        "top_skills": top_skills,
        "domain_competitiveness": domain_scores,
        "analyzed_roles": roles_to_scan,
    }


def _detect_domain(role: str) -> str:
    """Map a role name to one of the domain hint keys."""
    role_lower = role.lower()
    for keyword, domain in ROLE_DOMAIN_HINTS.items():
        if keyword in role_lower:
            return domain
    return "tech"  # safe fallback


def _mock_jobs(role: str) -> list:
    """
    Generate domain-aware mock job data when Adzuna API is unavailable.
    Descriptions use skills relevant to the role's actual domain instead
    of always returning tech job descriptions.
    """
    domain = _detect_domain(role)
    descs = MOCK_DESCRIPTIONS_BY_DOMAIN.get(domain, MOCK_DESCRIPTIONS_BY_DOMAIN["tech"])

    companies = [
        ("TalentBridge India", "Bangalore, India"),
        ("CareerFirst Hub", "Mumbai, India"),
        ("PeopleConnect", "Hyderabad, India"),
        ("WorkSphere", "Pune, India"),
        ("OpportunityIndia", "Remote, India"),
    ]

    jobs = []
    for i, desc in enumerate(descs[:5]):
        company, location = companies[i % len(companies)]
        jobs.append({
            "title": [f"Junior {role}", f"{role}", f"Senior {role}",
                      f"Associate {role}", f"{role} — Entry Level"][i % 5],
            "company": {"display_name": company},
            "location": {"display_name": location},
            "redirect_url": f"https://example.com/apply/{i + 1}",
            "salary_min": [400000, 600000, 1000000, 800000, 300000][i % 5],
            "description": desc,
        })
    return jobs
