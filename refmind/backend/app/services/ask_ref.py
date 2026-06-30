"""Ask the Ref — contextual Q&A scoped to a single incident."""

from __future__ import annotations

import json
import re
from typing import Any

from app.config import settings
from app.services.granite import invoke_granite
from app.services.incidents import get_incident
from app.services.rag import retrieve_rules

OFF_TOPIC_REPLY = (
    "I can only answer questions about this specific referee decision."
)

SYSTEM_PROMPT = """You are RefMind Assistant, an expert referee explainability assistant.
Your role is to help soccer fans understand referee decisions using official IFAB rules,
referee perspective, and available incident context.

You must be honest, transparent, and acknowledge uncertainty when appropriate.
Never fabricate rules or facts. Never accuse referees of bias without evidence.
If evidence is insufficient, clearly say so.
If the question is unrelated to this incident, respond exactly:
"I can only answer questions about this specific referee decision."

Respond ONLY with valid JSON:
{
  "answer": "string — clear explanation for casual fans",
  "confidence": 0.0 to 1.0
}"""

OFF_TOPIC_PATTERNS = [
    r"\bweather\b",
    r"\bwho won\b",
    r"\bscoreline\b",
    r"\bpredict\b",
    r"\brecipe\b",
    r"\bhello\b",
    r"\bhow are you\b",
    r"\bchatgpt\b",
    r"\banother (match|game|team)\b",
]


def _is_off_topic(question: str) -> bool:
    lower = question.lower().strip()
    if len(lower) < 3:
        return True
    incident_terms = (
        "referee", "ref", "foul", "handball", "offside", "penalty", "var",
        "camera", "rule", "decision", "call", "verdict", "fan", "bias",
        "correct", "wrong", "why", "what", "how", "was", "did", "miss",
    )
    if any(t in lower for t in incident_terms):
        return False
    return any(re.search(p, lower) for p in OFF_TOPIC_PATTERNS)


def _build_context(incident: dict[str, Any], analysis: dict[str, Any] | None) -> str:
    ref = incident["referee_context"]
    cam = incident["camera_context"]
    lines = [
        f"Incident: {incident['title']}",
        f"Match: {incident['match']} (minute {incident['minute']})",
        f"Question: {incident['question']}",
        f"Description: {incident['description']}",
        f"Rule citation: {incident.get('rule_citation', '')}",
        f"Referee position: {ref['referee_position']}",
        f"Referee view: {ref['view_angle']}",
        f"Decision time: {ref['decision_time_seconds']}s",
        f"Camera limit: {cam['camera_limit']}",
        f"Missing context: {cam['missing_context']}",
        f"Fan yes %: {incident['fan_yes_pct']}",
    ]
    if analysis:
        lines.extend([
            f"Rule explanation: {analysis.get('rule_explanation', '')}",
            f"Referee perspective: {analysis.get('referee_perspective', '')}",
            f"Camera analysis: {analysis.get('camera_analysis', '')}",
            f"Verdict: {analysis.get('verdict', '')}",
            f"Verdict reasoning: {analysis.get('verdict_reasoning', '')}",
            f"Why fans disagree: {analysis.get('why_fans_disagree', '')}",
        ])
    return "\n".join(lines)


def _demo_answer(incident: dict[str, Any], question: str, analysis: dict | None) -> dict:
    lower = question.lower()
    verdict = (analysis or {}).get("verdict", "Defensible but debatable")
    rule = incident.get("rule_citation", "IFAB Law")

    if "correct" in lower or "referee" in lower and "wrong" not in lower:
        answer = (
            f"The verdict for this incident is: {verdict}. "
            f"The referee applied {rule} based on what they could see in "
            f"{incident['referee_context']['decision_time_seconds']} seconds. "
            "Reasonable referees could still disagree on the borderline details."
        )
        confidence = 0.78
    elif "bias" in lower:
        answer = (
            "There is no evidence in the available context that the referee acted with bias. "
            "Disagreement usually comes from different viewing angles, replay distortion, "
            "and how strictly fans versus officials interpret the law."
        )
        confidence = 0.72
    elif "offside" in lower:
        answer = (
            f"This incident is about: {incident['question']}. "
            f"{incident.get('ground_truth_note', '')} "
            "If your question is about offside specifically, that applies only when "
            "the law on attacking position is in play for this moment."
        )
        confidence = 0.7
    elif "rule" in lower or "which law" in lower or "applies" in lower:
        answer = (
            f"The primary rule is {rule}. "
            f"{(analysis or {}).get('rule_explanation') or incident.get('ground_truth_note', '')}"
        )
        confidence = 0.85
    elif "disagree" in lower or "fan" in lower:
        answer = (
            f"{incident['fan_yes_pct']}% of fans voted yes. "
            f"{(analysis or {}).get('why_fans_disagree') or 'TV replays and team loyalty shape how fans see the same clip.'}"
        )
        confidence = 0.8
    elif "camera" in lower or "miss" in lower or "broadcast" in lower:
        cam = incident.get("camera_context")
        answer = (
            f"{(analysis or {}).get('camera_analysis') or cam['camera_limit']}"
            if cam
            else "Broadcast angles often hide the referee's real-time view."
        )
        confidence = 0.82
    elif "var" in lower:
        answer = (
            "VAR is only used for clear and obvious errors in goal, penalty, red card, "
            "and mistaken identity situations. Whether VAR should have intervened here "
            f"depends on the exact phase — the official read was: {verdict}."
        )
        confidence = 0.68
    else:
        answer = (
            f"For this incident ({incident['title']}), the key issue is whether "
            f"{incident['question'].lower().rstrip('?')} "
            f"Under {rule}, the honest read is: {verdict}. "
            "Ask about the rule, camera view, or fan split for more detail."
        )
        confidence = 0.65

    return {"answer": answer, "confidence": confidence, "demo_mode": True}


def _parse_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if "```" in cleaned:
        match = re.search(r"```(?:json)?\s*([\s\S]*?)```", cleaned)
        if match:
            cleaned = match.group(1).strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1:
        cleaned = cleaned[start : end + 1]
    return json.loads(cleaned)


def ask_ref(
    incident_id: str,
    question: str,
    analysis_context: dict[str, Any] | None = None,
) -> dict[str, Any]:
    incident = get_incident(incident_id)
    if not incident:
        raise ValueError("Incident not found")

    if _is_off_topic(question):
        return {"answer": OFF_TOPIC_REPLY, "confidence": 0.95, "demo_mode": True}

    context = _build_context(incident, analysis_context)
    query = " ".join(incident.get("rule_keywords", [incident.get("rule_topic", "")]))
    docs = retrieve_rules(query, topic=incident.get("rule_topic"))
    rules_text = "\n".join(d.page_content[:400] for d in docs[:2])

    if not settings.granite_available:
        return _demo_answer(incident, question, analysis_context)

    user_prompt = f"""Incident context:
{context}

IFAB excerpts:
{rules_text}

Fan question: {question}

Answer using ONLY this incident context."""

    try:
        raw = invoke_granite(SYSTEM_PROMPT, user_prompt)
        parsed = _parse_json(raw)
        return {
            "answer": parsed.get("answer", OFF_TOPIC_REPLY),
            "confidence": float(parsed.get("confidence", 0.7)),
            "demo_mode": False,
        }
    except Exception:
        return _demo_answer(incident, question, analysis_context)
