from __future__ import annotations

from pathlib import Path

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings

from app.config import settings
from app.data.seed_rules import SEED_RULES


class _LocalEmbeddings(Embeddings):
    """Lightweight local embeddings — no API key required for hackathon demo."""

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [self._hash_embed(t) for t in texts]

    def embed_query(self, text: str) -> list[float]:
        return self._hash_embed(text)

    @staticmethod
    def _hash_embed(text: str, dim: int = 384) -> list[float]:
        import hashlib
        import math

        vec = [0.0] * dim
        tokens = text.lower().split()
        for token in tokens:
            digest = hashlib.sha256(token.encode()).digest()
            for i in range(dim):
                vec[i] += (digest[i % len(digest)] / 255.0) - 0.5
        norm = math.sqrt(sum(v * v for v in vec)) or 1.0
        return [v / norm for v in vec]


def _persist_path() -> Path:
    path = Path(settings.chroma_persist_dir)
    if not path.is_absolute():
        path = Path(__file__).resolve().parent.parent.parent / path
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_vectorstore() -> Chroma:
    return Chroma(
        collection_name="ifab_rules",
        embedding_function=_LocalEmbeddings(),
        persist_directory=str(_persist_path()),
    )


def seed_vectorstore() -> int:
    """Load seed rules into Chroma. Returns number of documents added."""
    docs = [
        Document(
            page_content=rule["text"],
            metadata={"source": rule["source"], "topic": rule["topic"]},
        )
        for rule in SEED_RULES
    ]
    store = get_vectorstore()
    existing = store._collection.count()  # noqa: SLF001 — hackathon simplicity
    if existing >= len(docs):
        return existing
    store.add_documents(docs)
    return store._collection.count()  # noqa: SLF001


def retrieve_rules(query: str, topic: str | None = None, k: int = 3) -> list[Document]:
    seed_vectorstore()
    store = get_vectorstore()
    if topic:
        results = store.similarity_search(query, k=k, filter={"topic": topic})
        if results:
            return results
    return store.similarity_search(query, k=k)
