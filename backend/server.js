const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

// Initialize passport strategies BEFORE requiring/mounting auth routes
require("./config/passport")(passport);

const authRoutes = require("./routes/auth"); // require after initializing strategies

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// mount auth routes AFTER passport initialization
app.use("/auth", authRoutes);

// Import and mount package routes
const packageRoutes = require("./routes/packages");
app.use("/api/packages", packageRoutes);

// Import and mount booking routes
const bookingRoutes = require("./routes/booking");
app.use("/api/bookings", bookingRoutes);

// Import and mount payment routes
const paymentRoutes = require("./routes/payment");
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => res.send("Backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
