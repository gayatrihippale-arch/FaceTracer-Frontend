import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, MapPin, Calendar, User, Eye, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import RippleButton from "../components/RippleButton";
import GlassCard from "../components/GlassCard";

export default function RegisterMissing() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!photo) {
      setError("Please upload a portrait photo for facial analysis.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("last_seen_location", location);
    formData.append("last_seen_date", date);
    formData.append("description", description);
    formData.append("status", "Active");
    formData.append("photo", photo);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8000/missing-persons", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit folder.");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/missing-list");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Register Missing Case</h1>
        <p className="text-gray-400 text-sm">Submit case details and a portrait photo to extract biometric vectors.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-200 bg-red-950/40 border border-red-500/30 p-4 rounded-xl text-sm">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-emerald-200 bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Case folder created and biometric face map stored! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Photo Upload */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider">
            Biometric Photo Upload
          </label>
          
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all ${
              photoPreview
                ? "border-amber-500/40 bg-amber-500/5"
                : "border-white/10 hover:border-amber-500/30 bg-white/[0.02]"
            }`}
            style={{ minHeight: "260px" }}
          >
            {photoPreview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={photoPreview}
                  alt="Preview portrait"
                  className="max-h-[220px] rounded-xl object-cover border border-white/10 shadow-lg"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-white/5 rounded-2xl mb-4 border border-white/5">
                  <Upload className="w-8 h-8 text-gold-400" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">Drag and drop file here</p>
                <p className="text-xs text-gray-400 mb-4">or browse from local system (JPG, PNG)</p>
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-xs font-semibold transition-all">
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-400 bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
            <Info className="w-4.5 h-4.5 text-gold-500 shrink-0 mt-0.5" />
            <p>Ensure the portrait has clear lighting, face facing forward, and contains no other subjects for precision alignment.</p>
          </div>
        </div>

        {/* Right Side: Text Fields */}
        <div className="md:col-span-7">
          <GlassCard hover={false} className="space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                    Subject Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Johnathan Smith"
                      className="w-full glass-input pl-12 pr-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 24"
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm cursor-pointer appearance-none bg-navy-950"
                  >
                    <option value="Male" className="bg-navy-900">Male</option>
                    <option value="Female" className="bg-navy-900">Female</option>
                    <option value="Other" className="bg-navy-900">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                    Last Seen Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full glass-input pl-12 pr-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                  Last Seen Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Central Station, Platform 3"
                    className="w-full glass-input pl-12 pr-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                  Folder Notes / Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include clothing details, mental physical conditions, height, scars, etc."
                  className="w-full glass-input px-4 py-3 rounded-xl text-sm resize-none"
                />
              </div>
            </div>

            <RippleButton
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold py-3.5 rounded-xl shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
            >
              {loading ? "Aligning Facial Biometrics..." : "Save Case Folder"}
            </RippleButton>
          </GlassCard>
        </div>
      </form>
    </div>
  );
}
