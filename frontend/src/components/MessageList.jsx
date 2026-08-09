import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

function MessageList({ messages, currentUsername, typingUsers, isLoading, loadError }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-400">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 animate-bounce-dot rounded-full bg-brand-400 [animation-delay:0s]" />
          <span className="h-2.5 w-2.5 animate-bounce-dot rounded-full bg-brand-400 [animation-delay:0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce-dot rounded-full bg-brand-400 [animation-delay:0.3s]" />
        </div>
        <p className="text-sm">Loading conversation...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-sm font-medium text-red-600">{loadError}</p>
        <p className="text-xs text-slate-400">Check that the backend server is running and try refreshing.</p>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-slate-400">
        <div className="text-4xl">💬</div>
        <p className="text-sm font-medium text-slate-500">No messages yet</p>
        <p className="text-xs">Say hello to start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
      {messages.map((msg) => (
        <MessageBubble key={msg._id || `${msg.username}-${msg.createdAt}-${Math.random()}`} message={msg} isOwn={msg.username === currentUsername} />
      ))}

      {typingUsers.length > 0 && <TypingIndicator typingUsers={typingUsers} />}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
