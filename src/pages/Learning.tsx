import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'
import { vocabularyService } from '../services/vocabularyService'
import { translations } from '../i18n/translations'
import CardStack from '../components/CardStack'
import { ArrowRight, Download, X, Share } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import { SessionHeader } from '../components/SessionHeader'
import ProgressBar from '../components/ProgressBar'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function Learning() {
  const navigate = useNavigate()
  const { currentLevel, seenWordIds, currentBucketIndex, currentCenturionIndex, setAppMode, displayLanguage } = useGameStore()

  const t = translations[displayLanguage]

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !(window as unknown as { MSStream?: unknown }).MSStream
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as unknown as { standalone?: boolean }).standalone === true
  const alreadyDismissed = !!sessionStorage.getItem('install-dismissed')

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(isIos && !isStandalone && !alreadyDismissed)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (isStandalone || alreadyDismissed || isIos) return

    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [isIos, isStandalone, alreadyDismissed])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setDismissed(true)
    sessionStorage.setItem('install-dismissed', '1')
  }

  const bucket = (() => {
    try { return vocabularyService.getBucket(currentLevel, currentCenturionIndex, currentBucketIndex) }
    catch { return null }
  })()

  const wordsSeenInBucket = bucket ? seenWordIds.filter(id =>
    bucket.words.some(word => word.id === id)
  ).length : 0

  const allWordsSeen = bucket ? bucket.words.every(w => seenWordIds.includes(w.id)) : false

  const handleNext = () => {
    if (!allWordsSeen) return
    setAppMode('quiz')
    navigate('/quiz')
  }

  return (
    <PageContainer>
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-0">

        <header className="mb-6 sm:mb-10 text-center">
          <h2 className="mb-1 text-2xl font-bold text-[#1A1A1A]">{t.dailyPractice}</h2>
          <SessionHeader />
        </header>

        {/* Install Banner */}
        {showBanner && !dismissed && (
          <div className="mb-6 rounded-2xl bg-brand-dark text-white px-4 py-4 flex items-center justify-between gap-4 shadow-deuka">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                {isIos ? <Share size={20} className="text-white" /> : <Download size={20} className="text-white" />}
              </div>
              <div>
                <p className="text-sm font-bold">{t.installApp}</p>
                <p className="text-xs text-white/60 mt-0.5">
                  {isIos ? t.installIosHint : t.installAppSubtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!isIos && (
                <button
                  onClick={handleInstall}
                  className="px-3 py-1.5 bg-primary text-brand-dark text-xs font-bold rounded-lg transition-all active:scale-95"
                >
                  {t.installApp}
                </button>
              )}
              <button onClick={handleDismiss} className="text-white/40 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center py-2 sm:py-6">
          <CardStack />
        </div>

        <div className="mt-6 sm:mt-12 rounded-2xl sm:rounded-none bg-white sm:bg-transparent shadow-md sm:shadow-none border border-black/5 sm:border-0 px-4 py-4 sm:px-0 sm:py-0">
          <ProgressBar current={wordsSeenInBucket} total={10} />

          <button
            onClick={handleNext}
            disabled={!allWordsSeen}
            className={`shadow-deuka mt-4 sm:mt-8 mb-0 sm:mb-2 w-full max-w-xs mx-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95
              ${allWordsSeen
                ? 'bg-[#B2E5FF]/26 border border-brand-green text-black shadow-[0_0_12px_rgba(36,118,111,0.3)]'
                : 'bg-[#B2E5FF]/26 border border-black/70 text-black opacity-30 cursor-not-allowed'
              }`}
          >
            {t.next}
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </PageContainer>
  )
}