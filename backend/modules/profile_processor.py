"""
ALIGNIQ v2 — Profile Processor
Handles universal student profiles. Works for any field — engineering, arts, medicine, law, etc.
"""

# ─── Activity → Interest Cluster Mapping ──────────────────────────────────────
ACTIVITY_CLUSTERS = {
    "Technical & Analytical": ["logic", "data", "coding", "tech", "research", "finance"],
    "Creative & Artistic":    ["art", "design", "writing", "performing", "cooking", "culture"],
    "People & Communication": ["helping", "teaching", "networking", "caring", "leading"],
    "Outdoor & Physical":     ["sports", "nature", "outdoors", "animals"],
    "Leadership & Strategy":  ["leading", "trading", "building"],
}

ACTIVITY_NAMES = {
    "logic": "Solving logical problems", "data": "Analyzing data & patterns",
    "coding": "Coding and automating", "tech": "Working with technology",
    "research": "Researching & discovering", "finance": "Managing finances",
    "art": "Creating visual art", "design": "Designing and aesthetics",
    "writing": "Writing and storytelling", "performing": "Performing on stage",
    "cooking": "Cooking and crafting", "culture": "Cultural & heritage work",
    "helping": "Helping people", "teaching": "Teaching and explaining",
    "networking": "Communicating & networking", "caring": "Caring for others",
    "leading": "Leading and organizing", "trading": "Trading and negotiating",
    "sports": "Playing or coaching sports", "nature": "Working with nature",
    "outdoors": "Exploring outdoors", "animals": "Working with animals",
    "building": "Building / making things", "debating": "Debating and arguing",
}

