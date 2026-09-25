// Service that wraps calls to the FastAPI ML microservice

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Calls the FastAPI /categorize endpoint.
 * @param {string} description - Transaction description
 * @param {number} amount - Transaction amount
 * @returns {{category:string, confidence:number, method:string}}
 */
export async function classifyTransaction(description, amount) {
  try {
    const resp = await axios.post(`${ML_SERVICE_URL}/categorize`, {
      description,
      amount,
    });
    return resp.data; // {category, confidence, method}
  } catch (err) {
    console.error('ML service classification error:', err.message);
    // Fallback to generic category if service unavailable
    return { category: 'Uncategorized', confidence: 0, method: 'fallback' };
  }
}

/**
 * Calls the FastAPI /check-anomaly endpoint.
 * @param {string} userId
 * @param {string} category
 * @param {number} amount
 * @returns {{is_anomaly:boolean, z_score:number, message:string}}
 */
export async function checkAnomaly(userId, category, amount) {
  try {
    const resp = await axios.post(`${ML_SERVICE_URL}/check-anomaly`, {
      userId,
      category,
      amount,
    });
    return resp.data;
  } catch (err) {
    console.error('ML service anomaly check error:', err.message);
    return { is_anomaly: false, z_score: 0, message: 'Error checking anomaly' };
  }
}
