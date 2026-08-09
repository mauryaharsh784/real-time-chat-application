# Real-Time Chat Application

A full-stack, real-time chat application built with **React (Vite)**, **Node.js/Express**, **Socket.io**, and **MongoDB**. Users join with a username, send and receive messages instantly, see who's online, watch typing indicators, and have their chat history persisted across refreshes and server restarts.

---

## 1. Project Overview

This project is a single global chat room where any number of users can join with just a username (no password) and chat in real time. Messages are broadcast instantly via **Socket.io** and persisted to **MongoDB**, so history survives page refreshes, reconnects, and backend restarts.

---

## 2. Features

- Username-based login (no password), stored in `localStorage`
- Real-time messaging via Socket.io (no polling, no Firebase)
- Persistent chat history in MongoDB, loaded via REST on refresh
- Live online user list with count
- "User joined / left" system notices
- Typing indicators with debounce
- Connection status indicator (Connected / Disconnected) with automatic reconnection
- Responsive, modern UI built with Tailwind CSS
- Centralized error handling on both frontend and backend
- Clean, modular folder structure separating concerns

---

## 3. Tech Stack

**Frontend:** React.js, Vite, JavaScript, Tailwind CSS, Axios, Socket.io-client, React Router
**Backend:** Node.js, Express.js, Socket.io, MongoDB, Mongoose, dotenv, CORS

---

## 4. Architecture

```
React (Vite SPA)
   │  REST (Axios)             │ WebSocket (Socket.io)
   ▼                           ▼
Express REST API   <──────────>   Socket.io Server
        │                              │
        └──────────────┬───────────────┘
                        ▼
                    MongoDB (Mongoose)
```

- **REST API** handles chat history retrieval and can persist a message directly (used mainly for `GET /api/messages` on load).
- **Socket.io** handles all real-time events: joining, messaging, typing, presence, and leaving. Every message sent through Socket.io is validated and saved to MongoDB before being broadcast, so REST history and live messages always stay in sync.

### Message flow

```
React → Socket.io Client → Socket.io Server → Validate → Save to MongoDB → Broadcast → All connected clients
```

---

## 5. Folder Structure

```
real-time-chat/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── OnlineUsers.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Chat.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── utils/
│   │   │   └── formatTime.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/messageController.js
│   │   ├── models/Message.js
│   │   ├── routes/messageRoutes.js
│   │   ├── socket/socketHandler.js
│   │   ├── middleware/errorMiddleware.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## 6. Prerequisites

- Node.js v18+ and npm
- MongoDB running locally (or a MongoDB Atlas connection string)
- Two terminal windows (one for backend, one for frontend)

---

## 7. Installation

```bash
git clone <your-repo-url>
cd real-time-chat
```

Then install dependencies for both apps (see sections 9 and 10).

---

## 8. Environment Variables

**backend/.env** (copy from `backend/.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/realtime-chat
CLIENT_URL=http://localhost:5173
```

**frontend/.env** (copy from `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Never commit real `.env` files — they are already excluded in `.gitignore`.

---

## 9. Running Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit values if needed
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## 10. Running Frontend

