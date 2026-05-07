import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { X, Loader2, LogOut, User, Languages } from 'lucide-react'
import type { Level } from '../types'
import { UserRound } from 'lucide-react'
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-green via-primary to-brand-green" />

        <div className="p-6 space-y-5">
          <button
            onClick={onCancel}
            className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Heading */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-green font-semibold mb-1">
              Level Switch
            </p>
            <h2 className="text-xl font-bold text-brand-dark">
              Switch to {targetLevel}?
            </h2>
            <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
              All current progress, stats, and position will be permanently reset. This cannot be undone.
            </p>
          </div>

          {/* Confirmation input */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400">
              Type{' '}
              <span className="font-mono font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                {targetLevel}
              </span>{' '}
              to confirm
            </p>
            <input
              key={targetLevel ?? 'closed'}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={targetLevel}
              autoFocus
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition-all placeholder:text-gray-300"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { if (matches) onConfirm() }}
              disabled={!matches || isLoading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading
                ? <Loader2 size={14} className="animate-spin" />
                : `Switch to ${targetLevel}`
              }
            </button>
          </div>
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

  const handleLevelConfirm = async () => {
    if (!pendingLevel) return
    setIsSwitching(true)
    try {
      setLevel(pendingLevel)
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token && user?.id) {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles`, {
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
            updated_at: new Date().toISOString(),
          }),
        })
      }
    } catch (err) {
      console.error(err)
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

      {/* ----------------------------------------------------------------- */}
      {/* MOBILE — Static logo                                               */}
      {/* ----------------------------------------------------------------- */}
      <div className="md:hidden flex justify-center pt-10">
        <Link to="/">
          <img src="/logo.svg" alt="DEUKA" className="h-6" />
        </Link>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* DESKTOP NAV                                                        */}
      {/* ----------------------------------------------------------------- */}
      <nav className="hidden md:block sticky top-0 z-50 px-10 py-0 border-b border-black/[0.06] bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center h-14">

          {/* Logo */}
          <Link to="/" onClick={() => setIsProfileOpen(false)} className="flex items-center">
            <img src="/logo.svg" alt="DEUKA" className="h-5" />
          </Link>

          {/* Level switcher — pill group */}
          <div className="flex items-center gap-0.5 bg-app-bg rounded-xl p-1">
            {(['A1', 'A2', 'B1', 'B2'] as Level[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => lvl !== currentLevel && setPendingLevel(lvl)}
                className={`
                  relative px-4 py-1.5 text-[11px] font-bold tracking-wider rounded-lg transition-all duration-200
                  ${currentLevel === lvl
                    ? 'bg-brand-green text-white shadow-sm cursor-default'
                    : 'text-gray-400 hover:text-brand-dark cursor-pointer hover:bg-white/60'
                  }
                `}
              >
                {lvl}
                {/* Active dot indicator */}
                {currentLevel === lvl && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Profile avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`
                w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center
                text-xs font-bold tracking-wider transition-all duration-200
                hover:ring-2 hover:ring-brand-green/30 hover:ring-offset-2
                ${isProfileOpen ? 'ring-2 ring-brand-green/30 ring-offset-2' : ''}
              `}
            >
              {userInitial}
            </button>

            {/* Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white border border-black/[0.08] rounded-2xl shadow-xl py-2 overflow-hidden">

                {/* Account header */}
                <div className="px-4 py-3">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                    Signed in as
                  </p>
                  <p className="mt-0.5 text-sm font-semibold truncate text-brand-dark">
                    {user?.email}
                  </p>
                </div>

                <div className="h-px bg-black/[0.06] mx-3" />

                {/* Nav links */}
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-app-bg hover:text-brand-dark transition-colors"
                >
                  <User size={14} className="text-gray-400" />
                  Profile
                </Link>

                <div className="h-px bg-black/[0.06] mx-3" />

                {/* Settings block */}
                <div className="px-4 py-3">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-gray-400 font-semibold mb-2.5">
                    Settings
                  </p>
                  <button
                    onClick={() => { toggleLanguage(); setIsProfileOpen(false) }}
                    className="flex items-center justify-between w-full group cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 text-sm text-gray-600 group-hover:text-brand-dark transition-colors">
                      <Languages size={14} className="text-gray-400" />
                      Language
                    </span>
                    <span
                      className="bg-app-bg text-brand-green px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider"
                    >
                      {displayLanguage === 'en' ? 'EN' : 'AR'}
                    </span>
                  </button>
                </div>

                <div className="h-px bg-black/[0.06] mx-3" />

                {/* Logout */}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium cursor-pointer"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ----------------------------------------------------------------- */}
      {/* MOBILE — Floating bottom dock                                      */}
      {/* ----------------------------------------------------------------- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="relative overflow-visible bg-white border-t border-black/7 shadow-deuka-up px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-center gap-8">

            {/* Left levels */}
            <div className="flex gap-5">
              {(['A1', 'A2'] as Level[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => lvl !== currentLevel && setPendingLevel(lvl)}
                  className={`
                    w-11 h-11 text-md font-bold rounded-full transition-all duration-200 flex items-center justify-center
                    ${currentLevel === lvl
                      ? 'bg-nav-level-active text-white shadow-sm'
                      : 'bg-nav-level-inactive text-nav-level-text active:scale-95'
                    }
                  `}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Floating avatar */}
            <Link to="/profile" className="-mt-15">
              <div className="w-14 h-14 rounded-full bg-nav-avatar-bg flex items-center justify-center shadow-deuka-up active:scale-90 transition-transform border-2 border-white">
                <UserRound size={26} strokeWidth={2.5} className="text-nav-avatar-icon mx-auto" />
              </div>
            </Link>

            {/* Right levels */}
            <div className="flex gap-5">
              {(['B1', 'B2'] as Level[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => lvl !== currentLevel && setPendingLevel(lvl)}
                  className={`
                    w-11 h-11 text-md font-bold rounded-full transition-all duration-200 flex items-center justify-center
                    ${currentLevel === lvl
                      ? 'bg-nav-level-active text-white shadow-sm'
                      : 'bg-nav-level-inactive text-nav-level-text active:scale-95'
                    }
                  `}
                >
                  {lvl}
                </button>
              ))}
            </div>

          </div>
        </div>
      </nav>
    </>
  )
}