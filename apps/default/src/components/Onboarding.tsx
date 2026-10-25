import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const slides = [
  {
    icon: Sparkles,
    title: 'Welcome to GoNoGo',
    subtitle: 'Phoenix Ideas',
    description: 'Swipe through cutting-edge estate innovations and signal your interest instantly.',
    color: '#FF2DF1',
  },
  {
    icon: Zap,
    title: 'How It Works',
    subtitle: 'Simple & Fast',
    description: 'Swipe LEFT to pass. Swipe RIGHT to present to management. Tap "Explore more" for details.',
    color: '#2DF9FF',
  },
  {
    icon: TrendingUp,
    title: 'What Happens Next',
    subtitle: 'Your Impact',
    description: 'Right swipes are logged and reviewed daily at 09:00 SAST. Management responds with quick decisions.',
    color: '#C6FF00',
  },
];

export const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userName, setUserName] = useState('');
  const { setHasCompletedOnboarding, setUserName: saveUserName } = useAppStore();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      if (userName.trim()) {
        saveUserName(userName);
        setHasCompletedOnboarding(true);
      }
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-3 sm:p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full"
        >
          <div className="text-center space-y-4 sm:space-y-5">
            {/* Icon with neon glow */}
            <div className="flex justify-center">
              <div className="relative">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center border-2"
                  style={{ 
                    borderColor: slide.color,
                    boxShadow: `0 0 30px ${slide.color}`,
                  }}
                >
                  <Icon className="w-10 h-10" style={{ color: slide.color }} />
                </div>
                <div 
                  className="absolute inset-0 rounded-full blur-2xl opacity-40"
                  style={{ backgroundColor: slide.color }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2 sm:space-y-3">
              <div>
                <h1 
                  className="text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2"
                  style={{ 
                    color: slide.color,
                    textShadow: `0 0 15px ${slide.color}80`,
                  }}
                >
                  {slide.title}
                </h1>
                <p className="text-[#A0A0A0] text-sm sm:text-base font-medium">{slide.subtitle}</p>
              </div>
              <p className="text-[#EDEDED] text-xs sm:text-sm leading-relaxed font-medium">
                {slide.description}
              </p>
            </div>

            {/* Name input on last slide */}
            {isLastSlide && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border-2 border-[#2DF9FF]/30 rounded-xl text-[#EDEDED] placeholder-[#A0A0A0] focus:outline-none focus:border-[#2DF9FF] transition-all duration-300 text-sm sm:text-base font-medium"
                  style={{ boxShadow: '0 0 20px #2DF9FF30' }}
                />
              </motion.div>
            )}

            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {slides.map((_, index) => {
                const isActive = index === currentSlide;
                return (
                  <div
                    key={index}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? '32px' : '8px',
                      backgroundColor: isActive ? slide.color : '#ffffff20',
                      boxShadow: isActive ? `0 0 10px ${slide.color}` : 'none',
                    }}
                  />
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={isLastSlide && !userName.trim()}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              style={{
                backgroundColor: slide.color,
                boxShadow: `0 0 30px ${slide.color}80`,
              }}
            >
              {isLastSlide ? 'Start Swiping' : 'Next'}
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
