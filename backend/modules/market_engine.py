"""
ALIGNIQ — Market Engine Module
Adzuna API integration for real-time job market data.
Universal: works for all 12 domains × 180+ roles.

Key fix: frontend now sends the user-selected domain so we NEVER
have to guess domain from role name. _detect_domain is still used as
fallback but the explicit domain always takes priority.
"""

import os
import re
import requests
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed


# ══════════════════════════════════════════════════════════════════════════
# UNIVERSAL SKILL LIST — covers all 12 domains
# ══════════════════════════════════════════════════════════════════════════

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
    "Graphic Design", "Wireframing", "Prototyping",
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
    "Creative Writing", "Dance", "Choreography", "Painting",
    "Sculpture", "Ceramics", "Curation", "Theatre",
    # Trades & Skilled Work
    "Event Planning", "Hospitality Management", "Culinary Arts",
    "Real Estate", "Inventory Management", "CNC Machining",
    "Customer Service", "Food Safety", "Menu Planning",
    "Wine Knowledge", "Venue Management", "Floral Design",
    "Travel Planning", "Hotel Operations", "Aviation",
    "Electrical Wiring", "Woodworking", "Jewelry Making",
    "Tattoo Design", "Wedding Photography", "Wedding Planning",
]


# ══════════════════════════════════════════════════════════════════════════
# DOMAIN → representative skills (for competitiveness scoring)
# ══════════════════════════════════════════════════════════════════════════

DOMAIN_SKILL_MAP = {
    "Technology & Engineering": [
        "Python", "JavaScript", "Java", "Machine Learning", "Docker",
        "SQL", "AWS", "Git", "Linux", "Embedded Systems",
        "Rust", "TensorFlow", "PyTorch", "TypeScript", "React",
    ],
    "Business & Management": [
        "Business Analysis", "Project Management", "MS Excel",
        "Strategic Planning", "CRM", "Agile", "Market Research",
        "Financial Modeling", "Negotiation", "Operations Management",
    ],
    "Creative & Design": [
        "UI/UX Design", "Adobe Photoshop", "Figma", "Illustrator",
        "Motion Graphics", "Brand Identity", "3D Modeling",
        "Graphic Design", "Typography", "Color Theory",
    ],
    "Healthcare & Medicine": [
        "Patient Care", "Clinical Assessment", "Lab Techniques",
        "Medical Documentation", "Pharmacology", "Nursing",
        "Public Health", "Epidemiology", "Anatomy",
    ],
    "Law & Policy": [
        "Legal Research", "Contract Drafting", "Litigation",
        "Compliance", "Policy Analysis", "Legal Writing",
        "Due Diligence", "Arbitration", "Corporate Law",
    ],
    "Sports & Wellness": [
        "Coaching", "Athletic Training", "Sports Nutrition",
        "Fitness Assessment", "Performance Analysis", "Yoga",
        "Personal Training", "Sports Psychology", "Team Management",
    ],
    "Media & Communication": [
        "Content Creation", "Video Editing", "SEO",
        "Digital Marketing", "Journalism", "Public Speaking",
        "Photography", "Social Media Marketing", "Copywriting",
    ],
    "Finance & Economics": [
        "Financial Accounting", "Financial Modeling", "Auditing",
        "Taxation", "Risk Management", "Investment Analysis",
        "Portfolio Management", "Budgeting", "Derivatives",
    ],
    "Education & Social": [
        "Teaching", "Curriculum Design", "Counseling",
        "eLearning", "Community Engagement", "Lesson Planning",
        "Student Assessment", "Grant Writing",
    ],
    "Science & Research": [
        "Research Methodology", "Statistical Analysis",
        "Molecular Biology", "Scientific Writing", "Bioinformatics",
        "Lab Techniques", "Data Collection", "Chemistry",
    ],
    "Arts & Culture": [
        "Music Theory", "Film Production", "Animation",
        "Music Production", "Art Direction", "Creative Writing",
        "Dance", "Choreography", "Illustration", "Theatre",
    ],
    "Trades & Skilled Work": [
        "Event Planning", "Culinary Arts", "Hospitality Management",
        "Real Estate", "CNC Machining", "Customer Service",
        "Food Safety", "Wedding Planning", "Photography",
        "Travel Planning", "Hotel Operations", "Electrical Wiring",
    ],
}


