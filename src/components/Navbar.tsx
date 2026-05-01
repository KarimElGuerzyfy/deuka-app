import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'
import { useAuth } from '../hooks/useAuth'
import type { Level } from '../types'

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { session, signOut } = useAuth()
  const { currentLevel, setLevel, displayLanguage, toggleLanguage } = useGameStore()

  // Facts: Session is guaranteed by ProtectedRoute, but we handle null for safety.
  const userInitial = session?.user?.email?.[0].toUpperCase() || 'U'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="px-10 py-4 border-b bg-white border-black/10 sticky top-0 z-50 shadow-md">
      <div className="w-full max-w-7xl container mx-auto flex justify-between items-center">
        
        <Link to="/" onClick={() => setIsProfileOpen(false)}>
          <img src="/logo.svg" alt="DEUKA" className="h-6" />
        </Link>

        {/* Level Selector */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {(['A1', 'A2', 'B1', 'B2'] as Level[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                currentLevel === lvl
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Profile Action */}
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
                <p className="text-sm font-medium truncate text-gray-900">{session?.user?.email}</p>
              </div>

              <hr className="border-gray-100" />

              <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Profile
              </Link>
              <Link to="/stats" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Statistics
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
  )
}