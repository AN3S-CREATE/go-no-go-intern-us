import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, Database, AlertCircle, CheckCircle, X } from 'lucide-react';
import { getBackupStats, downloadVotesBackup, syncUnsyncedVotes, getLocalVotes } from '../services/voteBackup';
import * as Dialog from '@radix-ui/react-dialog';

interface AdminBackupPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminBackupPanel: React.FC<AdminBackupPanelProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState({ total: 0, synced: 0, unsynced: 0 });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{ success: number; failed: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      refreshStats();
    }
  }, [isOpen]);

  const refreshStats = () => {
    setStats(getBackupStats());
  };

  const handleSync = async () => {
    setIsSyncing(true);
    const result = await syncUnsyncedVotes();
    setLastSyncResult(result);
    refreshStats();
    setIsSyncing(false);
  };

  const handleDownload = () => {
    downloadVotesBackup();
  };

  const hasUnsynced = stats.unsynced > 0;

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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
              >
                <div className="relative rounded-3xl p-[3px] bg-gradient-to-br from-[#2DF9FF] to-[#A855F7]">
                  <div className="absolute inset-0 rounded-3xl blur-3xl opacity-50 bg-[#2DF9FF]" />
                  
                  <div className="relative bg-black rounded-3xl p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#2DF9FF]/20">
                          <Database className="w-5 h-5 text-[#2DF9FF]" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-[#EDEDED]">Vote Backup System</h2>
                          <p className="text-xs text-[#A0A0A0]">Multi-layer vote protection</p>
                        </div>
                      </div>
                      <Dialog.Close asChild>
                        <button className="text-[#A0A0A0] hover:text-[#EDEDED] transition-colors p-2">
                          <X className="w-6 h-6" />
                        </button>
                      </Dialog.Close>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-[#A0A0A0] text-xs mb-1">Total Votes</p>
                        <p className="text-2xl font-bold text-[#EDEDED]">{stats.total}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-[#00FF00]/20">
                        <p className="text-[#A0A0A0] text-xs mb-1">Synced</p>
                        <p className="text-2xl font-bold text-[#00FF00]">{stats.synced}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-[#FFA500]/20">
                        <p className="text-[#A0A0A0] text-xs mb-1">Pending</p>
                        <p className="text-2xl font-bold text-[#FFA500]">{stats.unsynced}</p>
                      </div>
                    </div>

                    {/* Warning if unsynced */}
                    {hasUnsynced && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-[#FFA500]/10 border border-[#FFA500]/30"
                      >
                        <AlertCircle className="w-5 h-5 text-[#FFA500] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-[#FFA500]">Unsynced Votes Detected</p>
                          <p className="text-xs text-[#EDEDED]/70 mt-1">
                            {stats.unsynced} vote{stats.unsynced !== 1 ? 's' : ''} saved locally but not yet synced to server. Click "Sync Now" to upload.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Last sync result */}
                    {lastSyncResult && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-[#00FF00]/10 border border-[#00FF00]/30"
                      >
                        <CheckCircle className="w-5 h-5 text-[#00FF00] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-[#00FF00]">Sync Complete</p>
                          <p className="text-xs text-[#EDEDED]/70 mt-1">
                            Successfully synced {lastSyncResult.success} vote{lastSyncResult.success !== 1 ? 's' : ''}.
                            {lastSyncResult.failed > 0 && ` ${lastSyncResult.failed} failed.`}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Protection layers info */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">🛡️ Protection Layers</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-[#EDEDED]/70">
                          <div className="w-2 h-2 rounded-full bg-[#00FF00]" />
                          <span>Local browser storage (instant save)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#EDEDED]/70">
                          <div className="w-2 h-2 rounded-full bg-[#00FF00]" />
                          <span>Primary webhook (real-time sync)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#EDEDED]/70">
                          <div className="w-2 h-2 rounded-full bg-[#00FF00]" />
                          <span>Backup webhook (redundancy)</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleSync}
                        disabled={isSyncing || !hasUnsynced}
                        className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-[#2DF9FF] to-[#A855F7] text-black hover:shadow-lg hover:shadow-[#2DF9FF]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Syncing...' : hasUnsynced ? 'Sync Now' : 'All Synced'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex-1 py-3 rounded-xl font-bold bg-white/10 text-[#EDEDED] hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download CSV
                      </button>
                    </div>

                    <p className="text-[10px] text-[#A0A0A0] text-center">
                      Votes are automatically saved locally and synced when online. Download CSV anytime for manual backup.
                    </p>
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