# ══════════════════════════════════════════════════════════════════════════
# PUBLIC DOMAIN LOOKUP
# ══════════════════════════════════════════════════════════════════════════

PUBLIC_DOMAIN_FROM_HINT = {
    "tech": "Technology & Engineering",
    "business": "Business & Management",
    "creative": "Creative & Design",
    "science": "Science & Research",
    "healthcare": "Healthcare & Medicine",
    "law": "Law & Policy",
    "education": "Education & Social",
    "media": "Media & Communication",
    "finance": "Finance & Economics",
    "arts": "Arts & Culture",
    "sports": "Sports & Wellness",
    "trades": "Trades & Skilled Work",
}

HINT_FROM_PUBLIC_DOMAIN = {v: k for k, v in PUBLIC_DOMAIN_FROM_HINT.items()}


# ══════════════════════════════════════════════════════════════════════════
# ROLE → DOMAIN HINTS (comprehensive — all 180+ roles)
# ══════════════════════════════════════════════════════════════════════════

ROLE_DOMAIN_HINTS: dict[str, str] = {
    # ── Technology & Engineering ──────────────────────────────────────
    "software": "tech", "developer": "tech", "engineer": "tech",
    "data scientist": "tech", "devops": "tech", "frontend": "tech",
    "backend": "tech", "ml engineer": "tech", "cloud": "tech",
    "cybersecurity": "tech", "embedded": "tech", "network": "tech",
    "ai": "tech", "robotics": "tech", "civil engineer": "tech",
    "mechanical engineer": "tech", "electrical engineer": "tech",
    "chemical engineer": "tech", "biomedical": "tech",
    "aerospace": "tech", "environmental engineer": "tech",

    # ── Business & Management ────────────────────────────────────────
    "business analyst": "business", "product manager": "business",
    "project manager": "business", "consultant": "business",
    "entrepreneur": "business", "operations": "business",
    "supply chain": "business", "hr manager": "business",
    "human resource": "business", "brand strategist": "business",
    "sales manager": "business", "retail": "business",
    "marketing manager": "business",

    # ── Creative & Design ────────────────────────────────────────────
    "ux": "creative", "ui": "creative", "graphic designer": "creative",
    "motion designer": "creative", "architect": "creative",
    "interior designer": "creative", "fashion designer": "creative",
    "industrial designer": "creative", "game designer": "creative",
    "art director": "creative", "illustrator": "creative",
    "animator": "creative", "creative director": "creative",
    "set designer": "creative",

    # ── Healthcare & Medicine ────────────────────────────────────────
    "doctor": "healthcare", "nurse": "healthcare", "pharmacist": "healthcare",
    "surgeon": "healthcare", "physician": "healthcare", "dentist": "healthcare",
    "psychologist": "healthcare", "physiotherapist": "healthcare",
    "paramedic": "healthcare", "veterinarian": "healthcare",
    "optometrist": "healthcare", "dietitian": "healthcare",
    "radiologist": "healthcare", "pathologist": "healthcare",
    "therapist": "healthcare", "medical": "healthcare",

    # ── Law & Policy ─────────────────────────────────────────────────
    "lawyer": "law", "judge": "law", "legal": "law", "advocate": "law",
    "compliance": "law", "policy": "law", "mediator": "law",
    "paralegal": "law", "civil services": "law", "diplomat": "law",
    "public administrator": "law",

    # ── Sports & Wellness ────────────────────────────────────────────
    "athlete": "sports", "coach": "sports", "trainer": "sports",
    "yoga": "sports", "fitness": "sports", "sports": "sports",
    "athletic director": "sports", "esports": "sports",
    "sports psychologist": "sports", "sports medicine": "sports",
    "physiologist": "sports", "wellness": "sports",

    # ── Media & Communication ────────────────────────────────────────
    "journalist": "media", "content creator": "media", "marketer": "media",
    "seo": "media", "copywriter": "media", "broadcaster": "media",
    "podcaster": "media", "pr manager": "media", "public relation": "media",
    "news": "media", "editor": "media", "media planner": "media",

    # ── Finance & Economics ──────────────────────────────────────────
    "accountant": "finance", "auditor": "finance", "analyst": "finance",
    "banker": "finance", "trader": "finance", "actuary": "finance",
    "financial": "finance", "investment": "finance", "economist": "finance",
    "tax": "finance", "wealth": "finance",

    # ── Education & Social ───────────────────────────────────────────
    "teacher": "education", "professor": "education", "counselor": "education",
    "librarian": "education", "instructor": "education",
    "social worker": "education", "ngo": "education",
    "academic": "education", "tutor": "education",

    # ── Science & Research ───────────────────────────────────────────
    "scientist": "science", "researcher": "science", "biologist": "science",
    "chemist": "science", "physicist": "science", "geologist": "science",
    "astronomer": "science", "marine biologist": "science",
    "microbiologist": "science", "geneticist": "science",
    "archaeologist": "science", "lab": "science",

    # ── Arts & Culture ───────────────────────────────────────────────
    "musician": "arts", "painter": "arts", "poet": "arts",
    "dancer": "arts", "choreographer": "arts", "sculptor": "arts",
    "curator": "arts", "theatre": "arts", "actor": "arts",
    "singer": "arts", "composer": "arts", "playwright": "arts",
    "music director": "arts", "art therapist": "arts",

    # ── Trades & Skilled Work ────────────────────────────────────────
    "chef": "trades", "culinary": "trades", "sommelier": "trades",
    "event manager": "trades", "event planner": "trades",
    "wedding planner": "trades", "wedding photographer": "trades",
    "real estate": "trades", "travel consultant": "trades",
    "hotel manager": "trades", "hotel": "trades",
    "flight attendant": "trades", "pilot": "trades",
    "merchant navy": "trades", "electrician": "trades",
    "cnc machinist": "trades", "cnc": "trades",
    "carpenter": "trades", "jewellery": "trades", "jewelry": "trades",
    "tattoo": "trades", "photographer": "trades",
    "planner": "trades", "hospitality": "trades",
    "bartender": "trades", "baker": "trades", "pastry": "trades",
}


