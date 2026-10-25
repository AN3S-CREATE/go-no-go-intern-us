import { create } from 'zustand';
import type { InnovationCard } from '../types';

interface AppState {
  hasAcceptedNeuroLogix: boolean;
  hasCompletedOnboarding: boolean;
  currentCardIndex: number;
  innovations: InnovationCard[];
  userName: string;
  setHasAcceptedNeuroLogix: (value: boolean) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  setCurrentCardIndex: (index: number) => void;
  setInnovations: (innovations: InnovationCard[]) => void;
  setUserName: (name: string) => void;
  nextCard: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  hasAcceptedNeuroLogix: false,
  hasCompletedOnboarding: false,
  currentCardIndex: 0,
  innovations: [],
  userName: 'Guest User',
  setHasAcceptedNeuroLogix: (value) => set({ hasAcceptedNeuroLogix: value }),
  setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
  setCurrentCardIndex: (index) => set({ currentCardIndex: index }),
  setInnovations: (innovations) => set({ innovations }),
  setUserName: (name) => set({ userName: name }),
  nextCard: () => set((state) => ({ 
    currentCardIndex: Math.min(state.currentCardIndex + 1, state.innovations.length) 
  })),
}));
