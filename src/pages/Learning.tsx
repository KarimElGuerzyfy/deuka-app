import { useGameStore } from '../store/useGameStore'; 

export default function Learning() {

  const { currentLevel } = useGameStore();

  return (
    <main className="flex-1 flex px-8 py-12 overflow-hidden justify-center">
      <div className="flex flex-1 w-full max-w-7xl mx-auto flex-col rounded-3xl border border-black/5 bg-white p-10 shadow-sm overflow-hidden">

        <header className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold text-brand-dark">Daily Practice</h2>
          <p className="text-base font-medium text-brand-dark/60">
            Reviewing Level {currentLevel || 'B1'} vocabulary. 15 words remaining today.
          </p>
        </header>

        {/* This div now correctly fills all middle space */}
        <div className="flex flex-1 items-center justify-center">
          <div className="text-gray-300 font-bold uppercase tracking-widest">
            Word Content Area
          </div>
        </div>

        <footer className="w-full mt-8">
          <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
            <div className="h-full w-[70%] rounded-full bg-primary" />
          </div>
          <p className="mt-2 text-center text-xs font-bold text-brand-dark/40 uppercase tracking-tighter">
            7 / 10
          </p>
        </footer>

      </div>
    </main>
  );
}