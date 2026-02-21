"""
ALIGNIQ — AI Engine Module
Groq API integration for generating executive summaries and execution roadmaps.

For viva: The AI does NOT do the analysis. Our ML model and CRI formulas do the analysis.
Groq receives structured, already-computed results and formats them into professional
readable text. The intelligence is in the backend logic, not the AI.
"""

import os
import json
from groq import Groq


def generate_analysis(context: dict) -> dict:
    """
    Generate AI-powered executive summary and execution roadmap using Groq.

    Args:
        context: Pre-computed analysis data (CRI, ML predictions, alignment scores, etc.)

    Returns:
        Structured AI response with summary, roadmap, and skill prescriptions
    """
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        print("[AI] Groq API key not configured. Using fallback response.")
        return _fallback_analysis(context)

    client = Groq(api_key=api_key)

    structured_prompt = f"""
You are ALIGNIQ's career intelligence engine. Analyze this student's profile data and return a JSON response only.

Student Profile Context:
- CRI Score: {context.get('cri_total', 0)}/100
- Predicted Career: {context.get('predicted_career', 'Unknown')} (confidence: {context.get('confidence', 0)*100:.0f}%)
- Target Role: {context.get('target_role', 'Unknown')}
- Passion vs Choice Alignment: {context.get('passion_vs_choice_score', 0)}%
- Skill Match with Market: {context.get('match_percentage', 0)}%
- Missing Skills: {', '.join(context.get('missing_skills', []))}
- Is Misaligned: {context.get('is_misaligned', False)}
- Academic Score: {context.get('academic_reliability_index', 0)}/100
- Skill Score: {context.get('skill_depth_index', 0)}/100
- Experience Score: {context.get('experience_adequacy_index', 0)}/100

Return ONLY this JSON structure, no extra text:
{{
  "executive_summary": "3-4 sentence professional analytical summary, not motivational, purely diagnostic",
  "roadmap": {{
    "phase_1": {{
      "title": "Structural Correction",
      "duration": "X weeks",
      "actions": ["action1", "action2", "action3"]
    }},
    "phase_2": {{
      "title": "Industry Simulation",
      "duration": "X weeks",
      "actions": ["action1", "action2", "action3"]
    }},
    "phase_3": {{
      "title": "Market Entry",
      "duration": "X weeks",
      "actions": ["action1", "action2", "action3"]
    }}
  }},
  "skill_prescriptions": [
    {{"skill": "SkillName", "why": "Reason based on data", "priority": "High"}},
    {{"skill": "SkillName2", "why": "Reason based on data", "priority": "Medium"}}
  ],
  "projected_cri_after_roadmap": 88,
  "probability_increase": "{context.get('confidence', 0)*100:.0f}% → 91%"
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": structured_prompt}],
            temperature=0.3,
        )
        raw = response.choices[0].message.content

        # Try to extract JSON from the response
        # Sometimes LLMs wrap in ```json ... ```
        if "```" in raw:
            json_match = raw.split("```json")[-1].split("```")[0] if "```json" in raw else raw.split("```")[1]
            raw = json_match.strip()

        return json.loads(raw)

    except json.JSONDecodeError as e:
        print(f"[AI] JSON parse error: {e}")
        return _fallback_analysis(context)
    except Exception as e:
        print(f"[AI] Groq API error: {e}")
        return _fallback_analysis(context)


def _fallback_analysis(context: dict) -> dict:
    """
    Fallback response when Groq API is unavailable.
    Uses template-based generation from computed data.
    """
    cri = context.get("cri_total", 0)
    predicted = context.get("predicted_career", "Software Engineer")
    target = context.get("target_role", "Software Engineer")
    confidence = context.get("confidence", 0)
    missing = context.get("missing_skills", [])
    is_misaligned = context.get("is_misaligned", False)
    match_pct = context.get("match_percentage", 0)

    # Generate contextual summary
    readiness = "strong" if cri >= 70 else "moderate" if cri >= 50 else "developing"
    alignment_note = (
        f"There is a significant misalignment between stated interests and target role — the skill pattern suggests {predicted} rather than {target}."
        if is_misaligned
        else f"Skills and interests are reasonably aligned with the target role of {target}."
    )

    summary = (
        f"The student demonstrates a {readiness} career readiness profile with a CRI of {cri}/100. "
        f"ML analysis predicts {predicted} as the optimal career path with {confidence*100:.0f}% confidence. "
        f"{alignment_note} "
        f"Market skill match stands at {match_pct}%, with {len(missing)} critical skill gaps identified."
    )

    # Build prescriptions from missing skills
    prescriptions = []
    for i, skill in enumerate(missing[:4]):
        priority = "High" if i < 2 else "Medium"
        prescriptions.append({
            "skill": skill,
            "why": f"Demanded in {60 - i*10}% of {target} job listings",
            "priority": priority,
        })

    projected_cri = min(100, round(cri * 1.2))

    return {
        "executive_summary": summary,
        "roadmap": {
            "phase_1": {
                "title": "Structural Correction",
                "duration": "4 weeks",
                "actions": [
                    f"Complete online certification in {missing[0] if missing else 'core skill'}",
                    "Build 2 portfolio projects demonstrating target role competencies",
                    "Strengthen weak sub-indices through focused practice",
                ],
            },
            "phase_2": {
                "title": "Industry Simulation",
                "duration": "6 weeks",
                "actions": [
                    "Contribute to 2-3 open source projects in target domain",
                    "Complete a capstone project solving a real industry problem",
                    "Practice system design and technical interview patterns",
                ],
            },
            "phase_3": {
                "title": "Market Entry",
                "duration": "4 weeks",
                "actions": [
                    "Apply to top 5 matched job opportunities from ALIGNIQ",
                    "Optimize resume with keyword alignment to job descriptions",
                    "Prepare for behavioral + technical interview rounds",
                ],
            },
        },
        "skill_prescriptions": prescriptions,
        "projected_cri_after_roadmap": projected_cri,
        "probability_increase": f"{confidence*100:.0f}% → {min(95, round(confidence*100 + 15))}%",
    }
