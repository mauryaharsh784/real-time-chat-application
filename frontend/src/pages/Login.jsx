import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (!trimmed) {
      setError("Please enter a username to continue");
      return;
    }

    if (trimmed.length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }

    if (trimmed.length > 30) {
      setError("Username must be under 30 characters");
      return;
    }

    localStorage.setItem("chat_username", trimmed);
    navigate("/chat");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-slate-50 to-brand-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-brand-900/5">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
            RT
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Real-Time Chat</h1>
          <p className="mt-1 text-sm text-slate-500">Enter a username to join the conversation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-xs font-medium text-slate-600">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoFocus
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Harsh"
              maxLength={30}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 active:bg-brand-800"
          >
            Join Chat
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          No password required — this is a demo chat room for anyone to join.
        </p>
      </div>
    </div>
  );
}

export default Login;
