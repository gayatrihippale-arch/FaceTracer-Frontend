import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, X, Search, ShieldAlert, Video, RefreshCw } from "lucide-react";
import RippleButton from "../components/RippleButton";
import GlassCard from "../components/GlassCard";

export default function FaceSearch() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("upload"); // upload / webcam

  // File upload state
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Webcam state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [webcamCaptured, setWebcamCaptured] = useState(false);
  const [cameraError, setCameraError] = useState("");

  // Scan states
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  // Initialize webcam stream
  const startWebcam = async () => {
    setCameraError("");
    setWebcamCaptured(false);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setCameraError("Camera access denied or device not found.");
      setMode("upload");
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (mode === "webcam") {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => stopWebcam();
  }, [mode]);

  // Capture Snapshot
  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      // Mirror the webcam image for user convenience
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Reset transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      canvas.toBlob((blob) => {
        const capturedFile = new File([blob], "snapshot.jpg", { type: "image/jpeg" });
        setFile(capturedFile);
        setPreview(URL.createObjectURL(capturedFile));
        setWebcamCaptured(true);
        stopWebcam();
      }, "image/jpeg");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const resetSearch = () => {
    setFile(null);
    setPreview(null);
    setWebcamCaptured(false);
    setError("");
    if (mode === "webcam") {
      startWebcam();
    }
  };

  const handleSearchSubmit = async () => {
    if (!file) {
      setError("Please capture or upload an image to scan.");
      return;
    }

    setScanning(true);
    setError("");

    const formData = new FormData();
    formData.append("photo", file);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/face-search`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Face recognition scan failed.");
      }

      // Snappy redirect delay to let scanning animation execute
      setTimeout(() => {
        navigate("/result", { state: { searchRecord: data } });
      }, 1500);
    } catch (err) {
      setError(err.message);
      setScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Biometric Face Search</h1>
        <p className="text-gray-400 text-sm">Upload a catalog image or capture a live webcam shot to query the missing person directory.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-200 bg-red-950/40 border border-red-500/30 p-4 rounded-xl text-sm">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {cameraError && (
        <div className="flex items-center gap-2 text-amber-200 bg-amber-950/40 border border-amber-500/30 p-4 rounded-xl text-sm">
          <ShieldAlert className="w-5 h-5 text-gold-400 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Mode Selectors */}
      <div className="flex gap-4">
        <button
          onClick={() => setMode("upload")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${mode === "upload"
              ? "bg-amber-500/10 border-amber-500/30 text-gold-400"
              : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
            }`}
        >
          <Upload className="w-4 h-4" />
          Upload Image File
        </button>
        <button
          onClick={() => setMode("webcam")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${mode === "webcam"
              ? "bg-amber-500/10 border-amber-500/30 text-gold-400"
              : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
            }`}
        >
          <Video className="w-4 h-4" />
          Use Live Webcam
        </button>
      </div>

      {/* Search Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        {/* Scanner Viewport */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <GlassCard className="relative p-0 aspect-[4/3] w-full overflow-hidden border border-white/10 flex items-center justify-center bg-navy-950/50" hover={false}>
            {/* Holographic Laser Scan Line */}
            {scanning && (
              <div className="absolute left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_#f59e0b] z-20 animate-laser pointer-events-none" />
            )}

            {/* Webcam Live Stream */}
            {mode === "webcam" && !webcamCaptured && (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />

                {/* Targeting HUD overlay */}
                <div className="absolute inset-8 border border-dashed border-amber-500/25 pointer-events-none rounded-xl flex items-center justify-center">
                  <div className="w-48 h-48 border border-amber-500/30 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-gold-500 absolute top-0 left-0" />
                    <div className="w-4 h-4 border-t-2 border-r-2 border-gold-500 absolute top-0 right-0" />
                    <div className="w-4 h-4 border-b-2 border-l-2 border-gold-500 absolute bottom-0 left-0" />
                    <div className="w-4 h-4 border-b-2 border-r-2 border-gold-500 absolute bottom-0 right-0" />
                  </div>
                </div>
              </div>
            )}

            {/* Captured / Uploaded Image View */}
            {preview && (
              <img
                src={preview}
                alt="Search query"
                className="w-full h-full object-cover"
              />
            )}

            {/* Empty view for upload mode */}
            {mode === "upload" && !preview && (
              <div className="flex flex-col items-center p-6 text-center">
                <Upload className="w-10 h-10 text-gold-400 mb-3" />
                <p className="text-sm font-semibold text-white mb-1">Upload query photo</p>
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all mt-3">
                  Browse Device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </GlassCard>

          {/* Hidden snapshot canvas */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <GlassCard className="h-full flex flex-col justify-between" hover={false}>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Biometric Scan Command</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Our artificial intelligence matching core will crop the query faces, normalize lightning features, generate feature weights, and scan matches.
              </p>

              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Scan Pipeline:</span>
                  <span className="text-gold-400 uppercase tracking-wider">OpenCV DNN SF-NET</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Search Mode:</span>
                  <span className="text-white capitalize">{mode}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              {mode === "webcam" && !webcamCaptured && (
                <RippleButton
                  onClick={captureSnapshot}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold py-3.5 rounded-xl shadow-gold-glow hover:shadow-gold-glow-lg text-sm flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5 stroke-[2.5]" />
                  Capture Snapshot
                </RippleButton>
              )}

              {preview && (
                <div className="flex flex-col gap-2">
                  <RippleButton
                    onClick={handleSearchSubmit}
                    disabled={scanning}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold py-3.5 rounded-xl shadow-gold-glow hover:shadow-gold-glow-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5 stroke-[2.5]" />
                    {scanning ? "Searching Database..." : "Execute Search Query"}
                  </RippleButton>
                  <button
                    onClick={resetSearch}
                    disabled={scanning}
                    className="w-full border border-white/10 hover:bg-white/5 text-gray-300 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset & Retake
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Adding laser scan CSS directly as style block for fast integration */}
      <style>{`
        @keyframes laser {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        .animate-laser {
          animation: laser 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
