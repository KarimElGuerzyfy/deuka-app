import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Level } from '../types'
import type { Word } from '../types/vocabulary'
import { vocabularyService } from '../services/vocabularyService'
import { saveProfile } from '../services/profileService'
import type { UserProfile } from '../services/profileService'
import { supabase } from '../lib/supabase'

// Helper to safely get the current access token
async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

type AppMode = 'learning' | 'quiz'
type FeedbackState = 'idle' | 'correct' | 'incorrect'
type DisplayLanguage = 'en' | 'ar'

interface GameState {
  userId: string | null
  appMode: AppMode
  currentLevel: Level
  currentCenturionIndex: number
  currentBucketIndex: number
  displayLanguage: DisplayLanguage
  currentWord: Word | null
  seenWordIds: string[]
  wordIndexInBucket: number
  feedbackState: FeedbackState
  score: number
  timeLeft: number
  isQuizActive: boolean
  levelComplete: boolean
  timerEnabled: boolean
  wordsMastered: number
  bucketsCleared: number

  setUserId: (id: string | null) => void
  hydrateFromProfile: (profile: UserProfile) => void
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
  toggleTimer: () => void
}

/**
 * Persists current state to Supabase using a direct fetch (bypasses deadlocking Supabase client).
 */
const persistUserProfile = async () => {
  const state = useGameStore.getState()
  const { userId } = state

  if (!userId) return

  const accessToken = await getAccessToken()
  if (!accessToken) {
    console.error('[useGameStore] persistUserProfile failed: no access token')
    return
  }

  console.log('💾 Persisting profile:', {
    currentBucketIndex: state.currentBucketIndex,
    currentCenturionIndex: state.currentCenturionIndex,
    wordsMastered: state.wordsMastered,
    bucketsCleared: state.bucketsCleared,
  })

  try {
    await saveProfile(userId, {
      currentLevel: state.currentLevel,
      currentCenturionIndex: state.currentCenturionIndex,
      currentBucketIndex: state.currentBucketIndex,
      wordsMastered: state.wordsMastered,
      bucketsCleared: state.bucketsCleared,
      displayLanguage: state.displayLanguage,
      timerEnabled: state.timerEnabled,
    }, accessToken)
  } catch (error) {
    console.error('[useGameStore] persistUserProfile failed:', error)
  }
}

export const useGameStore = create<GameState>()(subscribeWithSelector((set, get) => ({
  userId: null,

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
  timerEnabled: true,
  wordsMastered: 0,
  bucketsCleared: 0,

  setUserId: (id) => set({ userId: id }),

  hydrateFromProfile: (profile: UserProfile) => {
    set({
      currentLevel: profile.currentLevel as Level,
      currentCenturionIndex: profile.currentCenturionIndex,
      currentBucketIndex: profile.currentBucketIndex,
      wordsMastered: profile.wordsMastered,
      bucketsCleared: profile.bucketsCleared,
      displayLanguage: profile.displayLanguage,
      timerEnabled: profile.timerEnabled,
      seenWordIds: [],
      wordIndexInBucket: 0,
      currentWord: null,
      score: 0,
      feedbackState: 'idle',
      appMode: 'learning',
    })
  },

  setAppMode: (mode) => set({ appMode: mode }),

  setLevel: (level) => {
    set({
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
      wordsMastered: 0,
      bucketsCleared: 0,
    })
    persistUserProfile()
  },

  toggleLanguage: () => {
    set((state) => ({
      displayLanguage: state.displayLanguage === 'en' ? 'ar' : 'en',
    }))
    persistUserProfile()
  },

  toggleTimer: () => {
    set((state) => ({ timerEnabled: !state.timerEnabled }))
    persistUserProfile()
  },

  submitAnswer: (isCorrect) =>
    set((state) => ({
      feedbackState: isCorrect ? 'correct' : 'incorrect',
      score: isCorrect ? state.score + 1 : state.score,
    })),

  markWordAsSeen: (id) =>
    set((state) => ({
      seenWordIds: [...state.seenWordIds, id],
    })),

  nextWord: () => {
    const state = get()
    try {
      const bucket = vocabularyService.getBucket(
        state.currentLevel,
        state.currentCenturionIndex,
        state.currentBucketIndex
      )
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

      const nextBucket = vocabularyService.getBucket(
        state.currentLevel,
        nextCenturionIndex,
        nextBucketIndex
      )
      const nextWord = nextBucket.words[nextWordIndex]

      set({
        currentWord: nextWord,
        wordIndexInBucket: nextWordIndex,
        currentBucketIndex: nextBucketIndex,
        currentCenturionIndex: nextCenturionIndex,
        seenWordIds: [...state.seenWordIds, nextWord.id],
      })
    } catch (error) {
      console.error('[useGameStore] nextWord failed:', error)
      set({ currentCenturionIndex: 0, currentBucketIndex: 0, wordIndexInBucket: 0 })
      const bucket = vocabularyService.getBucket(state.currentLevel, 0, 0)
      set({
        currentWord: bucket.words[0],
        seenWordIds: [...state.seenWordIds, bucket.words[0].id],
      })
    }
  },

  advanceBucket: () => {
    const state = get()
    let nextBucket = state.currentBucketIndex + 1
    let nextCenturion = state.currentCenturionIndex

    try {
      vocabularyService.getBucket(state.currentLevel, nextCenturion, nextBucket)
    } catch {
      nextBucket = 0
      nextCenturion += 1
      try {
        vocabularyService.getBucket(state.currentLevel, nextCenturion, nextBucket)
      } catch {
        set({
          levelComplete: true,
          feedbackState: 'idle',
          score: 0,
          timeLeft: 5,
          seenWordIds: [],
          wordIndexInBucket: 0,
          currentWord: null,
          wordsMastered: state.wordsMastered + 10,
          bucketsCleared: state.bucketsCleared + 1,
        })
        persistUserProfile()
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
      wordsMastered: state.wordsMastered + 10,
      bucketsCleared: state.bucketsCleared + 1,
    })
    persistUserProfile()
  },

  clearLevelComplete: () => set({ levelComplete: false }),

  resetSession: () =>
    set({
      userId: null,
      seenWordIds: [],
      score: 0,
      feedbackState: 'idle',
      timeLeft: 5,
      isQuizActive: false,
      appMode: 'learning',
      currentWord: null,
      currentLevel: 'A1',
      currentCenturionIndex: 0,
      currentBucketIndex: 0,
      wordsMastered: 0,
      bucketsCleared: 0,
      displayLanguage: 'en',
      timerEnabled: true,
    }),

  resetTimer: (time) => set({ timeLeft: time }),

  tickTimer: () =>
    set((state) => ({
      timeLeft: Math.max(0, state.timeLeft - 1),
    })),

  setQuizActive: (active) => set({ isQuizActive: active }),
})))