
const express = require("express");
const cors = require("cors");

const messageRoutes = require("./routes/messageRoutes");
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

// ---- CORS ----
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ---- Body parser ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Root ----
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real-Time Chat Backend is running 🚀",
  });
});

// ---- Health Check ----
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// ---- Routes ----
app.use("/api/messages", messageRoutes);

// ---- Error Handling ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;

