import { getInitial, getAvatarColor } from "../utils/formatTime.js";

function OnlineUsers({ users, currentUsername }) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-l border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Online ({users.length})
        </h2>
      </div>
      <ul className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-2">
        {users.map((user) => (
          <li
            key={user}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <div className="relative">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(
                  user
                )}`}
              >
                {getInitial(user)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <span className="truncate">
              {user}
              {user === currentUsername && <span className="text-slate-400"> (you)</span>}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default OnlineUsers;
