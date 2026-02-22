"""
ALIGNIQ v2 — AI Engine
Uses Groq's llama-3.3-70b-versatile to generate:
  - role_description  (3–4 factual sentences about the chosen career)
  - executive_summary (5–6 analytical sentences, no motivation)
  - action_checklist  (6 specific, actionable items)
"""
import os
import json
import re
from groq import Groq

MODEL = "llama-3.3-70b-versatile"

def _get_client() -> Groq:
    """Lazy Groq client — reads API key at call time after dotenv is loaded."""
    return Groq(api_key=os.getenv("GROQ_API_KEY"))


def _call_groq(prompt: str) -> str:
    client = _get_client()
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=1200,
    )
    return response.choices[0].message.content.strip()


def generate_role_description(role: str, domain: str) -> str:
    """Generate 3–4 factual sentences about what a role actually involves."""
    prompt = f"""Write 3-4 concise, factual sentences describing what a {role} in the {domain} domain actually does day-to-day, including the scope of work, key responsibilities, typical environment, and career trajectory. Be professional and informative. No hype or motivation. No bullet points."""
    try:
        return _call_groq(prompt)
    except Exception:
        return f"A {role} operates within the {domain} domain, applying specialized knowledge and skills to deliver measurable outcomes. The role involves strategic thinking, technical execution, and collaborative work across cross-functional teams. Career progression typically follows increasing levels of responsibility, expertise, and leadership."


def generate_executive_summary(name: str, best_fit: dict, chosen: dict,
                               cri: dict, personality: dict) -> str:
    """Generate a 5–6 sentence analytical executive summary of the student's profile."""
    prompt = f"""You are a senior career intelligence analyst writing a concise assessment of {name}'s profile.

Data:
- Best fit career: {best_fit.get('role')} ({best_fit.get('score')}%)
- Chosen career: {chosen.get('role')} (alignment: {chosen.get('alignment_score')}%)
- CRI score: {cri.get('cri_total')}/100
- Interest match: {chosen.get('interest_match')}% | Skill match: {chosen.get('skill_match')}% | Experience match: {chosen.get('experience_match')}%
- Gap severity: {chosen.get('gap_severity')}
- Personality: analytical_creative={personality.get('analytical_creative')}, independent_collaborative={personality.get('independent_collaborative')}, theoretical_practical={personality.get('theoretical_practical')}

Return EXACTLY 5 lines, each starting with a label and pipe separator, like:
Readiness | Your CRI is X/100, which means...
Alignment | Your chosen role as X shows...
Best Fit | The data suggests X is your strongest match because...
Strength | Your personality leans towards...
Key Gap | The main area to develop is...

Rules:
- Each line must be ONE short sentence (under 20 words after the pipe).
- Be specific — use actual numbers, role names, and traits from the data.
- Be analytical and objective. No motivation, no fluff, no generic advice.
- Do NOT add numbering, bullet points, or extra formatting.
- Return ONLY the 5 lines, nothing else."""
    try:
        return _call_groq(prompt)
    except Exception:
        return (
            f"Readiness | CRI score of {cri.get('cri_total')}/100 indicates a developing career readiness foundation.\n"
            f"Alignment | {chosen.get('alignment_score')}% alignment with {chosen.get('role')} shows {chosen.get('gap_severity', 'moderate').lower()} gaps to address.\n"
            f"Best Fit | {best_fit.get('role')} at {best_fit.get('score')}% is the strongest statistical match for your profile.\n"
            f"Strength | Personality traits show clear directional leanings that support focused career paths.\n"
            f"Key Gap | Skill match at {chosen.get('skill_match')}% is the primary area needing development."
        )


