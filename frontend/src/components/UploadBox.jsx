import React, { useState, useRef } from 'react';
import { Video } from 'lucide-react';

const UploadBox = ({ onFileSelected }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        onFileSelected(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-3xl p-10 md:p-14 text-center flex flex-col items-center justify-center transition-all duration-300 min-h-[320px] cursor-pointer group ${
        isDragActive
          ? "border-sports-deepOrange bg-sports-deepOrange/5 shadow-[0_20px_50px_rgba(255,107,53,0.08)] scale-[1.01]"
          : "border-sports-orange/30 bg-white/45 hover:border-sports-deepOrange/60 hover:bg-white/70 shadow-premium hover:shadow-premium-hover hover:-translate-y-1"
      }`}
      onClick={onButtonClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="video/*"
        onChange={handleChange}
      />
      
      {/* Dynamic video upload icon */}
      <div className="w-16 h-16 rounded-2xl bg-sports-orange/10 border border-sports-orange/20 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-sports-deepOrange/10 group-hover:border-sports-deepOrange/30">
        <Video className="w-8 h-8 text-sports-deepOrange" strokeWidth={1.8} />
      </div>

      <h3 className="text-xl font-extrabold text-sports-navy mb-2 tracking-tight">
        Drag & drop your cricket video here
      </h3>
      
      <p className="text-sm text-sports-navy/70 mb-8 max-w-xs leading-relaxed">
        Supports MP4, AVI, MOV, MKV, and WebM format.
      </p>

      <button
        type="button"
        className="px-8 py-3.5 bg-gradient-to-r from-sports-orange to-sports-deepOrange hover:from-sports-deepOrange hover:to-sports-red text-white font-extrabold text-sm rounded-xl shadow-lg shadow-sports-deepOrange/15 hover:shadow-sports-deepOrange/30 active:scale-95 transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onButtonClick();
        }}
      >
        Select Video File
      </button>
    </div>
  );
};

export default UploadBox;
