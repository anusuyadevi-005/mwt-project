const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String }, // Made optional, will derive from email if not provided
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional password
  googleId: { type: String, unique: true, sparse: true }, // Google ID for OAuth users
  contactNumber: { type: String }, // Optional for Google users
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  otp: { type: String }, // OTP for password reset
  otpExpires: { type: Date }, // OTP expiration time
  role: { type: String, default: 'user' }, // User role: 'user' or 'admin'
});

module.exports = mongoose.model("User", userSchema);
