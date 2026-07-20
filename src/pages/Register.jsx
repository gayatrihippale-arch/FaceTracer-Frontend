import React, { useState } from "react";
import { useNavigate as useNavigateRouter, Link as LinkRouter } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, ShieldCheck, AlertCircle, Eye, CheckCircle2 } from "lucide-react";
import RippleButton from "../components/RippleButton";
import GlassCard from "../components/GlassCard";

export default function Register() {
  const navigate = useNavigateRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Police");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full px-6 py-8 items-center gap-8">
      {/* Left Column: Form */}
      <div className="lg:col-span-5 flex flex-col justify-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="w-full shadow-2xl relative z-10" hover={false}>
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-white mb-2">Create Profile</h2>
              <p className="text-gray-400 text-sm">Register an investigator or administrator account</p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 text-red-200 bg-red-950/40 border border-red-500/30 p-3 rounded-xl text-sm animate-pulse">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 flex items-center gap-2 text-emerald-200 bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Profile created! Redirecting to login...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Officer J. Doe"
                    className="w-full glass-input pl-12 pr-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jdoe@police.gov"
                    className="w-full glass-input pl-12 pr-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 0199"
                    className="w-full glass-input pl-12 pr-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full glass-input pl-12 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full glass-input pl-12 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1">
                  Department Role
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full glass-input pl-12 pr-4 py-2.5 rounded-xl text-sm appearance-none cursor-pointer"
                  >
                    <option value="Police" className="bg-navy-900 text-white">Police Investigator</option>
                    <option value="Admin" className="bg-navy-900 text-white">System Administrator</option>
                  </select>
                </div>
              </div>

              <RippleButton
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold py-3 rounded-xl mt-4 shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
              >
                {loading ? "Registering Credentials..." : "Create Authorization"}
              </RippleButton>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Already have an active credentials profile?{" "}
              <LinkRouter to="/login" className="text-gold-400 font-bold hover:underline">
                Login here
              </LinkRouter>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Right Column: Dynamic Branding */}
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
            Join FaceTracer
          </h2>
          
          <p className="text-gray-300 max-w-md text-base font-light leading-relaxed">
            Create an verified agency profile to register missing person folders, run live face scans, and review investigation matches.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
