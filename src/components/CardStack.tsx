import { useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { vocabularyService } from '../services/vocabularyService'
// Removed RefreshCw as it was flagged as unused
import { Languages, HelpCircle, Plus } from 'lucide-react'

type CardRole = 'german' | 'translation' | 'hint'

const ROLE_COLORS: Record<CardRole, string> = {
  german: '#24766F',
  translation: '#0077CC',
  hint: '#458CAF',
}

const ROLE_TITLES: Record<CardRole, string> = {
  german: 'German',
  translation: 'Translation',
  hint: 'Hint',
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
    }, 250)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const getCardContent = (role: CardRole): string => {
    switch (role) {
      case 'german': return localWord ? localWord.de : 'Click GENERATE to start'
      case 'translation': return translationWord ?? (localWord ? 'Click TRANSLATE to reveal' : '—')
      case 'hint': return hintWord ?? (localWord ? 'Click HINT to reveal' : '—')
      default: return ''
    }
  }

  const getPositionStyles = (role: CardRole) => {
    if (role === exitingCard) return { zIndex: 40, transform: 'translateY(-120%) scale(1)', opacity: 0 }
    const index = deckOrder.indexOf(role)
    switch (index) {
      case 0: return { zIndex: 30, transform: 'translateY(0) scale(1)', opacity: 1 }
      case 1: return { zIndex: 20, transform: 'translateY(16px) scale(0.98)', opacity: 1 }
      case 2: return { zIndex: 10, transform: 'translateY(32px) scale(0.96)', opacity: 1 }
      default: return {}
    }
  }

  const btnBase = "shadow-deuka flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#B2E5FF]/26 border border-black/70 text-black font-bold text-sm transition-all hover:bg-[#B2E5FF]/35 active:scale-95 cursor-pointer"

  return (
    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8 w-full lg:justify-center">
      <div className="w-full max-w-[320px] sm:max-w-[448px] mx-auto lg:mx-0">
        <div className="relative w-full h-44 sm:h-52">
          {(['german', 'translation', 'hint'] as CardRole[]).map((role) => (
            <div
              key={role}
              className="absolute inset-0 rounded-2xl border border-black/10 flex flex-col items-center justify-center p-8 transition-all duration-500"
              style={{
                backgroundColor: ROLE_COLORS[role],
                boxShadow: '0 4px 5px rgba(0, 0, 0, 0.5)',
                ...getPositionStyles(role),
              }}
            >
              <span className="absolute top-5 left-5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                {ROLE_TITLES[role]}
              </span>
              <p className={`text-center text-white leading-snug ${role === 'hint' ? 'text-base italic' : 'text-2xl sm:text-3xl font-bold'}`}>
                {getCardContent(role)}
              </p>
              
              {/* Decorative Icons: Simplified to remove RefreshCw dependency */}
              <div className="absolute bottom-5 right-5 opacity-10">
                {role === 'translation' && <Languages size={40} className="text-white" />}
                {role === 'hint' && <HelpCircle size={40} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs mx-auto lg:mx-0">
        <button onClick={handleGenerate} className={btnBase}><Plus size={18} /> GENERATE</button>
        <button onClick={handleTranslate} disabled={!localWord} className={`${btnBase} disabled:opacity-30`}><Languages size={18} /> TRANSLATE</button>
        <button onClick={handleHint} disabled={!localWord} className={`${btnBase} disabled:opacity-30`}><HelpCircle size={18} /> HINT</button>
      </div>
    </div>
  )
}