def generate_action_checklist(role: str, missing_skills: list,
                               gap_timeline: str, field: str) -> list:
    """Generate 6 specific, actionable items for the student."""
    skills_str = ", ".join(missing_skills[:4]) if missing_skills else "core domain skills"
    prompt = f"""Generate exactly 6 specific, actionable career development tasks for someone pursuing {role}, coming from a {field} background, with these missing skills: {skills_str}. The estimated timeline is {gap_timeline}.

Requirements:
- Each item must be a concrete action (not generic advice)
- Include: 1 certification or course, 1 project idea, 1 networking action, 1 online presence step, 2 skill-building tasks
- Return ONLY a JSON array of 6 strings. Example: ["Complete AWS Cloud Practitioner certification", "Build a portfolio project using React"]
- No numbering, no explanation."""
    try:
        raw = _call_groq(prompt)
        match = re.search(r'\[.*?\]', raw, re.DOTALL)
        if match:
            return json.loads(match.group())
        return [line.strip().strip('"').strip("'").lstrip("0123456789. -") for line in raw.split('\n') if line.strip()][:6]
    except Exception:
        return [
            f"Complete an introductory course in {missing_skills[0] if missing_skills else 'your target field'}",
            f"Build one end-to-end project demonstrating {role.lower()} capabilities",
            "Connect with 3 professionals in your target role via LinkedIn",
            "Update your LinkedIn headline and about section to reflect your career direction",
            f"Join a community or group related to {role} and engage weekly",
            "Document your existing projects with measurable outcomes for your portfolio",
        ]


def generate_roadmap(role: str, missing_skills: list, gap_severity: str,
                     field: str, experience_level: str) -> dict:
    """Generate a 3-phase roadmap for reaching the target role."""
    skills_str = ", ".join(missing_skills[:5]) if missing_skills else "core skills"
    prompt = f"""Generate a 3-phase career roadmap for someone who wants to become a {role}, coming from {field} background (level: {experience_level}), needing to build: {skills_str}. Gap severity: {gap_severity}.

Return ONLY a JSON object with this exact structure:
{{
  "phase_1": {{"title": "...", "duration": "...", "actions": ["action1", "action2", "action3"]}},
  "phase_2": {{"title": "...", "duration": "...", "actions": ["action1", "action2", "action3"]}},
  "phase_3": {{"title": "...", "duration": "...", "actions": ["action1", "action2", "action3"]}}
}}
Each phase title should be 3–5 words. Durations should be realistic (e.g. "0–2 months"). Actions must be specific and concrete."""
    try:
        raw = _call_groq(prompt)
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    # Fallback
    if gap_severity == "Minimal":
        d1, d2, d3 = "0–1 months", "1–2 months", "2–4 months"
    elif gap_severity == "Minor":
        d1, d2, d3 = "0–1 months", "1–3 months", "3–6 months"
    elif gap_severity == "Moderate":
        d1, d2, d3 = "0–2 months", "2–4 months", "4–8 months"
    else:
        d1, d2, d3 = "0–2 months", "2–6 months", "6–12 months"
    return {
        "phase_1": {"title": "Build Core Foundation", "duration": d1, "actions": [f"Learn {missing_skills[0] if missing_skills else 'foundational skill'}", "Complete one structured online course", "Set up your portfolio or work samples"]},
        "phase_2": {"title": "Apply & Create", "duration": d2, "actions": ["Build a real project using your new skills", f"Pursue an internship or freelance gig in {role.lower()} work", "Participate in a hackathon, competition, or workshop"]},
        "phase_3": {"title": "Position & Launch", "duration": d3, "actions": ["Refine your resume and LinkedIn for this role", "Apply to 10+ targeted roles with personalized applications", "Get feedback from 2 professionals in the field"]},
    }


def generate_bridge_sentence(name: str, best_fit_role: str, chosen_role: str,
                              personality: dict) -> str:
    """Generate one insightful sentence bridging the best-fit and chosen career paths."""
    prompt = f"""You are a career intelligence analyst. Write exactly ONE sentence that bridges {name}'s best-fit career ({best_fit_role}) and their chosen career ({chosen_role}).

Personality data: analytical_creative={personality.get('analytical_creative')}, independent_collaborative={personality.get('independent_collaborative')}, theoretical_practical={personality.get('theoretical_practical')}.

The sentence should:
- Be specific to these two careers
- Reference a personality trait that connects or differentiates them
- Sound like insight, not motivation
- Be under 30 words

Return ONLY the sentence. No quotes, no labels, no explanation."""
    try:
        return _call_groq(prompt).strip('"').strip("'")
    except Exception:
        return (
            f"Your analytical disposition serves both paths — the difference is whether "
            f"you apply it inside an organization as a {chosen_role} or build one as a {best_fit_role}."
        )
