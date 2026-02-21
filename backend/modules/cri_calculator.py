"""
ALIGNIQ v2 — CRI Calculator
Career Readiness Index formula for universal profiles across all fields.
"""

def calculate_cri(processed: dict) -> dict:
    """
    Compute Career Readiness Index for any field/domain.

    Sub-indices:
    ┌────────────────────────────────┬────────┐
    │ Academic Reliability Index     │  25 pts│  CGPA + consistency + no backlogs
    │ Skill Depth Index              │  30 pts│  skill count + proficiency + languages
    │ Experience Adequacy Index      │  30 pts│  internships + projects + leadership + competitions
    │ Market Alignment Score         │  15 pts│  target role realism vs salary expectation
    └────────────────────────────────┴────────┘
    """
    # ─── 1. Academic Reliability Index (0–25) ─────────────────────────────────
    cgpa_norm  = processed.get('cgpa_norm', 0.6)          # 0–1
    consistency= processed.get('consistency', 'medium')
    backlogs   = processed.get('backlogs', 0)

    consistency_score = {'high': 10, 'medium': 6, 'low': 2}.get(consistency, 6)
    backlog_penalty   = min(backlogs * 2, 8)
    ari = round(cgpa_norm * 15 + consistency_score - backlog_penalty, 2)
    ari = max(0, min(25, ari))

    # ─── 2. Skill Depth Index (0–30) ─────────────────────────────────────────
    skills_selected  = processed.get('selected_skills', [])
    proficiency      = processed.get('proficiency_rating', 5)    # 1–10
    languages_known  = processed.get('languages_known', [])

    skill_count_score = min(len(skills_selected) * 1.5, 15)      # max 15
    proficiency_score = (proficiency / 10) * 10                   # max 10
    language_score    = min(len(languages_known) * 1.5, 5)        # max 5
    sdi = round(skill_count_score + proficiency_score + language_score, 2)
    sdi = max(0, min(30, sdi))

    # ─── 3. Experience Adequacy Index (0–30) ─────────────────────────────────
    internships       = processed.get('internships', 0)
    projects          = processed.get('projects', [])
    competitions      = processed.get('competitions', '')
    leadership        = processed.get('leadership', False)
    volunteer         = processed.get('volunteer', False)
    earned_from_skill = processed.get('earned_from_skill', False)
    readiness_rating  = processed.get('readiness_rating', 5)

    internship_score  = min(internships * 6, 12)
    project_score     = min(len([p for p in projects if p and len(p.strip()) > 3]) * 3, 9)
    extra_score       = 0
    if competitions and len(competitions.strip()) > 2: extra_score += 2
    if leadership:        extra_score += 2
    if volunteer:         extra_score += 1
    if earned_from_skill: extra_score += 2
    readiness_bonus   = (readiness_rating / 10) * 5                # max 5
    eai = round(internship_score + project_score + extra_score + readiness_bonus, 2)
    eai = max(0, min(30, eai))

    # ─── 4. Market Alignment Score (0–15) ────────────────────────────────────
    # Higher if the target role has strong market demand and student's skills match it
    from backend.modules.profile_processor import ROLE_REQUIREMENTS, calculate_skill_overlap
    target_role   = processed.get('target_role', '')
    req           = ROLE_REQUIREMENTS.get(target_role, {})
    role_skills   = req.get('skills', [])
    demand        = req.get('market_demand', 'Moderate')
    demand_score  = {'Very Strong': 8, 'Always High': 8, 'Strong': 7, 'Growing': 6, 'Moderate': 5, 'Stable': 5, 'Changing': 3, 'Niche': 2, 'Variable': 2}.get(demand, 5)
    skill_align   = calculate_skill_overlap(processed.get('selected_skills', []), role_skills) * 7 if role_skills else 3.5
    mas = round(demand_score + skill_align, 2)
    mas = max(0, min(15, mas))

    # ─── Total CRI ────────────────────────────────────────────────────────────
    cri_total = round(ari + sdi + eai + mas, 1)
    cri_total = max(0, min(100, cri_total))

    # ─── Projected CRI (if 1 internship + 3 skills added) ────────────────────
    projected_sdi = min(sdi + 4.5, 30)
    projected_eai = min(eai + 6.0, 30)
    projected_cri = round(ari + projected_sdi + projected_eai + mas, 1)
    projected_cri = max(0, min(100, projected_cri))

    return {
        'cri_total':                  cri_total,
        'academic_reliability_index': ari,
        'skill_depth_index':          sdi,
        'experience_adequacy_index':  eai,
        'market_alignment_score':     mas,
        'projected_cri':              projected_cri,
    }
