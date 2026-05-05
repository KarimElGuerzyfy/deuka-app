import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { X, Loader2 } from 'lucide-react'
import type { Level } from '../types'

// ---------------------------------------------------------------------------
// Level Switch Modal
// ---------------------------------------------------------------------------

interface LevelSwitchModalProps {
  isOpen: boolean
  targetLevel: Level | null
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}

function LevelSwitchModal({ isOpen, targetLevel, onConfirm, onCancel, isLoading }: LevelSwitchModalProps) {
  const [input, setInput] = useState('')
  const matches = input === targetLevel

  if (!isOpen || !targetLevel) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-5">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>

        <div>
          <h2 className="text-lg font-bold text-gray-900">Switch to Level {targetLevel}?</h2>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">
            Switching levels will permanently reset all your current progress — buckets cleared, words mastered, and your position in the curriculum. This cannot be undone.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Type <span className="text-red-500 font-mono">{targetLevel}</span> to confirm
          </p>
          {/* Key prop added to reset input state when target level changes */}
          <input
            key={targetLevel ?? 'closed'}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={targetLevel}
            autoFocus
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { if (matches) onConfirm() }}
            disabled={!matches || isLoading}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : `Switch to ${targetLevel}`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [pendingLevel, setPendingLevel] = useState<Level | null>(null)
  const [isSwitching, setIsSwitching] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { user, signOut } = useAuth()
  const { currentLevel, setLevel, displayLanguage, toggleLanguage } = useGameStore()

  const userInitial = user?.email?.[0]?.toUpperCase() || 'U'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLevelClick = (lvl: Level) => {
    if (lvl === currentLevel) return
    setPendingLevel(lvl)
  }

  const handleLevelConfirm = async () => {
    if (!pendingLevel) return
    setIsSwitching(true)

    try {
      setLevel(pendingLevel)

      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token && user?.id) {
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
              'Content-Type': 'application/json',
              Prefer: 'resolution=merge-duplicates,return=minimal',
            },
            body: JSON.stringify({
              id: user.id,
              current_level: pendingLevel,
              current_centurion_index: 0,
              current_bucket_index: 0,
              words_mastered: 0,
              buckets_cleared: 0,
              updated_at: new Date().toISOString(),
            }),
          }
        )
      }
    } catch (err) {
      console.error('Level switch failed:', err)
    } finally {
      setIsSwitching(false)
      setPendingLevel(null)
    }
  }

  return (
    <>
      <LevelSwitchModal
        isOpen={!!pendingLevel}
        targetLevel={pendingLevel}
        onConfirm={handleLevelConfirm}
        onCancel={() => setPendingLevel(null)}
        isLoading={isSwitching}
      />

      <nav className="px-10 py-4 border-b bg-white border-black/10 sticky top-0 z-50 shadow-md">
        <div className="w-full max-w-7xl container mx-auto flex justify-between items-center">
          <Link to="/" onClick={() => setIsProfileOpen(false)}>
            <img src="/logo.svg" alt="DEUKA" className="h-6" />
          </Link>

          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {(['A1', 'A2', 'B1', 'B2'] as Level[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelClick(lvl)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  currentLevel === lvl
                    ? 'bg-white text-black shadow-sm cursor-default'
                    : 'text-gray-500 hover:text-black cursor-pointer'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm hover:opacity-80 transition-opacity cursor-pointer"
            >
              {userInitial}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 overflow-hidden animate-in fade-in zoom-in duration-150">
                <div className="px-4 py-2 mb-1">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Account</p>
                  <p className="text-sm font-medium truncate text-gray-900">{user?.email}</p>
                </div>

                <hr className="border-gray-100" />

                <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Profile
                </Link>

                <hr className="border-gray-100" />

                <div className="px-4 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Settings</p>
                  <button
                    onClick={() => { toggleLanguage(); setIsProfileOpen(false); }}
                    className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-black cursor-pointer"
                  >
                    <span>Language</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">
                      {displayLanguage === 'en' ? 'ENGLISH' : 'ARABIC'}
                    </span>
                  </button>
                </div>

                <hr className="border-gray-100" />

                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}