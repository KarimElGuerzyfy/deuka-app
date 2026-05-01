import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'
import { vocabularyService } from '../services/vocabularyService'
import CardStack from '../components/CardStack'
import { ArrowRight } from 'lucide-react'

export default function Learning() {
  const navigate = useNavigate()
  const { 
    currentLevel, 
    seenWordIds, 
    currentBucketIndex, 
    currentCenturionIndex,
    setAppMode
  } = useGameStore()

  const wordsSeenInBucket = seenWordIds.filter(id =>
    id.startsWith(`${currentLevel}-${currentCenturionIndex + 1}-${currentBucketIndex + 1}`)
  ).length

  const progressPercent = (wordsSeenInBucket / 10) * 100

  const bucket = (() => {
    try {
      return vocabularyService.getBucket(currentLevel, currentCenturionIndex, currentBucketIndex)
    } catch {
      return null
    }
  })()

  const allWordsSeen = bucket
    ? bucket.words.every(w => seenWordIds.includes(w.id))
    : false

  const handleNext = () => {
    if (!allWordsSeen) return
    setAppMode('quiz')
    navigate('/quiz')
  }

  return (
    <main className="flex-1 flex px-10 py-20 overflow-hidden justify-center bg-app-bg">
      <div className="flex flex-col flex-1 w-full max-w-7xl mx-auto rounded-2xl border border-black/5 bg-white p-20 shadow-sm overflow-hidden">

        <div className="flex flex-col flex-1 w-full max-w-2xl mx-auto">

          {/* Header */}
          <header className="mb-8 text-center">
            <h2 className="mb-1 text-2xl font-bold text-[#1A1A1A]">Daily Practice</h2>
            <p className="text-sm font-medium text-[#1A1A1A]/60">
              Level {currentLevel} — Centurion {currentCenturionIndex + 1} · Bucket {currentBucketIndex + 1}
            </p>
          </header>

          {/* Card Stack */}
          <div className="flex-1 flex items-center justify-center">
            <CardStack />
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <p className="mb-2 text-center text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-[0.2em]">
              {wordsSeenInBucket} / 10
            </p>
            <div className="h-1 w-full rounded-full bg-[#E5E5E5] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#24766F] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* NEXT Button */}
          <button
            onClick={handleNext}
            disabled={!allWordsSeen}
            className={`shadow-deuka mt-4 w-64 mx-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 cursor-pointer
              ${allWordsSeen
                ? 'bg-[#B2E5FF]/26 border border-[#24766F] text-black shadow-[0_0_12px_rgba(36,118,111,0.3)] hover:bg-[#B2E5FF]/35'
                : 'bg-[#B2E5FF]/26 border border-black/70 text-black opacity-30 cursor-not-allowed'
              }`}
          >
            NEXT
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>

        </div>
      </div>
    </main>
  )
}