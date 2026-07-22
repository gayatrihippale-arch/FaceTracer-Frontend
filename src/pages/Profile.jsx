import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Lock, Shield, CheckCircle2, AlertTriangle, LogOut } from "lucide-react";
import RippleButton from "../components/RippleButton";
import GlassCard from "../components/GlassCard";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Edit states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    try {
      const u = JSON.parse(userStr);
      setUser(u);
      setName(u.name || "");
      setPhone(u.phone || "");
      setRole(u.role || "Police");
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");
    const updateData = { name, phone, role };
    if (password !== "") {
      updateData.password = password;
    }

    try {
      const response = await fetch("${import.meta.env.VITE_API_URL}/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update profile folder.");
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Investigator Profile</h1>
        <p className="text-gray-400 text-sm">Review your security clearance, department credentials, and modify settings.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-200 bg-red-950/40 border border-red-500/30 p-4 rounded-xl text-sm animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-emerald-200 bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Investigator credentials updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Summary Card */}
        <div className="md:col-span-4 space-y-4">
          <GlassCard hover={false} className="text-center p-6 space-y-4">
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-gold-glow">
              <User className="w-10 h-10 text-black stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white leading-tight">{user?.name}</h3>
              <p className="text-gray-400 text-xs mt-1">{user?.email}</p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-gold-400 text-xs font-bold uppercase tracking-wider mx-auto">
              <Shield className="w-3.5 h-3.5" />
              {user?.role} Officer
            </div>

            <div className="border-t border-white/5 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-red-950/30 hover:bg-red-950/50 border border-red-500/20 text-red-400 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out Credentials
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Form Edit */}
        <div className="md:col-span-8">
          <GlassCard hover={false}>
            <h3 className="text-lg font-bold text-white mb-6">Modify Settings</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
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
                  <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                    Department Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 0100"
                      className="w-full glass-input pl-12 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                  Clearance Email (Read Only)
                </label>
                <div className="relative opacity-60">
                  <Mail className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full glass-input pl-12 pr-4 py-2.5 rounded-xl text-sm bg-navy-950/60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                    New Security Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full glass-input pl-12 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                    Verify New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full glass-input pl-12 pr-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <RippleButton
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold py-3 rounded-xl shadow-gold-glow hover:shadow-gold-glow-lg text-sm"
                >
                  {loading ? "Re-authorizing Profile..." : "Save Profile Settings"}
                </RippleButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
