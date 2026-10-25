import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ThumbsDown } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import type { InnovationCard } from '../types';
import { swipeApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'sonner';
import { AIAssistant } from './AIAssistant';
import { DataViz } from './DataViz';

interface DetailsModalProps {
  card: InnovationCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
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

export const DetailsModal: React.FC<DetailsModalProps> = ({
  card,
  isOpen,
  onClose,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userName } = useAppStore();

  if (!card) return null;

  const categoryColor = categoryColors[card.category];

  const handlePresent = async () => {
    setIsSubmitting(true);
    try {
      // Log selection locally (could be sent to API later)
      console.log('Feature selected:', {
        user: userName,
        feature: card.title,
        category: card.category,
        timestamp: new Date().toISOString(),
      });
      
      toast.success('Feature selected!', {
        style: {
          background: '#000000',
          border: `2px solid ${categoryColor}`,
          color: '#EDEDED',
          boxShadow: `0 0 30px ${categoryColor}60`,
        },
      });
      onSwipeRight();
      onClose();
    } catch (error) {
      toast.error('Failed to log selection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePass = () => {
    onSwipeLeft();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed inset-x-3 bottom-2 top-14 sm:inset-x-4 sm:top-16 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50"
              >
                <div 
                  className="relative rounded-3xl p-[3px] max-h-full overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${categoryColor}70, ${categoryColor}40)`,
                  }}
                >
                  {/* Neon glow */}
                  <div 
                    className="absolute inset-0 rounded-3xl blur-3xl opacity-50"
                    style={{ backgroundColor: categoryColor }}
                  />

                  {/* Content */}
                  <div className="relative bg-black rounded-3xl max-h-full overflow-y-auto">
                    <div className="p-4 pb-4 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div 
                          className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${categoryColor}25`,
                            color: categoryColor,
                            boxShadow: `0 0 20px ${categoryColor}50`,
                            textShadow: `0 0 10px ${categoryColor}80`,
                          }}
                        >
                          {categoryLabels[card.category]}
                        </div>
                        <Dialog.Close asChild>
                          <button className="text-[#A0A0A0] hover:text-[#EDEDED] transition-colors p-2">
                            <X className="w-7 h-7" />
                          </button>
                        </Dialog.Close>
                      </div>

                      {/* Title */}
                      <h2 
                        className="text-2xl font-bold leading-tight"
                        style={{ 
                          color: categoryColor,
                          textShadow: `0 0 20px ${categoryColor}70`,
                        }}
                      >
                        {card.title}
                      </h2>

                      {/* What section */}
                      <div className="space-y-2">
                        <h3 className="text-[#A0A0A0] text-xs font-bold uppercase tracking-wider">
                          🎯 What's The Deal?
                        </h3>
                        <p className="text-[#EDEDED] text-sm leading-relaxed font-medium">
                          {card.what}
                        </p>
                      </div>

                      {/* Why section */}
                      <div className="space-y-2">
                        <h3 className="text-[#A0A0A0] text-xs font-bold uppercase tracking-wider">
                          🚀 Why It's Awesome
                        </h3>
                        <p className="text-[#EDEDED] text-sm leading-relaxed font-medium">
                          {card.why}
                        </p>
                      </div>

                      {/* How section - only show if card has 'how' field */}
                      {card.how && (
                        <div className="space-y-2">
                          <h3 className="text-[#A0A0A0] text-xs font-bold uppercase tracking-wider">
                            ⚡ How It Works
                          </h3>
                          <p className="text-[#EDEDED] text-sm leading-relaxed font-medium">
                            {card.how}
                          </p>
                        </div>
                      )}

                      {/* ROI & Timeline section - fun and engaging (only for voteable features) */}
                      {!card.isInfoCard && card.category !== 'info-card' && (
                        <div 
                          className="rounded-xl p-4 space-y-3 border"
                          style={{
                            backgroundColor: `${categoryColor}10`,
                            borderColor: `${categoryColor}30`,
                          }}
                        >
                          <h3 
                            className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"
                            style={{ color: categoryColor }}
                          >
                            💰 The Business Case
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {/* Implementation Time */}
                            <div>
                              <p className="text-white/50 text-xs mb-1">Build Time</p>
                              <p className="text-white font-bold text-lg">3-4 weeks</p>
                            </div>
                            
                            {/* Expected ROI */}
                            <div>
                              <p className="text-white/50 text-xs mb-1">Expected ROI</p>
                              <p className="text-white font-bold text-lg">2-3x</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-white/70 text-sm">
                              <span className="font-semibold" style={{ color: categoryColor }}>Quick wins:</span> Faster student onboarding, higher engagement rates, and better placement outcomes within the first month.
                            </p>
                            <p className="text-white/70 text-sm">
                              <span className="font-semibold" style={{ color: categoryColor }}>Platform impact:</span> Increases user retention by 40% and reduces support costs through intelligent automation.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Data Visualizations */}
                      <DataViz categoryColor={categoryColor} />

                      {/* AI Assistant */}
                      <AIAssistant
                        innovationTitle={card.title}
                        innovationWhat={card.what}
                        innovationWhy={card.why}
                        categoryColor={categoryColor}
                        category={card.category}
                      />

                      {/* Action buttons */}
                      {card.isInfoCard || card.category === 'info-card' ? (
                        // Info cards only get a Continue button
                        <div className="pt-1">
                          <button
                            onClick={() => {
                              onSwipeRight();
                              onClose();
                            }}
                            className="w-full py-3 rounded-xl font-bold text-black transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                            style={{
                              backgroundColor: categoryColor,
                              boxShadow: `0 0 30px ${categoryColor}80`,
                            }}
                          >
                            Continue to Features →
                          </button>
                        </div>
                      ) : (
                        // Voteable cards get Pass and Present buttons
                        <div className="flex gap-2 sm:gap-3 pt-1">
                          <button
                            onClick={handlePass}
                            disabled={isSubmitting}
                            className="flex-1 py-2 sm:py-2.5 rounded-xl font-bold bg-white/5 text-[#A0A0A0] hover:bg-white/10 hover:text-[#EDEDED] transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 text-xs sm:text-sm"
                          >
                            <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Pass
                          </button>
                          <button
                            onClick={handlePresent}
                            disabled={isSubmitting}
                            className="flex-1 py-2 sm:py-2.5 rounded-xl font-bold text-black transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 text-xs sm:text-sm"
                            style={{
                              backgroundColor: categoryColor,
                              boxShadow: `0 0 30px ${categoryColor}80`,
                            }}
                          >
                            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {isSubmitting ? 'Presenting...' : 'Present'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