# ─── Role Requirements Dictionary ─────────────────────────────────────────────
ROLE_REQUIREMENTS = {
    # ── Technology & Engineering ──
    "Software Developer": {
        "skills": ["Python", "JavaScript", "Java", "SQL", "Git", "System Design"],
        "personality_ideal": {"analytical_creative": 30, "independent_collaborative": 40, "theoretical_practical": 60, "stable_adaptive": 50, "specialist_generalist": 30},
        "activity_fit": ["coding", "logic", "building", "tech"],
        "education_relevance": ["Computer Engineering", "Computer Science", "Electronics Engineering"],
        "salary_range": "₹6L – ₹30L", "growth_trajectory": "High", "market_demand": "Very Strong",
    },
    "Data Scientist": {
        "skills": ["Python", "SQL", "Machine Learning", "Statistical Analysis", "Data Visualization"],
        "personality_ideal": {"analytical_creative": 25, "independent_collaborative": 35, "theoretical_practical": 45, "stable_adaptive": 45, "specialist_generalist": 35},
        "activity_fit": ["data", "logic", "research", "coding"],
        "education_relevance": ["Computer Engineering", "Computer Science", "Statistics", "Mathematics", "Physics"],
        "salary_range": "₹8L – ₹35L", "growth_trajectory": "Very High", "market_demand": "Very Strong",
    },
    "AI/ML Engineer": {
        "skills": ["Python", "Machine Learning", "Deep Learning", "SQL", "Cloud (AWS/Azure)"],
        "personality_ideal": {"analytical_creative": 35, "independent_collaborative": 30, "theoretical_practical": 40, "stable_adaptive": 45, "specialist_generalist": 25},
        "activity_fit": ["coding", "logic", "research", "data"],
        "education_relevance": ["Computer Engineering", "Computer Science", "Electronics Engineering", "Mathematics"],
        "salary_range": "₹10L – ₹50L", "growth_trajectory": "Very High", "market_demand": "Strong",
    },
    "UX/UI Designer": {
        "skills": ["Figma", "Adobe Photoshop", "UI Prototyping", "User Research", "Typography"],
        "personality_ideal": {"analytical_creative": 70, "independent_collaborative": 65, "theoretical_practical": 70, "stable_adaptive": 60, "specialist_generalist": 50},
        "activity_fit": ["design", "art", "building", "helping", "tech"],
        "education_relevance": ["Graphic Design", "Computer Science", "Psychology", "Fine Arts", "Architecture", "Industrial Design"],
        "salary_range": "₹6L – ₹25L", "growth_trajectory": "High", "market_demand": "Strong",
    },
    "DevOps Engineer": {
        "skills": ["Docker", "Kubernetes", "Cloud (AWS/Azure)", "Linux", "CI/CD"],
        "personality_ideal": {"analytical_creative": 30, "independent_collaborative": 50, "theoretical_practical": 65, "stable_adaptive": 55, "specialist_generalist": 35},
        "activity_fit": ["tech", "coding", "logic", "building"],
        "education_relevance": ["Computer Engineering", "Computer Science", "Electronics Engineering"],
        "salary_range": "₹8L – ₹30L", "growth_trajectory": "High", "market_demand": "Strong",
    },
    "Cybersecurity Analyst": {
        "skills": ["Python", "Linux", "Network Security", "Ethical Hacking", "SQL"],
        "personality_ideal": {"analytical_creative": 30, "independent_collaborative": 30, "theoretical_practical": 60, "stable_adaptive": 40, "specialist_generalist": 25},
        "activity_fit": ["logic", "research", "tech", "coding"],
        "education_relevance": ["Computer Engineering", "Computer Science", "Electronics Engineering"],
        "salary_range": "₹7L – ₹28L", "growth_trajectory": "High", "market_demand": "Strong",
    },
    # ── Business & Management ──
    "Business Analyst": {
        "skills": ["MS Excel", "Data Analysis", "Business Communication", "SQL", "PowerBI"],
        "personality_ideal": {"analytical_creative": 35, "independent_collaborative": 65, "theoretical_practical": 60, "stable_adaptive": 50, "specialist_generalist": 55},
        "activity_fit": ["data", "logic", "trading", "networking"],
        "education_relevance": ["Business Administration", "Commerce", "Economics", "Computer Science", "MBA", "BBA"],
        "salary_range": "₹5L – ₹20L", "growth_trajectory": "High", "market_demand": "Strong",
    },
    "Product Manager": {
        "skills": ["Product Strategy", "Market Research", "Data Analysis", "Agile", "Communication"],
        "personality_ideal": {"analytical_creative": 50, "independent_collaborative": 75, "theoretical_practical": 65, "stable_adaptive": 65, "specialist_generalist": 70},
        "activity_fit": ["leading", "tech", "trading", "data", "networking"],
        "education_relevance": ["Computer Science", "Business Administration", "MBA", "Engineering"],
        "salary_range": "₹15L – ₹60L", "growth_trajectory": "Very High", "market_demand": "Strong",
    },
    "Marketing Manager": {
        "skills": ["Market Research", "Content Creation", "Data Analysis", "SEO", "Brand Strategy"],
        "personality_ideal": {"analytical_creative": 65, "independent_collaborative": 70, "theoretical_practical": 60, "stable_adaptive": 65, "specialist_generalist": 65},
        "activity_fit": ["networking", "writing", "art", "data", "leading"],
        "education_relevance": ["Marketing", "Business Administration", "MBA", "BBA", "Commerce"],
        "salary_range": "₹5L – ₹25L", "growth_trajectory": "High", "market_demand": "Moderate",
    },
    "Entrepreneur": {
        "skills": ["Business Strategy", "Financial Planning", "Networking", "Sales", "Leadership"],
        "personality_ideal": {"analytical_creative": 60, "independent_collaborative": 55, "theoretical_practical": 70, "stable_adaptive": 80, "specialist_generalist": 75},
        "activity_fit": ["leading", "trading", "building", "networking", "finance"],
        "education_relevance": ["Business Administration", "MBA", "Engineering", "Economics"],
        "salary_range": "Variable", "growth_trajectory": "High (Risk)", "market_demand": "Always needed",
    },
    "HR Manager": {
        "skills": ["Business Communication", "Counseling Skills", "Report Writing", "MS Excel", "Recruitment"],
        "personality_ideal": {"analytical_creative": 50, "independent_collaborative": 80, "theoretical_practical": 60, "stable_adaptive": 50, "specialist_generalist": 60},
        "activity_fit": ["helping", "leading", "networking", "teaching"],
        "education_relevance": ["Business Administration", "Psychology", "MBA", "BBA", "Sociology"],
        "salary_range": "₹5L – ₹18L", "growth_trajectory": "Stable", "market_demand": "Stable",
    },
    # ── Creative & Design ──
    "Graphic Designer": {
        "skills": ["Adobe Photoshop", "Illustrator", "Typography", "Brand Identity", "Color Theory"],
        "personality_ideal": {"analytical_creative": 80, "independent_collaborative": 50, "theoretical_practical": 70, "stable_adaptive": 60, "specialist_generalist": 45},
        "activity_fit": ["art", "design", "culture"],
        "education_relevance": ["Graphic Design", "Fine Arts", "Architecture"],
        "salary_range": "₹3L – ₹15L", "growth_trajectory": "Moderate", "market_demand": "Moderate",
    },
    "Content Creator": {
        "skills": ["Creative Writing", "Video Editing", "SEO", "Social Media", "Storytelling"],
        "personality_ideal": {"analytical_creative": 75, "independent_collaborative": 55, "theoretical_practical": 60, "stable_adaptive": 70, "specialist_generalist": 70},
        "activity_fit": ["writing", "performing", "art", "networking"],
        "education_relevance": ["Literature", "Journalism", "Fine Arts", "Communication"],
        "salary_range": "₹3L – ₹20L", "growth_trajectory": "High", "market_demand": "Strong",
    },
    "Architect": {
        "skills": ["AutoCAD", "SketchUp", "3D Modeling", "Structural Design", "Project Management"],
        "personality_ideal": {"analytical_creative": 65, "independent_collaborative": 55, "theoretical_practical": 55, "stable_adaptive": 50, "specialist_generalist": 40},
        "activity_fit": ["design", "building", "art", "logic"],
        "education_relevance": ["Architecture", "Civil Engineering"],
        "salary_range": "₹4L – ₹20L", "growth_trajectory": "Moderate", "market_demand": "Moderate",
    },
    "Filmmaker": {
        "skills": ["Scriptwriting", "Video Editing", "Storytelling", "Cinematography", "Project Management"],
        "personality_ideal": {"analytical_creative": 85, "independent_collaborative": 60, "theoretical_practical": 60, "stable_adaptive": 70, "specialist_generalist": 60},
        "activity_fit": ["performing", "art", "writing", "leading"],
        "education_relevance": ["Fine Arts", "Theatre", "Literature", "Communication"],
        "salary_range": "₹3L – ₹30L", "growth_trajectory": "Variable", "market_demand": "Niche",
    },
    # ── Science & Research ──
    "Research Scientist": {
        "skills": ["Research Methodology", "Statistical Analysis", "Lab Techniques", "Scientific Writing"],
        "personality_ideal": {"analytical_creative": 30, "independent_collaborative": 35, "theoretical_practical": 25, "stable_adaptive": 35, "specialist_generalist": 20},
        "activity_fit": ["research", "logic", "data", "nature"],
        "education_relevance": ["Physics", "Chemistry", "Biology", "Computer Science", "Biotechnology", "Mathematics"],
        "salary_range": "₹5L – ₹20L", "growth_trajectory": "Moderate", "market_demand": "Moderate",
    },
    "Biotechnologist": {
        "skills": ["Lab Techniques", "Molecular Biology", "Research Methodology", "Data Analysis"],
        "personality_ideal": {"analytical_creative": 35, "independent_collaborative": 40, "theoretical_practical": 40, "stable_adaptive": 40, "specialist_generalist": 25},
        "activity_fit": ["research", "nature", "logic"],
        "education_relevance": ["Biotechnology", "Biology", "Chemistry", "Pharmacy"],
        "salary_range": "₹4L – ₹15L", "growth_trajectory": "High", "market_demand": "Moderate",
    },
    # ── Healthcare ──
    "Doctor (General)": {
        "skills": ["Patient Communication", "Clinical Assessment", "Diagnostic Skills", "Medical Ethics", "First Aid"],
        "personality_ideal": {"analytical_creative": 35, "independent_collaborative": 60, "theoretical_practical": 55, "stable_adaptive": 40, "specialist_generalist": 35},
        "activity_fit": ["caring", "helping", "research", "logic"],
        "education_relevance": ["MBBS", "Medicine"],
        "salary_range": "₹10L – ₹50L", "growth_trajectory": "Stable High", "market_demand": "Always High",
    },
    "Clinical Psychologist": {
        "skills": ["Counseling Skills", "Research Methodology", "Report Writing", "Patient Communication", "Crisis Intervention"],
        "personality_ideal": {"analytical_creative": 50, "independent_collaborative": 70, "theoretical_practical": 45, "stable_adaptive": 45, "specialist_generalist": 35},
        "activity_fit": ["caring", "helping", "research", "teaching"],
        "education_relevance": ["Psychology", "MBBS", "Social Work"],
        "salary_range": "₹4L – ₹18L", "growth_trajectory": "High", "market_demand": "Growing",
    },
    "Pharmacist": {
        "skills": ["Pharmacology Basics", "Medical Documentation", "Patient Communication", "Research"],
        "personality_ideal": {"analytical_creative": 30, "independent_collaborative": 55, "theoretical_practical": 55, "stable_adaptive": 35, "specialist_generalist": 30},
        "activity_fit": ["caring", "research", "logic"],
        "education_relevance": ["Pharmacy", "Chemistry", "Biology"],
        "salary_range": "₹4L – ₹15L", "growth_trajectory": "Stable", "market_demand": "Stable",
    },
    # ── Law ──
    "Lawyer": {
        "skills": ["Legal Research", "Case Analysis", "Argumentation", "Contract Drafting", "Legal Writing"],
        "personality_ideal": {"analytical_creative": 35, "independent_collaborative": 55, "theoretical_practical": 50, "stable_adaptive": 45, "specialist_generalist": 40},
        "activity_fit": ["debating", "research", "writing", "helping"],
        "education_relevance": ["LLB", "BA LLB", "Corporate Law", "International Law"],
        "salary_range": "₹4L – ₹50L", "growth_trajectory": "High", "market_demand": "Stable",
    },
    "IAS/IPS Officer": {
        "skills": ["Policy Analysis", "Report Writing", "Public Speaking", "Leadership", "Research"],
        "personality_ideal": {"analytical_creative": 40, "independent_collaborative": 60, "theoretical_practical": 50, "stable_adaptive": 50, "specialist_generalist": 60},
        "activity_fit": ["leading", "research", "debating", "helping"],
        "education_relevance": ["Political Science", "History", "Economics", "Law", "Engineering"],
        "salary_range": "₹8L – ₹20L (+ perks)", "growth_trajectory": "Stable", "market_demand": "Competitive",
    },
    # ── Education & Social ──
    "Teacher": {
        "skills": ["Communication", "Content Creation", "Research", "Public Speaking", "Counseling Skills"],
        "personality_ideal": {"analytical_creative": 55, "independent_collaborative": 75, "theoretical_practical": 55, "stable_adaptive": 45, "specialist_generalist": 55},
        "activity_fit": ["teaching", "helping", "leading", "writing"],
        "education_relevance": ["Education", "any field"],
        "salary_range": "₹3L – ₹12L", "growth_trajectory": "Stable", "market_demand": "Always High",
    },
    "Social Worker": {
        "skills": ["Community Engagement", "Counseling Skills", "Report Writing", "Grant Writing", "Crisis Intervention"],
        "personality_ideal": {"analytical_creative": 50, "independent_collaborative": 80, "theoretical_practical": 65, "stable_adaptive": 55, "specialist_generalist": 60},
        "activity_fit": ["helping", "caring", "leading", "teaching"],
        "education_relevance": ["Social Work", "Psychology", "Sociology"],
        "salary_range": "₹3L – ₹10L", "growth_trajectory": "Moderate", "market_demand": "Moderate",
    },
    # ── Media ──
    "Journalist": {
        "skills": ["Creative Writing", "Research & Analysis", "Editing", "Storytelling", "Public Speaking"],
        "personality_ideal": {"analytical_creative": 60, "independent_collaborative": 55, "theoretical_practical": 60, "stable_adaptive": 70, "specialist_generalist": 65},
        "activity_fit": ["writing", "research", "networking", "debating"],
        "education_relevance": ["Literature", "Political Science", "History", "Journalism"],
        "salary_range": "₹3L – ₹15L", "growth_trajectory": "Changing", "market_demand": "Moderate",
    },
    "Digital Marketer": {
        "skills": ["SEO", "Content Creation", "Data Analysis", "Social Media", "Google Analytics"],
        "personality_ideal": {"analytical_creative": 60, "independent_collaborative": 65, "theoretical_practical": 65, "stable_adaptive": 65, "specialist_generalist": 65},
        "activity_fit": ["networking", "writing", "art", "data"],
        "education_relevance": ["Marketing", "Business Administration", "Commerce", "Computer Science"],
        "salary_range": "₹3L – ₹18L", "growth_trajectory": "High", "market_demand": "Strong",
    },
    # ── Finance ──
    "Chartered Accountant": {
        "skills": ["Financial Accounting", "Tally", "GST/Taxation", "MS Excel", "Auditing"],
        "personality_ideal": {"analytical_creative": 20, "independent_collaborative": 45, "theoretical_practical": 55, "stable_adaptive": 30, "specialist_generalist": 20},
        "activity_fit": ["finance", "logic", "data"],
        "education_relevance": ["Commerce", "Accounting", "Finance", "Economics"],
        "salary_range": "₹7L – ₹30L", "growth_trajectory": "Stable High", "market_demand": "Always High",
    },
    "Financial Analyst": {
        "skills": ["Financial Modeling", "MS Excel", "Data Analysis", "PowerBI", "Market Research"],
        "personality_ideal": {"analytical_creative": 25, "independent_collaborative": 45, "theoretical_practical": 55, "stable_adaptive": 40, "specialist_generalist": 30},
        "activity_fit": ["finance", "data", "logic", "research"],
        "education_relevance": ["Finance", "Economics", "Commerce", "Mathematics", "MBA"],
        "salary_range": "₹5L – ₹25L", "growth_trajectory": "High", "market_demand": "Strong",
    },
    # ── Arts & Culture ──
    "Musician": {
        "skills": ["Music Theory", "Instrument Proficiency", "Performance", "Music Production", "Composition"],
        "personality_ideal": {"analytical_creative": 85, "independent_collaborative": 50, "theoretical_practical": 55, "stable_adaptive": 65, "specialist_generalist": 40},
        "activity_fit": ["performing", "art", "culture"],
        "education_relevance": ["Music", "Fine Arts", "Performing Arts"],
        "salary_range": "₹2L – ₹100L+", "growth_trajectory": "Variable", "market_demand": "Niche",
    },
    "Novelist": {
        "skills": ["Creative Writing", "Storytelling", "Research & Analysis", "Editing", "Critical Thinking"],
        "personality_ideal": {"analytical_creative": 90, "independent_collaborative": 25, "theoretical_practical": 30, "stable_adaptive": 50, "specialist_generalist": 50},
        "activity_fit": ["writing", "research", "culture"],
        "education_relevance": ["Literature", "Philosophy", "History"],
        "salary_range": "₹2L – ₹30L", "growth_trajectory": "Variable", "market_demand": "Niche",
    },
    # ── Sports ──
    "Sports Coach": {
        "skills": ["Sports Coaching", "Fitness Assessment", "Team Coordination", "Sports Psychology", "First Aid & Injury Prevention"],
        "personality_ideal": {"analytical_creative": 45, "independent_collaborative": 80, "theoretical_practical": 70, "stable_adaptive": 60, "specialist_generalist": 50},
        "activity_fit": ["sports", "teaching", "leading", "helping"],
        "education_relevance": ["Sports Management", "Physical Education", "Sports Science"],
        "salary_range": "₹3L – ₹20L", "growth_trajectory": "Growing", "market_demand": "Growing",
    },
    "Fitness Trainer": {
        "skills": ["Fitness Assessment", "Nutrition Planning", "Sports Psychology", "First Aid & Injury Prevention"],
        "personality_ideal": {"analytical_creative": 40, "independent_collaborative": 75, "theoretical_practical": 75, "stable_adaptive": 60, "specialist_generalist": 45},
        "activity_fit": ["sports", "helping", "caring"],
        "education_relevance": ["Sports Management", "Nutrition & Dietetics"],
        "salary_range": "₹3L – ₹15L", "growth_trajectory": "Growing", "market_demand": "Growing",
    },
    # ── Trades ──
    "Chef / Culinary Artist": {
        "skills": ["Culinary Techniques", "Menu Planning", "Food Safety & Hygiene", "Customer Relations", "Cost Control"],
        "personality_ideal": {"analytical_creative": 70, "independent_collaborative": 55, "theoretical_practical": 80, "stable_adaptive": 65, "specialist_generalist": 45},
        "activity_fit": ["cooking", "art", "helping", "building"],
        "education_relevance": ["Culinary Arts", "Hotel Management", "Tourism & Hospitality"],
        "salary_range": "₹3L – ₹20L", "growth_trajectory": "Moderate", "market_demand": "Stable",
    },
    "Event Manager": {
        "skills": ["Event Planning", "Budget Management", "Vendor Management", "Communication", "Negotiation"],
        "personality_ideal": {"analytical_creative": 60, "independent_collaborative": 80, "theoretical_practical": 75, "stable_adaptive": 75, "specialist_generalist": 70},
        "activity_fit": ["leading", "networking", "cooking", "art"],
        "education_relevance": ["Event Management", "Hotel Management", "MBA", "BBA"],
        "salary_range": "₹3L – ₹15L", "growth_trajectory": "Moderate", "market_demand": "Moderate",
    },
    "Pilot": {
        "skills": ["Aviation Theory", "Navigation", "Communication", "Technical Knowledge", "Crisis Management"],
        "personality_ideal": {"analytical_creative": 30, "independent_collaborative": 60, "theoretical_practical": 65, "stable_adaptive": 45, "specialist_generalist": 30},
        "activity_fit": ["tech", "outdoors", "logic"],
        "education_relevance": ["Aviation", "Physics", "Mathematics", "Engineering"],
        "salary_range": "₹15L – ₹80L", "growth_trajectory": "Stable High", "market_demand": "Strong",
    },
}

