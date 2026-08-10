const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // this just tells Mongoose "this ID points to a User document"
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'], // only these 3 values are allowed
    default: 'PENDING'
  },
  acceptedAt: { type: Date, default: null },
  rejectedAt: { type: Date, default: null }
}, { timestamps: true }); // createdAt comes from here automatically

module.exports = mongoose.model('Connection', connectionSchema);
