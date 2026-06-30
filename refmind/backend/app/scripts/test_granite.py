"""Verify watsonx Granite connection. Run after filling in backend/.env"""

from __future__ import annotations

import json
import sys

from app.config import settings
from app.services.granite import test_granite_connection


def main() -> int:
    print("RefMind — Watsonx Granite connection test\n")
    print(f"  DEMO_MODE       = {settings.demo_mode}")
    print(f"  API key set     = {bool(settings.watsonx_api_key and settings.watsonx_api_key not in settings._PLACEHOLDERS)}")
    print(f"  Project ID set  = {bool(settings.watsonx_project_id and settings.watsonx_project_id not in settings._PLACEHOLDERS)}")
    print(f"  Model           = {settings.watsonx_model_id}")
    print(f"  URL             = {settings.watsonx_url}\n")

    if not settings.watsonx_configured:
        print("FAIL - Edit backend/.env with your watsonx credentials.")
        print("  1. Go to https://dataplatform.cloud.ibm.com/")
        print("  2. Create a project and copy Project ID")
        print("  3. Manage -> Access (IAM) -> Create API key")
        return 1

    if settings.demo_mode:
        print("FAIL — Set DEMO_MODE=false in backend/.env")
        return 1

    print("Calling Granite …")
    result = test_granite_connection()
    print(json.dumps(result, indent=2))

    if result.get("ok"):
        print("\nSUCCESS — Granite is live. Restart the API server if it is already running.")
        return 0

    print("\nFAIL — Check API key, project ID, and region URL match your watsonx project.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
