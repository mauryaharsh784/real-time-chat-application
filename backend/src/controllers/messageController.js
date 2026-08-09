const Message = require("../models/Message");

/**
 * @desc    Save a new chat message to the database
 * @route   POST /api/messages
 * @access  Public
 */
const createMessage = async (req, res, next) => {
  try {
    const { username, message } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const newMessage = await Message.create({
      username: username.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get chat history in chronological order, with optional pagination
 * @route   GET /api/messages?page=1&limit=50
 * @access  Public
 */
const getMessages = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
    const skip = (page - 1) * limit;

    // Fetch newest-first for pagination, then reverse to chronological order
    const total = await Message.countDocuments();
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      messages: messages.reverse(), // chronological order (oldest -> newest)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getMessages,
};
