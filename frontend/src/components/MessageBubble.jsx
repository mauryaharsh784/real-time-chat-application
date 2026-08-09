import { formatTime, getInitial, getAvatarColor } from "../utils/formatTime.js";

function MessageBubble({ message, isOwn }) {
  const { username, message: text, createdAt } = message;

  return (
    <div className={`flex w-full animate-fade-in ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] items-end gap-2 sm:max-w-[65%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(
            username
          )}`}
          title={username}
        >
          {getInitial(username)}
        </div>

        <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
          {!isOwn && <span className="mb-0.5 px-1 text-xs font-medium text-slate-500">{username}</span>}
          <div
            className={`rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
              isOwn
                ? "rounded-br-sm bg-brand-600 text-white"
                : "rounded-bl-sm bg-white text-slate-800 border border-slate-200"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{text}</p>
          </div>
          <span className="mt-0.5 px-1 text-[11px] text-slate-400">{formatTime(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
