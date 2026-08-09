/**
 * Formats an ISO date string / Date into a short local time string, e.g. "10:32 AM".
 */
export const formatTime = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/**
 * Returns the initial letter of a username, uppercased, for avatar display.
 */
export const getInitial = (username) => {
  if (!username) return "?";
  return username.trim().charAt(0).toUpperCase();
};

/**
 * Deterministically derives a Tailwind color pair for a username's avatar,
 * so the same user always gets the same color.
 */
const AVATAR_COLORS = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-fuchsia-500",
  "bg-pink-500",
];

export const getAvatarColor = (username) => {
  if (!username) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};
