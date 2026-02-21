"""
ALIGNIQ — ML Engine Module
Random Forest career prediction + cosine similarity alignment scoring.
"""

import os
import numpy as np
import joblib
from sklearn.metrics.pairwise import cosine_similarity

from .profile_processor import (
    encode_skills_to_domain_vector,
    encode_role_to_domain_vector,
    encode_domains_to_vector,
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "career_model.pkl")

# Domain labels (must match training)
DOMAIN_LABELS = ["AI/ML", "Web Development", "Data Science", "Cloud/DevOps", "Cybersecurity", "Core Engineering"]


def predict_career(profile: dict) -> dict:
    """
    Predict career using trained Random Forest model.
    Falls back to heuristic if model not found.

    Args:
        profile: Processed profile from profile_processor

    Returns:
        Prediction result with top 3 careers, confidence, feature importance
    """
    feature_names = ["cgpa_norm", "backlogs", "aptitude_norm", "consistency",
                     "internships", "projects", "hackathons", "leadership",
                     "skills_count", "self_rating"]

    features = np.array([[profile.get(f, 0) for f in feature_names]])

    try:
        model = joblib.load(MODEL_PATH)
        probabilities = model.predict_proba(features)[0]
        classes = model.classes_

        # Sort by probability descending
        sorted_indices = np.argsort(probabilities)[::-1]
        top_3 = [
            {"role": classes[i], "probability": round(float(probabilities[i]), 2)}
            for i in sorted_indices[:3]
        ]

        predicted = top_3[0]["role"]
        confidence = top_3[0]["probability"]

        # Feature importance
        importances = model.feature_importances_
        feature_importance = {
            name: round(float(importances[i]), 3)
            for i, name in enumerate(feature_names)
        }

    except (FileNotFoundError, Exception) as e:
        print(f"[ML] Model not found or error ({e}), using heuristic prediction.")
        predicted, confidence, top_3, feature_importance = _heuristic_predict(profile)

    return {
        "predicted_career": predicted,
        "confidence": confidence,
        "top_3_predictions": top_3,
        "feature_importance": feature_importance,
    }


def _heuristic_predict(profile: dict):
    """
    Simple heuristic fallback when ML model is unavailable.
    Uses domain skill vector overlap.
    """
    skills = profile.get("all_skills", [])
    domain_vector = encode_skills_to_domain_vector(skills)

    # Map domains to career roles
    domain_to_role = {
        "AI/ML": "AI/ML Engineer",
        "Web Development": "Full Stack Developer",
        "Data Science": "Data Scientist",
        "Cloud/DevOps": "DevOps Engineer",
        "Cybersecurity": "Cybersecurity Analyst",
        "Core Engineering": "Embedded Systems Engineer",
    }

    # Normalize to probabilities
    total = domain_vector.sum() if domain_vector.sum() > 0 else 1
    probs = domain_vector / total

    sorted_idx = np.argsort(probs)[::-1]
    top_3 = [
        {"role": domain_to_role[DOMAIN_LABELS[i]], "probability": round(float(probs[i]), 2)}
        for i in sorted_idx[:3]
    ]

    predicted = top_3[0]["role"]
    confidence = top_3[0]["probability"]

    feature_importance = {
        "skills_count": 0.31, "cgpa_norm": 0.22, "internships": 0.19,
        "projects": 0.16, "hackathons": 0.12,
    }

    return predicted, confidence, top_3, feature_importance


def calculate_alignment(student_skills: list, interested_domains: list, target_role: str) -> dict:
    """
    Calculate alignment scores using cosine similarity.

    - passion_alignment: student skills vs interested domains
    - role_alignment: student skills vs target role requirements
    - passion_vs_choice: interested domains vs target role

    Cosine similarity explanation (for viva):
    Cosine similarity measures the cosine of the angle between two vectors.
    A value of 1 means identical direction, 0 means orthogonal (no relation).
    We represent skills, domains, and roles as vectors in domain-space,
    then compute how aligned they are.
    """
    student_vector = encode_skills_to_domain_vector(student_skills)
    target_vector = encode_role_to_domain_vector(target_role)
    passion_vector = encode_domains_to_vector(interested_domains)

    # Handle zero vectors
    def safe_cosine(a, b):
        if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
            return 0.0
        return float(cosine_similarity([a], [b])[0][0])

    passion_alignment = safe_cosine(student_vector, passion_vector)
    role_alignment = safe_cosine(student_vector, target_vector)
    passion_vs_choice = safe_cosine(passion_vector, target_vector)

    return {
        "passion_alignment_score": round(passion_alignment * 100, 1),
        "role_alignment_score": round(role_alignment * 100, 1),
        "passion_vs_choice_score": round(passion_vs_choice * 100, 1),
        "is_misaligned": passion_vs_choice < 0.4,
    }
