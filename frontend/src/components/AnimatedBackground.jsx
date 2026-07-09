import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-gradient-to-br from-[#FFF7F0] via-[#FFF1E8] to-[#FFF7F0]">
      {/* 1. SOFT GLOWING BLURRED CIRCLES */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-sports-yellow/15 blur-[100px]"
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-sports-orange/10 blur-[120px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[40%] left-[60%] w-[35vw] h-[35vw] rounded-full bg-sports-red/5 blur-[90px]"
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 2. STADIUM SILHOUETTE */}
      <div className="absolute bottom-0 left-0 right-0 h-[220px] opacity-[0.06] select-none">
        <svg viewBox="0 0 1440 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover object-bottom">
          <path d="M0 220 L0 180 Q150 150 360 170 Q600 190 900 160 Q1200 140 1440 180 L1440 220 Z" fill="#1D3557" />
          <path d="M0 220 L0 190 Q200 170 480 185 Q750 200 1080 180 Q1300 165 1440 190 L1440 220 Z" fill="#FF6B35" />
          {/* Light Towers */}
          <rect x="150" y="80" width="4" height="90" fill="#1D3557" />
          <polygon points="144,80 160,80 156,70 148,70" fill="#1D3557" />
          <rect x="1250" y="60" width="4" height="110" fill="#1D3557" />
          <polygon points="1244,60 1260,60 1256,50 1248,50" fill="#1D3557" />
        </svg>
      </div>

      {/* 3. CURVED MOTION TRAILS */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <path d="M-100 100 Q 300 200 600 -100" stroke="#FF6B35" strokeWidth="4" fill="none" />
        <path d="M400 700 Q 800 400 1500 500" stroke="#E63946" strokeWidth="3" fill="none" />
        <path d="M-50 450 T 1300 300" stroke="#FF8C42" strokeWidth="2.5" strokeDasharray="8 8" fill="none" />
      </svg>

      {/* 4. FLOATING GEOMETRIC ACCENTS */}
      {/* Triangle */}
      <motion.div
        className="absolute top-[25%] left-[15%] w-6 h-6 border-2 border-sports-orange/20 rounded-md"
        style={{ rotate: 15 }}
        animate={{
          y: [0, -15, 0],
          rotate: [15, 45, 15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Plus */}
      <motion.div
        className="absolute top-[65%] left-[8%] text-sports-red/15 text-2xl font-bold select-none"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        +
      </motion.div>

      {/* Ring */}
      <motion.div
        className="absolute top-[15%] right-[25%] w-8 h-8 rounded-full border-2 border-sports-yellow/20"
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Dots Grid */}
      <div className="absolute top-[50%] right-[10%] opacity-[0.06] grid grid-cols-3 gap-2">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-sports-navy" />
        ))}
      </div>

      {/* 5. CONTINUOUSLY DRIVING CRICKET BALL */}
      <motion.div
        className="absolute w-7 h-7 filter drop-shadow-[0_8px_16px_rgba(230,57,70,0.15)]"
        animate={{
          x: ["-10vw", "110vw"],
          y: ["40vh", "22vh", "48vh", "30vh"],
          rotate: [0, 1080],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#E63946" stroke="#1D3557" strokeWidth="1.8" />
          <path d="M5 16 C 10 10, 22 10, 27 16" stroke="#FFFFFF" strokeWidth="1.8" strokeDasharray="3 2" fill="none" />
          <circle cx="12" cy="12" r="3.5" fill="#FFF" opacity="0.4" />
        </svg>
      </motion.div>
    </div>
  );
};

export default AnimatedBackground;
