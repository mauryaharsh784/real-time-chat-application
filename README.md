# 💬 Real-Time Chat Application

A full-stack **real-time chat application** built with **React, Node.js, Express, Socket.io, and MongoDB**.

Users can join the chat using a username, send and receive messages instantly, see currently online users, view typing indicators, and access persistent chat history even after refreshing the page or restarting the backend.

---

## 🚀 Features

- 🔐 Username-based login
- 💬 Real-time messaging with Socket.io
- 🗄️ Persistent message storage with MongoDB
- 👥 Live online users list and count
- 🟢 User joined / left notifications
- ✍️ Real-time typing indicators
- 🔄 Automatic Socket.io reconnection
- 📡 Connection status indicator
- 🕒 Message timestamps
- 📄 Paginated chat history
- 🎨 Responsive UI with Tailwind CSS
- ⚡ REST API for chat history and health checks
- 🛡️ Centralized error handling
- 🧩 Clean and modular frontend/backend architecture
- 💾 Username persistence using `localStorage`

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS
- Axios
- Socket.io Client
- React Router

### Backend

- Node.js
- Express.js
- Socket.io
- MongoDB
- Mongoose
- dotenv
- CORS

---

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │    React + Vite     │
                    │     Frontend        │
                    └─────────┬───────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
          REST API (Axios)         WebSocket (Socket.io)
                 │                         │
                 ▼                         ▼
        ┌────────────────┐       ┌──────────────────┐
        │ Express Server │◄─────►│ Socket.io Server │
        └────────┬───────┘       └────────┬─────────┘
                 │                        │
                 └────────────┬───────────┘
                              ▼
                     ┌─────────────────┐
                     │ MongoDB +       │
                     │ Mongoose        │
                     └─────────────────┘
```

### Message Flow

```text
User
  ↓
React UI
  ↓
Socket.io Client
  ↓
Socket.io Server
  ↓
Validate Message
  ↓
Save to MongoDB
  ↓
Broadcast Message
  ↓
All Connected Users
```

Every message sent through Socket.io is validated and stored in MongoDB **before being broadcast**, keeping real-time messages and persisted chat history synchronized.

---

## 📁 Project Structure

```text
real-time-chat/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── OnlineUsers.jsx
│   │   │   └── TypingIndicator.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Chat.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   │
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   │
│   │   ├── utils/
│   │   │   └── formatTime.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   └── messageController.js
│   │   │
│   │   ├── models/
│   │   │   └── Message.js
│   │   │
│   │   ├── routes/
│   │   │   └── messageRoutes.js
│   │   │
│   │   ├── socket/
│   │   │   └── socketHandler.js
│   │   │
│   │   ├── middleware/
│   │   │   └── errorMiddleware.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Before running the project, make sure you have:

- **Node.js v18+**
- **npm**
- **MongoDB** running locally

