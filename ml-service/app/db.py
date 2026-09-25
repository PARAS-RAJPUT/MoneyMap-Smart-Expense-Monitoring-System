# db.py – MongoDB helper for anomaly detection (FastAPI side)

import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, Dict

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/expense-tracker")
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_default_database()

async def get_user_category_stats(user_id: str, category: str, window_days: int = 30) -> Optional[Dict]:
    """Return rolling mean, std, and count of amounts for a given user & category.
    Uses Mongo aggregation on the `transactions` collection.
    """
    pipeline = [
        {"$match": {"userId": user_id, "category": category}},
        {"$sort": {"timestamp": -1}},
        {"$limit": 1000},  # safety cap
        {"$group": {
            "_id": None,
            "mean": {"$avg": "$amount"},
            "std": {"$stdDevPop": "$amount"},
            "count": {"$sum": 1}
        }}
    ]
    cursor = db["transactions"].aggregate(pipeline)
    result = await cursor.to_list(length=1)
    if not result:
        return None
    stats = result[0]
    # Return only needed fields
    return {"mean": stats.get("mean", 0), "std": stats.get("std", 0), "count": stats.get("count", 0)}
