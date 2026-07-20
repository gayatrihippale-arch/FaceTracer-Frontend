import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Mail, Lock, AlertCircle, ShieldAlert } from "lucide-react";
import RippleButton from "../components/RippleButton";
import GlassCard from "../components/GlassCard";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed. Check your inputs.");
      }

      localStorage.setItem("token", data.access_token);

      // Fetch user info with the token
      const meResponse = await fetch("http://localhost:8000/users/me", {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });
      const meData = await meResponse.json();

      localStorage.setItem("user", JSON.stringify(meData));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full px-6 py-8 items-center gap-8">
      {/* Left Column: Login Form */}
      <div className="lg:col-span-5 flex flex-col justify-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="w-full shadow-2xl relative z-10" hover={false}>
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400 text-sm">Please log in to your investigator profile</p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 text-red-200 bg-red-950/40 border border-red-500/30 p-3.5 rounded-xl text-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@police.gov"
                    className="w-full glass-input pl-12 pr-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass-input pl-12 pr-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-gray-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-gold-500 rounded" />
                  Keep me logged in
                </label>
                <Link to="#" className="hover:text-gold-400 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <RippleButton
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold py-3.5 rounded-xl mt-6 shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
              >
                {loading ? "Decrypting Credentials..." : "Access System"}
              </RippleButton>
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
              Don't have an authorization profile?{" "}
              <Link to="/register" className="text-gold-400 font-bold hover:underline">
                Register here
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Right Column: Dynamic Branding Panel */}
      <div className="hidden lg:col-span-7 lg:flex flex-col items-center justify-center relative p-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: [0, -10, 0], opacity: 1 }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut"
            },
            opacity: { duration: 1 }
          }}
          className="text-center z-10 flex flex-col items-center"
        >
          <div className="p-5 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-3xl mb-8 shadow-gold-glow-lg scale-110">
            <Eye className="w-16 h-16 text-black stroke-[2.5]" />
          </div>
          
          <h2 className="text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-yellow-100 to-amber-300 bg-clip-text text-transparent leading-none">
            FaceTracer Security
          </h2>
          
          <p className="text-gray-300 max-w-md text-base font-light leading-relaxed">
            AI-driven instant facial cataloging and search. Secure cryptographic face mapping tailored for public administration and local enforcement.
          </p>

          <div className="flex items-center gap-2 mt-8 text-xs text-gold-400 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            Unauthorized Access is Strictly Monitored
          </div>
        </motion.div>
      </div>
    </div>
  );
}
