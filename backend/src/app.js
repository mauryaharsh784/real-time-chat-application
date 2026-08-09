const express = require("express");
const cors = require("cors");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real-Time Chat Backend is running 🚀"
  });
});

// ---- Middleware ----
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Health Check ----
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// ---- Routes ----
app.use("/api/messages", messageRoutes);

// ---- Error Handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
