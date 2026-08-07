"""
main.py
-------
The FastAPI backend that powers the chatbot - now 100% free, using Ollama
(a local LLM) instead of a paid API.

WHAT HAPPENS WHEN A USER ASKS A QUESTION (the "RAG" flow):
1. We receive their question via POST /chat
2. We embed the question using the SAME embedding model used in ingest.py
   - This is important: query and documents must live in the same "vector space"
3. We compare the question's vector against every stored chunk vector using
   cosine similarity (here: a simple dot product, since vectors are normalized)
   and take the top matches (this is "retrieval")
4. We build a prompt that includes those chunks as context, then send it to
   a local LLM running via Ollama (this is "augmented generation" - the model
   answers using YOUR content, not just its own training knowledge)
5. We return the model's answer to the frontend

REQUIREMENTS:
- Ollama must be installed and running (https://ollama.com)
- You must have pulled a model, e.g.: ollama pull llama3.1:8b

Run with:
    uvicorn main:app --reload --port 8000
"""

import os
import json
import requests
import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

load_dotenv()

STORE_PATH = os.path.join(os.path.dirname(__file__), "store.npz")
META_PATH = os.path.join(os.path.dirname(__file__), "store_meta.json")
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"
TOP_K = 4  # how many chunks to retrieve per question

# Ollama runs locally and exposes an OpenAI-ish REST API by default on this port.
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")

app = FastAPI(title="Documentary Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load everything once at startup, not per-request (much faster)
embed_model = SentenceTransformer(EMBED_MODEL_NAME)

# Load the vector store built by ingest.py
if os.path.exists(STORE_PATH) and os.path.exists(META_PATH):
    _store = np.load(STORE_PATH)
    doc_embeddings = _store["embeddings"]  # shape: (num_chunks, embedding_dim)
    with open(META_PATH, "r", encoding="utf-8") as f:
        _meta = json.load(f)
    documents = _meta["documents"]
    sources = _meta["sources"]
else:
    doc_embeddings = np.zeros((0, 384))
    documents, sources = [], []
    print("WARNING: store.npz not found - run 'python ingest.py' first.")


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]


@app.get("/")
def health_check():
    return {"status": "ok", "chunks_loaded": len(documents), "model": OLLAMA_MODEL}


def ask_ollama(system_prompt: str, question: str) -> str:
    """
    Calls the local Ollama server's chat endpoint.
    Ollama exposes this at /api/chat by default once it's running.
    """
    response = requests.post(
        f"{OLLAMA_URL}/api/chat",
        json={
            "model": OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question},
            ],
            "stream": False,
        },
        timeout=120,
    )
    response.raise_for_status()
    data = response.json()
    return data["message"]["content"]


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if len(documents) == 0:
        return ChatResponse(
            answer="No content has been indexed yet - run 'python ingest.py' on the backend first.",
            sources=[],
        )

    # 1. Embed the incoming question (normalized, matching ingest.py)
    query_embedding = embed_model.encode([req.question], normalize_embeddings=True)[0]

    # 2. Retrieval: cosine similarity = dot product, since both sides are normalized.
    similarities = doc_embeddings @ query_embedding  # shape: (num_chunks,)
    top_indices = np.argsort(similarities)[::-1][:TOP_K]

    retrieved_chunks = [documents[i] for i in top_indices]
    retrieved_sources = [sources[i] for i in top_indices]

    # 3. Build a context block from retrieved chunks
    context_block = "\n\n---\n\n".join(retrieved_chunks)

    system_prompt = (
        "You are a helpful assistant for a documentary/vlog website about Bangladesh. "
        "Answer the user's question using ONLY the context provided below. "
        "If the answer isn't in the context, say you don't have that information in "
        "the documentaries yet, rather than guessing.\n\n"
        f"CONTEXT:\n{context_block}"
    )

    # 4. Ask the local LLM (via Ollama) to answer, grounded in the retrieved context
    try:
        answer_text = ask_ollama(system_prompt, req.question)
    except requests.exceptions.ConnectionError:
        return ChatResponse(
            answer=(
                "Couldn't reach Ollama. Make sure Ollama is installed and running "
                f"(try 'ollama run {OLLAMA_MODEL}' in a terminal), then try again."
            ),
            sources=[],
        )

    return ChatResponse(answer=answer_text, sources=list(set(retrieved_sources)))
