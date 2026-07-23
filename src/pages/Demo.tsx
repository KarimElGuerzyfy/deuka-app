import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Public demo account. These credentials are intentionally in the client
// bundle — the account is read-restricted at the database layer (no logout,
// no delete, advance-only), so exposing them carries no privilege risk.
const DEMO_EMAIL = 'demo@deuka.app'
const DEMO_PASSWORD = 'Demo1234'

export default function Demo() {
  const navigate = useNavigate()
  const ran = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // StrictMode double-invokes effects in dev; guard against a second sign-in.
    if (ran.current) return
    ran.current = true

    let cancelled = false

    const signIn = async () => {
      const { data: existing } = await supabase.auth.getSession()

      if (existing.session) {
        if (!cancelled) navigate('/', { replace: true })
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      })

      if (cancelled) return

      if (signInError) {
        setError(signInError.message)
        return
      }

      navigate('/', { replace: true })
    }

    void signIn()

    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="min-h-dvh flex items-center justify-center bg-app-bg px-6">
      {error ? (
        <div className="text-center max-w-sm">
          <p className="text-sm opacity-70">Could not start the demo.</p>
          <p className="mt-2 text-xs opacity-50">{error}</p>
          <a href="/auth/login" className="mt-4 inline-block text-sm underline">
            Sign in manually
          </a>
        </div>
      ) : (
        <p className="text-sm opacity-70">Starting demo…</p>
      )}
    </div>
  )
}