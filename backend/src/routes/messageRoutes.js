const express = require("express");
const { createMessage, getMessages } = require("../controllers/messageController");

const router = express.Router();

// POST /api/messages
router.post("/", createMessage);

// GET /api/messages?page=1&limit=50
router.get("/", getMessages);

module.exports = router;
