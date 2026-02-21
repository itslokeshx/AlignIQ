"""
ALIGNIQ v2 — Flask Application
POST /api/analyze   → full universal career analysis
GET  /api/health    → service health
GET  /api/market-trends → market overview data
"""
import os
import uuid
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from modules.profile_processor import (
    process_profile, predict_best_fit_careers,
    get_role_details, generate_why_text,
    calculate_chosen_career_match, ROLE_REQUIREMENTS,
)
from modules.cri_calculator  import calculate_cri
from modules.ai_engine       import (
    generate_role_description, generate_executive_summary,
    generate_action_checklist, generate_roadmap,
)
from modules.market_engine   import fetch_jobs, get_market_trends, rank_jobs_by_match

app = Flask(__name__)
CORS(app)


# ─── Health ────────────────────────────────────────────────────────────────────
@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "version": "2.0", "timestamp": datetime.utcnow().isoformat()})


# ─── Market Trends (unchanged from v1) ─────────────────────────────────────────
@app.route("/api/market-trends")
def market_trends():
    try:
        data = get_market_trends()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Main Analysis Endpoint ──────────────────────────────────────────────────────
@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json(force=True)

    # ── 1. Process Profile ───────────────────────────────────────────────────
    try:
        processed = process_profile(data)
    except Exception as e:
        return jsonify({"error": f"Profile processing failed: {str(e)}"}), 400

    name        = data.get("identity", {}).get("name", "User")
    target_role = processed["target_role"]
    target_domain = processed["target_domain"]
    field       = processed["field_of_study"]

    # ── 2. Best-Fit Career Predictions ────────────────────────────────────────
    top3 = predict_best_fit_careers(processed)
    # top3: [(role, score), (role, score), (role, score)]
    primary_role  = top3[0][0] if top3 else "Business Analyst"
    primary_score = top3[0][1] if top3 else 60.0
    second_role   = top3[1][0] if len(top3) > 1 else None
    third_role    = top3[2][0] if len(top3) > 2 else None

    primary_details = get_role_details(primary_role)
    why_text        = generate_why_text(primary_role, processed)

    # Strengths = skills the student has that appear in the best-fit role requirements
    primary_req     = ROLE_REQUIREMENTS.get(primary_role, {})
    primary_skills  = primary_req.get("skills", [])
    student_lower   = [s.lower() for s in processed["selected_skills"]]
    strengths       = [s for s in primary_skills if any(ss in s.lower() or s.lower() in ss for ss in student_lower)][:4]
    skills_to_dev   = [s for s in primary_skills if s not in strengths][:3]

    best_fit = {
        "role":              primary_role,
        "score":             primary_score,
        "why":               why_text,
        "strengths":         strengths,
        "skills_to_develop": skills_to_dev,
        "salary_range":      primary_details["salary_range"],
        "growth_trajectory": primary_details["growth_trajectory"],
        "market_demand":     primary_details["market_demand"],
        "second_fit":        {"role": second_role, "score": top3[1][1] if len(top3) > 1 else 0},
        "third_fit":         {"role": third_role,  "score": top3[2][1] if len(top3) > 2 else 0},
    }

    # ── 3. Chosen Career Analysis ─────────────────────────────────────────────
    # Fetch jobs for chosen role (used for market skill demand too)
    try:
        job_results = fetch_jobs(target_role, "India")
    except Exception:
        job_results = []

    # Extract top-demanded skills from job listings
    market_skill_demand = _extract_market_skills(job_results, target_role)

    chosen_match = calculate_chosen_career_match(processed, market_skill_demand)

    # AI-generated role description
    role_description = generate_role_description(target_role, target_domain)

    # Target role entry salary (from ROLE_REQUIREMENTS or domain defaults)
    chosen_role_details = get_role_details(target_role)

    # AI roadmap
    exp_level = _get_experience_level(processed)
    roadmap   = generate_roadmap(
        target_role,
        chosen_match["missing_skills"],
        chosen_match["gap_severity"],
        field,
        exp_level,
    )

    chosen_career = {
        "role":              target_role,
        "interest_match":    chosen_match["interest_match"],
        "skill_match":       chosen_match["skill_match"],
        "experience_match":  chosen_match["experience_match"],
        "alignment_score":   chosen_match["alignment_score"],
        "role_description":  role_description,
        "market_data": {
            "top_skills":      market_skill_demand[:8],
            "avg_experience":  "0–2 years (entry level)" if exp_level == "entry" else "2–5 years",
            "entry_salary":    chosen_role_details["salary_range"],
        },
        "you_have":         chosen_match["you_have"],
        "missing_skills":   chosen_match["missing_skills"],
        "gap_severity":     chosen_match["gap_severity"],
        "gap_timeline":     chosen_match["gap_timeline"],
        "roadmap":          roadmap,
    }

    # ── 4. CRI ────────────────────────────────────────────────────────────────
    cri = calculate_cri(processed)

    # ── 5. Personality & Interest Profile ────────────────────────────────────
    interest_profile = {
        "personality":       processed["personality_scores"],
        "interest_clusters": processed["interest_clusters"],
        "motivators":        processed["motivators"],
    }

    # ── 6. Executive Summary + Checklist ─────────────────────────────────────
    executive_summary = generate_executive_summary(
        name, best_fit, chosen_career, cri, processed["personality_scores"]
    )
    action_checklist = generate_action_checklist(
        target_role, chosen_match["missing_skills"], chosen_match["gap_timeline"], field
    )

    # ── 7. Assemble Response ──────────────────────────────────────────────────
    response = {
        "identity": {
            "name":           name,
            "profile_id":     f"AQ-{uuid.uuid4().hex[:8].upper()}",
            "generated_date": datetime.utcnow().strftime("%d %b %Y"),
        },
        "interest_profile":  interest_profile,
        "best_fit":          best_fit,
        "chosen_career":     chosen_career,
        "cri":               cri,
        "jobs":              rank_jobs_by_match(job_results, processed["selected_skills"]),
        "executive_summary": executive_summary,
        "action_checklist":  action_checklist,
    }
    return jsonify(response)


# ─── Helpers ──────────────────────────────────────────────────────────────────
def _get_experience_level(processed: dict) -> str:
    internships = processed.get("internships", 0)
    projects    = len(processed.get("projects", []))
    if internships >= 2 or (internships >= 1 and projects >= 2):
        return "intermediate"
    return "entry"


def _extract_market_skills(job_results: list, role: str) -> list:
    """
    Build top-skill demand pairs from job listings.
    Returns list of [skill, count] pairs.
    """
    skill_counts = {}
    for job in job_results:
        desc = str(job.get("description", "")).lower()
        for word in [
            "python", "sql", "excel", "java", "react", "node", "aws", "azure",
            "figma", "photoshop", "autocad", "matlab", "communication", "research",
            "management", "analytics", "machine learning", "leadership", "design",
            "writing", "counseling", "legal", "accounting", "marketing",
        ]:
            if word in desc:
                skill_counts[word.title()] = skill_counts.get(word.title(), 0) + 1

    # Supplement with ROLE_REQUIREMENTS skills
    req_skills = ROLE_REQUIREMENTS.get(role, {}).get("skills", [])
    for s in req_skills:
        skill_counts[s] = skill_counts.get(s, 0) + 3   # weight known requirements higher

    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
    return [[s, c] for s, c in sorted_skills[:8]]


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
