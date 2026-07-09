import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const CommentaryCard = ({ commentary }) => {
  const isPlaceholder = !commentary || commentary === "No commentary generated.";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={commentary}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/50 backdrop-blur-md border border-sports-orange/15 rounded-3xl p-6 shadow-premium relative overflow-hidden"
      >
        {/* Quoted Icon Backdrop */}
        <div className="absolute -top-4 -left-2 text-sports-orange/10 select-none pointer-events-none">
          <Quote className="w-24 h-24 stroke-[4.5px]" />
        </div>

        {/* Card Header */}
        <div className="flex items-center justify-between mb-4 border-b border-sports-orange/10 pb-3 relative z-10">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-sports-navy flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sports-red animate-pulse" />
            Live Commentary
          </h3>
          <span className="text-[10px] font-bold text-sports-navy/75 px-2.5 py-1 bg-white border border-sports-orange/10 rounded-lg shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sports-red" />
            AI Output
          </span>
        </div>

        {/* Commentary Text Container */}
        <div className="min-h-[100px] flex items-center relative z-10">
          {isPlaceholder ? (
            <div className="w-full text-center py-4">
              <p className="text-sports-navy/50 italic text-sm">
                No commentary generated. Upload a video and click "Generate Commentary" to begin.
              </p>
            </div>
          ) : (
            <div className="w-full pl-6 md:pl-8">
              <p className="text-sports-navy leading-relaxed text-base md:text-lg font-bold bg-white/40 border border-sports-orange/10 p-5 rounded-2xl shadow-inner font-sans">
                {commentary}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentaryCard;
