from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.config import settings


def _load_incidents() -> list[dict[str, Any]]:
    path = Path(settings.incidents_path)
    if not path.is_absolute():
        path = Path(__file__).resolve().parent.parent.parent / path
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def list_incidents() -> list[dict[str, Any]]:
    """Return incidents without spoiler fields for the voting screen."""
    return [
        {
            "id": i["id"],
            "title": i["title"],
            "match": i["match"],
            "minute": i["minute"],
            "question": i["question"],
            "description": i["description"],
            "video_hint": i["video_hint"],
            "user_vote_prompt": i["user_vote_prompt"],
        }
        for i in _load_incidents()
    ]


def get_incident(incident_id: str) -> dict[str, Any] | None:
    for incident in _load_incidents():
        if incident["id"] == incident_id:
            return incident
    return None


def get_fan_result(incident: dict[str, Any], user_vote: bool) -> dict[str, Any]:
    yes_pct = incident["fan_yes_pct"]
    no_pct = 100 - yes_pct
    agreed_with_majority = (user_vote and yes_pct >= 50) or (not user_vote and no_pct >= 50)
    fan_agreement_pct = yes_pct if user_vote else no_pct
    return {
        "fan_yes_pct": yes_pct,
        "fan_no_pct": no_pct,
        "user_vote": user_vote,
        "agreed_with_majority": agreed_with_majority,
        "fan_agreement_pct": fan_agreement_pct,
        "majority_answer": "yes" if yes_pct >= 50 else "no",
    }
