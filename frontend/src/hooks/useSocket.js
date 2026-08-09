
import { useEffect, useRef, useState, useCallback } from "react";
import socket from "../services/socket.js";

/**
 * Encapsulates all Socket.io wiring for the chat page:
 * connection lifecycle, message stream, online users, typing indicators,
 * and join/leave system notices.
 *
 * @param {string} username
 */
const useSocket = (username) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [systemNotice, setSystemNotice] = useState(null);
  const [socketError, setSocketError] = useState(null);

  const typingTimeoutRef = useRef(null);
  const noticeTimeoutRef = useRef(null);

  // ---- Connect / disconnect lifecycle ----
  useEffect(() => {
    if (!username) return undefined;

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);

      setIsConnected(true);
      setSocketError(null);

      // Join chat immediately after connection
      socket.emit("user:join", username);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");

      setIsConnected(false);
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);

      setIsConnected(false);
      setSocketError("Unable to reach the server. Retrying...");
    };

    const handleReconnect = () => {
      console.log("Socket reconnected");

      setSocketError(null);

      // Re-join after reconnect
      if (username) {
        socket.emit("user:join", username);
      }
    };

    // IMPORTANT:
    // Register listeners BEFORE connecting.
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.io.on("reconnect", handleReconnect);

    // If socket is already connected, join immediately.
    if (socket.connected) {
      handleConnect();
    } else {
      // Connect only after listeners are registered.
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.io.off("reconnect", handleReconnect);

      socket.disconnect();
    };
  }, [username]);

  // ---- Message / presence / typing events ----
  useEffect(() => {
    const showNotice = (text) => {
      setSystemNotice(text);

      clearTimeout(noticeTimeoutRef.current);

      noticeTimeoutRef.current = setTimeout(() => {
        setSystemNotice(null);
      }, 3000);
    };

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleUserJoined = (data) => {
      showNotice(`🟢 ${data.message}`);
    };

    const handleUserLeft = (data) => {
      showNotice(`🔴 ${data.message}`);
    };

    const handleUsersOnline = (data) => {
      setOnlineUsers(data.users || []);
    };

    const handleTypingStart = ({ username: typer }) => {
      setTypingUsers((prev) =>
        prev.includes(typer) ? prev : [...prev, typer]
      );
    };

    const handleTypingStop = ({ username: typer }) => {
      setTypingUsers((prev) =>
        prev.filter((user) => user !== typer)
      );
    };

    const handleErrorMessage = (msg) => {
      setSocketError(msg);
    };

    socket.on("message:receive", handleReceiveMessage);
    socket.on("user:joined", handleUserJoined);
    socket.on("user:left", handleUserLeft);
    socket.on("users:online", handleUsersOnline);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);
    socket.on("error:message", handleErrorMessage);

    return () => {
      socket.off("message:receive", handleReceiveMessage);
      socket.off("user:joined", handleUserJoined);
      socket.off("user:left", handleUserLeft);
      socket.off("users:online", handleUsersOnline);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      socket.off("error:message", handleErrorMessage);

      clearTimeout(noticeTimeoutRef.current);
    };
  }, []);

  // ---- Send message ----
  const sendChatMessage = useCallback((text) => {
    const trimmed = text.trim();

    if (!trimmed) return;

    if (!socket.connected) {
      setSocketError("Not connected to the server.");
      return;
    }

    socket.emit(
      "message:send",
      { message: trimmed },
      (ack) => {
        if (!ack?.success) {
          setSocketError(
            ack?.error || "Message failed to send"
          );
        }
      }
    );
  }, []);

  // ---- Typing start ----
  const notifyTypingStart = useCallback(() => {
    if (!socket.connected) return;

    socket.emit("typing:start");

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop");
    }, 1500);
  }, []);

  // ---- Typing stop ----
  const notifyTypingStop = useCallback(() => {
    clearTimeout(typingTimeoutRef.current);

    if (socket.connected) {
      socket.emit("typing:stop");
    }
  }, []);

  // ---- Load history ----
  const prependHistory = useCallback((history) => {
    setMessages(history);
  }, []);

  return {
    isConnected,
    messages,
    onlineUsers,
    typingUsers: typingUsers.filter(
      (user) => user !== username
    ),
    systemNotice,
    socketError,
    sendChatMessage,
    notifyTypingStart,
    notifyTypingStop,
    prependHistory,
  };
};

export default useSocket;

