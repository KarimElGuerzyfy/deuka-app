import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
// 1. Use 'import type' for Session
// 2. Remove 'User' since you aren't using the type directly here
import type { Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout failed:", error.message);
  };

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    loading,
    signOut,
  };
};