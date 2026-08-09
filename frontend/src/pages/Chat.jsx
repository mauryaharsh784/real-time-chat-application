import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "../components/ChatHeader.jsx";
import MessageList from "../components/MessageList.jsx";
import MessageInput from "../components/MessageInput.jsx";
import OnlineUsers from "../components/OnlineUsers.jsx";
import useSocket from "../hooks/useSocket.js";
import { fetchMessages } from "../services/api.js";

function Chat() {
  const navigate = useNavigate();
  const username = localStorage.getItem("chat_username");

  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const {
    isConnected,
    messages,
    onlineUsers,
    typingUsers,
    systemNotice,
    socketError,
    sendChatMessage,
    notifyTypingStart,
    notifyTypingStop,
    prependHistory,
  } = useSocket(username);

  // Load chat history from MongoDB via REST on mount (survives refresh)
  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      try {
        setIsLoadingHistory(true);
        setLoadError(null);
        const data = await fetchMessages(1, 100);
        if (isMounted) {
          prependHistory(data.messages || []);
        }
      } catch (err) {
        if (isMounted) {
          setLoadError("Failed to load chat history. Is the backend running?");
        }
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [prependHistory]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("chat_username");
    navigate("/");
  }, [navigate]);

  if (!username) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <ChatHeader
        username={username}
        onlineCount={onlineUsers.length}
        isConnected={isConnected}
        onLogout={handleLogout}
      />

      {systemNotice && (
        <div className="border-b border-slate-100 bg-brand-50/60 px-4 py-1.5 text-center text-xs text-brand-700 animate-fade-in sm:px-6">
          {systemNotice}
        </div>
      )}

      {socketError && (
        <div className="border-b border-red-100 bg-red-50 px-4 py-1.5 text-center text-xs text-red-600 sm:px-6">
          ⚠ {socketError}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <div className="flex min-h-0 flex-1 flex-col">
          <MessageList
            messages={messages}
            currentUsername={username}
            typingUsers={typingUsers}
            isLoading={isLoadingHistory}
            loadError={loadError}
          />
          <MessageInput
            onSend={sendChatMessage}
            onTypingStart={notifyTypingStart}
            onTypingStop={notifyTypingStop}
            disabled={!isConnected}
          />
        </div>

        <OnlineUsers users={onlineUsers} currentUsername={username} />
      </div>
    </div>
  );
}

export default Chat;
