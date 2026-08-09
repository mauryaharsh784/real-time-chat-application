function ChatHeader({ username, onlineCount, isConnected, onLogout }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white font-bold">
          RT
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-900 sm:text-base">Real-Time Chat</h1>
          <p className="text-xs text-slate-500">
            Signed in as <span className="font-medium text-slate-700">{username}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-1.5 text-xs text-slate-600 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {onlineCount} Online
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            isConnected ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}
          />
          {isConnected ? "Connected" : "Disconnected"}
        </div>

        <button
          onClick={onLogout}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
