// src/hooks/useQuizEngine.ts

import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'
import { vocabularyService } from '../services/vocabularyService'
import type { Word, Bucket } from '../types/vocabulary'

// --------------- Types ---------------

interface QuizQuestion {
  word: Word
  options: Word[]
  correctId: string
}

type QuizResult = 'pass' | 'fail' | null

// --------------- Helper ---------------

function buildQuestions(bucket: Bucket): QuizQuestion[] {
  return bucket.words.map((word) => {
    // Now passes the full bucket object, not just { words }
    const distractors = vocabularyService.getDistractors(word, bucket)
    const options = [...distractors, word].sort(() => 0.5 - Math.random())
    return { word, options, correctId: word.id }
  })
}

// --------------- Hook ---------------

export function useQuizEngine() {
  const navigate = useNavigate()
  const {
    currentLevel,
    currentCenturionIndex,
    currentBucketIndex,
    displayLanguage,
    timeLeft,
    resetTimer,
    tickTimer,
    submitAnswer,
    feedbackState,
    setAppMode,
    resetSession,
  } = useGameStore()

  // ---- Bucket & questions (stable references) ----
  const bucket = useMemo(
    () => vocabularyService.getBucket(currentLevel, currentCenturionIndex, currentBucketIndex),
    [currentLevel, currentCenturionIndex, currentBucketIndex]
  )

  const questions = useMemo<QuizQuestion[]>(
    () => buildQuestions(bucket),
    [bucket]
  )

  // ---- Local UI state ----
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [quizResult, setQuizResult] = useState<QuizResult>(null)

  // ---- Refs (never change, safe to omit from dependency arrays) ----
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  const currentQuestion = questions[questionIndex]
  const isRevealed = feedbackState !== 'idle'
  const isCorrect = selectedId === currentQuestion.correctId

  // ---- Timer control (stable callbacks) ----
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    resetTimer(5)
    if (mountedRef.current) {
      intervalRef.current = setInterval(() => {
        if (mountedRef.current) tickTimer()
      }, 1000)
    }
  }, [stopTimer, resetTimer, tickTimer])

  // ---- Answer logic (defined early, wrapped in useCallback for stable reference) ----
  const handleAnswer = useCallback(
    (wordId: string | null) => {
      stopTimer()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      setSelectedId(wordId)
      const isAnswerCorrect = wordId === currentQuestion.correctId
      submitAnswer(isAnswerCorrect)

      if (isAnswerCorrect) {
        timeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return
          const nextIndex = questionIndex + 1
          if (nextIndex >= questions.length) {
            setQuizResult('pass')
          } else {
            setQuestionIndex(nextIndex)
            setSelectedId(null)
          }
        }, 900)
      } else {
        timeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return
          setQuizResult('fail')
        }, 1200)
      }
    },
    [currentQuestion, questionIndex, questions.length, stopTimer, submitAnswer]
  )

  // ---- Side effects with correct dependencies ----

  // Start timer when a new question appears and not in feedback
  useEffect(() => {
    if (!quizResult && feedbackState === 'idle') {
      startTimer()
    }
    return () => stopTimer()
  }, [questionIndex, feedbackState, quizResult, startTimer, stopTimer])

  // Handle time‑out – now DEFERRED to avoid synchronous setState in effect
  useEffect(() => {
    if (timeLeft === 0 && feedbackState === 'idle' && !quizResult) {
      stopTimer()
      // Asynchronously call handleAnswer to satisfy React Compiler
      const timeoutId = setTimeout(() => {
        if (mountedRef.current) handleAnswer(null)
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [timeLeft, feedbackState, quizResult, stopTimer, handleAnswer])

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      stopTimer()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [stopTimer])

  // ---- Navigation helpers (stable) ----
  const handleRetry = useCallback(() => {
    setAppMode('learning')
    navigate('/')
  }, [setAppMode, navigate])

  const handleContinue = useCallback(() => {
    resetSession()
    setAppMode('learning')
    navigate('/')
  }, [resetSession, setAppMode, navigate])

  // ---- Public API ----
  return {
    currentQuestion,
    questionsCount: questions.length,
    questionIndex,
    selectedId,
    isRevealed,
    isCorrect,
    quizResult,
    handleAnswer,
    handleRetry,
    handleContinue,
    progressPercent: (questionIndex / questions.length) * 100,
    timeLeft,
    currentLevel,
    currentCenturionIndex,
    currentBucketIndex,
    displayLanguage,
  }
}