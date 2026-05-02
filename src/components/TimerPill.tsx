interface TimerPillProps {
  timeLeft: number
}

// Displays remaining time as a pill badge matching the Figma spec.
// Background #E5EEFF, border #C2C7CF, 8px radius, subtle drop shadow.
// Turns red when 2 seconds or less remain.
export default function TimerPill({ timeLeft }: TimerPillProps) {
  const isUrgent = timeLeft <= 2
  const formatted = `00:0${timeLeft}`

  return (
    <div
      className="flex items-center gap-2 rounded-lg border transition-colors duration-300"
      style={{
        background: isUrgent ? '#FEE2E2' : '#E5EEFF',
        borderColor: isUrgent ? '#FCA5A5' : '#C2C7CF',
        padding: '8px 16px',
        boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isUrgent ? '#EF4444' : '#1A1A1A'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span
        className="text-sm font-medium tabular-nums"
        style={{
          fontFamily: "'Space Mono', monospace",
          color: isUrgent ? '#EF4444' : '#1A1A1A',
        }}
      >
        {formatted}
      </span>
    </div>
  )
}