# Default data for roles not in ROLE_REQUIREMENTS
DOMAIN_DEFAULTS = {
    "Technology & Engineering": {"salary_range": "₹5L – ₹30L", "growth_trajectory": "High", "market_demand": "Strong"},
    "Business & Management":    {"salary_range": "₹5L – ₹25L", "growth_trajectory": "High", "market_demand": "Moderate"},
    "Creative & Design":        {"salary_range": "₹3L – ₹20L", "growth_trajectory": "Moderate", "market_demand": "Moderate"},
    "Science & Research":       {"salary_range": "₹4L – ₹15L", "growth_trajectory": "Moderate", "market_demand": "Niche"},
    "Healthcare & Medicine":    {"salary_range": "₹5L – ₹30L", "growth_trajectory": "Stable", "market_demand": "Always High"},
    "Law & Policy":             {"salary_range": "₹4L – ₹30L", "growth_trajectory": "Stable", "market_demand": "Stable"},
    "Education & Social":       {"salary_range": "₹3L – ₹12L", "growth_trajectory": "Stable", "market_demand": "Stable"},
    "Media & Communication":    {"salary_range": "₹3L – ₹18L", "growth_trajectory": "Changing", "market_demand": "Moderate"},
    "Finance & Economics":      {"salary_range": "₹5L – ₹30L", "growth_trajectory": "Stable High", "market_demand": "Strong"},
    "Arts & Culture":           {"salary_range": "₹2L – ₹20L", "growth_trajectory": "Variable", "market_demand": "Niche"},
    "Sports & Wellness":        {"salary_range": "₹3L – ₹15L", "growth_trajectory": "Growing", "market_demand": "Growing"},
    "Trades & Skilled Work":    {"salary_range": "₹3L – ₹15L", "growth_trajectory": "Stable", "market_demand": "Stable"},
}

