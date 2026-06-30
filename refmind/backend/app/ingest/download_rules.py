"""Download official IFAB Laws of the Game PDF into data/rules/."""

from __future__ import annotations

import urllib.request
from pathlib import Path

IFAB_PDF_URL = "https://downloads.theifab.com/downloads/laws-of-the-game-2024-25?l=en"
OUTPUT_NAME = "ifab-laws-2024-25.pdf"


def download_ifab_pdf() -> Path:
    rules_dir = Path(__file__).resolve().parent.parent.parent / "data" / "rules"
    rules_dir.mkdir(parents=True, exist_ok=True)
    dest = rules_dir / OUTPUT_NAME

    print(f"Downloading IFAB Laws 2024/25 …")
    req = urllib.request.Request(IFAB_PDF_URL, headers={"User-Agent": "RefMind/0.1"})
    with urllib.request.urlopen(req, timeout=120) as response:
        data = response.read()

    if data[:4] != b"%PDF":
        raise ValueError("Download did not return a PDF — check IFAB URL")

    dest.write_bytes(data)
    print(f"Saved {dest} ({len(data):,} bytes)")
    return dest


if __name__ == "__main__":
    download_ifab_pdf()
