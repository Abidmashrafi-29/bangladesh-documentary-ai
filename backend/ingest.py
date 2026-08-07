"""
ingest.py
---------
This script is the "content pipeline" step of RAG (Retrieval-Augmented Generation).

WHAT IT DOES, STEP BY STEP:
1. Reads every .txt transcript in data/transcripts/
2. Splits ("chunks") each transcript into smaller paragraphs
   - Why chunk? LLMs and embedding models work best on focused pieces of text,
     not whole documents. Smaller chunks = more precise retrieval later.
3. Converts each chunk into a vector ("embedding") using a local embedding model
   - An embedding is just a list of numbers that captures the *meaning* of the text.
   - Similar meanings -> similar vectors -> we can measure "closeness" mathematically.
4. Saves those vectors + original text + source filename into a single file
   (store.npz) - our own tiny "vector database," built with plain NumPy.

WHY NOT A REAL VECTOR DATABASE (like ChromaDB)?
Real vector databases add speed and features at scale (millions of documents,
approximate search, filtering, persistence servers, etc). But under the hood,
the CORE idea is exactly what we do here: store vectors, compare a query vector
against them, return the closest matches. Building it yourself once with NumPy
is one of the best ways to actually understand what a vector DB is doing -
you can always swap in ChromaDB/Pinecone/Weaviate later once you understand
the fundamentals, without changing how the rest of your app thinks about RAG.

Run this ONCE whenever you add/update transcripts:
    python ingest.py
"""

import os
import glob
import json
import numpy as np
from sentence_transformers import SentenceTransformer

TRANSCRIPTS_DIR = os.path.join(os.path.dirname(__file__), "data", "transcripts")
STORE_PATH = os.path.join(os.path.dirname(__file__), "store.npz")
META_PATH = os.path.join(os.path.dirname(__file__), "store_meta.json")

# A small, fast, free local embedding model - runs on CPU, no API key needed.
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"


def chunk_text(text: str, max_chars: int = 600) -> list[str]:
    """
    Naive paragraph-based chunker.
    Splits on blank lines first (paragraphs), then merges small paragraphs together
    until we hit roughly max_chars, so chunks aren't too tiny or too huge.
    """
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    current = ""
    for para in paragraphs:
        if len(current) + len(para) < max_chars:
            current += ("\n\n" if current else "") + para
        else:
            if current:
                chunks.append(current)
            current = para
    if current:
        chunks.append(current)
    return chunks


def main():
    print(f"Loading embedding model '{EMBED_MODEL_NAME}' (first run downloads it)...")
    embed_model = SentenceTransformer(EMBED_MODEL_NAME)

    transcript_files = glob.glob(os.path.join(TRANSCRIPTS_DIR, "*.txt"))
    print(f"Found {len(transcript_files)} transcript file(s).")

    all_docs = []
    all_sources = []

    for filepath in transcript_files:
        filename = os.path.basename(filepath)
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()

        chunks = chunk_text(text)
        print(f"  {filename}: {len(chunks)} chunk(s)")

        for chunk in chunks:
            all_docs.append(chunk)
            all_sources.append(filename)

    if not all_docs:
        print("No transcripts found - add .txt files to data/transcripts/ first.")
        return

    print("Embedding chunks (this happens locally on your CPU)...")
    embeddings = embed_model.encode(all_docs, normalize_embeddings=True)
    # normalize_embeddings=True makes cosine similarity a simple dot product later -
    # a common trick that keeps the retrieval math fast and simple.

    # Save vectors as a compressed NumPy array, and the text/source alongside it
    np.savez_compressed(STORE_PATH, embeddings=embeddings)
    with open(META_PATH, "w", encoding="utf-8") as f:
        json.dump({"documents": all_docs, "sources": all_sources}, f)

    print(f"Done. Stored {len(all_docs)} chunks in '{STORE_PATH}' and '{META_PATH}'.")


if __name__ == "__main__":
    main()
