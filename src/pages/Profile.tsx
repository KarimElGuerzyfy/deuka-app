import { useGameStore } from '../store/useGameStore';
import { SettingsSection } from '../components/SettingsSection';

export default function Profile() {
  const { displayLanguage, toggleLanguage } = useGameStore();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure your learning experience.</p>
      </header>

      {/* Preferences Section */}
      <SettingsSection title="Preferences">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Interface Language</p>
            <p className="text-xs text-gray-500">Current: {displayLanguage === 'en' ? 'English' : 'Arabic'}</p>
          </div>
          <button 
            onClick={toggleLanguage}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Switch to {displayLanguage === 'en' ? 'Arabic' : 'English'}
          </button>
        </div>
      </SettingsSection>

      {/* Account Section */}
      <SettingsSection title="Account">
        <div className="p-4">
          <button 
            className="w-full py-2 text-center text-red-600 font-medium border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
            onClick={() => {/* Add signOut from useAuth here later */}}
          >
            Log Out
          </button>
        </div>
      </SettingsSection>

      <footer className="text-center pt-4">
        <p className="text-xs text-gray-400">DEUKA App v1.0.0</p>
      </footer>
    </div>
  );
}