# ══════════════════════════════════════════════════════════════════════════
# MOCK JOB DESCRIPTIONS — domain-specific, realistic
# ══════════════════════════════════════════════════════════════════════════

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
        "Adobe Photoshop InDesign Illustrator Premiere Pro. Brand Identity Typography Color Theory. 3D Modeling SketchUp. Motion Graphics Animation. Graphic Design.",
        "UI/UX Design Figma User Research. Storyboarding Typography. Adobe Photoshop Illustrator. Color Theory Brand Identity Graphic Design Wireframing Prototyping.",
    ],
    "healthcare": [
        "Patient Care Clinical Assessment First Aid CPR. Medical Documentation EMR Pharmacology Anatomy. Lab Techniques Diagnosis Nursing.",
        "Clinical Assessment Diagnosis Medical Documentation. Patient Care Nursing Anatomy. Lab Techniques EMR. Public Health Epidemiology basics.",
        "First Aid CPR Patient Care Medical Research. Pharmacology Anatomy Surgical Assistance. Medical Documentation EMR systems.",
    ],
    "law": [
        "Legal Research Contract Drafting Case Analysis Legal Writing. Litigation Compliance Due Diligence. Corporate Law Arbitration Negotiation.",
        "Policy Analysis Legal Research Compliance. Contract Drafting Legal Writing Litigation. Corporate Law Criminal Law Due Diligence.",
        "Legal Research Compliance Contract Drafting. Arbitration Due Diligence Legal Writing. Policy Analysis Case Analysis.",
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
        "Music Theory Composition Music Production Creative Writing. Dance Choreography Theatre Illustration. Art Direction Animation Painting.",
        "Film Production Art Direction Animation Illustration. Creative Writing Music Theory Composition. Dance Theatre Choreography Sculpture.",
        "Animation Illustration Art Direction Theatre. Music Production Creative Writing Dance. Choreography Ceramics Curation Painting Sculpture.",
    ],
    "trades": [
        "Event Planning Wedding Planning Venue Management Hospitality Management. Customer Service Photography Floral Design. Food Safety Menu Planning.",
        "Culinary Arts Food Safety Menu Planning Customer Service. Event Planning Hospitality Management Inventory Management. Wine Knowledge Hotel Operations.",
        "Photography Wedding Photography Event Planning Customer Service. Real Estate Travel Planning Hotel Operations. Venue Management Hospitality Management.",
        "Electrical Wiring CNC Machining Woodworking Inventory Management. Customer Service Event Planning. Aviation Hotel Operations.",
        "Hospitality Management Hotel Operations Customer Service Travel Planning. Event Planning Wedding Planning Photography. Real Estate Jewelry Making Tattoo Design.",
    ],
}