# Map role → domain for scoring
ROLE_DOMAIN_MAP = {}
UNIVERSAL_DOMAINS = {
    "Technology & Engineering": ["Software Developer","Data Scientist","AI/ML Engineer","Cybersecurity Analyst","Cloud Architect","DevOps Engineer","Embedded Systems Engineer","Robotics Engineer","Civil Engineer","Mechanical Engineer","Electrical Engineer","Chemical Engineer","Biomedical Engineer","Aerospace Engineer","Environmental Engineer","Network Engineer"],
    "Business & Management": ["Business Analyst","Product Manager","Project Manager","Management Consultant","Operations Manager","Supply Chain Manager","HR Manager","Entrepreneur","Financial Analyst","Investment Banker","Actuary","Risk Analyst","Marketing Manager","Brand Strategist","Sales Manager","Retail Manager"],
    "Creative & Design": ["UX/UI Designer","Graphic Designer","Motion Designer","Architect","Interior Designer","Fashion Designer","Industrial Designer","Game Designer","Photographer","Filmmaker","Content Creator","Art Director","Illustrator","Animator","Creative Director","Set Designer"],
    "Science & Research": ["Research Scientist","Biotechnologist","Pharmacologist","Chemist","Physicist","Astronomer","Marine Biologist","Neuroscientist","Geologist","Epidemiologist","Forensic Scientist","Materials Scientist","Environmental Scientist","Food Scientist","Geneticist","Microbiologist"],
    "Healthcare & Medicine": ["Doctor (General)","Surgeon","Psychiatrist","Dentist","Pharmacist","Physiotherapist","Nurse","Radiologist","Nutritionist","Veterinarian","Occupational Therapist","Paramedic","Public Health Specialist","Medical Researcher","Clinical Psychologist","Anesthesiologist"],
    "Law & Policy": ["Lawyer","Judge","Public Prosecutor","Corporate Lawyer","Civil Rights Advocate","Policy Analyst","Diplomat","IAS/IPS Officer","Legal Consultant","Compliance Officer","Paralegal","Arbitrator","Intelligence Analyst","Urban Planner","Social Policy Researcher","NGO Director"],
    "Education & Social": ["Teacher","Professor","Education Consultant","School Counselor","Social Worker","Community Organizer","Nonprofit Manager","Youth Worker","Librarian","Museum Curator","Educational Content Creator","Instructional Designer","Child Psychologist","Special Educator","Academic Researcher","Career Coach"],
    "Media & Communication": ["Journalist","News Anchor","Podcast Host","Public Relations Specialist","Copywriter","Technical Writer","Editor","Publisher","Social Media Manager","Digital Marketer","SEO Specialist","Advertising Executive","Screenwriter","Radio Jockey","Documentary Filmmaker","Communication Strategist"],
    "Finance & Economics": ["Chartered Accountant","Cost Accountant","Tax Consultant","Auditor","Financial Planner","Wealth Manager","Economist","Budget Analyst","Credit Analyst","Insurance Underwriter","Stockbroker","Forex Trader","Microfinance Specialist","Development Economist","Quantitative Analyst","CFO"],
    "Arts & Culture": ["Musician","Classical Dancer","Theater Artist","Stand-up Comedian","Poet","Novelist","Sculptor","Painter","Art Restorer","Cultural Journalist","Heritage Curator","Arts Administrator","Film Critic","Music Producer","Choreographer","Voice Artist"],
    "Sports & Wellness": ["Professional Athlete","Sports Coach","Sports Psychologist","Fitness Trainer","Yoga Instructor","Sports Nutritionist","Physiotherapist","Sports Manager","Adventure Sports Guide","Esports Professional","Sports Journalist","Athletic Director"],
    "Trades & Skilled Work": ["Chef / Culinary Artist","Sommelier","Event Manager","Wedding Planner","Real Estate Agent","Travel Consultant","Hotel Manager","Flight Attendant","Pilot","Merchant Navy Officer","Electrician (Master)","CNC Machinist","Carpenter","Jewellery Designer","Tattoo Artist","Wedding Photographer"],
}
for domain, roles in UNIVERSAL_DOMAINS.items():
    for role in roles:
        ROLE_DOMAIN_MAP[role] = domain


