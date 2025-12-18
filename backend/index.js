const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const session = require("express-session");

dotenv.config();

// Require passport config to register strategies
require("./config/passport")(passport);

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/tamilnadutravel")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import models
const User = require("./models/User");
const Booking = require("./models/Booking");

// Import routes
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/booking");
const paymentRoutes = require("./routes/payment");
const packageRoutes = require("./routes/packages");

// Use routes
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/packages", packageRoutes);

// =====================
// ✅ Start Server
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
