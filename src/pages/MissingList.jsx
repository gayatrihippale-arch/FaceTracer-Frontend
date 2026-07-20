import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Calendar, User, Eye, CheckCircle2, AlertTriangle, ShieldCheck, Filter } from "lucide-react";
import GlassCard from "../components/GlassCard";
import RippleButton from "../components/RippleButton";

export default function MissingList() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");

  const fetchList = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    
    // Construct Query Params
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (gender) params.append("gender", gender);
    if (status) params.append("status", status);
    if (ageMin) params.append("age_min", ageMin);
    if (ageMax) params.append("age_max", ageMax);

    try {
      const response = await fetch(`http://localhost:8000/missing-persons?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error("Failed to load missing directory.");
      }

      const data = await response.json();
      setPersons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [gender, status, ageMin, ageMax]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchList();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Resolved" : "Active";
    const token = localStorage.getItem("token");
    
    const formData = new FormData();
    formData.append("status", nextStatus);

    try {
      const response = await fetch(`http://localhost:8000/missing-persons/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        // Refresh local state
        setPersons((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Missing Case Directory</h1>
          <p className="text-gray-400 text-sm">Browse, filter, and modify profiles registered inside FaceTracer.</p>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <GlassCard hover={false} className="p-5">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject by name or location keywords..."
                className="w-full glass-input pl-12 pr-4 py-3 rounded-xl text-sm"
              />
            </div>
            
            {/* Gender Filter */}
            <div className="md:col-span-3">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-xl text-sm cursor-pointer appearance-none bg-navy-950"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-xl text-sm cursor-pointer appearance-none bg-navy-950"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active Cases</option>
                <option value="Resolved">Resolved Cases</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                Age Bounds
              </span>
              <input
                type="number"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
                placeholder="Min"
                className="w-16 glass-input px-2.5 py-1.5 rounded-lg text-xs text-center"
              />
              <span className="text-xs text-gray-500">—</span>
              <input
                type="number"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
                placeholder="Max"
                className="w-16 glass-input px-2.5 py-1.5 rounded-lg text-xs text-center"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setGender("");
                  setStatus("");
                  setAgeMin("");
                  setAgeMax("");
                }}
                className="text-xs font-bold text-gray-400 hover:text-white px-4 py-2 hover:bg-white/5 rounded-xl transition-all"
              >
                Reset Filters
              </button>
              <RippleButton
                type="submit"
                className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold px-6 py-2 rounded-xl text-xs"
              >
                Run Search Query
              </RippleButton>
            </div>
          </div>
        </form>
      </GlassCard>

      {/* Directory Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-400 text-sm">Querying matching records...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-200 text-sm font-semibold">{error}</p>
        </div>
      ) : persons.length === 0 ? (
        <div className="py-20 text-center bg-white/[0.01] border border-white/5 rounded-2xl">
          <p className="text-gray-500 text-sm">No matching case folders found in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {persons.map((person) => (
            <GlassCard key={person.id} className="flex flex-col h-full overflow-hidden p-0" hover={true}>
              {/* Photo header */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-950 border-b border-white/5">
                <img
                  src={`http://localhost:8000/${person.photo_path}`}
                  alt={person.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.2)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/%3E%3C/svg%3E";
                  }}
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {person.status === "Active" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 backdrop-blur">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 backdrop-blur">
                      Resolved
                    </span>
                  )}
                </div>
              </div>

              {/* Description Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white leading-tight truncate">{person.name}</h3>
                    <span className="text-xs text-gold-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10">
                      Age {person.age}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-gray-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      <span>{person.gender}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span className="truncate">{person.last_seen_location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>{new Date(person.last_seen_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {person.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 pt-1 font-light leading-relaxed">
                      {person.description}
                    </p>
                  )}
                </div>

                {/* Status Toggler */}
                <button
                  onClick={() => handleToggleStatus(person.id, person.status)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    person.status === "Active"
                      ? "bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/30 text-emerald-300"
                      : "bg-red-950/40 hover:bg-red-900/60 border-red-500/30 text-red-300"
                  }`}
                >
                  {person.status === "Active" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Resolved
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      Reopen Case
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