# ══════════════════════════════════════════════════════════════════════════
# ROLE-SPECIFIC MOCK DESCRIPTIONS
# When we know the exact role, use tailored descriptions instead of
# generic domain ones.
# ══════════════════════════════════════════════════════════════════════════

ROLE_SPECIFIC_MOCKS: dict[str, list[str]] = {
    # Trades
    "wedding planner": [
        "Wedding Planning Event Planning Venue Management Floral Design. Customer Service Budgeting Negotiation. Photography Hospitality Management.",
        "Event Planning Wedding Planning Customer Service. Venue Management Floral Design Menu Planning. Photography Budgeting Hospitality Management.",
        "Wedding Planning Venue Management Event Planning. Customer Service Floral Design Photography. Budgeting Travel Planning Hospitality Management.",
    ],
    "wedding photographer": [
        "Photography Wedding Photography Video Editing. Adobe Photoshop Premiere Pro Lightroom. Event Planning Customer Service Portfolio.",
        "Photography Wedding Photography Adobe Photoshop Video Editing. Customer Service Event Planning. Premiere Pro Lightroom Storytelling.",
        "Wedding Photography Photography Adobe Photoshop Video Editing. Lightroom Premiere Pro Customer Service. Event Planning Storytelling Portfolio.",
    ],
    "chef": [
        "Culinary Arts Food Safety Menu Planning Inventory Management. Customer Service Team Management. Wine Knowledge Hospitality Management.",
        "Culinary Arts Menu Planning Food Safety. Customer Service Hospitality Management Inventory Management. Team Management Wine Knowledge.",
        "Food Safety Culinary Arts Menu Planning Customer Service. Inventory Management Team Management Hospitality Management.",
    ],
    "sommelier": [
        "Wine Knowledge Hospitality Management Customer Service. Menu Planning Food Safety Event Planning. Culinary Arts Inventory Management.",
        "Wine Knowledge Customer Service Hospitality Management. Event Planning Menu Planning Food Safety. Travel Planning Culinary Arts.",
        "Wine Knowledge Hospitality Management Customer Service Food Safety. Menu Planning Event Planning Culinary Arts.",
    ],
    "event manager": [
        "Event Planning Event Management Venue Management Customer Service. Budgeting Team Management Hospitality Management. Photography Negotiation.",
        "Event Management Event Planning Customer Service. Venue Management Hospitality Management Budgeting. Team Management Photography Negotiation.",
        "Event Planning Event Management Venue Management. Customer Service Budgeting Hospitality Management. Team Management Photography.",
    ],
    "real estate agent": [
        "Real Estate Customer Service Negotiation Market Research. Business Communication CRM. Photography Budgeting.",
        "Real Estate Negotiation Customer Service Market Research. CRM Business Communication. Photography Budgeting.",
        "Real Estate Customer Service Negotiation. Market Research Business Communication CRM. Photography.",
    ],
    "travel consultant": [
        "Travel Planning Customer Service Hospitality Management. CRM Business Communication. Photography Event Planning Budgeting.",
        "Travel Planning Hospitality Management Customer Service. Business Communication CRM. Event Planning Budgeting.",
    ],
    "hotel manager": [
        "Hotel Operations Hospitality Management Customer Service. Event Management Team Management Budgeting. Food Safety Inventory Management.",
        "Hospitality Management Hotel Operations Customer Service. Team Management Event Management Budgeting. Food Safety Inventory Management.",
    ],
    "flight attendant": [
        "Customer Service Hospitality Management First Aid. Team Management Travel Planning Aviation. Public Speaking.",
        "Customer Service First Aid Hospitality Management. Travel Planning Aviation Team Management. Public Speaking.",
    ],
    "pilot": [
        "Aviation Team Management Customer Service. Travel Planning Leadership. Instrument Flying Navigation.",
        "Aviation Navigation Team Management. Customer Service Travel Planning Leadership.",
    ],
    "electrician": [
        "Electrical Wiring Customer Service Inventory Management. Team Management Woodworking CNC Machining.",
        "Electrical Wiring Inventory Management Customer Service. Team Management Woodworking.",
    ],
    "cnc machinist": [
        "CNC Machining Inventory Management AutoCAD SolidWorks. Team Management Customer Service.",
        "CNC Machining AutoCAD SolidWorks Inventory Management. Team Management Customer Service.",
    ],
    "carpenter": [
        "Woodworking Inventory Management Customer Service. Team Management Carpentry AutoCAD.",
        "Woodworking Customer Service Inventory Management. AutoCAD Team Management.",
    ],
    "jewellery designer": [
        "Jewelry Making Adobe Photoshop Illustrator. Customer Service Photography Graphic Design. 3D Modeling.",
        "Jewelry Making Customer Service Photography. Adobe Photoshop Illustrator 3D Modeling. Graphic Design.",
    ],
    "tattoo artist": [
        "Tattoo Design Illustration Adobe Photoshop Customer Service. Photography Graphic Design. Color Theory.",
        "Tattoo Design Illustration Customer Service Photography. Adobe Photoshop Color Theory Graphic Design.",
    ],
    # Arts
    "musician": [
        "Music Theory Composition Music Production. Creative Writing Dance. Theatre Performance. Choreography.",
        "Music Production Music Theory Composition. Creative Writing Theatre. Dance Choreography.",
    ],
    "dancer": [
        "Dance Choreography Theatre. Music Theory Physical Training Fitness Assessment. Performance Analysis Creative Writing.",
        "Choreography Dance Theatre Physical Training. Fitness Assessment Performance Analysis. Music Theory.",
    ],
    "actor": [
        "Theatre Dance Choreography Creative Writing. Public Speaking Storytelling. Music Theory Film Production.",
        "Theatre Creative Writing Dance Public Speaking. Film Production Storytelling Choreography.",
    ],
    "curator": [
        "Curation Art Direction Creative Writing. Painting Sculpture Ceramics. Photography Illustration.",
        "Curation Art Direction Photography. Creative Writing Painting Sculpture. Illustration Ceramics.",
    ],
    "painter": [
        "Painting Illustration Art Direction Color Theory. Creative Writing Sculpture. Ceramics Photography.",
        "Painting Color Theory Illustration. Art Direction Creative Writing. Sculpture Photography Ceramics.",
    ],
    # Creative
    "art director": [
        "Art Direction Brand Identity Typography Graphic Design. Adobe Photoshop Illustrator Figma. Color Theory Storyboarding UI/UX Design.",
        "Art Direction Graphic Design Brand Identity. Adobe Photoshop Illustrator Typography Color Theory. Motion Graphics Figma UI/UX Design.",
        "Brand Identity Art Direction Typography Adobe Photoshop. Graphic Design Illustrator Color Theory. Figma Storyboarding.",
    ],
    "graphic designer": [
        "Graphic Design Adobe Photoshop Illustrator InDesign. Typography Color Theory Brand Identity. Canva Figma UI/UX Design.",
        "Adobe Photoshop Illustrator Graphic Design Typography. Brand Identity Color Theory InDesign. Canva Figma.",
    ],
    "animator": [
        "Animation After Effects Motion Graphics 3D Modeling. Storyboarding Illustration Adobe Photoshop. Premiere Pro.",
        "Animation Motion Graphics After Effects 3D Modeling. Storyboarding Illustration. Premiere Pro Adobe Photoshop.",
    ],
    "filmmaker": [
        "Film Production Premiere Pro After Effects Video Editing. Storyboarding Script Writing Storytelling Photography. Adobe Photoshop.",
        "Film Production Video Editing Premiere Pro After Effects. Storyboarding Script Writing Photography Storytelling.",
    ],
    # Sports
    "yoga instructor": [
        "Yoga Personal Training Fitness Assessment. Coaching Sports Nutrition Injury Prevention. Team Management.",
    ],
    "sports coach": [
        "Coaching Athletic Training Sports Nutrition Team Management. Performance Analysis Injury Prevention Sports Psychology. Fitness Assessment.",
    ],
    "fitness trainer": [
        "Personal Training Fitness Assessment Sports Nutrition. Coaching Athletic Training Injury Prevention. Team Management.",
    ],
}


