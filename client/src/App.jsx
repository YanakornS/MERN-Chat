import "./App.css";
import SignIn from "./components/SignIn";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Navigate } from "react-router";
import { Loader } from "lucide-react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth && authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
          Route
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
          Route
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
          Route
        />
        <Route path="/setting" element={<Setting />} Route />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
          Route
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
