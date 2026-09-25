// Transaction model for MERN expense tracker
// Fields: amount, description, merchant, category, confidence, timestamp, userId, corrected

const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  merchant: { type: String },
  category: { type: String }, // filled by ML service
  confidence: { type: Number }, // confidence of category prediction
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  corrected: { type: Boolean, default: false }, // manually corrected category flag
});

module.exports = mongoose.model('Transaction', TransactionSchema);
