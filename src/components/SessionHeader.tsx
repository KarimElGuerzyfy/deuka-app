import { useGameStore } from '../store/useGameStore'

export function SessionHeader() {
  const { currentLevel, currentCenturionIndex, currentBucketIndex } = useGameStore()

  return (
    <p className="text-sm font-medium text-[#1A1A1A]/60">
      Level {currentLevel} — Centurion {currentCenturionIndex + 1} · Bucket {currentBucketIndex + 1}
    </p>
  )
}