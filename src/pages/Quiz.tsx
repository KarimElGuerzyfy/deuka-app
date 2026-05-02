import PageContainer from '../components/PageContainer'
import { SessionHeader } from '../components/SessionHeader'
import ProgressBar from '../components/ProgressBar'
import TimerPill from '../components/TimerPill'

export default function Quiz() {
  return (
    <PageContainer>
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-0">

<header className="mb-4 sm:mb-6">
  <div className="flex items-center justify-between mb-1">
    <h2 className="text-2xl font-bold text-[#1A1A1A]">Quiz Gate</h2>
    <TimerPill timeLeft={5} />
  </div>
  <div className="mb-3 text-center">
    <SessionHeader />
  </div>
  <ProgressBar current={0} total={10} />
</header>

        <div className="flex flex-col gap-6 py-2 sm:py-6">
          <div className="h-64 w-full rounded-2xl border-2 border-dashed border-black/10 flex items-center justify-center text-black/20 font-bold">
            QUIZ INTERFACE START
          </div>
        </div>

      </div>
    </PageContainer>
  )
}