"""In-memory mind-change stats for the Camera Lie Detector (hackathon demo)."""

from __future__ import annotations

from app.services.incidents import get_incident

_stats: dict[str, dict[str, int]] = {}


def record_mind_change(incident_id: str, changed_mind: bool) -> dict:
    incident = get_incident(incident_id)
    if not incident:
        raise ValueError("Incident not found")

    bucket = _stats.setdefault(incident_id, {"total": 0, "changed": 0})
    bucket["total"] += 1
    if changed_mind:
        bucket["changed"] += 1

    curated = incident.get("mind_change_pct", 45)
    live_pct = round(100 * bucket["changed"] / bucket["total"]) if bucket["total"] else curated
    # Blend curated baseline with live session data once enough votes exist
    if bucket["total"] >= 3:
        blended = round((curated + live_pct) / 2)
    else:
        blended = curated

    return {
        "changed_mind": changed_mind,
        "mind_change_pct": blended,
        "live_responses": bucket["total"],
        "message": (
            f"{blended}% of users changed their mind after seeing what the camera hid."
            if changed_mind
            else "You held your ground — but many fans flip after the replay."
        ),
    }
