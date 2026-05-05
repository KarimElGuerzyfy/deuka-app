import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useGameStore } from '../store/useGameStore';
import { loadProfile } from '../services/profileService';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);

  // Ref to replace global let — stable across hot reloads
  const hydratedUserId = useRef<string | null>(null);

  const setUserId = useGameStore((s) => s.setUserId);
  const hydrateFromProfile = useGameStore((s) => s.hydrateFromProfile);
  const resetSession = useGameStore((s) => s.resetSession);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        hydratedUserId.current = null;
        setUser(null);
        setUserId(null);
        resetSession();
        setLoading(false);
        return;
      }

      const uid = session.user.id;

      if (hydratedUserId.current === uid) {
        setLoading(false);
        return;
      }

      hydratedUserId.current = uid;
      setUser(session.user);        // full user object (email, metadata)
      setUserId(uid);

      try {
        const profile = await loadProfile(uid, session.access_token);
        if (profile) {
          hydrateFromProfile(profile);
        }
      } catch (err) {
        console.error('[useAuth] Hydration failed:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUserId, hydrateFromProfile, resetSession]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    isAuthenticated: !!user,
    loading,
    signOut,
  };
}