def process_profile(data: dict) -> dict:
    """
    Process v2 universal student profile into structured analysis inputs.
    """
    identity   = data.get('identity', {})
    interests  = data.get('interests', {})
    experience = data.get('experience', {})
    skills     = data.get('skills', {})
    intent     = data.get('intent', {})
    personality= data.get('personality', {})

    return {
        'personality_scores': calculate_personality_scores(personality.get('answers', {})),
        'interest_clusters':  calculate_interest_clusters(interests.get('activities', [])),
        'cgpa_norm':         min(identity.get('cgpa', 0) / 10.0, 1.0),
        'field_of_study':    identity.get('field_of_study', ''),
        'education_level':   identity.get('education_level', ''),
        'consistency':       identity.get('consistency', 'medium'),
        'backlogs':          int(identity.get('backlogs', 0)),
        'activities':        interests.get('activities', []),
        'work_environments': interests.get('work_environments', []),
        'motivators':        interests.get('motivators', []),
        'internships':       int(experience.get('internships', 0)),
        'projects':          experience.get('projects', []),
        'competitions':      experience.get('competitions', ''),
        'leadership':        bool(experience.get('leadership', False)),
        'volunteer':         bool(experience.get('volunteer', False)),
        'readiness_rating':  int(experience.get('readiness_rating', 5)),
        'earned_from_skill': bool(experience.get('earned_from_skill', False)),
        'selected_skills':   skills.get('selected_skills', []),
        'proficiency_rating':int(skills.get('proficiency_rating', 5)),
        'languages_known':   skills.get('languages_known', []),
        'target_domain':     intent.get('target_domain', ''),
        'target_role':       intent.get('target_role', ''),
        'reasons':           intent.get('reasons', []),
        'salary_expectation':int(intent.get('salary_expectation', 10)),
        'work_location':     intent.get('work_location', 'Hybrid'),
        'open_to_education': intent.get('open_to_education', 'Maybe'),
    }


