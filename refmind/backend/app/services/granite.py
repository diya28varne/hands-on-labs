"""IBM Granite via watsonx.ai — shared client and connection test."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from app.config import settings

if TYPE_CHECKING:
    from langchain_ibm import ChatWatsonx

_llm: Any = None


def get_granite_llm() -> "ChatWatsonx":
    global _llm
    if _llm is None:
        from langchain_ibm import ChatWatsonx

        _llm = ChatWatsonx(
            model_id=settings.watsonx_model_id,
            url=settings.watsonx_url,
            apikey=settings.watsonx_api_key,
            project_id=settings.watsonx_project_id,
            params={
                "decoding_method": "greedy",
                "temperature": 0.2,
                "max_new_tokens": 1500,
            },
        )
    return _llm


def test_granite_connection() -> dict:
    """Send a minimal prompt to verify watsonx credentials and model access."""
    from langchain_core.messages import HumanMessage

    if not settings.watsonx_configured:
        return {
            "ok": False,
            "error": "Missing WATSONX_API_KEY or WATSONX_PROJECT_ID in backend/.env",
        }
    if settings.demo_mode:
        return {
            "ok": False,
            "error": "DEMO_MODE is still true — set DEMO_MODE=false in backend/.env",
        }

    try:
        llm = get_granite_llm()
        response = llm.invoke([HumanMessage(content='Reply with exactly: {"status":"ok"}')])
        content = response.content if hasattr(response, "content") else str(response)
        return {
            "ok": True,
            "model_id": settings.watsonx_model_id,
            "url": settings.watsonx_url,
            "sample": content[:120],
        }
    except Exception as exc:
        return {
            "ok": False,
            "error": str(exc),
            "model_id": settings.watsonx_model_id,
            "url": settings.watsonx_url,
        }


def invoke_granite(system: str, user: str) -> str:
    from langchain_core.messages import HumanMessage, SystemMessage

    llm = get_granite_llm()
    response = llm.invoke([SystemMessage(content=system), HumanMessage(content=user)])
    return response.content if hasattr(response, "content") else str(response)
