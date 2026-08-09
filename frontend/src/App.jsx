import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Chat from "./pages/Chat.jsx";

function App() {
  const username = localStorage.getItem("chat_username");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={username ? <Navigate to="/chat" replace /> : <Login />}
        />
        <Route
          path="/chat"
          element={username ? <Chat /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
