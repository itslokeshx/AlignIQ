"""
ALIGNIQ — Flask Backend Application
Adaptive Career Alignment & Employability Intelligence System

Routes:
- POST /api/analyze — Main analysis endpoint
- GET  /api/jobs — Fetch and rank jobs by skill match
- GET  /api/market-trends — Aggregated market intelligence
- GET  /api/health — Health check
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import modules
from modules.profile_processor import process_profile
from modules.ml_engine import predict_career, calculate_alignment
from modules.cri_calculator import calculate_cri
from modules.market_engine import (
    fetch_jobs,
    extract_skills_from_jobs,
    calculate_market_match,
    rank_jobs_by_match,
    get_market_trends,
)
from modules.ai_engine import generate_analysis

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "ALIGNIQ Backend", "version": "1.0.0"})


@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    Main analysis endpoint.
    Receives full student profile JSON, runs all analysis modules,
    and returns complete results.
    """
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Step 1: Process profile into feature vector
        profile = process_profile(data)

        # Step 2: ML career prediction
        ml_result = predict_career(profile)

        # Step 3: Alignment scores (cosine similarity)
        all_skills = data.get("skills", {}).get("selected_skills", [])
        alignment = calculate_alignment(
            student_skills=all_skills,
            interested_domains=data.get("intent", {}).get("interested_domains", []),
            target_role=data.get("intent", {}).get("target_role", ""),
        )

        # Step 4: Market analysis (Adzuna API)
        target_role = data.get("intent", {}).get("target_role", "Software Engineer")
        jobs = fetch_jobs(target_role)
        skill_demand = extract_skills_from_jobs(jobs)
        market = calculate_market_match(all_skills, skill_demand)
        ranked_jobs = rank_jobs_by_match(jobs, all_skills)

        # Step 5: CRI calculation
        cri = calculate_cri(data, market["match_percentage"])

        # Step 6: AI analysis (Groq)
        ai_context = {
            **cri,
            **ml_result,
            **alignment,
            **market,
            "target_role": target_role,
        }
        ai_result = generate_analysis(ai_context)

        return jsonify({
            "cri": cri,
            "ml": ml_result,
            "alignment": alignment,
            "market": market,
            "jobs": ranked_jobs,
            "ai": ai_result,
        })

    except Exception as e:
        print(f"[ERROR] Analysis failed: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    """
    Fetch and rank jobs by skill match.
    Query params: role, skills (comma-separated)
    """
    try:
        role = request.args.get("role", "Software Engineer")
        skills_str = request.args.get("skills", "")
        skills = [s.strip() for s in skills_str.split(",") if s.strip()]

        jobs = fetch_jobs(role)
        ranked = rank_jobs_by_match(jobs, skills) if skills else jobs[:5]

        return jsonify({"jobs": ranked})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/market-trends", methods=["GET"])
def market_trends():
    """
    Return aggregated skill demand data across multiple roles.
    Used by the Market Intelligence page.
    """
    try:
        trends = get_market_trends()
        return jsonify(trends)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "production") == "development"
    print(f"\n{'='*50}")
    print(f"  ALIGNIQ Backend — Running on port {port}")
    print(f"  Debug mode: {debug}")
    print(f"{'='*50}\n")
    app.run(host="0.0.0.0", port=port, debug=debug)