def calculate_personality_scores(answers: dict) -> dict:
    """
    Map 8 answers to 5 personality dimension scores (0–100).
    0 = left side of spectrum, 100 = right side.
    """
    s = {
        'analytical_creative':    50,
        'independent_collaborative': 50,
        'theoretical_practical':  50,
        'stable_adaptive':        50,
        'specialist_generalist':  50,
    }
    if answers.get('q1') == 'B': s['analytical_creative']    += 25
    else:                         s['analytical_creative']    -= 25
    if answers.get('q2') == 'B': s['independent_collaborative'] += 25
    else:                         s['independent_collaborative'] -= 25
    if answers.get('q3') == 'B': s['theoretical_practical']  += 25
    else:                         s['theoretical_practical']  -= 25
    if answers.get('q4') == 'B': s['stable_adaptive']        += 25
    else:                         s['stable_adaptive']        -= 25
    if answers.get('q5') == 'B': s['stable_adaptive']        += 12
    else:                         s['stable_adaptive']        -= 12
    if answers.get('q6') == 'B': s['analytical_creative']    += 12
    else:                         s['analytical_creative']    -= 12
    if answers.get('q7') == 'A': s['theoretical_practical']  += 12
    else:                         s['theoretical_practical']  -= 12
    if answers.get('q8') == 'B': s['specialist_generalist']  += 25
    else:                         s['specialist_generalist']  -= 25
    return {k: max(0, min(100, v)) for k, v in s.items()}


