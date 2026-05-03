// src/hooks/useQuizEngine.ts

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
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

// --------------- Helper (stable, no hooks) ---------------

function buildQuestions(bucket: Bucket): QuizQuestion[] {
  return bucket.words.map((word) => {
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
    feedbackState,
    resetTimer,
    tickTimer,
    submitAnswer,
    setAppMode,
    advanceBucket,
  } = useGameStore()

  // Stable questions – only recalculated when the bucket changes
  const questions = useMemo(() => {
    const bucket = vocabularyService.getBucket(currentLevel, currentCenturionIndex, currentBucketIndex)
    return buildQuestions(bucket)
  }, [currentLevel, currentCenturionIndex, currentBucketIndex])

  // Local UI state
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [quizResult, setQuizResult] = useState<QuizResult>(null)
  
  const currentQuestion = questions[questionIndex] || questions[questions.length - 1]
  const isRevealed = feedbackState !== 'idle'
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mountedRef = useRef(true)

  // ---- Timer Logic ----

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    resetTimer(5)
    intervalRef.current = setInterval(() => tickTimer(), 1000)
  }, [stopTimer, resetTimer, tickTimer])

  // ---- Stable Navigation Handlers ----

  const handleRetry = useCallback(() => {
    // Manually clear UI blockers but preserve progress
    useGameStore.setState({ 
      feedbackState: 'idle', 
      timeLeft: 5 
    })
    setAppMode('learning')
    navigate('/', { replace: true })
  }, [setAppMode, navigate])

  const handleContinue = useCallback(() => {
    // Advance progress only on pass
    advanceBucket()
    useGameStore.setState({ 
      feedbackState: 'idle', 
      timeLeft: 5 
    })
    setAppMode('learning')
    navigate('/', { replace: true })
  }, [advanceBucket, setAppMode, navigate])

  // ---- Answer Handling ----

  const handleAnswer = useCallback((wordId: string | null) => {
    if (feedbackState !== 'idle' || quizResult) return
    
    stopTimer()
    setSelectedId(wordId)
    
    const isAnswerCorrect = wordId === currentQuestion.correctId
    submitAnswer(isAnswerCorrect)

    if (isAnswerCorrect) {
      setTimeout(() => {
        if (!mountedRef.current) return
        
        const nextIndex = questionIndex + 1
        // Reset feedback locally for the next question
        useGameStore.setState({ feedbackState: 'idle' })

        if (nextIndex >= questions.length) {
          setQuestionIndex(questions.length)
          setQuizResult('pass')
        } else {
          setQuestionIndex(nextIndex)
          setSelectedId(null)
        }
      }, 1000)
    } else {
      setTimeout(() => {
        if (!mountedRef.current) return
        stopTimer()
        setQuizResult('fail')
      }, 1500)
    }
  }, [feedbackState, quizResult, currentQuestion.correctId, submitAnswer, stopTimer, questionIndex, questions.length])

  // ---- Effects ----

  // 1. Timer Control
  useEffect(() => {
    if (feedbackState === 'idle' && !quizResult) {
      startTimer()
    } else {
      stopTimer()
    }
    return () => stopTimer()
  }, [feedbackState, quizResult, questionIndex, startTimer, stopTimer])

  // 2. Timeout handling
  useEffect(() => {
    if (timeLeft === 0 && feedbackState === 'idle' && !quizResult) {
      const defer = setTimeout(() => handleAnswer(null), 0)
      return () => clearTimeout(defer)
    }
  }, [timeLeft, feedbackState, quizResult, handleAnswer])

  // 3. Auto-Navigation observer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (quizResult === 'pass') {
      timer = setTimeout(() => {
        if (mountedRef.current) handleContinue()
      }, 2000)
    } else if (quizResult === 'fail') {
      timer = setTimeout(() => {
        if (mountedRef.current) handleRetry()
      }, 2000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [quizResult, handleContinue, handleRetry])

  // 4. Cleanup on Unmount (Hard UI Reset)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      stopTimer()
      // Purge UI state so re-entry is fresh, but keep progression
      useGameStore.setState({ 
        feedbackState: 'idle', 
        timeLeft: 5 
      })
    }
  }, [stopTimer])

  // ---- Public API ----
  return {
    currentQuestion,
    questionsCount: questions.length,
    questionIndex,
    selectedId,
    isRevealed,
    isCorrect: selectedId === currentQuestion.correctId,
    quizResult,
    handleAnswer,
    timeLeft,
    displayLanguage,
    progressPercent: (questionIndex / questions.length) * 100
  }
}