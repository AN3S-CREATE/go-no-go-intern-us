import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { SwipeCard } from './SwipeCard';
import { DetailsModal } from './DetailsModal';
import { VeralogixLogo } from './VeralogixLogo';
import { AdminBackupPanel } from './AdminBackupPanel';
import { useAppStore } from '../store/useAppStore';
import { innovationApi, swipeApi } from '../services/api';
import type { InnovationCard } from '../types';
import { toast } from 'sonner';
import axios from 'axios';
import { saveVoteLocally, syncUnsyncedVotes, clearAllLocalVotes, getUnsyncedVotes } from '../services/voteBackup';

export const SwipeDeck: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<InnovationCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);
  const { 
    innovations, 
    currentCardIndex, 
    nextCard,
    userName,
  } = useAppStore();

  // Auto-sync unsynced votes on component mount
  useEffect(() => {
    const syncVotes = async () => {
      // Migration: Clear old votes from broken webhook system (one-time)
      const migrationKey = 'vote_system_migrated_v2';
      const hasMigrated = localStorage.getItem(migrationKey);
      
      if (!hasMigrated) {
        const oldVotes = getUnsyncedVotes();
        if (oldVotes.length > 0) {
          console.log(`🔄 Migrating ${oldVotes.length} old votes from broken webhook system...`);
          clearAllLocalVotes();
          toast.error(`Cleared ${oldVotes.length} old votes that couldn't sync. New votes will work correctly!`, {
            duration: 5000,
            style: {
              background: '#000000',
              border: '2px solid #FFA500',
              color: '#EDEDED',
            },
          });
        }
        localStorage.setItem(migrationKey, 'true');
        console.log('✅ Migration complete - new vote system active');
        return;
      }

      // Normal sync for new votes
      const result = await syncUnsyncedVotes();
      if (result.success > 0) {
        console.log(`✅ Synced ${result.success} backup votes`);
      }
      if (result.failed > 0) {
        console.warn(`⚠️ Failed to sync ${result.failed} votes`);
      }
    };
    syncVotes();
  }, []);

  // Secret admin panel trigger (triple tap on logo)
  useEffect(() => {
    if (logoTapCount >= 3) {
      setIsAdminPanelOpen(true);
      setLogoTapCount(0);
      toast('🔓 Admin panel unlocked', {
        style: {
          background: '#000000',
          border: '2px solid #2DF9FF',
          color: '#EDEDED',
          boxShadow: '0 0 30px #2DF9FF60',
        },
      });
    }
  }, [logoTapCount]);

  const handleLogoTap = () => {
    setLogoTapCount(prev => prev + 1);
    setTimeout(() => setLogoTapCount(0), 1000); // Reset after 1 second
  };

  const logVote = async (card: InnovationCard, voteType: 'vote-yes' | 'vote-no' | 'vote-maybe') => {
    const categoryMap: Record<string, string> = {
      'ai-features': 'cat-ai',
      'non-ai-features': 'cat-platform',
      'gimmicky-ai': 'cat-engagement',
      'info-card': 'cat-ai',
    };

    const voteData = {
      featureId: card.id,
      featureTitle: card.title,
      category: categoryMap[card.category] || 'cat-ai',
      voteType: voteType,
      timestamp: new Date().toISOString(),
      userName: userName || 'Anonymous',
    };

    // 🛡️ BACKUP LAYER 1: Save to local storage immediately (never loses data)
    saveVoteLocally(voteData);

    // 🛡️ BACKUP LAYER 2: Write directly to Taskade project (CORRECT API FORMAT!)
    try {
      // Create node directly in the project using CORRECT Taskade API format
      await axios.post('/api/taskade/projects/WGtW77Vk9smeBUvE/nodes', {
        '/text': voteData.featureTitle,
        '/attributes/@title': voteData.featureTitle,
        '/attributes/@category': voteData.category,
        '/attributes/@vote': voteData.voteType,
        '/attributes/@timestamp': voteData.timestamp,
        '/attributes/@userName': voteData.userName,
      });
      console.log('✅ Vote logged directly to project:', voteData.featureTitle);
    } catch (error) {
      console.error('❌ Direct API failed, vote saved locally:', error);
    }
  };

  const handleSwipeLeft = async () => {
    const card = innovations[currentCardIndex];
    if (card && !card.isInfoCard) {
      await logVote(card, 'vote-no');
      toast.error('Vote Saved: Not interested', {
        style: {
          background: '#000000',
          border: '2px solid #FF2DF1',
          color: '#EDEDED',
          boxShadow: '0 0 30px #FF2DF160',
        },
      });
    }
    nextCard();
  };

  const handleSwipeRight = async () => {
    const card = innovations[currentCardIndex];
    if (card && !card.isInfoCard) {
      await logVote(card, 'vote-yes');
      toast.success('Vote Saved: Feature selected! ✅', {
        style: {
          background: '#000000',
          border: '2px solid #2DF9FF',
          color: '#EDEDED',
          boxShadow: '0 0 30px #2DF9FF60',
        },
      });
    }
    nextCard();
  };

  const handleSwipeUp = async () => {
    const card = innovations[currentCardIndex];
    if (card && !card.isInfoCard) {
      await logVote(card, 'vote-maybe');
      toast('Vote Saved: Maybe later 🤔', {
        style: {
          background: '#000000',
          border: '2px solid #C6FF00',
          color: '#EDEDED',
          boxShadow: '0 0 30px #C6FF0060',
        },
      });
    }
    nextCard();
  };

  const handleExploreMore = () => {
    setSelectedCard(innovations[currentCardIndex]);
    setIsModalOpen(true);
  };

  const currentCard = innovations[currentCardIndex];
  const hasMoreCards = currentCardIndex < innovations.length;
  const allReviewed = currentCardIndex >= innovations.length;

  if (!innovations.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2DF9FF] animate-spin mx-auto" />
          <p className="text-white/60">Loading features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <div onClick={handleLogoTap} className="cursor-pointer">
        <VeralogixLogo />
      </div>

      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF2DF1] rounded-full blur-[180px] opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#2DF9FF] rounded-full blur-[180px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C6FF00] rounded-full blur-[200px] opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-8">
        {/* Card stack - Full screen optimized */}
        <div className="relative w-full max-w-md flex-1 flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            {hasMoreCards && currentCard && (
              <SwipeCard
                key={currentCard.id}
                card={currentCard}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSwipeUp={handleSwipeUp}
                onExploreMore={handleExploreMore}
              />
            )}
          </AnimatePresence>

          {/* All reviewed state */}
          {allReviewed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center space-y-6 p-8">
                <div className="relative">
                  <Sparkles className="w-20 h-20 text-[#C6FF00] mx-auto" />
                  <div className="absolute inset-0 blur-3xl bg-[#C6FF00] opacity-50 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h2 
                    className="text-3xl md:text-4xl font-bold"
                    style={{
                      color: '#C6FF00',
                      textShadow: '0 0 30px #C6FF0080',
                    }}
                  >
                    All Innovations Reviewed!
                  </h2>
                  <p className="text-white/90 text-lg font-medium">
                    You've explored all {innovations.length} innovations.
                  </p>
                  <p className="text-white/60">
                    Management will review at 09:00 SAST.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Progress indicator */}
        {hasMoreCards && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3 pb-4"
          >
            <p className="text-white/70 text-base font-medium">
              {currentCardIndex + 1} of {innovations.length}
            </p>
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF2DF1] via-[#2DF9FF] to-[#C6FF00]"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentCardIndex + 1) / innovations.length) * 100}%` 
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  boxShadow: '0 0 20px rgba(45,249,255,0.5)'
                }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Details modal */}
      <DetailsModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />

      {/* Admin backup panel (secret: triple-tap logo) */}
      <AdminBackupPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
    </div>
  );
};
