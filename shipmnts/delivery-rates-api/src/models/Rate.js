const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  validFrom: { type: String, required: true }, // stored as "YYYY-MM-DD" string, easy to compare
  validTo: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  transitDays: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Rate', rateSchema);
