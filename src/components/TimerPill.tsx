import { Timer } from 'lucide-react'
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
      className="flex items-center rounded-lg border transition-colors duration-300"
      style={{
        background: isUrgent ? '#FEE2E2' : '#E5EEFF',
        borderColor: isUrgent ? '#FCA5A5' : '#C2C7CF',
        padding: '8px 16px',
        boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
        gap: '7.99px',
      }}
    >
        <Timer
          size={20}
          strokeWidth={2.5}
          color={isUrgent ? '#EF4444' : '#003453'}
        />
      <span
        className="tabular-nums"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '33.6px',
          color: isUrgent ? '#EF4444' : '#003453',
        }}
      >
        {formatted}
      </span>
    </div>
  )
}