import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, FileText, Search, ShieldAlert, ArrowUpRight, CheckCircle2, UserX } from "lucide-react";
import GlassCard from "../components/GlassCard";
import RippleButton from "../components/RippleButton";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            navigate("/login");
            return;
          }
          throw new Error("Failed to load dashboard statistics.");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Synchronizing Secure Database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full text-center border-red-500/20 shadow-red-500/5">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Dashboard Error</h3>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <RippleButton
            onClick={() => window.location.reload()}
            className="w-full bg-red-950/40 border border-red-500/30 text-red-200 py-2.5 rounded-xl font-semibold"
          >
            Retry Connection
          </RippleButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Security Command</h1>
          <p className="text-gray-400 text-sm">Real-time facial catalog indexing and trace auditing.</p>
        </div>
        <div className="flex items-center gap-3">
          <RippleButton
            onClick={() => navigate("/face-search")}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold px-5 py-3 rounded-xl shadow-gold-glow hover:shadow-gold-glow-lg text-sm"
          >
            New Face Query
          </RippleButton>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard glow={false} className="flex items-center gap-5">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-gold-400 rounded-2xl">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Missing Directory</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{stats?.total_missing_persons}</h3>
          </div>
        </GlassCard>

        <GlassCard glow={false} className="flex items-center gap-5">
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl">
            <UserX className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Active Investigations</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{stats?.total_investigation_cases}</h3>
          </div>
        </GlassCard>

        <GlassCard glow={false} className="flex items-center gap-5">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl">
            <Search className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Face Searches Logged</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{stats?.recent_searches_count}</h3>
          </div>
        </GlassCard>
      </div>

      {/* Chart Section */}
      <GlassCard className="w-full" hover={false}>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white">Missing Case Trends</h3>
          <p className="text-gray-400 text-xs">Registered folders grouped by classification status (last 6 months).</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.cases_over_time || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <Tooltip
                contentStyle={{ background: "#0a0e1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }}
              />
              <Area type="monotone" dataKey="Active" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
              <Area type="monotone" dataKey="Resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* History Grid */}
      <GlassCard className="w-full overflow-hidden" hover={false}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Match Scans</h3>
            <p className="text-gray-400 text-xs">Audited trace search logs from mobile captures and library uploads.</p>
          </div>
          <Link
            to="/missing-list"
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
          >
            Browse Directory <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs text-gold-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 font-semibold">Searched Photo</th>
                <th className="py-3 px-4 font-semibold">Scan Date</th>
                <th className="py-3 px-4 font-semibold">Verdict</th>
                <th className="py-3 px-4 font-semibold">Match Score</th>
                <th className="py-3 px-4 font-semibold">Linked Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats?.recent_searches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                    No face searches run yet. Click "New Face Query" above to start.
                  </td>
                </tr>
              ) : (
                stats?.recent_searches.map((search) => (
                  <tr key={search.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={`http://localhost:8000/${search.searched_photo_path}`}
                        alt="Searched Query"
                        className="w-10 h-10 object-cover rounded-lg border border-white/10"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.2)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/%3E%3C/svg%3E";
                        }}
                      />
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-300">
                      {new Date(search.search_date).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {search.match_found ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Match Found
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/25 text-red-400">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          No Match
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {search.confidence_score ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gold-500 h-full rounded-full"
                              style={{ width: `${search.confidence_score}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gold-400">{search.confidence_score}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">0.00%</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {search.matched_person ? (
                        <Link
                          to={`/missing-list?search=${encodeURIComponent(search.matched_person.name)}`}
                          className="text-xs text-gold-400 hover:underline font-semibold"
                        >
                          {search.matched_person.name} (Age {search.matched_person.age})
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
