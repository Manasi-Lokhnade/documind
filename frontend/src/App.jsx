import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

function App() {

  return (
    <Routes>

      {/* Landing Page */}
      <Route
        path="/"
        element={<Landing />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* Chat */}
      <Route
        path="/chat/:id"
        element={<Chat />}
      />

    </Routes>
  );
}

export default App;