def calculate_interest_clusters(activities: list) -> list:
    cluster_scores = {}
    cluster_acts   = {}
    for cluster, acts in ACTIVITY_CLUSTERS.items():
        matched = [a for a in activities if a in acts]
        if matched:
            cluster_scores[cluster] = len(matched)
            cluster_acts[cluster]   = [ACTIVITY_NAMES.get(a, a) for a in matched]
    sorted_c = sorted(cluster_scores.items(), key=lambda x: x[1], reverse=True)
    result = []
    for i, (cluster, score) in enumerate(sorted_c[:3]):
        signal = 'strong' if (i == 0 and score >= 2) else 'moderate' if (i <= 1 or score >= 2) else 'emerging'
        result.append({'cluster': cluster, 'signal': signal, 'activities': cluster_acts[cluster]})
    return result


def calculate_skill_overlap(student_skills: list, role_skills: list) -> float:
    if not role_skills:
        return 0.5
    sl = [s.lower() for s in student_skills]
    rl = [s.lower() for s in role_skills]
    matches = sum(1 for rs in rl if any(ss in rs or rs in ss for ss in sl))
    return matches / len(rl)


def calculate_education_relevance(field: str, relevant_fields: list) -> float:
    if not relevant_fields or "any field" in relevant_fields:
        return 0.6
    field_lower = field.lower()
    for rf in relevant_fields:
        if rf.lower() in field_lower or field_lower in rf.lower():
            return 1.0
        if any(w in field_lower for w in rf.lower().split() if len(w) > 3):
            return 0.7
    return 0.2


def calculate_personality_match(student: dict, ideal: dict) -> float:
    if not ideal:
        return 0.5
    diffs = [abs(student.get(k, 50) - v) / 100.0 for k, v in ideal.items()]
    return 1 - (sum(diffs) / len(diffs))


