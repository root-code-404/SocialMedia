const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Code expires after 5 minutes (300 seconds)
});

const VerificationModel = mongoose.model('verification', verificationSchema);

module.exports = VerificationModel;
