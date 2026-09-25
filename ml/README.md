# FinFlow ML Microservice

XGBoost / scikit-learn powered expense forecasting for MoneyMap.

## Setup

```bash
# Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
# or
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at **http://localhost:8000**

## Endpoints

| Method | Path       | Description                        |
|--------|------------|------------------------------------|
| GET    | `/health`  | Health check + model info          |
| POST   | `/predict` | Predict month-end spending         |
| POST   | `/train`   | Train model on expense history     |

## `/predict` Request

```json
{
  "expenses": [
    { "amount": 142.50, "category": "Food & Dining", "date": "2024-10-24T00:00:00Z" },
    { "amount": 19.99,  "category": "Entertainment", "date": "2024-10-22T00:00:00Z" }
  ],
  "budget": 6000
}
```

## `/predict` Response

```json
{
  "forecast": 4850.00,
  "remaining": 1150.00,
  "confidence": 0.72,
  "model": "XGBoost",
  "days_elapsed": 24,
  "days_remaining": 7
}
```

## How the Model Works

1. **Features**: `day_of_month`, `day_of_week`, `month`, `week_of_month`, `category_encoded`, `rolling_7d_avg`, `rolling_30d_avg`, `cumulative_spend`
2. **Model**: XGBoost Regressor (primary) → sklearn GradientBoostingRegressor (fallback)
3. **Prediction**: Rolls forward day-by-day from today to month-end, accumulating predicted spend
4. **Fallback**: If insufficient data (<3 expenses) or no trained model exists, uses linear projection `(spent_so_far / days_elapsed) × days_in_month`

## Training

The model auto-trains when `/predict` is called if no model exists yet.
Manually retrain with new data by calling `/train`:

```bash
curl -X POST http://localhost:8000/train \
  -H "Content-Type: application/json" \
  -d '{"expenses": [...]}'
```
