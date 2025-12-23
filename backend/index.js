require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const preboardingRoutes = require("./routes/preboardingRoutes");

// Connect MongoDB
connectDB();

// Initialize app
const app = express();

//  CORS CONFIG (LOCAL DEV)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body Parser
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/hr", preboardingRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 HRMS Backend Server is running",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
