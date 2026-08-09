const Message = require("../models/Message");

// In-memory map of online users: socket.id -> username
const onlineUsers = new Map();

// In-memory set tracking who is currently typing (username set)
const typingUsers = new Set();

/**
 * Returns a de-duplicated, sorted list of currently online usernames.
 */
const getOnlineUsernames = () => {
  return Array.from(new Set(onlineUsers.values())).sort((a, b) => a.localeCompare(b));
};

/**
 * Registers all Socket.io event handlers for a single connected socket.
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
const registerSocketHandlers = (io, socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // ---- user:join ----
  socket.on("user:join", (username) => {
    try {
      if (!username || typeof username !== "string" || !username.trim()) {
        socket.emit("error:message", "Invalid username");
        return;
      }

      const cleanUsername = username.trim().slice(0, 30);
      socket.data.username = cleanUsername;
      onlineUsers.set(socket.id, cleanUsername);

      // Notify everyone (including sender) that a user joined
      io.emit("user:joined", {
        username: cleanUsername,
        message: `${cleanUsername} joined the chat`,
        timestamp: new Date().toISOString(),
      });

      // Broadcast updated online users list to everyone
      io.emit("users:online", {
        users: getOnlineUsernames(),
        count: getOnlineUsernames().length,
      });
    } catch (err) {
      console.error("Error in user:join handler:", err.message);
      socket.emit("error:message", "Failed to join chat");
    }
  });

  // ---- message:send ----
  socket.on("message:send", async (payload, callback) => {
    try {
      const username = socket.data.username;
      const messageText = payload && typeof payload.message === "string" ? payload.message.trim() : "";

      if (!username) {
        socket.emit("error:message", "You must join before sending messages");
        return;
      }

      if (!messageText) {
        socket.emit("error:message", "Message cannot be empty");
        return;
      }

      if (messageText.length > 1000) {
        socket.emit("error:message", "Message is too long");
        return;
      }

      // Persist message to MongoDB
      const savedMessage = await Message.create({
        username,
        message: messageText,
      });

      // Broadcast to ALL connected clients (including sender) for consistency
      io.emit("message:receive", {
        _id: savedMessage._id,
        username: savedMessage.username,
        message: savedMessage.message,
        createdAt: savedMessage.createdAt,
      });

      // Acknowledge success back to the sender, if a callback was provided
      if (typeof callback === "function") {
        callback({ success: true });
      }
    } catch (err) {
      console.error("Error in message:send handler:", err.message);
      socket.emit("error:message", "Failed to send message. Please try again.");
      if (typeof callback === "function") {
        callback({ success: false, error: err.message });
      }
    }
  });

  // ---- typing:start ----
  socket.on("typing:start", () => {
    const username = socket.data.username;
    if (!username) return;

    typingUsers.add(username);
    socket.broadcast.emit("typing:start", { username });
  });

  // ---- typing:stop ----
  socket.on("typing:stop", () => {
    const username = socket.data.username;
    if (!username) return;

    typingUsers.delete(username);
    socket.broadcast.emit("typing:stop", { username });
  });

  // ---- disconnect ----
  socket.on("disconnect", () => {
    const username = socket.data.username;
    onlineUsers.delete(socket.id);
    typingUsers.delete(username);

    console.log(`Socket disconnected: ${socket.id} (${username || "unknown"})`);

    if (username) {
      io.emit("user:left", {
        username,
        message: `${username} left the chat`,
        timestamp: new Date().toISOString(),
      });

      io.emit("users:online", {
        users: getOnlineUsernames(),
        count: getOnlineUsernames().length,
      });

      // Make sure a stale typing indicator doesn't linger for other clients
      io.emit("typing:stop", { username });
    }
  });

  // ---- generic socket error ----
  socket.on("error", (err) => {
    console.error(`Socket error on ${socket.id}:`, err.message);
  });
};

module.exports = { registerSocketHandlers, getOnlineUsernames };
