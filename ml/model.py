"""
ML model module for MoneyMap / FinFlow expense forecasting.

Uses XGBoost as primary model (falls back to scikit-learn GradientBoostingRegressor).
Predicts month-end total spending based on historical expense data.
"""

import numpy as np
import pandas as pd
from datetime import datetime, date
import joblib
import os
import warnings

warnings.filterwarnings("ignore")

# Try XGBoost first, fall back to scikit-learn
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
ENCODER_PATH = os.path.join(os.path.dirname(__file__), "encoder.pkl")

CATEGORIES = [
    "Food & Dining", "Food & Drink", "Food", "Entertainment",
    "Housing", "Rent & Utils", "Utilities", "Transport",
    "Shopping", "Salary", "General"
]


def _expenses_to_df(expenses: list) -> pd.DataFrame:
    """Convert raw expense dicts from MongoDB → feature DataFrame."""
    records = []
    for e in expenses:
        try:
            # Parse date — handle ISO strings and epoch ms
            raw_date = e.get("date") or e.get("createdAt", "")
            if isinstance(raw_date, (int, float)):
                d = datetime.fromtimestamp(raw_date / 1000)
            else:
                d = datetime.fromisoformat(str(raw_date).replace("Z", "+00:00"))

            records.append({
                "amount": abs(float(e.get("amount", 0))),
                "category": e.get("category", "General"),
                "day_of_month": d.day,
                "day_of_week": d.weekday(),   # 0=Mon … 6=Sun
                "month": d.month,
                "week_of_month": (d.day - 1) // 7 + 1,
                "date": d.date(),
            })
        except Exception:
            continue

    if not records:
        return pd.DataFrame()

    df = pd.DataFrame(records)

    # Encode categories
    df["category_enc"] = df["category"].apply(
        lambda c: CATEGORIES.index(c) if c in CATEGORIES else len(CATEGORIES)
    )

    # Rolling features (by date order)
    df = df.sort_values("date").reset_index(drop=True)
    df["cumulative"] = df["amount"].cumsum()

    # Rolling 7-day and 30-day average by grouping date into windows
    df["rolling_7d"] = df["amount"].rolling(window=7, min_periods=1).mean()
    df["rolling_30d"] = df["amount"].rolling(window=30, min_periods=1).mean()

    return df


def _build_features(df: pd.DataFrame) -> np.ndarray:
    """Extract feature matrix from DataFrame."""
    cols = [
        "day_of_month", "day_of_week", "month", "week_of_month",
        "category_enc", "rolling_7d", "rolling_30d", "cumulative"
    ]
    return df[cols].values.astype(float)


def train(expenses: list) -> dict:
    """
    Train the forecasting model on historical expense data.
    Returns metadata about the trained model.
    """
    df = _expenses_to_df(expenses)

    if df.empty or len(df) < 3:
        return {"status": "insufficient_data", "samples": len(df)}

    X = _build_features(df)
    # Target: cumulative spending up to this day → regress next-day cumulative
    y = df["cumulative"].values

    if len(X) < 4:
        return {"status": "insufficient_data", "samples": len(X)}

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    if XGBOOST_AVAILABLE:
        model = xgb.XGBRegressor(
            n_estimators=200,
            max_depth=4,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            verbosity=0,
        )
        model_name = "XGBoost"
    else:
        model = GradientBoostingRegressor(
            n_estimators=200,
            max_depth=4,
            learning_rate=0.05,
            random_state=42,
        )
        model_name = "GradientBoostingRegressor (sklearn)"

    model.fit(X_train, y_train)
    score = model.score(X_test, y_test) if len(X_test) > 0 else None

    joblib.dump(model, MODEL_PATH)

    return {
        "status": "trained",
        "model": model_name,
        "samples": len(X),
        "r2_score": round(score, 4) if score is not None else None,
    }


def predict_month_end(expenses: list, budget: float = 6000.0) -> dict:
    """
    Predict month-end total spending given current expense history.

    Strategy:
    1. If a trained model exists → use it to extrapolate
    2. Otherwise → linear projection based on days elapsed
    """
    df = _expenses_to_df(expenses)
    today = date.today()
    days_in_month = (
        date(today.year, today.month % 12 + 1, 1) - date(today.year, today.month, 1)
    ).days if today.month < 12 else 31

    if df.empty:
        return {
            "forecast": 0.0,
            "remaining": budget,
            "confidence": 0.0,
            "model": "none",
            "days_elapsed": today.day,
            "days_remaining": days_in_month - today.day,
        }

    total_so_far = df["amount"].sum()

    # Linear fallback
    linear_forecast = (total_so_far / max(today.day, 1)) * days_in_month

    # Try model-based prediction
    if os.path.exists(MODEL_PATH) and len(df) >= 3:
        try:
            model = joblib.load(MODEL_PATH)
            X = _build_features(df)
            # Predict cumulative at end of month by projecting remaining days
            remaining_days = days_in_month - today.day
            last_row = X[-1].copy()

            projections = []
            rolling_7d = float(df["rolling_7d"].iloc[-1])
            rolling_30d = float(df["rolling_30d"].iloc[-1])
            cumulative = float(df["cumulative"].iloc[-1])

            for day_offset in range(1, remaining_days + 1):
                proj_day = min(today.day + day_offset, days_in_month)
                proj_dow = (today.weekday() + day_offset) % 7
                feat = np.array([[
                    proj_day, proj_dow, today.month,
                    (proj_day - 1) // 7 + 1,
                    last_row[4],  # keep same category encoding
                    rolling_7d, rolling_30d, cumulative
                ]])
                pred_cumulative = float(model.predict(feat)[0])
                projections.append(max(pred_cumulative, cumulative))
                cumulative = projections[-1]

            ml_forecast = max(projections[-1] if projections else linear_forecast, total_so_far)
            confidence = min(len(df) / 30.0, 1.0)  # scales with data quantity

            return {
                "forecast": round(ml_forecast, 2),
                "remaining": round(max(budget - ml_forecast, 0), 2),
                "confidence": round(confidence, 2),
                "model": "XGBoost" if XGBOOST_AVAILABLE else "GradientBoosting",
                "days_elapsed": today.day,
                "days_remaining": remaining_days,
            }
        except Exception as e:
            # Fall through to linear
            pass

    # Linear projection fallback
    return {
        "forecast": round(linear_forecast, 2),
        "remaining": round(max(budget - linear_forecast, 0), 2),
        "confidence": round(min(today.day / days_in_month * 0.7, 0.7), 2),
        "model": "linear_projection",
        "days_elapsed": today.day,
        "days_remaining": days_in_month - today.day,
    }
