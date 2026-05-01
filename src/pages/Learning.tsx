import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'
import { vocabularyService } from '../services/vocabularyService'
import CardStack from '../components/CardStack'
import { ArrowRight } from 'lucide-react'

export default function Learning() {
  const navigate = useNavigate()
  const { currentLevel, seenWordIds, currentBucketIndex, currentCenturionIndex, setAppMode } = useGameStore()

  const wordsSeenInBucket = seenWordIds.filter(id =>
    id.startsWith(`${currentLevel}-${currentCenturionIndex + 1}-${currentBucketIndex + 1}`)
  ).length

  const progressPercent = (wordsSeenInBucket / 10) * 100
  const bucket = (() => {
    try { return vocabularyService.getBucket(currentLevel, currentCenturionIndex, currentBucketIndex) }
    catch { return null }
  })()

  const allWordsSeen = bucket ? bucket.words.every(w => seenWordIds.includes(w.id)) : false

  const handleNext = () => {
    if (!allWordsSeen) return
    setAppMode('quiz')
    navigate('/quiz')
  }

  return (
    <main className="flex-1 flex px-4 py-6 sm:px-10 lg:py-12 overflow-y-auto justify-center items-start sm:items-center bg-app-bg">
      <div className="flex flex-col w-full max-w-7xl mx-auto
        rounded-none sm:rounded-2xl
        border-0 sm:border sm:border-black/5
        bg-transparent sm:bg-white
        p-0 sm:p-12 lg:p-20
        shadow-none sm:shadow-sm
        h-fit sm:my-auto">
        <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-0">

          <header className="mb-6 sm:mb-10 text-center">
            <h2 className="mb-1 text-2xl font-bold text-[#1A1A1A]">Daily Practice</h2>
            <p className="text-sm font-medium text-[#1A1A1A]/60">
              Level {currentLevel} — Centurion {currentCenturionIndex + 1} · Bucket {currentBucketIndex + 1}
            </p>
          </header>

          <div className="flex items-center justify-center py-2 sm:py-6">
            <CardStack />
          </div>

          {/* Progress + Next — floating card on mobile only */}
          <div className="mt-6 sm:mt-12 rounded-2xl sm:rounded-none bg-white sm:bg-transparent shadow-md sm:shadow-none border border-black/5 sm:border-0 px-4 py-4 sm:px-0 sm:py-0">
            <p className="mb-2 text-center text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-[0.2em]">
              {wordsSeenInBucket} / 10
            </p>
            <div className="h-1.5 w-full rounded-full bg-[#E5E5E5] overflow-hidden">
              <div
                className="h-full bg-[#24766F] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!allWordsSeen}
              className={`shadow-deuka mt-4 sm:mt-8 mb-0 sm:mb-2 w-full max-w-xs mx-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95
                ${allWordsSeen
                  ? 'bg-[#B2E5FF]/26 border border-[#24766F] text-black shadow-[0_0_12px_rgba(36,118,111,0.3)]'
                  : 'bg-[#B2E5FF]/26 border border-black/70 text-black opacity-30 cursor-not-allowed'
                }`}
            >
              NEXT
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}