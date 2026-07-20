import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import StarryBackground from "./components/StarryBackground";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RegisterMissing from "./pages/RegisterMissing";
import MissingList from "./pages/MissingList";
import FaceSearch from "./pages/FaceSearch";
import Result from "./pages/Result";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen w-full select-none z-10 flex flex-col">
        {/* Persistent, performance-optimized, cursor-reactive starry background */}
        <StarryBackground />

        {/* Global Navigation Header */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full relative z-10">
          <Routes>
            {/* Public Entry Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Secure Investigator Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register-missing"
              element={
                <ProtectedRoute>
                  <RegisterMissing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/missing-list"
              element={
                <ProtectedRoute>
                  <MissingList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/face-search"
              element={
                <ProtectedRoute>
                  <FaceSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
