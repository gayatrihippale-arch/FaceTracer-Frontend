import React from "react";

export default function GlassCard({ children, className = "", hover = true, glow = false }) {
  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-500 ${
        glow ? "glass-panel-glow" : "glass-panel"
      } ${
        hover ? "hover:border-gold-500/40 hover:shadow-gold-glow/10 hover:scale-[1.01]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
