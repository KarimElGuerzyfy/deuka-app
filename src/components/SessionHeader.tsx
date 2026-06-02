import { useGameStore } from '../store/useGameStore'
import { translations } from '../i18n/translations'

export function SessionHeader() {
  const { currentLevel, currentCenturionIndex, currentBucketIndex, displayLanguage } = useGameStore()
  const t = translations[displayLanguage]

  return (
    <p className="text-sm font-medium text-[#1A1A1A]/60">
      {t.level} {currentLevel} — {t.centurion} {currentCenturionIndex + 1} · {t.bucket} {currentBucketIndex + 1}
    </p>
  )
}