import React, { useState, useEffect } from "react";

export default function RippleButton({ children, onClick, className = "", type = "button", ...props }) {
  const [ripples, setRipples] = useState([]);

  const handleTrigger = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples((prev) => [...prev, newRipple]);
    
    if (onClick) {
      onClick(e);
    }
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timeout = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripples[0].id));
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [ripples]);

  return (
    <button
      type={type}
      onClick={handleTrigger}
      className={`relative overflow-hidden transition-all duration-300 transform active:scale-95 ${className}`}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-gold-400/35 pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            transform: "scale(2.5)",
            animation: "ripple 0.6s ease-out",
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
