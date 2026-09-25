"""
FinFlow ML Microservice — FastAPI server

Endpoints:
  GET  /health      Health check
  POST /predict     Predict month-end spending (XGBoost / sklearn)
  POST /train       Train/retrain the model on provided expense data
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
import traceback

from model import predict_month_end, train, XGBOOST_AVAILABLE

app = FastAPI(
    title="FinFlow ML API",
    description="XGBoost / scikit-learn expense forecasting microservice",
    version="1.0.0",
)

# Allow requests from Next.js frontend (any origin in dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ──────────────────────────────────────────────────────────────────

class ExpenseItem(BaseModel):
    amount: float
    category: Optional[str] = "General"
    date: Optional[Any] = None
    createdAt: Optional[Any] = None
    title: Optional[str] = ""

class PredictRequest(BaseModel):
    expenses: List[ExpenseItem]
    budget: Optional[float] = 6000.0

class TrainRequest(BaseModel):
    expenses: List[ExpenseItem]


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "xgboost_available": XGBOOST_AVAILABLE,
        "model": "XGBoost" if XGBOOST_AVAILABLE else "GradientBoosting (sklearn)",
    }


@app.post("/predict")
def predict(req: PredictRequest):
    """
    Predict month-end spending.

    Auto-trains the model on first call if no saved model exists.
    Input:  list of expense objects + monthly budget
    Output: { forecast, remaining, confidence, model, days_elapsed, days_remaining }
    """
    try:
        import os
        from model import MODEL_PATH
        expenses_dicts = [e.model_dump() for e in req.expenses]

        # Auto-train on first call (or when model file is missing)
        if not os.path.exists(MODEL_PATH) and len(expenses_dicts) >= 3:
            train(expenses_dicts)

        result = predict_month_end(expenses_dicts, budget=req.budget)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/train")
def train_model(req: TrainRequest):
    """
    Train (or retrain) the forecasting model on provided expense history.
    Call this whenever you want the model to learn from new data.
    """
    try:
        expenses_dicts = [e.model_dump() for e in req.expenses]
        result = train(expenses_dicts)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
