/**
 * Local Storage Vote Backup System
 * Ensures votes are never lost even if server is down
 */

interface VoteRecord {
  id: string;
  featureId: string;
  featureTitle: string;
  category: string;
  voteType: 'vote-yes' | 'vote-no' | 'vote-maybe';
  timestamp: string;
  userName: string;
  synced: boolean;
}

const STORAGE_KEY = 'intern_us_votes_backup';
const PROJECT_ID = 'WGtW77Vk9smeBUvE';
const PROJECT_API_URL = `/api/taskade/projects/${PROJECT_ID}/nodes`;

/**
 * Save vote to local storage immediately
 */
export const saveVoteLocally = (vote: Omit<VoteRecord, 'id' | 'synced'>): void => {
  try {
    const votes = getLocalVotes();
    const newVote: VoteRecord = {
      ...vote,
      id: `vote_${Date.now()}_${Math.random()}`,
      synced: false,
    };
    votes.push(newVote);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    console.log('✅ Vote saved locally:', newVote);
  } catch (error) {
    console.error('❌ Failed to save vote locally:', error);
  }
};

/**
 * Get all votes from local storage
 */
export const getLocalVotes = (): VoteRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('❌ Failed to read local votes:', error);
    return [];
  }
};

/**
 * Get unsynced votes that need to be sent to server
 */
export const getUnsyncedVotes = (): VoteRecord[] => {
  return getLocalVotes().filter(vote => !vote.synced);
};

/**
 * Mark vote as synced
 */
const markVoteSynced = (voteId: string): void => {
  try {
    const votes = getLocalVotes();
    const updated = votes.map(vote =>
      vote.id === voteId ? { ...vote, synced: true } : vote
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('❌ Failed to mark vote as synced:', error);
  }
};

/**
 * Sync unsynced votes to backup webhook
 */
export const syncUnsyncedVotes = async (): Promise<{ success: number; failed: number }> => {
  const unsyncedVotes = getUnsyncedVotes();
  
  if (unsyncedVotes.length === 0) {
    return { success: 0, failed: 0 };
  }

  let success = 0;
  let failed = 0;

  for (const vote of unsyncedVotes) {
    try {
      const response = await fetch(PROJECT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          '/text': vote.featureTitle,
          '/attributes/@title': vote.featureTitle,
          '/attributes/@category': vote.category,
          '/attributes/@vote': vote.voteType,
          '/attributes/@timestamp': vote.timestamp,
          '/attributes/@userName': vote.userName,
        }),
      });

      if (response.ok) {
        markVoteSynced(vote.id);
        success++;
        console.log('✅ Synced vote:', vote.featureTitle);
      } else {
        failed++;
        console.error('❌ Failed to sync vote:', vote.featureTitle, await response.text());
      }
    } catch (error) {
      failed++;
      console.error('❌ Error syncing vote:', error);
    }
  }

  return { success, failed };
};

/**
 * Export all votes as CSV for manual backup
 */
export const exportVotesAsCSV = (): string => {
  const votes = getLocalVotes();
  
  if (votes.length === 0) {
    return 'No votes to export';
  }

  const headers = ['Feature Title', 'Category', 'Vote', 'Timestamp', 'User', 'Synced'];
  const rows = votes.map(vote => [
    vote.featureTitle,
    vote.category,
    vote.voteType,
    vote.timestamp,
    vote.userName,
    vote.synced ? 'Yes' : 'No',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csv;
};

/**
 * Download votes as CSV file
 */
export const downloadVotesBackup = (): void => {
  const csv = exportVotesAsCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `intern_us_votes_backup_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Get backup statistics
 */
export const getBackupStats = (): {
  total: number;
  synced: number;
  unsynced: number;
} => {
  const votes = getLocalVotes();
  const synced = votes.filter(v => v.synced).length;
  
  return {
    total: votes.length,
    synced,
    unsynced: votes.length - synced,
  };
};

/**
 * Clear all local votes (use with caution!)
 */
export const clearAllLocalVotes = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ All local votes cleared');
  } catch (error) {
    console.error('❌ Failed to clear local votes:', error);
  }
};
