import { create } from 'zustand';

interface GameState {
  // State
  appMode: 'learning' | 'quiz';
  feedbackState: 'idle' | 'correct' | 'incorrect';
  score: number;
  timeLeft: number;
  isQuizActive: boolean;
  seenWordIds: string[];

  // Actions
  setAppMode: (mode: 'learning' | 'quiz') => void;
  submitAnswer: (isCorrect: boolean) => void;
  markWordAsSeen: (id: string) => void;
  resetSession: () => void;
  resetTimer: (time: number) => void;
  tickTimer: () => void;
  setQuizActive: (active: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Initial State
  appMode: 'learning',
  feedbackState: 'idle',
  score: 0,
  timeLeft: 5,
  isQuizActive: false,
  seenWordIds: [],

  // Actions
  setAppMode: (mode) => set({ appMode: mode }),

  submitAnswer: (isCorrect) => set((state) => ({
    feedbackState: isCorrect ? 'correct' : 'incorrect',
    score: isCorrect ? state.score + 1 : state.score,
  })),

  markWordAsSeen: (id) => set((state) => ({
    seenWordIds: [...state.seenWordIds, id]
  })),

  resetSession: () => set({ 
    seenWordIds: [], 
    score: 0, 
    feedbackState: 'idle',
    timeLeft: 5,
    isQuizActive: false 
  }),

  resetTimer: (time) => set({ timeLeft: time }),

  tickTimer: () => set((state) => ({ 
    timeLeft: Math.max(0, state.timeLeft - 1) 
  })),

  setQuizActive: (active) => set({ isQuizActive: active }),
}));