def calculate_activity_match(activities: list, role_activities: list) -> float:
    if not role_activities:
        return 0.5
    return min(sum(1 for a in activities if a in role_activities) / len(role_activities), 1.0)


def predict_best_fit_careers(processed: dict) -> list:
    """
    Score all known roles and return top 3 career matches.
    """
    scores = {}
    for role, req in ROLE_REQUIREMENTS.items():
        skill_match   = calculate_skill_overlap(processed['selected_skills'], req['skills'])
        edu_match     = calculate_education_relevance(processed['field_of_study'], req.get('education_relevance', []))
        personality_m = calculate_personality_match(processed['personality_scores'], req.get('personality_ideal', {}))
        activity_m    = calculate_activity_match(processed['activities'], req.get('activity_fit', []))
        final = skill_match * 0.35 + edu_match * 0.25 + personality_m * 0.25 + activity_m * 0.15
        scores[role] = round(final * 100, 1)

    sorted_roles = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_roles[:3]


def get_role_details(role: str) -> dict:
    """Get salary/growth/demand for a role (with fallback by domain)."""
    if role in ROLE_REQUIREMENTS:
        r = ROLE_REQUIREMENTS[role]
        return {
            'salary_range':       r.get('salary_range', 'N/A'),
            'growth_trajectory':  r.get('growth_trajectory', 'N/A'),
            'market_demand':      r.get('market_demand', 'N/A'),
            'role_skills':        r.get('skills', []),
        }
    domain = ROLE_DOMAIN_MAP.get(role, '')
    defaults = DOMAIN_DEFAULTS.get(domain, {'salary_range': 'N/A', 'growth_trajectory': 'N/A', 'market_demand': 'N/A'})
    return {**defaults, 'role_skills': []}


def generate_why_text(role: str, processed: dict) -> str:
    """Generate a brief 'why this fits you' explanation."""
    clusters = [c['cluster'] for c in processed.get('interest_clusters', [])]
    field    = processed.get('field_of_study', '')
    p        = processed.get('personality_scores', {})
    creative = p.get('analytical_creative', 50) > 60
    collab   = p.get('independent_collaborative', 50) > 60
    practical= p.get('theoretical_practical', 50) > 60

    reasons = []
    if field:
        reasons.append(f"Your background in {field}")
    if clusters:
        reasons.append(f"strong {clusters[0].lower()} orientation")
    if creative:
        reasons.append("creative problem-solving tendency")
    elif not creative:
        reasons.append("analytical thinking style")
    if collab:
        reasons.append("collaborative work preference")
    if practical:
        reasons.append("practical, impact-focused mindset")

    return f"{', '.join(reasons[:3])} aligns well with what this role demands day-to-day."


def calculate_chosen_career_match(processed: dict, job_skill_demand: list) -> dict:
    """Calculate how well the student matches their chosen career."""
    target_role = processed.get('target_role', '')
    role_details = get_role_details(target_role)
    role_skills  = role_details.get('role_skills', [])

    # Skill match
    skill_match = round(calculate_skill_overlap(processed['selected_skills'], role_skills) * 100, 1) if role_skills else 50.0

    # Interest match — how much do their activities align with this role's domain
    domain = ROLE_DOMAIN_MAP.get(target_role, processed.get('target_domain', ''))
    req = ROLE_REQUIREMENTS.get(target_role, {})
    interest_match = round(calculate_activity_match(processed['activities'], req.get('activity_fit', [])) * 100, 1)

    # Experience match
    exp_score = min(
        (processed['internships'] * 20 + len(processed['projects']) * 10 +
         (10 if processed['competitions'] else 0) + (12 if processed['leadership'] else 0)),
        100
    )
    experience_match = round(exp_score, 1)

    # Overall alignment
    alignment = round((skill_match * 0.4 + interest_match * 0.35 + experience_match * 0.25), 1)

    # Gap analysis
    student_lower = [s.lower() for s in processed['selected_skills']]
    you_have = [s for s in role_skills if any(ss in s.lower() or s.lower() in ss for ss in student_lower)]
    missing  = [s for s in role_skills if s not in you_have][:5]

    gap_count = len(missing)
    if gap_count == 0:
        severity, timeline = "Minimal", "You're well-positioned"
    elif gap_count <= 2:
        severity, timeline = "Minor", "addressable in 4–6 weeks"
    elif gap_count <= 4:
        severity, timeline = "Moderate", "addressable in 2–4 months"
    else:
        severity, timeline = "Significant", "requires 6–12 months of focused effort"

    return {
        'interest_match':    interest_match,
        'skill_match':       skill_match,
        'experience_match':  experience_match,
        'alignment_score':   alignment,
        'you_have':          you_have,
        'missing_skills':    missing,
        'gap_severity':      severity,
        'gap_timeline':      timeline,
    }
