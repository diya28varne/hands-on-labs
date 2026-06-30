import os
import sys
from pathlib import Path
from urllib.parse import urlparse

# Serverless defaults — demo works without watsonx or local Chroma
os.environ.setdefault("DEMO_MODE", "true")
os.environ.setdefault("VERCEL", "1")

BACKEND = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND))

from mangum import Mangum  # noqa: E402

from app.main import app  # noqa: E402


def _headers(scope: dict) -> dict[str, str]:
    return {k.decode().lower(): v.decode() for k, v in scope.get("headers", [])}


def _fastapi_path(scope: dict) -> str:
    """Map Vercel /api rewrite to FastAPI routes at /*."""
    headers = _headers(scope)
    for key in ("x-vercel-original-path", "x-forwarded-uri", "x-invoke-path", "x-url"):
        raw = headers.get(key, "")
        if not raw:
            continue
        path = urlparse(raw).path if raw.startswith("http") else raw.split("?")[0]
        if path.startswith("/api/") and path not in ("/api/index", "/api/index.py"):
            return path[4:] or "/"

    path = scope.get("path", "")
    if path.startswith("/api/") and path not in ("/api/index", "/api/index.py"):
        return path[4:] or "/"
    if path == "/api":
        return "/"
    return path


class VercelFastApi:
    def __init__(self, asgi_app):
        self.app = Mangum(asgi_app, lifespan="off")

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            resolved = _fastapi_path(scope)
            if resolved != scope.get("path"):
                scope = dict(scope)
                scope["path"] = resolved
        await self.app(scope, receive, send)


handler = VercelFastApi(app)
