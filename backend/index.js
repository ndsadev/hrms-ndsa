const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Load env variables
dotenv.config();

// Connect MongoDB
connectDB();

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HRMS Backend Server is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);

// 404 auth handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
