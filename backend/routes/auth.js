const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// 📝 Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, contactNumber } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Derive name from email if not provided
    const userName = name || email.split('@')[0];

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name: userName, email, password: hashedPassword, contactNumber });
    await newUser.save();

    res.status(201).json({ message: "Signup successful! Please login now." });
  } catch (err) {
    res.status(500).json({ message: "Error signing up", error: err });
  }
});

// 🔐 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user if not exists
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = email === 'jeyanthi282005@gmail.com' ? 'admin' : 'user';
      user = new User({
        name: email.split('@')[0], // Use part before @ as name
        email,
        password: hashedPassword,
        role,
      });
      await user.save();
    } else {
      // Check password if user exists and has password
      if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });
      } else {
        // If no password (e.g., Google user), set password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
      }
      // Set role for admin email if not already set
      if (email === 'jeyanthi282005@gmail.com' && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
});

// Google OAuth routes
router.get("/google", (req, res, next) => {
  const state = req.query.state || 'login'; // default to login if no state
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login", session: true }),
  (req, res) => {
    // successful auth -> redirect to login page with user data
    const userData = encodeURIComponent(JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      googleId: req.user.googleId
    }));

    res.redirect(`http://localhost:5173/login?google=success&user=${userData}`);
  }
);

// Get current user from session
router.get("/me", (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Set password for Google users
router.post("/set-password", async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password set successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error setting password", error: err });
  }
});

// Send OTP for password reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 300000; // 5 minutes
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. This OTP will expire in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending error:", error);
        return res.status(500).json({ message: "Error sending email. Please check email configuration." });
      }
      res.status(200).json({ message: "OTP sent to your email" });
    });
  } catch (err) {
    res.status(500).json({ message: "Error processing request", error: err });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    // Clear OTP after verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error verifying OTP", error: err });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err });
  }
});

module.exports = router;
