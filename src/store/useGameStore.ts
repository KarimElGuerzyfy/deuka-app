import { create } from 'zustand'
import type { Level } from '../types'
import type { Word } from '../types/vocabulary'

type AppMode = 'learning' | 'quiz'
type FeedbackState = 'idle' | 'correct' | 'incorrect'
type DisplayLanguage = 'en' | 'ar'

interface GameState {
  // App Control
  appMode: AppMode
  currentLevel: Level
  currentCenturionIndex: number
  currentBucketIndex: number
  displayLanguage: DisplayLanguage

  // Learning Session
  currentWord: Word | null
  seenWordIds: string[]

  // Quiz Session
  feedbackState: FeedbackState
  score: number
  timeLeft: number
  isQuizActive: boolean

  // Actions
  setAppMode: (mode: AppMode) => void
  setLevel: (level: Level) => void
  toggleLanguage: () => void
  submitAnswer: (isCorrect: boolean) => void
  markWordAsSeen: (id: string) => void
  resetSession: () => void
  resetTimer: (time: number) => void
  tickTimer: () => void
  setQuizActive: (active: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
  // Initial State
  appMode: 'learning',
  currentLevel: 'A1',
  currentCenturionIndex: 0,
  currentBucketIndex: 0,
  displayLanguage: 'en',
  currentWord: null,
  seenWordIds: [],
  feedbackState: 'idle',
  score: 0,
  timeLeft: 5,
  isQuizActive: false,

  // Actions
  setAppMode: (mode) => set({ appMode: mode }),
  setLevel: (level) => set({ 
    currentLevel: level,
    currentCenturionIndex: 0,
    currentBucketIndex: 0,
    seenWordIds: [],
    score: 0,
    feedbackState: 'idle',
    appMode: 'learning'
  }),
  toggleLanguage: () => set((state) => ({
    displayLanguage: state.displayLanguage === 'en' ? 'ar' : 'en'
  })),
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
    isQuizActive: false,
    appMode: 'learning'
  }),
  resetTimer: (time) => set({ timeLeft: time }),
  tickTimer: () => set((state) => ({
    timeLeft: Math.max(0, state.timeLeft - 1)
  })),
  setQuizActive: (active) => set({ isQuizActive: active }),
}))