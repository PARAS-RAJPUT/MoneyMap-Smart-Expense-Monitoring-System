# FastAPI Expense‑ML Service

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal

from .utils import categorize_text, init_rule_dict
from .db import get_user_category_stats

app = FastAPI(title="Expense ML Service", version="0.1.0")

# Allow calls from the Node backend (localhost:3000) and any origin for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load rule‑based lookup at startup
RULES = init_rule_dict()

class CategorizeRequest(BaseModel):
    description: str = Field(..., example="Starbucks coffee")
    amount: float = Field(..., example=4.75)

class CategorizeResponse(BaseModel):
    category: str
    confidence: float
    method: Literal["rule", "ml"]

@app.post("/categorize", response_model=CategorizeResponse)
async def categorize(req: CategorizeRequest):
    try:
        category, confidence, method = await categorize_text(req.description, req.amount, RULES)
        return CategorizeResponse(category=category, confidence=confidence, method=method)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class AnomalyRequest(BaseModel):
    userId: str = Field(..., example="64a7b2c8f0e8a5d6c1b2e3f4")
    category: str = Field(..., example="Food & Drink")
    amount: float = Field(..., example=120.0)

class AnomalyResponse(BaseModel):
    is_anomaly: bool
    z_score: float
    message: str

@app.post("/check-anomaly", response_model=AnomalyResponse)
async def check_anomaly(req: AnomalyRequest):
    # Retrieve rolling mean/std for this user/category (last N days, e.g., 30)
    stats = await get_user_category_stats(req.userId, req.category)
    if not stats or stats["count"] < 5:
        # Not enough data – cannot decide, treat as non‑anomaly
        return AnomalyResponse(is_anomaly=False, z_score=0.0, message="Insufficient history for anomaly check.")

    mean = stats["mean"]
    std = stats["std"]
    if std == 0:
        # Avoid division by zero – treat any deviation as anomaly if amount != mean
        is_anomaly = req.amount != mean
        z = float('inf') if is_anomaly else 0.0
        msg = "Zero variance – any change flagged as anomaly." if is_anomaly else "Exact repeat of historic amount."
        return AnomalyResponse(is_anomaly=is_anomaly, z_score=z, message=msg)

    z = (req.amount - mean) / std
    is_anomaly = abs(z) > 3  # 3‑sigma rule
    msg = "Anomalous transaction detected." if is_anomaly else "Transaction within normal range."
    return AnomalyResponse(is_anomaly=is_anomaly, z_score=round(z, 3), message=msg)
