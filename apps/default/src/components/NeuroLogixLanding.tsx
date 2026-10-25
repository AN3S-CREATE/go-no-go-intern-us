import React from 'react';
import { motion } from 'framer-motion';

interface NeuroLogixLandingProps {
  onAccept: () => void;
}

export const NeuroLogixLanding: React.FC<NeuroLogixLandingProps> = ({ onAccept }) => {
  const handleLearnMore = () => {
    window.open('https://veralogix.github.io/NeuroLogix---Veralogix-AI-Innovation-/privacy', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center relative overflow-hidden">
      {/* Neon lime green glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C6FF00] rounded-full blur-[180px] opacity-25 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#C6FF00] rounded-full blur-[180px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 py-12"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <img 
            src="https://iili.io/KeG9tjt.png" 
            alt="NeuroLogix Logo" 
            className="h-24 md:h-32 object-contain drop-shadow-[0_0_30px_rgba(198,255,0,0.6)]"
          />
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-[#C6FF00] drop-shadow-[0_0_20px_rgba(198,255,0,0.5)]"
        >
          Data Collection Notice
        </motion.h1>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-2xl space-y-6 mb-12"
        >
          <p className="text-white/90 text-center text-lg leading-relaxed">
            At Veralogix, we're always on the cutting edge of technology. As part of our innovation initiative, <span className="text-[#C6FF00] font-bold">NeuroLogix</span>, we collect non-personal usage data to improve performance and user experience.
          </p>
          <p className="text-white/70 text-center">
            No personal or sensitive information is collected or shared.
          </p>
          <p className="text-white/60 text-center text-sm">
            By continuing, you accept these terms.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        >
          <button
            onClick={onAccept}
            className="flex-1 px-10 py-4 bg-[#C6FF00] text-black font-bold text-lg rounded-2xl hover:bg-[#C6FF00]/90 transition-all duration-300 shadow-[0_0_40px_rgba(198,255,0,0.5)] hover:shadow-[0_0_60px_rgba(198,255,0,0.7)] hover:scale-105 active:scale-95"
          >
            Accept
          </button>
          <button
            onClick={handleLearnMore}
            className="flex-1 px-10 py-4 bg-transparent border-2 border-[#C6FF00] text-[#C6FF00] font-bold text-lg rounded-2xl hover:bg-[#C6FF00]/10 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Learn More
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
