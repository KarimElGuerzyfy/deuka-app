interface ProgressBarProps {
  current: number
  total: number
}

// Accepts current and total — renders the label and filled bar.
// Tracking logic stays in the page; this component only handles display.
export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progressPercent = (current / total) * 100

  return (
    <div>
      <p className="mb-2 text-center text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-[0.2em]">
        {current} / {total}
      </p>
      <div className="h-1.5 w-full rounded-full bg-[#E5E5E5] overflow-hidden">
        <div
          className="h-full bg-[#24766F] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}