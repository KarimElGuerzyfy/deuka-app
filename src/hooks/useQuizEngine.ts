// src/hooks/useQuizEngine.ts

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

type QuizResult = 'pass' | 'fail' | null

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
    resetTimer,
    tickTimer,
    submitAnswer,
    setAppMode,
    advanceBucket,
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
    intervalRef.current = setInterval(() => tickTimer(), 1000)
  }, [stopTimer, resetTimer, tickTimer])

  const handleRetry = useCallback(() => {
    useGameStore.setState({ feedbackState: 'idle', timeLeft: 5 })
    setAppMode('learning')
    navigate('/', { replace: true })
  }, [setAppMode, navigate])

  const handleContinue = useCallback(() => {
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
        // Differentiate between timeout and wrong answer
        setStatusMessage(
          wordId === null
            ? "Time's up — review the bucket and try again"
            : 'Incorrect — review the bucket and try again'
        )
      }, 1500)
    }
  }, [feedbackState, quizResult, currentQuestion.correctId, submitAnswer, stopTimer, questionIndex, questions.length])

  useEffect(() => {
    if (feedbackState === 'idle' && !quizResult) {
      startTimer()
    } else {
      stopTimer()
    }
    return () => stopTimer()
  }, [feedbackState, quizResult, questionIndex, startTimer, stopTimer])

  useEffect(() => {
    if (timeLeft === 0 && feedbackState === 'idle' && !quizResult) {
      const defer = setTimeout(() => handleAnswer(null), 0)
      return () => clearTimeout(defer)
    }
  }, [timeLeft, feedbackState, quizResult, handleAnswer])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (quizResult === 'pass') {
      timer = setTimeout(() => { if (mountedRef.current) handleContinue() }, 2500)
    } else if (quizResult === 'fail') {
      timer = setTimeout(() => { if (mountedRef.current) handleRetry() }, 2500)
    }
    return () => { if (timer) clearTimeout(timer) }
  }, [quizResult, handleContinue, handleRetry])

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
    timeLeft,
    displayLanguage,
    progressPercent: (questionIndex / questions.length) * 100,
  }
}