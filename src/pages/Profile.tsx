import { useState, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { SettingsSection } from '../components/SettingsSection';
import {
  Settings,
  LogOut,
  Globe,
  Trophy,
  BookOpen,
  GraduationCap,
  Check,
  User,
  Lock,
  AlertCircle,
  Loader2,
  Timer,
} from 'lucide-react';

export default function Profile() {
  const { user, signOut } = useAuth();
  const {
    displayLanguage,
    toggleLanguage,
    currentLevel,
    timerEnabled,
    toggleTimer,
    wordsMastered,
    bucketsCleared,
  } = useGameStore();
  const settingsRef = useRef<HTMLDivElement>(null);

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const scrollToSettings = () => {
    settingsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    {
      label: 'Current Level',
      value: currentLevel,
      icon: <GraduationCap size={20} className="text-blue-500" />,
    },
    {
      label: 'Words Mastered',
      value: wordsMastered,
      icon: <BookOpen size={20} className="text-green-500" />,
    },
    {
      label: 'Buckets Cleared',
      value: bucketsCleared,
      icon: <Trophy size={20} className="text-yellow-500" />,
    },
  ];

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const { error: nameError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (nameError) throw nameError;

      if (password) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
        setPassword('');
        setConfirmPassword('');
      }

      setUpdateMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      setUpdateMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateMessage(null), 5000);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-app-bg pb-32">
      <div className="max-w-2xl mx-auto px-6 pt-10 space-y-8">

        {/* Profile Hero */}
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 bg-brand-green rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user?.email?.[0]?.toUpperCase() ?? 'K'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">
              {user?.user_metadata?.full_name ?? 'Karim El Guerzyfy'}
            </h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
          <button
            onClick={scrollToSettings}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            <Settings size={16} />
            Edit Settings
          </button>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center"
            >
              {stat.icon}
              <p className="text-lg font-bold mt-2">{stat.value}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        <hr className="border-gray-200" />

        {/* Settings Area */}
        <div ref={settingsRef} id="settings-area" className="pt-4 space-y-6">
          <SettingsSection title="Preferences">
            <div className="p-4 space-y-4">

              {/* Language Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Globe size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Interface Language</p>
                    <p className="text-xs text-gray-500">
                      {displayLanguage === 'en' ? 'English' : 'Arabic'}
                    </p>
                  </div>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => { if (displayLanguage !== 'en') toggleLanguage(); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      displayLanguage === 'en' ? 'bg-white text-brand-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {displayLanguage === 'en' && <Check size={14} />}
                    English
                  </button>
                  <button
                    onClick={() => { if (displayLanguage !== 'ar') toggleLanguage(); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      displayLanguage === 'ar' ? 'bg-white text-brand-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {displayLanguage === 'ar' && <Check size={14} />}
                    العربية
                  </button>
                </div>
              </div>

              {/* Timer Toggle */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <Timer size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Quiz Timer</p>
                    <p className="text-xs text-gray-500">
                      {timerEnabled ? 'Enabled — 5 seconds per question' : 'Disabled — unlimited time'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTimer}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    timerEnabled ? 'bg-brand-green' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      timerEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </SettingsSection>

          <SettingsSection title="Account">
            <div className="p-4 space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User size={16} className="text-gray-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Lock size={16} className="text-gray-400" />
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>

              {password && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Lock size={16} className="text-gray-400" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleUpdateProfile}
                  disabled={isUpdating || !fullName.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-brand-green text-white rounded-lg text-sm font-semibold hover:bg-brand-green/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                </button>
                {updateMessage && (
                  <div className={`flex items-center gap-1.5 text-xs ${updateMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    <AlertCircle size={14} />
                    {updateMessage.text}
                  </div>
                )}
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Session">
            <div className="p-4 space-y-3">
              <button
                className="w-full py-3 flex items-center justify-center gap-2 text-red-600 font-semibold border border-red-100 rounded-xl hover:bg-red-50 transition-all"
                onClick={signOut}
              >
                <LogOut size={18} />
                Log Out
              </button>
              <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest pt-4">
                DEUKA App v1.0.0 — Established 2026
              </p>
            </div>
          </SettingsSection>
        </div>
      </div>
    </main>
  );
}