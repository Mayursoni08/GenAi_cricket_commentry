import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Zap, Shield, Rocket, Lock, Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import UploadBox from './components/UploadBox';
import VideoPreview from './components/VideoPreview';
import CommentaryCard from './components/CommentaryCard';
import LoadingSpinner from './components/LoadingSpinner';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentary, setCommentary] = useState("No commentary generated.");
  const [error, setError] = useState(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setError(null);
    setCommentary("No commentary generated.");
    setProcessedVideoUrl(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
    setCommentary("No commentary generated.");
    setProcessedVideoUrl(null);
  };

  const handleGenerateCommentary = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setCommentary("No commentary generated.");
    setProcessedVideoUrl(null);

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        setCommentary(response.data.commentary);
        if (response.data.video_url) {
          setProcessedVideoUrl(`${API_BASE_URL}${response.data.video_url}`);
        }
      } else {
        throw new Error("Invalid response received from backend");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || err.message || "Failed to connect to the backend server.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for hero text
  const heroVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F0] text-sports-navy flex flex-col font-sans relative selection:bg-sports-orange/20 selection:text-sports-navy scroll-smooth">
      {/* Navbar Header */}
      <Navbar />

      {/* 1. HERO SECTION (Unified 80vh Upload Fold) */}
      <section
        id="home"
        className="min-h-[85vh] w-full relative flex items-center justify-center bg-cover bg-center bg-no-repeat pt-28 pb-16 z-10"
        style={{ backgroundImage: "url('/stadium-bg.png')" }}
      >
        {/* Stadium Background Opacity Overlay (25% light cream) */}
        <div className="absolute inset-0 bg-[#FFF7F0] opacity-25 z-0" />

        {/* Centered Main Core Container */}
        <div className="max-w-3xl w-full mx-auto px-6 relative z-10 flex flex-col items-center space-y-6">
          
          <motion.div 
            className="text-center flex flex-col items-center space-y-3"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            {/* AI badge */}
            <div className="inline-flex items-center space-x-2 bg-sports-deepOrange/10 border border-sports-deepOrange/15 px-3 py-1 rounded-full w-fit">
              <Sparkles className="w-4.5 h-4.5 text-sports-deepOrange" />
              <span className="text-[10px] font-black uppercase tracking-wider text-sports-deepOrange font-sans">
                AI Commentary Engine
              </span>
            </div>

            {/* Title (Bodoni Moda Heading) */}
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-sports-navy font-serif leading-tight select-none">
              Cricket AI Commentary
            </h1>

            {/* Subtitle (Poppins) */}
            <p className="text-sm md:text-base text-sports-navy/75 max-w-xl font-medium leading-relaxed font-sans">
              Transform cricket videos into realistic AI-powered live commentary.
            </p>
          </motion.div>

          {/* DYNAMIC UPLOAD WORKFLOW CARD (Directly below subtitle, visible immediately) */}
          <motion.div 
            className="w-full max-w-2xl mt-2 text-left"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Show uploader OR video player preview card */}
            {!selectedFile ? (
              <UploadBox onFileSelected={handleFileSelected} />
            ) : (
              <VideoPreview file={selectedFile} onClear={handleClear} />
            )}
          </motion.div>

          {/* Action Trigger Button, Loaders, Output Details */}
          <div className="w-full max-w-2xl space-y-5">
            {/* Generate button (Only if file is selected) */}
            {selectedFile && !loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center"
              >
                <button
                  type="button"
                  className="w-full py-4 px-8 bg-gradient-to-r from-sports-orange via-sports-deepOrange to-sports-red hover:from-sports-deepOrange hover:via-sports-red hover:to-red-600 text-white font-black text-base rounded-2xl shadow-lg shadow-sports-deepOrange/20 hover:shadow-[0_0_30px_rgba(255,107,53,0.35)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center font-sans"
                  onClick={handleGenerateCommentary}
                >
                  <svg viewBox="0 0 32 32" className="w-5 h-5 mr-3 animate-spin" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" fill="#FFFFFF" opacity="0.2" />
                    <circle cx="16" cy="16" r="14" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="14 10" />
                    <circle cx="12" cy="12" r="3.5" fill="#FFF" />
                  </svg>
                  <span>Generate Commentary</span>
                </button>
              </motion.div>
            )}

            {/* Error notifications */}
            {error && (
              <div className="bg-sports-red/10 border border-sports-red/20 text-sports-red p-4 rounded-2xl text-sm font-semibold flex items-start gap-3 shadow-sm font-sans">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <div>
                  <span className="font-bold">Error:</span> {error}
                </div>
              </div>
            )}

            {/* Spinning Loader */}
            {loading && (
              <div className="bg-white/45 backdrop-blur-md border border-sports-orange/15 rounded-3xl p-6 shadow-premium font-sans">
                <LoadingSpinner message="Generating match commentary..." />
              </div>
            )}

            {/* Processed Video Card */}
            {processedVideoUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/50 backdrop-blur-md border border-sports-orange/15 rounded-3xl p-6 shadow-premium flex flex-col space-y-4 text-left font-sans"
              >
                <div className="flex items-center justify-between border-b border-sports-orange/10 pb-3">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-sports-navy flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sports-orange animate-pulse" />
                    Processed Video Output
                  </h3>
                  <span className="text-[10px] font-bold text-sports-navy/70 px-2.5 py-1 bg-white border border-sports-orange/10 rounded-lg shadow-sm">
                    With Audio Overlay
                  </span>
                </div>

                {/* HTML5 video player */}
                <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-sports-orange/10 relative shadow-inner">
                  <video
                    src={processedVideoUrl}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                </div>

                {/* Actions (Download) */}
                <div className="flex justify-end pt-1">
                  <a
                    href={processedVideoUrl}
                    download={`commentary_${selectedFile?.name || 'video.mp4'}`}
                    className="px-6 py-3 bg-gradient-to-r from-sports-orange to-sports-deepOrange hover:from-sports-deepOrange hover:to-sports-red text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>Download Video</span>
                  </a>
                </div>
              </motion.div>
            )}

            {/* Live commentary card output */}
            <CommentaryCard commentary={commentary} />
          </div>

        </div>

        {/* Bottom Blend Fade out mask into solid cream backdrop */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FFF7F0] to-transparent pointer-events-none z-10" />
      </section>

      {/* 2. FEATURES GRID SECTION (Solid cream fold below first fold) */}
      <section 
        id="features" 
        className="bg-[#FFF7F0] py-20 relative z-20 border-t border-sports-orange/5"
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* Section title (Bodoni Moda) */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-sports-navy font-serif tracking-tight leading-tight">
              Broadcast Features
            </h2>
            <p className="text-sm md:text-base text-sports-navy/60 mt-3 max-w-md mx-auto font-sans">
              Optimized specifications calibrated for professional match broadcasting.
            </p>
          </div>

          {/* Cards Grid (Poppins) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
            {/* Card 1: AI Powered */}
            <div className="bg-white/40 backdrop-blur-md border border-sports-orange/15 p-6 rounded-3xl shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sports-yellow/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-sports-orange" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-md font-bold text-sports-navy mb-1">⚡ AI Powered</h4>
                <p className="text-xs text-sports-navy/70 leading-relaxed">
                  Advanced commentary algorithms calibrated for dynamic matching of play sequences.
                </p>
              </div>
            </div>

            {/* Card 2: Cricket Focused */}
            <div className="bg-white/40 backdrop-blur-md border border-sports-orange/15 p-6 rounded-3xl shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sports-orange/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-sports-deepOrange" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-md font-bold text-sports-navy mb-1">🏏 Cricket Focused</h4>
                <p className="text-xs text-sports-navy/70 leading-relaxed">
                  Trained on thousands of overs, wickets, boundaries, and historical game terms.
                </p>
              </div>
            </div>

            {/* Card 3: Fast */}
            <div className="bg-white/40 backdrop-blur-md border border-sports-orange/15 p-6 rounded-3xl shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sports-red/10 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-sports-red" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-md font-bold text-sports-navy mb-1">🚀 Fast</h4>
                <p className="text-xs text-sports-navy/70 leading-relaxed">
                  Get high-fidelity text commentaries in seconds to fuel match streams.
                </p>
              </div>
            </div>

            {/* Card 4: Secure */}
            <div className="bg-white/40 backdrop-blur-md border border-sports-orange/15 p-6 rounded-3xl shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sports-navy/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-sports-navy" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-md font-bold text-sports-navy mb-1">🔒 Secure</h4>
                <p className="text-xs text-sports-navy/70 leading-relaxed">
                  Videos are saved temporarily inside a dedicated storage and processed securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-sports-orange/10 text-center text-xs text-sports-navy/60 bg-white/20 backdrop-blur-sm relative z-20 font-sans">
        <p>© 2026 Cricket AI Commentary. Ready for MotionEpic / Video-of-Thought integration.</p>
      </footer>
    </div>
  );
}

export default App;
