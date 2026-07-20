import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, Search, FileText, User, LogOut, LayoutDashboard, PlusCircle } from "lucide-react";
import RippleButton from "./RippleButton";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user = null;

  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      // ignore
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 glass-panel border-b border-white/5 shadow-blue-glow">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-gold-glow">
            <Eye className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-yellow-200 to-amber-400 bg-clip-text text-transparent">
            Face<span className="text-gold-500">Tracer</span>
          </span>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-6">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive("/dashboard") ? "text-gold-400" : "text-gray-300 hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/register-missing"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive("/register-missing") ? "text-gold-400" : "text-gray-300 hover:text-white"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                Register Case
              </Link>
              <Link
                to="/missing-list"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive("/missing-list") ? "text-gold-400" : "text-gray-300 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                Missing Directory
              </Link>
              <Link
                to="/face-search"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive("/face-search") ? "text-gold-400" : "text-gray-300 hover:text-white"
                }`}
              >
                <Search className="w-4 h-4" />
                Face Search
              </Link>
              <Link
                to="/profile"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive("/profile") ? "text-gold-400" : "text-gray-300 hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
            </>
          ) : (
            <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Home Features
            </Link>
          )}
        </div>

        {/* Action button */}
        <div className="flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-3">
              {/* User badge */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-white">{user?.name}</span>
                <span className="text-xs text-gold-400 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {user?.role}
                </span>
              </div>
              <RippleButton
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </RippleButton>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-300 hover:text-white px-4 py-2 hover:bg-white/5 rounded-xl transition-all"
              >
                Login
              </Link>
              <RippleButton
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-5 py-2.5 rounded-xl text-sm font-bold shadow-gold-glow hover:shadow-gold-glow-lg text-shadow-none"
              >
                Register
              </RippleButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
