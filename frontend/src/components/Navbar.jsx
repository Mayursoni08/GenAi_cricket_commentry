import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-sports-cream/75 backdrop-blur-md border-b border-sports-orange/10 py-3 shadow-glass' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO & TITLE */}
        <div className="flex items-center space-x-2 cursor-pointer group select-none">
          <span className="text-2xl transition-transform duration-300 group-hover:scale-110" role="img" aria-label="cricket-ball">
            🏏
          </span>
          <span className="text-lg md:text-xl font-black tracking-tight text-sports-navy font-serif">
            Cricket AI Commentary
          </span>
        </div>

        {/* MENU OPTIONS */}
        <div className="hidden md:flex items-center space-x-8 font-sans">
          <a href="#home" className="text-sm font-semibold text-sports-navy hover:text-sports-deepOrange transition-colors duration-200">
            Home
          </a>
          <a href="#features" className="text-sm font-semibold text-sports-navy/75 hover:text-sports-deepOrange transition-colors duration-200">
            Features
          </a>
          <a href="#home" className="text-sm font-semibold text-sports-navy/75 hover:text-sports-deepOrange transition-colors duration-200">
            Upload Workflow
          </a>
        </div>

        {/* BADGE (Preview Version) */}
        <div className="flex items-center font-sans">
          <span className="px-3.5 py-1.5 bg-sports-deepOrange/10 border border-sports-deepOrange/20 text-sports-deepOrange rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider select-none animate-pulse">
            ★ Preview Version
          </span>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
