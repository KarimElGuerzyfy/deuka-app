interface ProgressBarProps {
  current: number
  total: number
  showLabel?: boolean
}

// Accepts current and total — renders the label and filled bar.
// Tracking logic stays in the page; this component only handles display.
export default function ProgressBar({ current, total, showLabel = true }: ProgressBarProps) {
  const progressPercent = (current / total) * 100

  return (
    <div>
      {showLabel && (
        <p className="mb-2 text-center text-sm font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
          {current} / {total}
        </p>
      )}
      <div className="h-3 w-full rounded-full bg-[#E5E5E5] overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progressPercent}%`, background: '#33BBFF' }}
        />
      </div>
    </div>
  )
}