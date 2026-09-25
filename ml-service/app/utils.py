# utils.py – Helper functions for the FastAPI ML service

import os
import json
import pickle
from typing import Tuple
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

# ------------------------------------------------------------
# Rule‑based lookup
# ------------------------------------------------------------

def init_rule_dict() -> dict:
    """Load a simple rule‑based dict from a JSON file.
    The file can be edited by the developer to add more keywords.
    Expected format: {"keyword": "Category", ...}
    """
    rule_path = Path(__file__).parent / "rules.json"
    if rule_path.is_file():
        with open(rule_path, "r", encoding="utf-8") as f:
            return json.load(f)
    # Minimal fallback dictionary if the file does not exist
    return {
        "starbucks": "Food & Drink",
        "uber": "Transport",
        "amazon": "Shopping",
        "salary": "Income",
    }

# ------------------------------------------------------------
# ML model – TF‑IDF + LogisticRegression pipeline
# ------------------------------------------------------------

MODEL_PATH = Path(__file__).parent.parent / "models" / "classifier.pkl"

def load_classifier() -> Pipeline:
    if MODEL_PATH.is_file():
        with open(MODEL_PATH, "rb") as f:
            return pickle.load(f)
    # If no trained model exists, train a tiny dummy model on the fly
    # (required for first‑run scenarios). In production replace with real training.
    dummy_texts = ["salary payment", "coffee shop", "uber ride", "grocery store"]
    dummy_labels = ["Income", "Food & Drink", "Transport", "Shopping"]
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer()),
        ("clf", LogisticRegression(max_iter=200))
    ])
    pipeline.fit(dummy_texts, dummy_labels)
    # Save for future runs
    os.makedirs(MODEL_PATH.parent, exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(pipeline, f)
    return pipeline

# Load once at startup for speed
_CLASSIFIER = load_classifier()

async def categorize_text(description: str, amount: float, rule_dict: dict) -> Tuple[str, float, str]:
    """Return (category, confidence, method).
    1. Try rule‑based lookup – case‑insensitive keyword search.
    2. If no rule matches, fall back to the ML classifier.
    """
    lowered = description.lower()
    for kw, cat in rule_dict.items():
        if kw.lower() in lowered:
            # Rule confidence is a static high value (0.9)
            return cat, 0.9, "rule"
    # ML fallback – predict probabilities
    probs = _CLASSIFIER.predict_proba([description])[0]
    idx = probs.argmax()
    category = _CLASSIFIER.classes_[idx]
    confidence = float(probs[idx])
    return category, confidence, "ml"
