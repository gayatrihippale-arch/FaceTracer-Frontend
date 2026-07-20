import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, Search, Camera, Cpu } from "lucide-react";
import RippleButton from "../components/RippleButton";
import GlassCard from "../components/GlassCard";

export default function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleGetStarted = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto text-center z-10 py-16 flex flex-col items-center"
      >
        {/* Glow Element */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-gold-400 text-sm font-semibold mb-6 uppercase tracking-wider"
        >
          <Cpu className="w-4 h-4 animate-pulse" />
          AI-Powered Facial Identification
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-none"
        >
          Reconnecting Lives with
          <br />
          <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
            Facial Recognition Tech
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed font-light"
        >
          FaceTracer provides law enforcement and administration with instant, secure, and accurate matching tools to search, track, and identify missing persons.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-16">
          <RippleButton
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-lg font-bold px-8 py-4 rounded-xl shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
          >
            Get Started
          </RippleButton>
          <button
            onClick={() => navigate("/register")}
            className="bg-white/5 border border-white/10 hover:border-white/20 text-white text-lg font-semibold px-8 py-4 rounded-xl backdrop-blur transition-all"
          >
            Create Police Account
          </button>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          <motion.div variants={itemVariants}>
            <GlassCard className="h-full text-left" glow={false}>
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-gold-400 flex items-center justify-center rounded-xl mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Camera Scans</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Take a rapid photo from any active laptop webcam or mobile browser to analyze key faces in real time.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="h-full text-left" glow={false}>
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-gold-400 flex items-center justify-center rounded-xl mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Vector Query</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Matches cropped faces against high-accuracy deep learning embeddings stored directly inside the system.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="h-full text-left" glow={false}>
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-gold-400 flex items-center justify-center rounded-xl mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Police & Admin Grade</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Equipped with JWT authorization, role scopes, and log audits to guarantee secure investigation profiles.
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