```bash
cd frontend
npm install
cp .env.example .env   # then edit values if needed
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 11. REST API Documentation

### `GET /api/health`
Returns server status.
```json
{ "success": true, "message": "Server is running" }
```

### `POST /api/messages`
Saves a message to MongoDB.

Request body:
```json
{ "username": "Harsh", "message": "Hello everyone!" }
```

Response `201`:
```json
{
  "success": true,
  "message": {
    "_id": "...",
    "username": "Harsh",
    "message": "Hello everyone!",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### `GET /api/messages?page=1&limit=50`
Returns chat history in chronological order (oldest → newest).

Response `200`:
```json
{
  "success": true,
  "count": 50,
  "total": 132,
  "page": 1,
  "totalPages": 3,
  "messages": [ { "_id": "...", "username": "Harsh", "message": "Hi", "createdAt": "..." } ]
}
```

---

## 12. Socket.io Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `user:join` | client → server | `username` (string) | Registers the connecting socket under a username |
| `user:joined` | server → all clients | `{ username, message, timestamp }` | Broadcast when a user joins |
| `user:left` | server → all clients | `{ username, message, timestamp }` | Broadcast when a user disconnects |
| `message:send` | client → server | `{ message }` (+ ack callback) | Client sends a new chat message |
| `message:receive` | server → all clients | `{ _id, username, message, createdAt }` | Broadcast of a saved message |
| `typing:start` | client ↔ server | — | User started typing (debounced) |
| `typing:stop` | client ↔ server | — | User stopped typing |
| `users:online` | server → all clients | `{ users: string[], count }` | Current online users list |
| `error:message` | server → client | string | Friendly error message for the client |

---

## 13. MongoDB Setup

**Local MongoDB (recommended for development):**

1. Install MongoDB Community Edition for your OS.
2. Start the MongoDB service:
   - macOS (Homebrew): `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
   - Windows: MongoDB runs as a service after installation, or run `mongod` manually.
3. Confirm it's running on `mongodb://127.0.0.1:27017`.
4. The app will automatically create the `realtime-chat` database and `messages` collection on first write.

**MongoDB Atlas (cloud alternative):** create a free cluster, allow your IP, and set `MONGODB_URI` in `backend/.env` to your Atlas connection string.

---

## 14. Testing Real-Time Chat

1. Start the backend (`npm run dev` in `backend/`) and confirm MongoDB is connected in the console.
2. Start the frontend (`npm run dev` in `frontend/`).
3. Open `http://localhost:5173` in **Browser Tab 1**, log in as `Harsh`.
4. Open `http://localhost:5173` in **Browser Tab 2** (or an incognito window), log in as `Rahul`.
5. Send "Hello everyone!" from Harsh's tab — it should appear instantly in Rahul's tab with no refresh.
6. Type in one tab and confirm the other tab shows "`<username>` is typing...".
7. Refresh Rahul's tab — the previous messages should still be there (loaded from MongoDB via `GET /api/messages`).
8. Close one tab and confirm the other shows the "left the chat" notice and an updated online count.

---

## 15. Design Decisions

- **Why Socket.io:** Provides reliable bidirectional, low-latency communication with built-in reconnection handling and room/broadcast primitives — a better fit than raw WebSockets or polling for this use case.
- **Why MongoDB:** Chat messages are naturally schema-light, append-only documents; MongoDB's document model and Mongoose's timestamps make storing and querying them straightforward.
- **Why React:** Component-based architecture maps cleanly onto the chat UI (header, message list, bubbles, input, sidebar) and pairs well with hooks for managing socket state.
- **Message persistence:** Every message received over Socket.io is validated and written to MongoDB *before* being broadcast, guaranteeing the live stream and the persisted history never diverge.
- **User tracking:** Online users are tracked in an in-memory `Map` of `socket.id → username` on the server, rebuilt on each connect/disconnect event — sufficient for a single-instance deployment.
- **Real-time communication:** All real-time interactions (messaging, typing, presence) go exclusively through Socket.io events; REST is used only for initial history loading and health checks.

---

## 16. Assumptions

- Authentication is a simple username entry (no passwords, no accounts, no JWT).
- There is a single global chat room shared by all users.
- Duplicate usernames are allowed (each socket connection is tracked independently); this is a demo-scale simplification.
- MongoDB is used purely for persisting message history, not user accounts.

---

## 17. Future Improvements

- JWT-based authentication and user accounts
- Private (1-to-1) messaging
- Group / multi-room chats
- File and image sharing
- Message reactions (emoji)
- Read receipts
- Message editing and deletion
- Push notifications

---

## Common Errors and Fixes

| Problem | Likely Cause | Fix |
|---|---|---|
| `MongoServerError: connect ECONNREFUSED` | MongoDB isn't running | Start MongoDB locally or check your Atlas URI/IP allowlist |
| Frontend shows "Disconnected" permanently | Backend not running or wrong `VITE_SOCKET_URL` | Confirm backend is up on the port in `.env` and URLs match |
| CORS errors in browser console | `CLIENT_URL` in backend `.env` doesn't match frontend origin | Set `CLIENT_URL=http://localhost:5173` (or your actual frontend URL) |
| Messages don't appear for other tab | Wrong `VITE_SOCKET_URL`, or ad blocker blocking WebSocket | Verify env vars; check browser console/network tab |
| `Cannot find module 'xyz'` | Dependencies not installed | Run `npm install` in the relevant folder |
| History empty after refresh | Backend wasn't running when messages were sent, or wrong `MONGODB_URI` | Confirm messages exist in the `messages` collection via `mongosh` |

---

## Final Requirement Checklist

- [x] Username-based login with validation, stored in `localStorage`
- [x] Real-time messaging via Socket.io (no Firebase/polling)
- [x] Messages persisted to MongoDB and reloaded via REST after refresh
- [x] Message timestamps displayed
- [x] Online users count + sidebar list
- [x] Typing indicators with debounce
- [x] Graceful connection/disconnection handling with reconnection
- [x] REST APIs: health check, send message, get chat history (with pagination)
- [x] Mongoose `Message` model with timestamps
- [x] Clean backend architecture (config/controllers/models/routes/socket/middleware)
- [x] Clean frontend architecture (components/pages/services/hooks/utils)
- [x] Central error middleware on backend; loading/error/empty states on frontend
- [x] `.env.example` files for both apps; real `.env` files git-ignored
- [x] Responsive, modern Tailwind CSS UI
- [x] Complete README with setup, API docs, Socket.io event docs, and testing guide

**Note:** This project has not been deployed to any hosting provider — it is provided as a complete, runnable local project only.
#   r e a l - t i m e - c h a t - a p p l i c a t i o n -  
 