You can also use **MongoDB Atlas** instead of a local MongoDB installation.

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/mauryaharsh784/real-time-chat-application.git
cd real-time-chat-application
```

The project contains two applications:

```text
frontend/
backend/
```

Install dependencies separately for both.

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

### Backend Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/realtime-chat
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend API:

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

> **Windows users:** If `cp` doesn't work in PowerShell, copy `.env.example` manually and rename the copy to `.env`.

---

# 🗄️ MongoDB Setup

## Local MongoDB

Make sure MongoDB is running on:

```text
mongodb://127.0.0.1:27017
```

The application automatically creates:

```text
Database: realtime-chat
Collection: messages
```

when the first message is stored.

## MongoDB Atlas

Alternatively, you can use MongoDB Atlas.

Update:

```env
MONGODB_URI=your-mongodb-atlas-connection-string
```

inside:

```text
backend/.env
```

---

# 📡 REST API

## Health Check

### `GET /api/health`

Returns the server status.

Response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Send Message

### `POST /api/messages`

Saves a message to MongoDB.

Request:

```json
{
  "username": "Harsh",
  "message": "Hello everyone!"
}
```

Response:

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

---

## Get Chat History

### `GET /api/messages?page=1&limit=50`

Returns paginated chat history in chronological order.

Example response:

```json
{
  "success": true,
  "count": 50,
  "total": 132,
  "page": 1,
  "totalPages": 3,
  "messages": [
    {
      "_id": "...",
      "username": "Harsh",
      "message": "Hi",
      "createdAt": "..."
    }
  ]
}
```

---

# 🔌 Socket.io Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `user:join` | Client → Server | `username` | Registers a user |
| `user:joined` | Server → Clients | `{ username, message, timestamp }` | User joined notification |
| `user:left` | Server → Clients | `{ username, message, timestamp }` | User left notification |
| `message:send` | Client → Server | `{ message }` | Sends a message |
| `message:receive` | Server → Clients | `{ _id, username, message, createdAt }` | Receives a saved message |
| `typing:start` | Client ↔ Server | — | User started typing |
| `typing:stop` | Client ↔ Server | — | User stopped typing |
| `users:online` | Server → Clients | `{ users, count }` | Online users |
| `error:message` | Server → Client | `string` | Error notification |

---

# 🧪 Testing the Application

Follow these steps to test real-time functionality.

### 1. Start MongoDB

Make sure MongoDB is running.

### 2. Start Backend

```bash
cd backend
npm run dev
```

### 3. Start Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

### 4. Open the Application

Open:

```text
http://localhost:5173
```

### 5. Test Multiple Users

Open the application in two browser tabs.

**Tab 1:**

```text
Username: Harsh
```

**Tab 2:**

```text
Username: Rahul
```

### 6. Test Messaging

Send:

```text
Hello everyone!
```

The message should appear instantly in both tabs without refreshing.

### 7. Test Typing Indicator

Start typing in one tab.

The other tab should display:

```text
Harsh is typing...
```

### 8. Test Persistence

Refresh the page.

Previous messages should still be available because they are stored in MongoDB.

### 9. Test Online Presence

Close one browser tab.

The other user should receive a **user left** notification and the online count should update.

---

# 🧠 Design Decisions

### Why Socket.io?

Socket.io provides:

- Low-latency communication
- Automatic reconnection
- Event-based communication
- Broadcasting
- Reliable real-time updates

It is a good fit for real-time chat functionality.

### Why MongoDB?

Chat messages are naturally represented as documents, making MongoDB a suitable choice for storing message history.

Mongoose also provides:

- Schema validation
- Timestamps
- Easy MongoDB integration

### Why React?

React's component-based architecture makes it easy to separate the chat interface into reusable components such as:

- Message list
- Message bubble
- Chat header
- Message input
- Online users
- Typing indicator

---

# 🔐 Authentication & User Tracking

This project intentionally uses simple username-based authentication.

There are currently:

- No passwords
- No user accounts
- No JWT authentication

Usernames are stored in:

```text
localStorage
```

Online users are tracked on the backend using:

```text
Map<socket.id, username>
```

This approach is suitable for a demo/single-instance application.

---

# ⚠️ Assumptions

- Single global chat room
- Username-based login
- Duplicate usernames are allowed
- No user account system
- MongoDB is used only for message persistence
- Online user tracking is stored in server memory

---

# 🐛 Common Errors & Fixes

| Problem | Possible Cause | Solution |
|---|---|---|
| `ECONNREFUSED` | MongoDB isn't running | Start MongoDB |
| Frontend shows `Disconnected` | Backend isn't running | Start backend server |
| CORS error | Incorrect `CLIENT_URL` | Check backend `.env` |
| Messages don't appear | Incorrect Socket.io URL | Check `VITE_SOCKET_URL` |
| `Cannot find module` | Dependencies missing | Run `npm install` |
| History is empty | Incorrect MongoDB URI | Check `MONGODB_URI` |

---

# 🔮 Future Improvements

- 🔐 JWT authentication
- 👤 User accounts and profiles
- 💬 Private 1-to-1 messaging
- 👥 Group chats
- 🖼️ Image and file sharing
- ❤️ Message reactions
- ✅ Read receipts
- ✏️ Message editing
- 🗑️ Message deletion
- 🔔 Push notifications
- 🌐 Production deployment

---

# 📋 Project Checklist

- [x] Username-based login
- [x] LocalStorage username persistence
- [x] Real-time messaging
- [x] Socket.io integration
- [x] MongoDB message persistence
- [x] Chat history
- [x] Online users
- [x] User joined/left notifications
- [x] Typing indicators
- [x] Connection status
- [x] Automatic reconnection
- [x] REST API
- [x] API pagination
- [x] Mongoose timestamps
- [x] Centralized error handling
- [x] Responsive UI
- [x] Tailwind CSS
- [x] Modular project structure

---

# 📸 Screenshots

> Add screenshots of your application here.

Example:

```text
screenshots/
├── login.png
├── chat.png
├── online-users.png
└── typing-indicator.png
```

You can later add them using:

```markdown
![Login Screen](screenshots/login.png)

![Chat Interface](screenshots/chat.png)
```

---

# 🌐 Repository

**GitHub:**  
https://github.com/mauryaharsh784/real-time-chat-application

---

# 👨‍💻 Author

**Harsh Vardhan Maurya**

- GitHub: https://github.com/mauryaharsh784
- LinkedIn: https://www.linkedin.com/in/harsh-vardhan-maurya/

---

## 📄 License

This project is created for learning and demonstration purposes.

---

⭐ If you found this project useful, consider giving it a **star** on GitHub.

> **Note:** This project is currently configured as a local runnable application and has not been deployed to a production hosting provider.