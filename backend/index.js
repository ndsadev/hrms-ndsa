const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const preboardingRoutes = require("./routes/preboardingRoutes");

// Load env variables
dotenv.config();

// Connect MongoDB
connectDB();

// Initialize app
const app = express();

/* =================================================
   GLOBAL MIDDLEWARES
================================================= */
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* =================================================
   HEALTH CHECK
================================================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 HRMS Backend Server is running",
  });
});

/* =================================================
   API ROUTES
================================================= */
app.use("/api/auth", authRoutes);
app.use("/api/hr", preboardingRoutes);

/* =================================================
   GLOBAL ERROR HANDLER (MULTER + OTHERS)
================================================= */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =================================================
   404 HANDLER
================================================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =================================================
   SERVER LISTEN
================================================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
