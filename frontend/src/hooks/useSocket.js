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

    socket.connect();

    const handleConnect = () => {
      setIsConnected(true);
      setSocketError(null);
      socket.emit("user:join", username);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = () => {
      setSocketError("Unable to reach the server. Retrying...");
    };

    const handleReconnect = () => {
      setSocketError(null);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.io.on("reconnect", handleReconnect);

    // If already connected (e.g. hot reload), join immediately
    if (socket.connected) {
      handleConnect();
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
      noticeTimeoutRef.current = setTimeout(() => setSystemNotice(null), 3000);
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
      setTypingUsers((prev) => (prev.includes(typer) ? prev : [...prev, typer]));
    };

    const handleTypingStop = ({ username: typer }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== typer));
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

  // ---- Actions exposed to components ----

  const sendChatMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    socket.emit("message:send", { message: trimmed }, (ack) => {
      if (!ack?.success) {
        setSocketError(ack?.error || "Message failed to send");
      }
    });
  }, []);

  const notifyTypingStart = useCallback(() => {
    socket.emit("typing:start");
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop");
    }, 1500); // debounce: auto-stop after 1.5s of inactivity
  }, []);

  const notifyTypingStop = useCallback(() => {
    clearTimeout(typingTimeoutRef.current);
    socket.emit("typing:stop");
  }, []);

  const prependHistory = useCallback((history) => {
    setMessages(history);
  }, []);

  return {
    isConnected,
    messages,
    onlineUsers,
    typingUsers: typingUsers.filter((u) => u !== username),
    systemNotice,
    socketError,
    sendChatMessage,
    notifyTypingStart,
    notifyTypingStop,
    prependHistory,
  };
};

export default useSocket;
