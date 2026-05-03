import { create } from 'zustand'
import type { Level } from '../types'
import type { Word } from '../types/vocabulary'
import { vocabularyService } from '../services/vocabularyService'

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
  wordIndexInBucket: number

  // Quiz Session
  feedbackState: FeedbackState
  score: number
  timeLeft: number
  isQuizActive: boolean
  levelComplete: boolean  // signals level completion to the UI

  // Actions
  setAppMode: (mode: AppMode) => void
  setLevel: (level: Level) => void
  toggleLanguage: () => void
  submitAnswer: (isCorrect: boolean) => void
  markWordAsSeen: (id: string) => void
  nextWord: () => void
  advanceBucket: () => void
  resetSession: () => void
  resetTimer: (time: number) => void
  tickTimer: () => void
  setQuizActive: (active: boolean) => void
  clearLevelComplete: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial State
  appMode: 'learning',
  currentLevel: 'A1',
  currentCenturionIndex: 0,
  currentBucketIndex: 0,
  displayLanguage: 'en',
  currentWord: null,
  seenWordIds: [],
  wordIndexInBucket: 0,
  feedbackState: 'idle',
  score: 0,
  timeLeft: 5,
  isQuizActive: false,
  levelComplete: false,

  // Actions
  setAppMode: (mode) => set({ appMode: mode }),

  setLevel: (level) => set({
    currentLevel: level,
    currentCenturionIndex: 0,
    currentBucketIndex: 0,
    seenWordIds: [],
    wordIndexInBucket: 0,
    score: 0,
    feedbackState: 'idle',
    appMode: 'learning',
    currentWord: null,
    levelComplete: false,
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

  nextWord: () => {
    const state = get()
    try {
      const bucket = vocabularyService.getBucket(state.currentLevel, state.currentCenturionIndex, state.currentBucketIndex)

      let nextWordIndex = state.currentWord ? state.wordIndexInBucket + 1 : 0
      let nextBucketIndex = state.currentBucketIndex
      let nextCenturionIndex = state.currentCenturionIndex

      if (nextWordIndex >= bucket.words.length) {
        nextWordIndex = 0
        nextBucketIndex += 1

        try {
          vocabularyService.getBucket(state.currentLevel, nextCenturionIndex, nextBucketIndex)
        } catch {
          nextBucketIndex = 0
          nextCenturionIndex += 1
        }
      }

      const nextBucket = vocabularyService.getBucket(state.currentLevel, nextCenturionIndex, nextBucketIndex)
      const nextWord = nextBucket.words[nextWordIndex]

      set({
        currentWord: nextWord,
        wordIndexInBucket: nextWordIndex,
        currentBucketIndex: nextBucketIndex,
        currentCenturionIndex: nextCenturionIndex,
        seenWordIds: [...state.seenWordIds, nextWord.id]
      })
    } catch (error) {
      console.error('Error fetching next word:', error)
      set({ currentCenturionIndex: 0, currentBucketIndex: 0, wordIndexInBucket: 0 })
      const bucket = vocabularyService.getBucket(state.currentLevel, 0, 0)
      set({ currentWord: bucket.words[0], seenWordIds: [...state.seenWordIds, bucket.words[0].id] })
    }
  },

  advanceBucket: () => {
    const state = get()
    let nextBucket = state.currentBucketIndex + 1
    let nextCenturion = state.currentCenturionIndex

    try {
      // Try next bucket in current centurion
      vocabularyService.getBucket(state.currentLevel, nextCenturion, nextBucket)
    } catch {
      // No more buckets — try next centurion
      nextBucket = 0
      nextCenturion += 1
      try {
        vocabularyService.getBucket(state.currentLevel, nextCenturion, nextBucket)
      } catch {
        // No more centurions — level is complete
        set({
          levelComplete: true,
          feedbackState: 'idle',
          score: 0,
          timeLeft: 5,
          seenWordIds: [],
          wordIndexInBucket: 0,
          currentWord: null,
        })
        return
      }
    }

    set({
      currentCenturionIndex: nextCenturion,
      currentBucketIndex: nextBucket,
      seenWordIds: [],
      wordIndexInBucket: 0,
      currentWord: null,
      score: 0,
      feedbackState: 'idle',
    })
  },

  clearLevelComplete: () => set({ levelComplete: false }),

  resetSession: () => set({
    seenWordIds: [],
    score: 0,
    feedbackState: 'idle',
    timeLeft: 5,
    isQuizActive: false,
    appMode: 'learning',
  }),

  resetTimer: (time) => set({ timeLeft: time }),

  tickTimer: () => set((state) => ({
    timeLeft: Math.max(0, state.timeLeft - 1)
  })),

  setQuizActive: (active) => set({ isQuizActive: active }),
}))