def fetch_jobs(role: str, location: str = "India", count: int = 10) -> list:
    """
    Fetch jobs from Adzuna API for a given role.
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
    Returns top 10 most demanded skills as [(skill, count), ...].
    """
    skill_counter = Counter()
    for job in jobs:
        raw = job.get("description", "") + " " + job.get("title", "")
        desc = _strip_html(raw).lower()
        for skill in ALL_KNOWN_SKILLS:
            skill_lower = skill.lower()
            if len(skill_lower) <= 3:
                if re.search(r"\b" + re.escape(skill_lower) + r"\b", desc):
                    skill_counter[skill] += 1
            else:
                if skill_lower in desc:
                    skill_counter[skill] += 1
    return skill_counter.most_common(10)


def calculate_market_match(student_skills: list, job_skill_demand: list) -> dict:
    """Calculate how well student skills match market demand."""
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
        title = job.get("title", "").lower()
        desc = job.get("description", "").lower()
        combined = f"{title} {desc}"

        student_lower = [s.lower() for s in student_skills]

        matches = 0
        for skill in student_lower:
            if skill in combined:
                matches += 1
            else:
                words = skill.split()
                if len(words) > 1 and any(w in combined for w in words if len(w) > 2):
                    matches += 0.5

        skill_pct = matches / max(len(student_skills), 1) * 100

        title_bonus = 0
        role_keywords = [
            "software", "developer", "engineer", "analyst", "designer",
            "manager", "data", "frontend", "backend", "full stack",
            "devops", "product", "marketing", "consultant", "research",
            "content", "creative", "finance", "legal", "medical",
            "chef", "planner", "photographer", "hotel", "event",
        ]
        title_lower = title.lower()
        if any(kw in title_lower for kw in role_keywords):
            title_bonus = 15

        match_pct = min(round(skill_pct + title_bonus, 1), 100)

        ranked.append({
            "title": job.get("title", "Unknown Role"),
            "company": job.get("company", {}).get("display_name", "N/A"),
            "location": job.get("location", {}).get("display_name", "N/A"),
            "apply_url": job.get("redirect_url", "#"),
            "match_percentage": match_pct,
            "salary": job.get("salary_min", "Not disclosed"),
        })
    return sorted(ranked, key=lambda x: x["match_percentage"], reverse=True)[:5]


