import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowLeft, User, MapPin, Calendar, FileText } from "lucide-react";
import GlassCard from "../components/GlassCard";
import RippleButton from "../components/RippleButton";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchRecord } = location.state || {};

  if (!searchRecord) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Search Loaded</h3>
          <p className="text-gray-400 text-sm mb-6">No matching query data has been loaded. Please run a face search scan first.</p>
          <RippleButton
            onClick={() => navigate("/face-search")}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold py-2.5 rounded-xl text-sm"
          >
            Go to Face Search
          </RippleButton>
        </GlassCard>
      </div>
    );
  }

  const { match_found, confidence_score, matched_person, searched_photo_path } = searchRecord;

  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/face-search")}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Biometric Scan Outcome</h1>
          <p className="text-gray-400 text-sm">Face compare algorithm diagnostic outcome.</p>
        </div>
      </div>

      {/* Match Status Banner */}
      <div
        className={`w-full p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-500 ${match_found
          ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
          : "bg-red-950/20 border-red-500/30 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
          }`}
      >
        <div className="flex items-start gap-4">
          <div className="mt-1">
            {match_found ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-10 h-10 text-red-400 shrink-0" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white leading-tight">
              {match_found ? "Identity Match Confirmed" : "No Identity Match Found"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {match_found
                ? "A highly corresponding profile was matched in the active missing records directory."
                : "The scanned subject is not matching any active entries above the strict matching threshold."}
            </p>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="flex flex-col items-start md:items-end gap-1.5 min-w-[140px]">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Confidence Level</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-black ${match_found ? "text-emerald-400" : "text-red-400"}`}>
              {confidence_score ? `${confidence_score}%` : "0.00%"}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${match_found ? "bg-emerald-400" : "bg-red-400"}`}
              style={{ width: `${confidence_score || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Searched Query Image */}
        <GlassCard hover={false} className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Scanned Query Target</h3>
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-navy-950 border border-white/5 shadow-inner">
            <img
              src={`${import.meta.env.VITE_API_URL}/${searched_photo_path}`}
              alt="Query Target"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.2)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/%3E%3C/svg%3E";
              }}
            />
          </div>
        </GlassCard>

        {/* Database Match Image & Data */}
        <GlassCard hover={false} className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Matched Profile Folder</h3>

          {match_found && matched_person ? (
            <div className="flex-1 flex flex-col justify-between gap-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-navy-950 border border-white/5 shadow-inner">
                <img
                  src={`${import.meta.env.VITE_API_URL}/${matched_person.photo_path}`}
                  alt="Matched Directory Portrait"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.2)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-center text-gray-500 bg-white/[0.01]">
              <XCircle className="w-10 h-10 text-gray-600 mb-2" />
              <p className="text-sm">No corresponding database entry to preview.</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Subject Information Details */}
      {match_found && matched_person && (
        <GlassCard hover={false} className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-xl font-bold text-white">Folder Metadata: {matched_person.name}</h3>
            <p className="text-gray-400 text-xs mt-0.5">Biometric profile registry folder details.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Classification Details</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-white pt-1">
                <User className="w-4 h-4 text-gold-500 shrink-0" />
                <span>{matched_person.gender}, Age {matched_person.age}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Last Tracked Location</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-white pt-1">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                <span>{matched_person.last_seen_location}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Last Seen Date</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-white pt-1">
                <Calendar className="w-4 h-4 text-gold-500 shrink-0" />
                <span>{new Date(matched_person.last_seen_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {matched_person.description && (
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                Physical Description / Folders Notes
              </span>
              <p className="text-sm text-gray-300 font-light leading-relaxed whitespace-pre-line bg-white/[0.01] p-4 rounded-xl border border-white/5">
                {matched_person.description}
              </p>
            </div>
          )}
        </GlassCard>
      )}

      {/* Operations Panel */}
      <div className="flex gap-4">
        <RippleButton
          onClick={() => navigate("/face-search")}
          className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold px-6 py-3 rounded-xl text-sm hover:shadow-lg transition-all"
        >
          New Scan Scan
        </RippleButton>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold px-6 py-3 rounded-xl text-sm transition-all"
        >
          Back to Command Panel
        </button>
      </div>
    </div>
  );
}
