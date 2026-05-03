import { useQuizEngine } from '../hooks/useQuizEngine'
import PageContainer from '../components/PageContainer'
import { SessionHeader } from '../components/SessionHeader'
import ProgressBar from '../components/ProgressBar'
import TimerPill from '../components/TimerPill'
import type { Word } from '../types/vocabulary'

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const FONT_SERIF = "'Cormorant Garamond', serif"

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
  const containerStyle: React.CSSProperties = (() => {
    switch (optionState) {
      case 'correct':
        return {
          background: '#91D5CF',
          borderColor: 'rgba(51,51,0,0.7)',
          boxShadow: '0px 2.99px 2.99px 0px rgba(0,0,0,0.25)',
        }
      case 'wrong':
        return {
          background: '#FFCCCC',
          borderColor: 'rgba(51,51,0,0.7)',
          boxShadow: '0px 2.99px 2.99px 0px rgba(0,0,0,0.25)',
        }
      default:
        return {
          background: 'rgba(178,229,255,0.26)',
          borderColor: 'rgba(51,51,0,0.7)',
          boxShadow: '0px 2.99px 2.99px 0px rgba(0,0,0,0.25)',
        }
    }
  })()

  const labelBg =
    optionState === 'correct' ? '#24766F'
    : optionState === 'wrong' ? '#EF4444'
    : '#1A1A1A'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between rounded-[18px] border-[0.75px] transition-all duration-300 ${
        !disabled ? 'active:scale-[0.98] cursor-pointer' : 'cursor-default'
      }`}
      style={{ padding: '11.73px 23.46px', ...containerStyle }}
    >
      <div className="flex items-center gap-4">
        <span
          className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0 transition-colors duration-300"
          style={{ background: labelBg }}
        >
          {label}
        </span>
        <span
          className="text-base font-medium text-[#1A1A1A]"
          style={{ fontFamily: FONT_SERIF, fontSize: '1.05rem' }}
          dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}
        >
          {displayLanguage === 'en' ? word.en : word.ar}
        </span>
      </div>
      {optionState === 'correct' && <span className="text-[#24766F] text-lg">✓</span>}
      {optionState === 'wrong' && <span className="text-red-500 text-lg">✕</span>}
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
        <h2 className="text-4xl font-bold text-[#1A1A1A] mb-3" style={{ fontFamily: FONT_SERIF }}>
          Bucket Complete
        </h2>
        <p className="text-sm text-[#1A1A1A]/50">
          Perfect score — moving to the next bucket.
        </p>
      </div>
    </main>
  )
}

// --- Status Popup ---
function StatusPopup({ message, type }: { message: string; type: 'wrong' | 'timeout' }) {
  const bg = type === 'timeout'
    ? 'rgba(254, 243, 199, 0.95)'  // soft amber
    : 'rgba(254, 226, 226, 0.95)'  // soft red

  const border = type === 'timeout'
    ? 'rgba(251, 191, 36, 0.4)'
    : 'rgba(239, 68, 68, 0.3)'

  return (
    <div
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-fit px-8 py-12 rounded-2xl shadow-lg flex items-center justify-center animate-fade-in z-10"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        backdropFilter: 'blur(4px)',
      }}
    >
      <p className="text-sm font-semibold text-[#1A1A1A] text-center leading-relaxed">
        {message}
      </p>
    </div>
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
    statusMessage,
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

  // Determine popup type from message content
  const popupType = statusMessage.startsWith("Time's up") ? 'timeout' : 'wrong'

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

        {/* Question card — relative so popup can be positioned against it */}
        <div className="relative mb-6 sm:mb-8 rounded-2xl border border-black/8 bg-white sm:bg-[#FAFAFA] px-6 py-8 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-3">
            What does this mean?
          </p>
          <p
            className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] leading-tight"
            style={{ fontFamily: FONT_SERIF }}
          >
            {currentQuestion.word.de}
          </p>
          {isRevealed && isCorrect && currentQuestion.word.sentence && (
            <p className="mt-3 text-sm text-[#1A1A1A]/40 italic">
              {currentQuestion.word.sentence}
            </p>
          )}

          {/* Status popup — floats over the question card */}
          {statusMessage && (
            <StatusPopup message={statusMessage} type={popupType} />
          )}
        </div>

        {/* Options */}
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

      </div>
    </PageContainer>
  )
}