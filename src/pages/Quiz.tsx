import { useQuizEngine } from '../hooks/useQuizEngine'
import PageContainer from '../components/PageContainer'
import { SessionHeader } from '../components/SessionHeader'
import ProgressBar from '../components/ProgressBar'
import TimerPill from '../components/TimerPill'
import type { Word } from '../types/vocabulary'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

// --- OptionButton Component ---
interface OptionButtonProps {
  word: Word
  label: string
  displayLanguage: 'en' | 'ar'
  optionState: 'idle' | 'correct' | 'wrong'
  disabled: boolean
  onClick: () => void
}

function OptionButton({ word, label, displayLanguage, optionState, disabled, onClick }: OptionButtonProps) {
  const baseStyles = "relative flex items-center w-full p-4 rounded-xl border-2 transition-all duration-200 text-left"
  
  const stateStyles = {
    idle: "border-black/5 bg-white hover:border-black/20",
    correct: "border-green-500 bg-green-50 text-green-900",
    wrong: "border-red-500 bg-red-50 text-red-900"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${stateStyles[optionState]}`}
    >
      <span className={`flex items-center justify-center w-8 h-8 rounded-lg mr-4 font-bold text-sm
        ${optionState === 'idle' ? 'bg-black/5 text-black/40' : 'bg-current/10'}`}>
        {label}
      </span>
      <span className="text-lg font-medium">
        {displayLanguage === 'en' ? word.en : word.ar}
      </span>
      
      {optionState === 'correct' && <span className="ml-auto text-xl">✓</span>}
      {optionState === 'wrong' && <span className="ml-auto text-xl">✕</span>}
    </button>
  )
}

// --- PassScreen Component ---
function PassScreen() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 bg-app-bg">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full border-2 border-[#24766F] bg-[#24766F]/10 flex items-center justify-center">
          <span className="text-4xl text-[#24766F]">✓</span>
        </div>
        <h2 className="text-4xl font-bold text-[#1A1A1A] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Bucket Complete
        </h2>
        <p className="text-sm text-[#1A1A1A]/50">
          Perfect score — moving to the next bucket.
        </p>
      </div>
    </main>
  )
}

// --- Main Quiz Component ---
export default function Quiz() {
  const {
    currentQuestion,
    questionsCount,
    questionIndex,
    selectedId,
    isRevealed,
    isCorrect,
    quizResult,
    handleAnswer,
    timeLeft,
    displayLanguage,
  } = useQuizEngine()

  if (quizResult === 'pass') return <PassScreen />
  if (!currentQuestion) return null

  const getOptionState = (option: Word): 'idle' | 'correct' | 'wrong' => {
    if (!isRevealed) return 'idle'
    if (option.id === currentQuestion.correctId) return 'correct'
    if (option.id === selectedId) return 'wrong'
    return 'idle'
  }

  return (
    <PageContainer>
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-0">
        <header className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">
              Question {Math.min(questionIndex + 1, questionsCount)}/{questionsCount}
            </h2>
            <TimerPill timeLeft={timeLeft} />
          </div>
          <div className="mb-3 text-center">
            <SessionHeader />
          </div>
          <ProgressBar current={questionIndex} total={questionsCount} />
        </header>

        <div className="mb-6 sm:mb-8 rounded-2xl border border-black/8 bg-white sm:bg-[#FAFAFA] px-6 py-8 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-3">
            What does this mean?
          </p>
          <p
            className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {currentQuestion.word.de}
          </p>
          {isRevealed && isCorrect && currentQuestion.word.sentence && (
            <p className="mt-3 text-sm text-[#1A1A1A]/40 italic">
              {currentQuestion.word.sentence}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, i) => (
            <OptionButton
              key={option.id}
              word={option}
              label={OPTION_LABELS[i]}
              displayLanguage={displayLanguage}
              optionState={getOptionState(option)}
              disabled={isRevealed}
              onClick={() => handleAnswer(option.id)}
            />
          ))}
        </div>

        {selectedId === null && isRevealed && (
          <p className="mt-5 text-center text-xs text-red-400 font-medium tracking-wide">
            Time's up — no answer selected.
          </p>
        )}
      </div>
    </PageContainer>
  )
}