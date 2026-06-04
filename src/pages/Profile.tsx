import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { translations } from '../i18n/translations';
import { SettingsSection } from '../components/SettingsSection';
import {
  Settings, LogOut, Globe, Trophy, BookOpen,
  GraduationCap, Check, User, Lock, AlertCircle,
  Loader2, Timer, Trash2, RotateCcw, X,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Confirmation Modal
// ---------------------------------------------------------------------------

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description: string
  phrase: string
  confirmLabel: string
  confirmClassName: string
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmModal({
  isOpen, title, description, phrase, confirmLabel,
  confirmClassName, isLoading, onConfirm, onCancel,
}: ConfirmModalProps) {
  const [input, setInput] = useState('')
  const matches = input === phrase

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-5">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Type <span className="text-red-500 font-mono">{phrase}</span> to confirm
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={phrase}
            autoFocus
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (matches) onConfirm() }}
            disabled={!matches || isLoading}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${confirmClassName}`}
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Profile Page
// ---------------------------------------------------------------------------

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    displayLanguage, toggleLanguage, currentLevel,
    timerEnabled, toggleTimer, wordsMastered, bucketsCleared, resetSession,
  } = useGameStore();

  const t = translations[displayLanguage]
  const settingsRef = useRef<HTMLDivElement>(null);

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const scrollToSettings = () => settingsRef.current?.scrollIntoView({ behavior: 'smooth' });

  const stats = [
    { label: t.currentLevel, value: currentLevel, icon: <GraduationCap size={20} className="text-blue-500" /> },
    { label: t.wordsMastered, value: wordsMastered, icon: <BookOpen size={20} className="text-green-500" /> },
    { label: t.bucketsCleared, value: bucketsCleared, icon: <Trophy size={20} className="text-yellow-500" /> },
  ];

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    setUpdateMessage(null);
    try {
      const { error: nameError } = await supabase.auth.updateUser({ data: { full_name: fullName } });
      if (nameError) throw nameError;
      if (password) {
        if (password !== confirmPassword) throw new Error('Passwords do not match');
        // Check if demo account before allowing password change
        const { data, error: blockError } = await supabase.functions.invoke('block-demo-password-change');
        if (blockError || data?.error) {
          throw new Error(data?.error ?? 'Password changes are not allowed for this account.');
        }
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
        setPassword('');
        setConfirmPassword('');
      }
      setUpdateMessage({ type: 'success', text: t.profileUpdated });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      setUpdateMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateMessage(null), 5000);
    }
  };

  const handleResetProgress = async () => {
    setIsResetting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token && user?.id) {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=minimal',
          },
          body: JSON.stringify({
            id: user.id,
            current_level: 'A1',
            current_centurion_index: 0,
            current_bucket_index: 0,
            words_mastered: 0,
            buckets_cleared: 0,
            display_language: 'en',
            timer_enabled: true,
            updated_at: new Date().toISOString(),
          }),
        })
      }
      resetSession()
      setShowResetModal(false)
    } catch (err) {
      console.error('Reset progress failed:', err)
    } finally {
      setIsResetting(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase.functions.invoke('delete-account')
      if (error) throw error
      try { await signOut() } catch { /* expected */ }
      navigate('/auth/register')
    } catch (err) {
      console.error('Delete account failed:', err)
      setIsDeleting(false)
    }
  }

  return (
    <>
      <ConfirmModal
        isOpen={showResetModal}
        title={t.resetProgress}
        description={t.resetProgressDescription}
        phrase="RESET"
        confirmLabel={t.reset}
        confirmClassName="bg-orange-500 hover:bg-orange-600"
        isLoading={isResetting}
        onConfirm={handleResetProgress}
        onCancel={() => setShowResetModal(false)}
      />
      <ConfirmModal
        isOpen={showDeleteModal}
        title={t.deleteAccount}
        description={t.deleteAccountDescription}
        phrase="DELETE"
        confirmLabel={t.delete}
        confirmClassName="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />

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
              {t.editSettings}
            </button>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                {stat.icon}
                <p className="text-lg font-bold mt-2">{stat.value}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>

          <hr className="border-gray-200" />

          {/* Settings Area */}
          <div ref={settingsRef} id="settings-area" className="pt-4 space-y-6">

            <SettingsSection title={t.preferences}>
              <div className="p-4 space-y-4">

                {/* Language Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Globe size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t.interfaceLanguage}</p>
                      <p className="text-xs text-gray-500">
                        {displayLanguage === 'en' ? t.english : t.arabic}
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
                      <p className="font-medium text-sm">{t.quizTimer}</p>
                      <p className="text-xs text-gray-500">
                        {timerEnabled ? t.timerEnabled : t.timerDisabled}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTimer}
                    className={`relative w-12 h-6 rounded-full transition-colors ${timerEnabled ? 'bg-brand-green' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${timerEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

              </div>
            </SettingsSection>

            <SettingsSection title={t.account}>
              <div className="p-4 space-y-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User size={16} className="text-gray-400" />
                    {t.fullName}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Lock size={16} className="text-gray-400" />
                    {t.newPassword}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.newPasswordPlaceholder}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                  />
                </div>
                {password && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Lock size={16} className="text-gray-400" />
                      {t.confirmPassword}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t.confirmPasswordPlaceholder}
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
                    {isUpdating ? <Loader2 size={16} className="animate-spin" /> : t.saveChanges}
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

            <SettingsSection title="">
              <div className="p-4 space-y-3">
                <button
                  className="w-full py-3 flex items-center justify-center gap-2 text-red-600 font-semibold border border-red-100 rounded-xl hover:bg-red-50 transition-all"
                  onClick={signOut}
                >
                  <LogOut size={18} />
                  {t.logOut}
                </button>
                <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest pt-4">
                  {t.appVersion}
                </p>
              </div>
            </SettingsSection>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-200 bg-red-50/50 overflow-hidden">
              <div className="px-4 pt-4 pb-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-red-500">
                  {t.dangerZone}
                </h2>
                <p className="text-xs text-red-400 mt-0.5">
                  {t.dangerZoneSubtitle}
                </p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                      <RotateCcw size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{t.resetProgress}</p>
                      <p className="text-xs text-gray-400">{t.resetProgressSubtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowResetModal(true)}
                    className="px-3 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    {t.reset}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg text-red-500">
                      <Trash2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{t.deleteAccount}</p>
                      <p className="text-xs text-gray-400">{t.deleteAccountSubtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-3 py-1.5 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}