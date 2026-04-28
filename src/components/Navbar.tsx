import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="p-4 border-b bg-white border-brand-dark/10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="DEUKA" className="h-5" />
        </div>
        
        <div className="space-x-4 text-brand-dark flex items-center">
          <a href="/" className="hover:underline">Learning</a>
          <a href="/quiz" className="hover:underline">Quiz</a>
          <a href="/profile" className="hover:underline">Profile</a>
          
          {session ? (
            <button 
              onClick={handleLogout} 
              className="hover:underline font-medium text-brand-dark"
            >
              Logout
            </button>
          ) : (
            <a href="/auth/login" className="hover:underline font-medium">Login</a>
          )}
        </div>
      </div>
    </nav>
  );
}