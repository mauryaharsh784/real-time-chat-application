const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Index to speed up chronological retrieval of chat history
messageSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
