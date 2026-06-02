import { useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { vocabularyService } from '../services/vocabularyService'
import { translations } from '../i18n/translations'
import { Languages, HelpCircle, RefreshCw } from 'lucide-react'

type CardRole = 'german' | 'translation' | 'hint'

const ROLE_COLORS: Record<CardRole, string> = {
  german: 'var(--color-brand-green)',
  translation: '#0077CC',
  hint: '#458CAF',
}

export default function CardStack() {
  const {
    currentLevel,
    currentCenturionIndex,
    currentBucketIndex,
    seenWordIds,
    wordIndexInBucket,
    displayLanguage,
    markWordAsSeen,
  } = useGameStore()

  const t = translations[displayLanguage]

  const ROLE_TITLES: Record<CardRole, string> = {
    german: t.cardRoleGerman,
    translation: t.cardRoleTranslation,
    hint: t.cardRoleHint,
  }

  const [deckOrder, setDeckOrder] = useState<CardRole[]>(['german', 'translation', 'hint'])
  const [isAnimating, setIsAnimating] = useState(false)
  const [exitingCard, setExitingCard] = useState<CardRole | null>(null)
  const [localWord, setLocalWord] = useState(useGameStore.getState().currentWord)
  const [translationWord, setTranslationWord] = useState<string | null>(null)
  const [hintWord, setHintWord] = useState<string | null>(null)

  const bucket = (() => {
    try {
      return vocabularyService.getBucket(currentLevel, currentCenturionIndex, currentBucketIndex)
    } catch {
      return null
    }
  })()

  const handleGenerate = () => {
    if (!bucket) return
    bringToFront('german')
    const nextIndex = localWord ? (wordIndexInBucket + 1) % bucket.words.length : 0
    const nextWord = bucket.words[nextIndex]
    if (!seenWordIds.includes(nextWord.id)) markWordAsSeen(nextWord.id)
    useGameStore.setState({ currentWord: nextWord, wordIndexInBucket: nextIndex })
    setLocalWord(nextWord)
    setTranslationWord(null)
    setHintWord(null)
  }

  const handleTranslate = () => {
    if (!localWord) return
    setTranslationWord(displayLanguage === 'en' ? localWord.en : localWord.ar)
    bringToFront('translation')
  }

  const handleHint = () => {
    if (!localWord) return
    setHintWord(localWord.sentence)
    bringToFront('hint')
  }

  const bringToFront = (targetRole: CardRole) => {
    if (isAnimating || deckOrder[0] === targetRole) return
    setIsAnimating(true)
    const topCard = deckOrder[0]
    setExitingCard(topCard)
    setTimeout(() => {
      setDeckOrder((prev) => {
        const remaining = prev.filter(r => r !== targetRole && r !== topCard)
        return [targetRole, ...remaining, topCard]
      })
      setExitingCard(null)
    }, 280)
    setTimeout(() => setIsAnimating(false), 480)
  }

  const getCardContent = (role: CardRole): string => {
    switch (role) {
      case 'german': return localWord ? localWord.de : t.cardPromptGenerate
      case 'translation': return translationWord ?? (localWord ? t.cardPromptTranslate : '—')
      case 'hint': return hintWord ?? (localWord ? t.cardPromptHint : '—')
      default: return ''
    }
  }

  const getPositionStyles = (role: CardRole) => {
    if (role === exitingCard) return {
      zIndex: 40,
      transform: 'translateY(-115%) scale(0.9)',
      opacity: 1,
    }
    const index = deckOrder.indexOf(role)
    switch (index) {
      case 0: return { zIndex: 30, transform: 'translateY(0px) scale(1)',     opacity: 1 }
      case 1: return { zIndex: 20, transform: 'translateY(16px) scale(0.98)', opacity: 1 }
      case 2: return { zIndex: 10, transform: 'translateY(32px) scale(0.96)', opacity: 1 }
      default: return {}
    }
  }

  const btnBase = "shadow-deuka flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#B2E5FF]/26 border border-black/70 text-black font-bold text-sm transition-all hover:bg-[#B2E5FF]/35 active:scale-95 cursor-pointer"

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 md:gap-16 lg:gap-x-8 w-full">

      {/* Card deck */}
      <div className="w-full max-w-md mx-auto lg:mx-0 shrink-0">
        <div className="relative w-full h-32 sm:h-52">
          {(['german', 'translation', 'hint'] as CardRole[]).map((role) => (
            <div
              key={role}
              className="absolute inset-0 rounded-2xl border border-black/10 flex flex-col items-center justify-center p-8 transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: ROLE_COLORS[role],
                boxShadow: '0 4px 5px rgba(0, 0, 0, 0.5)',
                ...getPositionStyles(role),
              }}
            >
              <span className="absolute top-5 left-5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                {ROLE_TITLES[role]}
              </span>

              <p
                className={`text-center text-white leading-snug ${
                  role === 'hint'
                    ? 'text-lg italic font-semibold'
                    : 'text-2xl sm:text-3xl font-bold'
                }`}
              >
                {getCardContent(role)}
              </p>

              <div className="absolute bottom-5 right-5 opacity-10">
                {role === 'translation' && <Languages size={40} className="text-white" />}
                {role === 'hint' && <HelpCircle size={40} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs mx-auto lg:mx-0">
        <button onClick={handleGenerate} className={btnBase}>
          {t.generate} <RefreshCw size={18} strokeWidth={2.5} />
        </button>
        <button onClick={handleTranslate} disabled={!localWord} className={`${btnBase} disabled:opacity-30`}>
          {t.translate} <Languages size={18} strokeWidth={2.5} />
        </button>
        <button onClick={handleHint} disabled={!localWord} className={`${btnBase} disabled:opacity-30`}>
          {t.hint} <HelpCircle size={18} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  )
}