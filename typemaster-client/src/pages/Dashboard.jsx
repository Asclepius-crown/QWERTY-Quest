import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Zap, Target, BarChart2, Play, Users, Settings, User, Skull, Zap as ZapIcon, Crown, Star, Ghost, Flame, Key, Shield } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import NeuralHeatmap from '../components/NeuralHeatmap';

const Dashboard = () => {
  const { user, updateAvatar } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'avatar1');
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [mfaQrCode, setMfaQrCode] = useState('');
  const [mfaToken, setMfaToken] = useState('');

  const stats = [
    { icon: Zap, label: 'Avg WPM', value: user?.stats?.avgWPM || 0, desc: 'Average Speed' },
    { icon: ZapIcon, label: 'Best WPM', value: user?.stats?.bestWPM || 0, desc: 'Personal Record' },
    { icon: Trophy, label: 'Rank', value: user?.stats?.rank || 'Unranked', desc: 'Current Position' },
    { icon: BarChart2, label: 'Races', value: user?.stats?.racesWon || 0, desc: 'Completed' }
  ];

  const avatars = [
    { id: 'avatar1', icon: User, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { id: 'avatar2', icon: Skull, color: 'text-red-400', bg: 'bg-red-500/20' },
    { id: 'avatar3', icon: ZapIcon, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { id: 'avatar4', icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { id: 'avatar5', icon: Star, color: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 'avatar6', icon: Ghost, color: 'text-gray-400', bg: 'bg-gray-500/20' },
    { id: 'avatar7', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/20' }
  ];

  const handleAvatarChange = async (avatarId) => {
    const oldAvatar = selectedAvatar;
    setSelectedAvatar(avatarId);
    const result = await updateAvatar(avatarId);
    if (!result.success) {
      setSelectedAvatar(oldAvatar);
    }
  };

  const registerPasskey = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webauthn/register/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to start registration');
      const options = await response.json();
      const registrationResponse = await startRegistration(options);
      const finishResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webauthn/register/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationResponse),
        credentials: 'include'
      });
      if (finishResponse.ok) {
        alert('Passkey registered successfully!');
      } else {
        alert('Failed to register passkey');
      }
    } catch (err) {
      console.error(err);
      alert('Error registering passkey: ' + err.message);
    }
  };

  const setupMfa = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/mfa/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to setup MFA');
      const data = await response.json();
      setMfaQrCode(data.qrCodeUrl);
      setShowMfaSetup(true);
    } catch (err) {
      console.error(err);
      alert('Error setting up MFA: ' + err.message);
    }
  };

  const enableMfa = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/mfa/enable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: mfaToken }),
        credentials: 'include'
      });
      if (response.ok) {
        alert('MFA enabled successfully!');
        setShowMfaSetup(false);
        setMfaQrCode('');
        setMfaToken('');
      } else {
        alert('Invalid token');
      }
    } catch (err) {
      console.error(err);
      alert('Error enabling MFA');
    }
  };

  return (
    <div className="min-h-screen bg-base-dark text-white">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back, <span className="text-primary-glow">{user?.username || 'Player'}</span>
            </h1>
            <p className="text-gray-400 text-lg">Ready to improve your typing skills and climb the ranks?</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.desc}</div>
              </div>
            ))}
          </motion.div>

          {/* Neural Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-12"
          >
             <NeuralHeatmap />
          </motion.div>

          {/* Avatar Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 rounded-2xl border border-white/5 mb-12"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              Choose Your Avatar
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
              {avatars.map((avatar) => {
                const Icon = avatar.icon;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarChange(avatar.id)}
                    className={`w-16 h-16 rounded-xl ${avatar.bg} border-2 flex items-center justify-center transition-all ${
                      selectedAvatar === avatar.id
                        ? 'border-primary shadow-lg scale-110'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${avatar.color}`} />
                  </button>
                );
              })}
            </div>
           </motion.div>

           {/* Passkey Registration */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.3 }}
             className="glass-card p-8 rounded-2xl border border-white/5 mb-12"
           >
             <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
               <Key className="w-6 h-6 text-primary" />
               Secure Your Account
             </h3>
             <p className="text-gray-400 mb-6">Register a passkey for passwordless, biometric authentication. More secure and convenient!</p>
             <button
               onClick={registerPasskey}
               className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
             >
               <Key className="w-5 h-5" />
               Register Passkey
             </button>
           </motion.div>

           {/* MFA Setup */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.35 }}
             className="glass-card p-8 rounded-2xl border border-white/5 mb-12"
           >
             <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
               <Shield className="w-6 h-6 text-primary" />
               Multi-Factor Authentication
             </h3>
             <p className="text-gray-400 mb-6">Add an extra layer of security with TOTP from your authenticator app.</p>
             {!showMfaSetup ? (
               <button
                 onClick={setupMfa}
                 className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
               >
                 <Shield className="w-5 h-5" />
                 Setup MFA
               </button>
             ) : (
               <div className="space-y-4">
                 <p className="text-sm text-gray-300">Scan this QR code with your authenticator app:</p>
                 <img src={mfaQrCode} alt="MFA QR Code" className="mx-auto" />
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-300">Enter the 6-digit code:</label>
                   <input
                     type="text"
                     value={mfaToken}
                     onChange={(e) => setMfaToken(e.target.value)}
                     maxLength="6"
                     className="block w-full pl-3 py-2 bg-base-navy/50 border border-white/10 rounded-xl text-white text-center text-lg font-mono"
                     placeholder="000000"
                   />
                 </div>
                 <button
                   onClick={enableMfa}
                   className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all"
                 >
                   Enable MFA
                 </button>
               </div>
             )}
           </motion.div>

           {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            <div className="glass-card p-8 rounded-2xl border border-white/5">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Play className="w-6 h-6 text-primary" />
                Quick Play
              </h3>
              <p className="text-gray-400 mb-6">Jump into a race instantly and start competing against players worldwide.</p>
              <Link
                to="/play"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg transition-all"
              >
                <Zap className="w-5 h-5" />
                Start Racing
              </Link>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-white/5">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-accent-purple" />
                Social Features
              </h3>
              <p className="text-gray-400 mb-6">Challenge friends, create rooms, and see how you stack up on the leaderboard.</p>
              <div className="flex gap-4">
                <Link
                  to="/leaderboard"
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-medium transition-all text-center"
                >
                  Leaderboard
                </Link>
                <button className="flex-1 px-4 py-3 bg-accent-purple hover:bg-accent-purple/80 text-white rounded-xl font-medium transition-all">
                  Create Room
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;