import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = "Processing video..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 space-y-5">
      <div className="relative w-16 h-16">
        {/* Tracks */}
        <div className="absolute inset-0 rounded-full border-4 border-sports-orange/10" />
        
        {/* Dual-color spinning arc */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-sports-deepOrange border-r-transparent border-b-sports-yellow border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Central pulsing core */}
        <div className="absolute inset-3.5 rounded-full bg-sports-red/15 animate-pulse" />
      </div>
      
      <div className="text-center">
        <p className="text-sports-navy font-extrabold text-base tracking-tight animate-pulse">
          {message}
        </p>
        <p className="text-xs text-sports-navy/60 mt-1 max-w-xs leading-relaxed">
          Uploading the match clip and running predictions. Please don't close this page.
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
