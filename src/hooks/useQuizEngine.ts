import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'
import { vocabularyService } from '../services/vocabularyService'
import type { Word, Bucket } from '../types/vocabulary'

interface QuizQuestion {
  word: Word
  options: Word[]
  correctId: string
}

type QuizResult = 'pass' | 'fail' | 'level-complete' | null

function buildQuestions(bucket: Bucket): QuizQuestion[] {
  return bucket.words.map((word) => {
    const distractors = vocabularyService.getDistractors(word, bucket)
    const options = [...distractors, word].sort(() => 0.5 - Math.random())
    return { word, options, correctId: word.id }
  })
}

export function useQuizEngine() {
  const navigate = useNavigate()
  const {
    currentLevel,
    currentCenturionIndex,
    currentBucketIndex,
    displayLanguage,
    timeLeft,
    feedbackState,
    timerEnabled,
    resetTimer,
    tickTimer,
    submitAnswer,
    setAppMode,
    advanceBucket,
    clearLevelComplete,
  } = useGameStore()

  const questions = useMemo(() => {
    const bucket = vocabularyService.getBucket(currentLevel, currentCenturionIndex, currentBucketIndex)
    return buildQuestions(bucket)
  }, [currentLevel, currentCenturionIndex, currentBucketIndex])

  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [quizResult, setQuizResult] = useState<QuizResult>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')

  const currentQuestion = questions[questionIndex] || questions[questions.length - 1]
  const isRevealed = feedbackState !== 'idle'
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mountedRef = useRef(true)

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    resetTimer(5)
    if (timerEnabled) {
      intervalRef.current = setInterval(() => tickTimer(), 1000)
    }
  }, [stopTimer, resetTimer, tickTimer, timerEnabled])

  const handleRetry = useCallback(() => {
    useGameStore.setState({ feedbackState: 'idle', timeLeft: 5, score: 0 })
    setAppMode('learning')
    navigate('/', { replace: true })
  }, [setAppMode, navigate])

  const handleContinue = useCallback(() => {
    // Single source of truth for bucket advancement
    advanceBucket()
    useGameStore.setState({ feedbackState: 'idle', timeLeft: 5 })
    setAppMode('learning')
    navigate('/', { replace: true })
  }, [advanceBucket, setAppMode, navigate])

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

        useGameStore.setState({ feedbackState: 'idle' })

        if (nextIndex >= questions.length) {
          setQuestionIndex(questions.length)

          // Peek ahead without mutating store — handleContinue does the actual advance
          const state = useGameStore.getState()
          let nextBucket = state.currentBucketIndex + 1
          let nextCenturion = state.currentCenturionIndex
          let isLevelDone = false

          try {
            vocabularyService.getBucket(state.currentLevel, nextCenturion, nextBucket)
          } catch {
            nextBucket = 0
            nextCenturion += 1
            try {
              vocabularyService.getBucket(state.currentLevel, nextCenturion, nextBucket)
            } catch {
              isLevelDone = true
            }
          }

          setQuizResult(isLevelDone ? 'level-complete' : 'pass')
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
        setStatusMessage(
          wordId === null
            ? "Time's up — review the bucket and try again"
            : 'Incorrect — review the bucket and try again'
        )
      }, 1500)
    }
  }, [feedbackState, quizResult, currentQuestion.correctId, submitAnswer, stopTimer, questionIndex, questions.length])

  // Timer control
  useEffect(() => {
    if (feedbackState === 'idle' && !quizResult) {
      startTimer()
    } else {
      stopTimer()
    }
    return () => stopTimer()
  }, [feedbackState, quizResult, questionIndex, startTimer, stopTimer])

  // Auto-timeout
  useEffect(() => {
    if (timeLeft === 0 && feedbackState === 'idle' && !quizResult && timerEnabled) {
      const defer = setTimeout(() => handleAnswer(null), 0)
      return () => clearTimeout(defer)
    }
  }, [timeLeft, feedbackState, quizResult, handleAnswer, timerEnabled])

  const handleLevelContinue = () => {
  clearLevelComplete()
  advanceBucket()
  setAppMode('learning')
  navigate('/', { replace: true })
}

  // Navigation after completion
useEffect(() => {
  let timer: ReturnType<typeof setTimeout>
  if (quizResult === 'pass') {
    timer = setTimeout(() => { if (mountedRef.current) handleContinue() }, 1300)
  } else if (quizResult === 'fail') {
    timer = setTimeout(() => { if (mountedRef.current) handleRetry() }, 2500)
  } else if (quizResult === 'level-complete') {
    timer = setTimeout(() => { if (mountedRef.current) handleLevelContinue() }, 1300)
  }
  return () => { if (timer) clearTimeout(timer) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [quizResult])

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      stopTimer()
      useGameStore.setState({ feedbackState: 'idle', timeLeft: 5 })
    }
  }, [stopTimer])


  return {
    currentQuestion,
    questionsCount: questions.length,
    questionIndex,
    selectedId,
    isRevealed,
    isCorrect: selectedId === currentQuestion.correctId,
    quizResult,
    statusMessage,
    handleAnswer,
    handleLevelContinue,
    timeLeft,
    displayLanguage,
    currentLevel,
    progressPercent: (questionIndex / questions.length) * 100,
  }
}