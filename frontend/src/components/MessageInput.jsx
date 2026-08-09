import { useState } from "react";

function MessageInput({ onSend, onTypingStart, onTypingStop, disabled }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value.trim()) {
      onTypingStart();
    } else {
      onTypingStop();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setText("");
    onTypingStop();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-slate-200 bg-white px-4 py-3 sm:px-6"
    >
      <textarea
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onTypingStop}
        placeholder={disabled ? "Connecting..." : "Type a message..."}
        rows={1}
        disabled={disabled}
        className="max-h-28 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;
