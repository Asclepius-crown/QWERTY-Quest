import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Zap, Target, BarChart2, Play, Users, Settings, User, Skull, Zap as ZapIcon, Crown, Star, Ghost, Flame } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user, updateAvatar } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'avatar1');

  const stats = [
    { icon: Zap, label: 'WPM', value: '0', desc: 'Average Speed' },
    { icon: Target, label: 'Accuracy', value: '0%', desc: 'Precision' },
    { icon: Trophy, label: 'Rank', value: 'Unranked', desc: 'Current Position' },
    { icon: BarChart2, label: 'Races', value: '0', desc: 'Completed' }
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
      // Could show error message
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

          {/* Coming Soon Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="glass-card p-8 rounded-2xl border border-white/5 inline-block">
              <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Advanced Analytics Coming Soon</h3>
              <p className="text-gray-400">Detailed performance tracking, progress charts, and personalized insights.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;