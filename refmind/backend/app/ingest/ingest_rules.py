from __future__ import annotations

import re
import shutil
from pathlib import Path

from langchain_core.documents import Document

from app.config import settings
from app.data.seed_rules import SEED_RULES
from app.services.rag import get_vectorstore

LAW_TOPIC_MAP = {
    "11": "offside",
    "12": "handball",
    "9": "penalty foul",
    "10": "penalty foul",
    "5": "VAR",
    "13": "penalty foul",
}


def _topic_from_chunk(text: str) -> str:
    lower = text.lower()
    if "offside" in lower or re.search(r"\blaw\s*11\b", lower):
        return "offside"
    if "handball" in lower or re.search(r"\blaw\s*12\b", lower):
        return "handball"
    if "video assistant referee" in lower or "var" in lower or re.search(r"\blaw\s*5\b", lower):
        return "VAR"
    if "penalty" in lower or "foul" in lower:
        return "penalty foul"
    return "ifab_pdf"


def ingest_pdf(pdf_path: Path) -> list[Document]:
    """Parse an IFAB/FIFA PDF with Docling and return LangChain documents."""
    from docling.datamodel.base_models import InputFormat
    from docling.datamodel.pipeline_options import PdfPipelineOptions
    from docling.document_converter import DocumentConverter, PdfFormatOption

    print(f"  Docling: parsing {pdf_path.name} …")
    pipeline_options = PdfPipelineOptions()
    pipeline_options.do_ocr = False  # IFAB PDFs have embedded text — skip heavy OCR
    pipeline_options.do_table_structure = True

    converter = DocumentConverter(
        format_options={
            InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options),
        }
    )
    result = converter.convert(str(pdf_path))
    text = result.document.export_to_markdown()
    print(f"  Docling: extracted {len(text):,} characters")
    return [
        Document(
            page_content=chunk.strip(),
            metadata={
                "source": f"IFAB {pdf_path.stem}",
                "topic": _topic_from_chunk(chunk),
            },
        )
        for chunk in _chunk_text(text)
        if chunk.strip()
    ]


def _chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> list[str]:
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks


def _reset_chroma() -> None:
    """Clear persisted Chroma data for a clean re-ingest."""
    persist = Path(settings.chroma_persist_dir)
    if not persist.is_absolute():
        persist = Path(__file__).resolve().parent.parent.parent / persist
    if persist.exists():
        try:
            shutil.rmtree(persist)
        except PermissionError:
            print("  Chroma locked (stop the API server first) — deleting collection in-place …")
            store = get_vectorstore()
            try:
                store._client.delete_collection("ifab_rules")  # noqa: SLF001
            except Exception:
                pass
            return
    persist.mkdir(parents=True, exist_ok=True)


def ingest_rules_directory() -> dict[str, int]:
    """
    Ingest all PDFs from data/rules/ plus seed rules into Chroma.
    Run: python -m app.ingest.ingest_rules
    """
    rules_dir = Path(settings.rules_pdf_dir)
    if not rules_dir.is_absolute():
        rules_dir = Path(__file__).resolve().parent.parent.parent / rules_dir

    print(f"Rules directory: {rules_dir}")
    pdfs = sorted(rules_dir.glob("*.pdf"))
    if not pdfs:
        print("No PDFs found — place IFAB rule PDFs in data/rules/ and re-run.")

    _reset_chroma()
    store = get_vectorstore()

    all_docs: list[Document] = [
        Document(
            page_content=r["text"],
            metadata={"source": r["source"], "topic": r["topic"]},
        )
        for r in SEED_RULES
    ]

    pdf_count = 0
    for pdf in pdfs:
        all_docs.extend(ingest_pdf(pdf))
        pdf_count += 1

    print(f"Adding {len(all_docs)} chunks to Chroma …")
    store.add_documents(all_docs)

    topics: dict[str, int] = {}
    for doc in all_docs:
        t = doc.metadata.get("topic", "unknown")
        topics[t] = topics.get(t, 0) + 1

    return {"documents": len(all_docs), "pdfs_processed": pdf_count, "topics": topics}


if __name__ == "__main__":
    stats = ingest_rules_directory()
    print(f"\nDone — {stats['documents']} chunks from {stats['pdfs_processed']} PDF(s).")
    print("Topics:", stats["topics"])