# ══════════════════════════════════════════════════════════════════════════
# MAIN MARKET TRENDS API
# ══════════════════════════════════════════════════════════════════════════

def get_market_trends(roles: list | None = None, domain: str = "") -> dict:
    """
    Aggregate skill demand data across multiple roles for Market Intelligence.
    Fetches all roles in PARALLEL for speed.
    """
    roles_to_scan = roles or [
        "Software Engineer",
        "Data Scientist",
        "DevOps Engineer",
        "Frontend Developer",
        "ML Engineer",
        "Backend Developer",
    ]

    # Resolve domain hint — prefer explicit domain from frontend
    explicit_hint = HINT_FROM_PUBLIC_DOMAIN.get(domain, "")

    all_skill_counts = Counter()
    domain_scores = {}

    def _scan_role(role: str):
        """Fetch + extract skills for one role (runs in thread)."""
        jobs = fetch_jobs(role, count=5)
        skills = extract_skills_from_jobs(jobs)

        domain_hint = explicit_hint or _detect_domain(role)
        expected_domain = PUBLIC_DOMAIN_FROM_HINT.get(domain_hint, "")
        expected_skills = {
            s.lower() for s in DOMAIN_SKILL_MAP.get(expected_domain, [])
        }

        if expected_skills:
            total = sum(c for _, c in skills)
            relevant = sum(
                c for s, c in skills if s.lower() in expected_skills
            )
            relevance = relevant / max(total, 1)

            use_mock = False
            if relevance < 0.20:
                print(
                    f"[Market] API results for '{role}' are off-domain "
                    f"(relevance={relevance:.0%}, expected={expected_domain}). "
                    f"Falling back to mock data."
                )
                use_mock = True
            elif total < 5:
                print(
                    f"[Market] API results for '{role}' are too sparse "
                    f"({total} mentions). Falling back to mock data."
                )
                use_mock = True

            if use_mock:
                jobs = _mock_jobs(role, domain_hint_override=domain_hint)
                skills = extract_skills_from_jobs(jobs)

        return skills

    # ── Parallel fetch all roles ─────────────────────────────────────────
    with ThreadPoolExecutor(max_workers=min(len(roles_to_scan), 6)) as pool:
        futures = {pool.submit(_scan_role, role): role for role in roles_to_scan}
        for fut in as_completed(futures):
            try:
                skills = fut.result()
                for skill, count in skills:
                    all_skill_counts[skill] += count
            except Exception as e:
                print(f"[Market] Role scan failed: {e}")

    # Top 10 demanded skills
    top_skills = all_skill_counts.most_common(10)

    # Domain competitiveness scores
    for d, d_skills in DOMAIN_SKILL_MAP.items():
        score = sum(all_skill_counts.get(s, 0) for s in d_skills)
        if score > 0:
            domain_scores[d] = min(100, score * 8)

    # If the explicit domain has no score yet, ensure it appears
    if domain and domain not in domain_scores and top_skills:
        total_mentions = sum(count for _, count in top_skills)
        domain_scores[domain] = min(100, max(20, total_mentions * 12))

    # Fallback for sparse data
    if not domain_scores and roles_to_scan:
        inferred = domain or _infer_public_domain_from_roles(roles_to_scan)
        if inferred:
            total_mentions = sum(count for _, count in top_skills) if top_skills else 1
            domain_scores[inferred] = min(100, max(20, total_mentions * 12))

    return {
        "top_skills": top_skills,
        "domain_competitiveness": domain_scores,
        "analyzed_roles": roles_to_scan,
    }


