import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Gamepad2, Keyboard, Palette, Volume2, Bell, Lock, Cpu, 
  Save, RotateCcw, Trash2, Check, Smartphone, Monitor, Globe, Mail, Eye, Download, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import Navbar from '../components/Navbar';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'gameplay', label: 'Gameplay', icon: Gamepad2 },
  { id: 'typing', label: 'Typing', icon: Keyboard },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'audio', label: 'Audio', icon: Volume2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'advanced', label: 'Advanced', icon: Cpu },
];

const Settings = () => {
  const { user } = useAuth();
  const { settings, updateSettings, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('account');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // Settings are auto-saved to context/localStorage on change, 
    // but this gives visual feedback.
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const SectionTitle = ({ title, desc }) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );

  const SettingCard = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl border border-white/5 mb-6">
      {title && <h3 className="text-lg font-bold text-gray-200 mb-4 border-b border-white/5 pb-2">{title}</h3>}
      {children}
    </div>
  );

  const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="font-medium text-gray-200">{label}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-primary' : 'bg-gray-700'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  const Input = ({ label, value, type = "text", placeholder }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <input 
        type={type} 
        defaultValue={value} 
        placeholder={placeholder}
        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
      />
    </div>
  );

  const Select = ({ label, options, value, onChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const Slider = ({ label, value, onChange }) => (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <span className="text-sm text-primary font-mono">{value}%</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );

  // --- TAB CONTENT COMPONENTS ---

  const AccountTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Account Settings" desc="Manage your identity and public profile information." />
      
      <SettingCard title="Public Profile">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 rounded-2xl bg-base-navy border-2 border-white/10 flex items-center justify-center">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <div className="flex-1">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all mb-2">Upload New Avatar</button>
            <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size 2MB.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Username" value={user?.username} />
          <Input label="Display Title" placeholder="e.g. Speed Demon" />
          <Input label="Bio" placeholder="Tell the world about yourself..." />
          <Select label="Country / Region" options={['Global', 'North America', 'Europe', 'Asia']} value="Global" onChange={() => {}} />
        </div>
      </SettingCard>

      <SettingCard title="Contact Info">
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Email Address" value={user?.email} type="email" />
          <Input label="Phone Number" placeholder="+1 (555) 000-0000" type="tel" />
        </div>
      </SettingCard>
    </motion.div>
  );

  const SecurityTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Security & Login" desc="Protect your account and manage sessions." />
      
      <SettingCard title="Password">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="font-bold text-white">Change Password</div>
            <div className="text-xs text-gray-500">Last changed 3 months ago</div>
          </div>
          <button className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm transition-all">Update</button>
        </div>
      </SettingCard>

      <SettingCard title="Two-Factor Authentication">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-green-500/10 rounded-full text-green-400">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-white">Authenticator App</div>
            <div className="text-xs text-gray-500">Secure your account with TOTP (Google Auth, Authy).</div>
          </div>
          <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold transition-all">Enable</button>
        </div>
      </SettingCard>

      <SettingCard title="Active Sessions">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm font-bold text-white">Windows PC (Chrome)</div>
                <div className="text-xs text-green-400">● Active now • New York, USA</div>
              </div>
            </div>
          </div>
        </div>
        <button className="mt-4 text-sm text-red-400 hover:text-red-300 font-bold flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Log out of all devices
        </button>
      </SettingCard>
    </motion.div>
  );

  const GameplayTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Gameplay Settings" desc="Customize your race experience." />
      
      <SettingCard title="Race Behavior">
        <Select 
          label="Default Mode" 
          options={['Ranked', 'Quick Race', 'Practice']} 
          value={settings.defaultMode} 
          onChange={(v) => updateSettings({ defaultMode: v })}
        />
        <Select 
          label="Countdown Length" 
          options={['3 Seconds', '5 Seconds', '10 Seconds']} 
          value={settings.countdownLength} 
          onChange={(v) => updateSettings({ countdownLength: v })}
        />
        <Toggle 
          label="Auto-Join Next Match" 
          desc="Automatically queue for a new race after finishing." 
          checked={settings.autoJoin} 
          onChange={(v) => updateSettings({ autoJoin: v })}
        />
        <Toggle 
          label="Live Opponent WPM" 
          desc="Show opponent speeds in real-time." 
          checked={settings.liveWpm} 
          onChange={(v) => updateSettings({ liveWpm: v })}
        />
      </SettingCard>

      <SettingCard title="Matchmaking">
        <Select 
          label="Preferred Region" 
          options={['Auto (Best Latency)', 'US East', 'Europe', 'Asia']} 
          value="Auto (Best Latency)" 
          onChange={() => {}}
        />
        <Toggle 
          label="Cross-Platform Play" 
          desc="Match with mobile/console players." 
          checked={settings.crossPlatform} 
          onChange={(v) => updateSettings({ crossPlatform: v })}
        />
      </SettingCard>
    </motion.div>
  );

  const TypingTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Typing Preferences" desc="Fine-tune your keyboard feel." />
      
      <SettingCard>
        <div className="grid md:grid-cols-2 gap-4">
          <Select 
            label="Keyboard Layout" 
            options={['QWERTY', 'AZERTY', 'Dvorak', 'Colemak']} 
            value={settings.layout} 
            onChange={(v) => updateSettings({ layout: v })}
          />
          <Select 
            label="Target Language" 
            options={['English', 'Spanish', 'French', 'Code (JS)']} 
            value={settings.language} 
            onChange={(v) => updateSettings({ language: v })}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Select 
            label="Font Family" 
            options={['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'System']} 
            value={settings.fontFamily} 
            onChange={(v) => updateSettings({ fontFamily: v })}
          />
          <Select 
            label="Font Size" 
            options={['Small', 'Medium', 'Large', 'Extra Large']} 
            value={settings.fontSize} 
            onChange={(v) => updateSettings({ fontSize: v })}
          />
        </div>
      </SettingCard>

      <SettingCard title="Visual Feedback">
        <Toggle 
          label="Highlight Mistakes" 
          desc="Turn incorrect letters red immediately." 
          checked={settings.highlightMistakes} 
          onChange={(v) => updateSettings({ highlightMistakes: v })}
        />
        <Toggle 
          label="Caret Animation" 
          desc="Smooth caret movement." 
          checked={settings.caretAnimation} 
          onChange={(v) => updateSettings({ caretAnimation: v })}
        />
        <Select 
          label="Caret Style" 
          options={['Line', 'Block', 'Underline', 'None']} 
          value={settings.caretStyle} 
          onChange={(v) => updateSettings({ caretStyle: v })}
        />
      </SettingCard>
    </motion.div>
  );

  const AppearanceTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Appearance" desc="Make the platform yours." />
      
      <SettingCard title="Theme">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {['Dark', 'Midnight', 'Neon', 'Light'].map(theme => (
            <button 
              key={theme} 
              onClick={() => updateSettings({ theme })}
              className={`p-2 rounded-lg border text-sm transition-all ${
                settings.theme === theme 
                ? 'border-primary bg-primary/20 text-white shadow-md' 
                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
        <Select 
          label="Accent Color" 
          options={['Electric Blue', 'Cyber Purple', 'Toxic Green', 'Crimson Red']} 
          value={settings.accentColor} 
          onChange={(v) => updateSettings({ accentColor: v })}
        />
      </SettingCard>

      <SettingCard title="Effects">
        <Toggle 
          label="Background Animations" 
          desc="Grid movements and particles." 
          checked={settings.backgroundAnimations} 
          onChange={(v) => updateSettings({ backgroundAnimations: v })}
        />
        <Toggle 
          label="Glow Intensity" 
          desc="Neon bloom effects on text." 
          checked={settings.glowIntensity} 
          onChange={(v) => updateSettings({ glowIntensity: v })}
        />
        <Toggle 
          label="Reduced Motion" 
          desc="Minimize animations for accessibility." 
          checked={settings.reducedMotion} 
          onChange={(v) => updateSettings({ reducedMotion: v })}
        />
      </SettingCard>
    </motion.div>
  );

  const AudioTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Audio Settings" desc="Control the soundscape of your races." />
      
      <SettingCard title="Volume Control">
        <Slider label="Master Volume" value={settings.masterVolume} onChange={(v) => updateSettings({ masterVolume: v })} />
        <Slider label="SFX Volume" value={settings.sfxVolume} onChange={(v) => updateSettings({ sfxVolume: v })} />
        <Slider label="Music Volume" value={settings.musicVolume} onChange={(v) => updateSettings({ musicVolume: v })} />
      </SettingCard>

      <SettingCard title="Sound Effects">
        <Toggle label="Keystroke Sounds" desc="Mechanical keyboard click sounds." checked={settings.keystrokeSounds} onChange={(v) => updateSettings({ keystrokeSounds: v })} />
        <Toggle label="Error Sounds" desc="Audio feedback on mistakes." checked={settings.errorSounds} onChange={(v) => updateSettings({ errorSounds: v })} />
        <Toggle label="Victory / Defeat Music" desc="Play themes at end of race." checked={settings.musicEnabled} onChange={(v) => updateSettings({ musicEnabled: v })} />
        <Select label="Voice Alerts" options={['None', 'Standard', 'Cyberpunk']} value={settings.voiceAlerts} onChange={(v) => updateSettings({ voiceAlerts: v })} />
      </SettingCard>
    </motion.div>
  );

  const NotificationsTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Notifications" desc="Manage how and when we contact you." />
      
      <SettingCard title="In-Game Notifications">
        <Toggle label="Match Invites" desc="Popups when friends challenge you." checked={settings.matchInvites} onChange={(v) => updateSettings({ matchInvites: v })} />
        <Toggle label="Friend Requests" desc="Alerts for new social connections." checked={settings.friendRequests} onChange={(v) => updateSettings({ friendRequests: v })} />
        <Toggle label="System Alerts" desc="Maintenance and server status updates." checked={settings.systemAlerts} onChange={(v) => updateSettings({ systemAlerts: v })} />
      </SettingCard>

      <SettingCard title="External">
        <Toggle label="Email Summaries" desc="Weekly progress reports." checked={settings.emailSummaries} onChange={(v) => updateSettings({ emailSummaries: v })} />
        <Toggle label="Push Notifications" desc="Browser alerts for matches." checked={settings.pushNotifications} onChange={(v) => updateSettings({ pushNotifications: v })} />
      </SettingCard>
    </motion.div>
  );

  const PrivacyTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Privacy & Social" desc="Control your visibility and data." />
      
      <SettingCard title="Social Visibility">
        <Select label="Profile Visibility" options={['Public', 'Friends Only', 'Private']} value={settings.profileVisibility} onChange={(v) => updateSettings({ profileVisibility: v })} />
        <Toggle label="Show Online Status" desc="Let friends see when you are active." checked={settings.showOnlineStatus} onChange={(v) => updateSettings({ showOnlineStatus: v })} />
        <Toggle label="Allow Challenges" desc="Receive race invites from strangers." checked={settings.allowChallenges} onChange={(v) => updateSettings({ allowChallenges: v })} />
      </SettingCard>

      <SettingCard title="Data Management">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-white">Export Data</div>
            <div className="text-xs text-gray-500">Download a copy of your race history.</div>
          </div>
          <button className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Download JSON
          </button>
        </div>
      </SettingCard>
    </motion.div>
  );

  const AdvancedTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Advanced Settings" desc="Developer tools and system utilities." />
      
      <SettingCard title="Performance Overlay">
        <Toggle label="Show FPS Counter" desc="Display frames per second." checked={settings.showFps} onChange={(v) => updateSettings({ showFps: v })} />
        <Toggle label="Show Network Stats" desc="Ping and packet loss info." checked={settings.showNetwork} onChange={(v) => updateSettings({ showNetwork: v })} />
        <Toggle label="Detailed Debug Info" desc="Show raw input latency data." checked={settings.debugInfo} onChange={(v) => updateSettings({ debugInfo: v })} />
      </SettingCard>

      <SettingCard title="Maintenance">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-white">Clear Local Cache</div>
              <div className="text-xs text-gray-500">Fixes loading issues.</div>
            </div>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm">Clear</button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-white">Reset Practice Data</div>
              <div className="text-xs text-gray-500">Clears local drill history only.</div>
            </div>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm">Reset</button>
          </div>
        </div>
      </SettingCard>

      <div className="mt-8 glass-card p-6 rounded-2xl border border-red-500/20 bg-red-900/5">
        <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-white">Delete Account</div>
            <div className="text-xs text-red-400/70">Permanently remove your account and all data.</div>
          </div>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold">Delete</button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-base-dark text-white font-sans">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card p-4 rounded-2xl border border-white/5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-3">Settings</h3>
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'account' && <AccountTab />}
                {activeTab === 'security' && <SecurityTab />}
                {activeTab === 'gameplay' && <GameplayTab />}
                {activeTab === 'typing' && <TypingTab />}
                {activeTab === 'appearance' && <AppearanceTab />}
                {activeTab === 'audio' && <AudioTab />}
                {activeTab === 'notifications' && <NotificationsTab />}
                {activeTab === 'privacy' && <PrivacyTab />}
                {activeTab === 'advanced' && <AdvancedTab />}
              </motion.div>
            </AnimatePresence>

            {/* Action Bar */}
            <div className="mt-8 flex justify-end gap-4 border-t border-white/10 pt-6">
              <button 
                onClick={resetSettings}
                className="px-6 py-3 text-gray-400 hover:text-white font-medium transition-colors"
              >
                Reset to Default
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all"
              >
                {isSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {isSaved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;