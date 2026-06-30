# Official IFAB rule PDFs for Docling ingestion

## Downloaded

| File | Source | Size |
|------|--------|------|
| `ifab-laws-2024-25.pdf` | [IFAB Laws of the Game 2024/25](https://downloads.theifab.com/downloads/laws-of-the-game-2024-25?l=en) | ~25 MB |

## Re-ingest after adding PDFs

Stop the API server first (Chroma file lock), then:

```powershell
cd refmind\backend
.\venv\Scripts\python -m app.ingest.ingest_rules
```

## Notes

- Docling runs with `do_ocr=False` — IFAB PDFs have embedded text; OCR causes memory errors on large double-page spreads.
- Seed rule snippets are always included alongside PDF chunks.
- Last ingest: **61 chunks** (handball, offside, penalty foul, VAR topics tagged).

## Optional: add more PDFs

Drop any additional IFAB documents here (e.g. VAR protocol, simplified rules from [theifab.com](https://www.theifab.com/laws-of-the-game-documents/)) and re-run ingestion.