# ══════════════════════════════════════════════════════════════════════════
# HELPERS
# ══════════════════════════════════════════════════════════════════════════

def _detect_domain(role: str) -> str:
    """Map a role name to one of the domain hint keys."""
    role_lower = role.lower()
    # Try longest match first (multi-word keys)
    sorted_hints = sorted(ROLE_DOMAIN_HINTS.items(), key=lambda x: -len(x[0]))
    for keyword, d in sorted_hints:
        if keyword in role_lower:
            return d
    return "tech"  # safe fallback


def _infer_public_domain_from_roles(roles: list[str]) -> str | None:
    """Infer the most likely public domain label from selected roles."""
    hint_counts = Counter()
    for role in roles:
        hint = _detect_domain(role)
        hint_counts[hint] += 1
    if not hint_counts:
        return None
    top_hint = hint_counts.most_common(1)[0][0]
    return PUBLIC_DOMAIN_FROM_HINT.get(top_hint)


def _mock_jobs(role: str, domain_hint_override: str = "") -> list:
    """
    Generate domain-aware mock job data when Adzuna API is unavailable
    or returns irrelevant results.

    Strategy:
      1. If we have ROLE_SPECIFIC_MOCKS for this role → use those
      2. Else use domain mock descriptions
    """
    # Check for role-specific mock data first
    role_lower = role.lower()
    for mock_key, mock_descs in ROLE_SPECIFIC_MOCKS.items():
        if mock_key in role_lower or role_lower in mock_key:
            descs = mock_descs
            break
    else:
        # Fall back to domain-level mocks
        domain = domain_hint_override or _detect_domain(role)
        descs = MOCK_DESCRIPTIONS_BY_DOMAIN.get(
            domain, MOCK_DESCRIPTIONS_BY_DOMAIN["tech"]
        )

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
            "title": [
                f"Junior {role}", f"{role}", f"Senior {role}",
                f"Associate {role}", f"{role} — Entry Level",
            ][i % 5],
            "company": {"display_name": company},
            "location": {"display_name": location},
            "redirect_url": f"https://example.com/apply/{i + 1}",
            "salary_min": [400000, 600000, 1000000, 800000, 300000][i % 5],
            "description": desc,
        })
    return jobs
