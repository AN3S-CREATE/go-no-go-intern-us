import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { getBackupStats, getLocalVotes } from './services/voteBackup';

// Debug helper: Check vote status in console
(window as any).checkVotes = () => {
  const stats = getBackupStats();
  const votes = getLocalVotes();
  console.log('📊 Vote System Status:');
  console.log(`  Total votes: ${stats.total}`);
  console.log(`  Synced: ${stats.synced}`);
  console.log(`  Unsynced: ${stats.unsynced}`);
  console.log('📋 All votes:', votes);
  return stats;
};

console.log('💡 Type checkVotes() in console to see vote status');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
