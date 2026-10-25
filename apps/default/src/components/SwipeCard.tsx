import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, Heart, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import type { InnovationCard } from '../types';

interface SwipeCardProps {
  card: InnovationCard;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp?: () => void;
  onExploreMore: () => void;
}

const categoryColors = {
  'ai-features': '#A855F7',
  'non-ai-features': '#2DF9FF',
  'gimmicky-ai': '#A855F7',
  'info-card': '#2DF9FF',
};

const categoryLabels = {
  'ai-features': 'AI Features',
  'non-ai-features': 'Platform Features',
  'gimmicky-ai': 'Engagement Features',
  'info-card': 'Information',
};

export const SwipeCard: React.FC<SwipeCardProps> = ({
  card,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onExploreMore,
}) => {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const categoryColor = categoryColors[card.category];

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setExitX(200);
      onSwipeRight();
    } else if (info.offset.x < -threshold) {
      setExitX(-200);
      onSwipeLeft();
    }
  };

  const isInfoCard = card.isInfoCard || card.category === 'info-card';

  return (
    <motion.div
      className="absolute w-full h-full max-w-lg"
      style={{ x, rotate: isInfoCard ? 0 : rotate, opacity }}
      drag={isInfoCard ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div 
        className="relative h-full rounded-3xl p-[3px] overflow-visible"
        style={{
          background: `linear-gradient(135deg, ${categoryColor}50, ${categoryColor}30)`,
        }}
      >
        {/* Neon border glow */}
        <div 
          className="absolute inset-0 rounded-3xl blur-3xl opacity-70"
          style={{ backgroundColor: categoryColor }}
        />

        {/* Action buttons row at bottom */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 px-8 z-20">
          {!isInfoCard && (
            <>
              {/* Pass button (X) */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setExitX(-200);
                  onSwipeLeft();
                }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#FF2DF1',
                  boxShadow: '0 0 30px #FF2DF1, 0 0 50px #FF2DF180',
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <X className="w-8 h-8 text-black" strokeWidth={3.5} />
              </motion.button>
            </>
          )}

          {/* Explore button - centered (always visible) */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              if (isInfoCard) {
                // For info cards, just skip to next
                onSwipeRight();
              } else {
                onExploreMore();
              }
            }}
            className="px-8 py-3 rounded-full border-2 flex items-center justify-center gap-2 backdrop-blur-sm"
            style={{
              borderColor: categoryColor,
              color: categoryColor,
              backgroundColor: `${categoryColor}15`,
              boxShadow: `0 0 20px ${categoryColor}40`,
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <Info className="w-5 h-5" />
            <span className="font-bold text-base">{isInfoCard ? 'Continue' : 'Explore'}</span>
          </motion.button>

          {!isInfoCard && (
            <>
              {/* Select button (Heart) */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setExitX(200);
                  onSwipeRight();
                }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#C6FF00',
                  boxShadow: '0 0 30px #C6FF00, 0 0 60px #C6FF0080',
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              >
                <Heart className="w-8 h-8 text-black" strokeWidth={3.5} />
              </motion.button>
            </>
          )}
        </div>

        {/* Card content - Full height with proper spacing */}
        <div className="relative bg-black rounded-3xl h-full flex flex-col p-8 pb-24 overflow-y-auto">
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-6">
            <div 
              className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${categoryColor}30`,
                color: categoryColor,
                boxShadow: `0 0 20px ${categoryColor}60`,
              }}
            >
              {categoryLabels[card.category]}
            </div>
          </div>

          {/* Title */}
          <h2 
            className="text-3xl md:text-4xl font-bold leading-tight mb-8"
            style={{ 
              color: categoryColor,
              textShadow: `0 0 20px ${categoryColor}70`,
            }}
          >
            {card.title}
          </h2>

          {/* What section */}
          <div className="space-y-3 mb-6">
            <h3 className="text-white/60 text-sm font-bold uppercase tracking-wider">
              WHAT
            </h3>
            <p className="text-white/95 text-base leading-relaxed">
              {card.what}
            </p>
          </div>

          {/* Why section */}
          <div className="space-y-3">
            <h3 className="text-white/60 text-sm font-bold uppercase tracking-wider">
              WHY
            </h3>
            <p className="text-white/95 text-base leading-relaxed">
              {card.why}
            </p>
          </div>

          {/* Swipe hint for voteable cards only */}
          {!isInfoCard && (
            <div className="mt-auto pt-6 text-center">
              <p className="text-white/30 text-sm flex items-center justify-center gap-3">
                <ChevronLeft className="w-4 h-4" />
                Swipe to vote
                <ChevronRight className="w-4 h-4" />
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
