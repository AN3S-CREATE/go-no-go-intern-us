import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronRight, Sparkles, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const slides = [
  {
    icon: Sparkles,
    title: 'Welcome to Intern Us',
    subtitle: 'Feature Selection Tool',
    description: 'Discover and vote on innovative AI-powered features designed specifically for South African students. Your input shapes the future of career development.',
    nextUp: '→ Learn how to swipe and vote',
    color: '#A855F7',
    gradient: 'from-purple-600/30 via-purple-800/20 to-transparent'
  },
  {
    icon: Zap,
    title: 'How It Works',
    subtitle: 'Simple & Powerful',
    description: 'Swipe LEFT to skip features you\'re not interested in. Swipe RIGHT to vote for features you want. Tap "Explore" for detailed specs and benefits of each innovation.',
    nextUp: '→ Discover your impact',
    color: '#2DF9FF',
    gradient: 'from-cyan-500/30 via-cyan-700/20 to-transparent'
  },
  {
    icon: TrendingUp,
    title: 'Your Voice Matters',
    subtitle: 'Building Together',
    description: 'Every swipe helps prioritize which AI features get built first. You\'re not just voting—you\'re actively shaping the platform that will empower thousands of South African students.',
    nextUp: '→ Ready to explore features!',
    color: '#C6FF00',
    gradient: 'from-lime-500/30 via-lime-700/20 to-transparent'
  },
];

export const OnboardingInternUs: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userName, setUserName] = useState('');
  const [direction, setDirection] = useState(0);
  const { setHasCompletedOnboarding, setUserName: saveUserName } = useAppStore();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      if (userName.trim()) {
        saveUserName(userName);
        setHasCompletedOnboarding(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentSlide > 0) {
      handlePrevious();
    } else if (info.offset.x < -threshold && currentSlide < slides.length - 1) {
      handleNext();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-700`} />
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-30 animate-pulse"
          style={{ backgroundColor: slide.color }}
        />
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 py-12"
        >
          {/* Icon with dramatic glow */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative">
              <div 
                className="w-28 h-28 rounded-full flex items-center justify-center border-3"
                style={{ 
                  borderColor: slide.color,
                  boxShadow: `0 0 60px ${slide.color}, inset 0 0 30px ${slide.color}40`,
                }}
              >
                <Icon className="w-14 h-14" style={{ color: slide.color }} />
              </div>
              <div 
                className="absolute inset-0 rounded-full blur-3xl opacity-50 animate-pulse"
                style={{ backgroundColor: slide.color }}
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-6 max-w-2xl"
          >
            <div className="space-y-3">
              <h1 
                className="text-4xl md:text-5xl font-bold leading-tight"
                style={{ 
                  color: slide.color,
                  textShadow: `0 0 30px ${slide.color}80`,
                }}
              >
                {slide.title}
              </h1>
              <p className="text-white/70 text-xl font-medium">{slide.subtitle}</p>
            </div>
            
            <p className="text-white/90 text-lg leading-relaxed max-w-xl mx-auto">
              {slide.description}
            </p>

            {/* Next up preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <p className="text-white/50 text-sm flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" />
                {slide.nextUp}
              </p>
            </motion.div>
          </motion.div>

          {/* Name input on last slide */}
          {isLastSlide && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 mb-6 w-full max-w-md"
            >
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name to begin"
                className="w-full px-6 py-4 bg-white/5 border-2 rounded-2xl text-white placeholder-white/40 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                style={{ 
                  borderColor: `${slide.color}60`,
                  boxShadow: `0 0 30px ${slide.color}30`,
                }}
                onFocus={(e) => e.target.style.borderColor = slide.color}
                onBlur={(e) => e.target.style.borderColor = `${slide.color}60`}
              />
            </motion.div>
          )}

          {/* Progress dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-36 left-1/2 -translate-x-1/2 flex gap-3"
          >
            {slides.map((_, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                  }}
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? '40px' : '12px',
                    backgroundColor: isActive ? slide.color : '#ffffff30',
                    boxShadow: isActive ? `0 0 15px ${slide.color}` : 'none',
                  }}
                />
              );
            })}
          </motion.div>

          {/* Next button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleNext}
            disabled={isLastSlide && !userName.trim()}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-12 py-4 rounded-2xl font-bold text-black text-lg transition-all duration-300 flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{
              backgroundColor: slide.color,
              boxShadow: `0 0 40px ${slide.color}80`,
            }}
          >
            {isLastSlide ? 'Start Exploring' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          {/* Swipe hint */}
          {currentSlide === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-8 right-8 text-white/40 text-sm"
            >
              ← Swipe to navigate →
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
