import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Calendar, Trophy, Zap, Target, Award, Clock, 
  Share2, MessageSquare, Shield, Swords, Crown, Flame, Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data (until backend profile endpoint exists)
  const badges = [
    { id: 1, name: 'Speed Demon', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20', unlocked: true },
    { id: 2, name: 'Sniper', icon: Target, color: 'text-green-400', bg: 'bg-green-500/20', unlocked: true },
    { id: 3, name: 'Veteran', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/20', unlocked: true },
    { id: 4, name: 'Godlike', icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/20', unlocked: false },
    { id: 5, name: 'On Fire', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/20', unlocked: false },
  ];

  const recentMatches = [
    { id: 1, mode: 'Ranked', wpm: 92, acc: 98, result: 'Win', date: '2h ago' },
    { id: 2, mode: 'Quick', wpm: 88, acc: 96, result: '2nd', date: '5h ago' },
    { id: 3, mode: 'Ranked', wpm: 95, acc: 99, result: 'Win', date: '1d ago' },
  ];

  return (
    <div className="min-h-screen bg-base-dark text-white font-sans">
      <Navbar />
      
      {/* 1. Player Banner Header */}
      <div className="relative pt-20">
        {/* Banner Image */}
        <div className="h-64 w-full bg-gradient-to-r from-blue-900 via-purple-900 to-base-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-base-dark to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative -mt-20">
            <div className="flex flex-col md:flex-row items-end md:items-center gap-6 pb-6 border-b border-white/10">
                {/* Avatar */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-base-dark border-4 border-base-dark relative z-10 shadow-2xl">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10">
                        <User className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-yellow-500 text-base-dark font-bold px-3 py-1 rounded-full text-sm border-4 border-base-dark">
                        Lvl {user?.stats?.level || 1}
                    </div>
                </div>

                {/* Identity */}
                <div className="flex-1 mb-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold text-white">{user?.username || 'Player'}</h1>
                        <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider">
                            Precision Specialist
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Global</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined Jan 2024</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4 md:mt-0">
                    <button className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all flex items-center gap-2">
                        <Swords className="w-4 h-4" /> Challenge
                    </button>
                    <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Rank */}
        <div className="space-y-8">
            {/* 2. Rank & Progression */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent"
            >
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Competitive Rank</h3>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{user?.stats?.rank || 'Bronze'} I</div>
                        <div className="text-sm text-gray-400">Top 15% Global</div>
                    </div>
                </div>
                {/* XP Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Current XP</span>
                        <span>{user?.stats?.xp || 0} / 5000</span>
                    </div>
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[70%]"></div>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">Win 3 more matches to rank up</p>
                </div>
            </motion.div>

            {/* 3. Skill Overview */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-2xl border border-white/5"
            >
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Skill Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-2xl font-mono font-bold text-white">{user?.stats?.avgWPM || 0}</div>
                        <div className="text-xs text-gray-500">Avg WPM</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-2xl font-mono font-bold text-green-400">{user?.stats?.bestWPM || 0}</div>
                        <div className="text-xs text-gray-500">Best WPM</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-2xl font-mono font-bold text-blue-400">98%</div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-2xl font-mono font-bold text-purple-400">{user?.stats?.racesWon || 0}</div>
                        <div className="text-xs text-gray-500">Wins</div>
                    </div>
                </div>
            </motion.div>

            {/* 5. Achievements */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 rounded-2xl border border-white/5"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Badges</h3>
                    <span className="text-xs text-primary">View All</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {badges.map((badge) => (
                        <div key={badge.id} className={`aspect-square rounded-xl flex items-center justify-center border transition-all group relative ${badge.unlocked ? `${badge.bg} ${badge.color} border-white/10` : 'bg-white/5 text-gray-600 border-transparent grayscale'}`}>
                            <badge.icon className="w-6 h-6" />
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-20">
                                {badge.name}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>

        {/* Right Column: History & Content */}
        <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-white/10">
                {['Overview', 'Matches', 'Analytics', 'Inventory'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                            activeTab === tab.toLowerCase() 
                            ? 'text-primary border-b-2 border-primary' 
                            : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 4. Match History */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Recent Activity</h3>
                {recentMatches.map((match, idx) => (
                    <motion.div 
                        key={match.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${match.result === 'Win' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'}`}>
                                {match.result === 'Win' ? 'W' : match.result}
                            </div>
                            <div>
                                <div className="text-white font-bold">{match.mode} Match</div>
                                <div className="text-xs text-gray-500">{match.date}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className="text-sm text-gray-400 uppercase text-[10px]">Speed</div>
                                <div className="text-xl font-mono font-bold text-white">{match.wpm}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-400 uppercase text-[10px]">Acc</div>
                                <div className="text-xl font-mono font-bold text-green-400">{match.acc}%</div>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Clock className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;