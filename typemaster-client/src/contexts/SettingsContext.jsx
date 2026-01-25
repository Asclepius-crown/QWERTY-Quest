import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const defaultSettings = {
  // Gameplay
  defaultMode: 'Ranked',
  countdownLength: '3 Seconds',
  autoJoin: true,
  liveWpm: true,
  crossPlatform: true,

  // Typing
  layout: 'QWERTY',
  language: 'English',
  fontFamily: 'JetBrains Mono',
  fontSize: 'Medium',
  highlightMistakes: true,
  caretAnimation: true,
  caretStyle: 'Block',

  // Appearance
  theme: 'Midnight',
  accentColor: 'Electric Blue',
  backgroundAnimations: true,
  glowIntensity: true,
  reducedMotion: false,

  // Audio
  masterVolume: 80,
  sfxVolume: 100,
  musicVolume: 40,
  keystrokeSounds: true,
  errorSounds: true,
  musicEnabled: true,
  voiceAlerts: 'Standard',

  // Notifications
  matchInvites: true,
  friendRequests: true,
  systemAlerts: true,
  emailSummaries: false,
  pushNotifications: true,

  // Privacy
  profileVisibility: 'Public',
  showOnlineStatus: true,
  allowChallenges: true,

  // Advanced
  showFps: false,
  showNetwork: false,
  debugInfo: false,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('typemaster_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('typemaster_settings', JSON.stringify(settings));
    applyTheme(settings.theme);
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-midnight', 'theme-neon', 'theme-light');
    root.classList.add(`theme-${theme.toLowerCase()}`);
    // You can add more specific CSS variable logic here if needed
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};