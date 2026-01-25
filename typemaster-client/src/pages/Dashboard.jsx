import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Trophy, Zap, Target, BarChart2, Play, Users, Settings, User, Skull, 
  Crown, Star, Ghost, Flame, Key, Shield, ArrowUp, Activity, Keyboard, Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import NeuralHeatmap from '../components/NeuralHeatmap';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/races/history`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          // Reverse for chart (oldest to newest)
          setHistory(data.races.reverse());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Calculate trends
  const calculateTrend = (key) => {
    if (history.length < 2) return 0;
    const last10 = history.slice(-10);
    const firstHalf = last10.slice(0, 5);
    const secondHalf = last10.slice(5);
    
    const avgFirst = firstHalf.reduce((acc, curr) => acc + (curr[key] || 0), 0) / firstHalf.length || 0;
    const avgSecond = secondHalf.reduce((acc, curr) => acc + (curr[key] || 0), 0) / secondHalf.length || 0;
    
    return ((avgSecond - avgFirst)).toFixed(1);
  };

  const wpmTrend = calculateTrend('wpm');
  const accTrend = calculateTrend('accuracy');

  // Chart Data
  const chartData = history.map((race, idx) => ({
    name: `Race ${idx + 1}`,
    wpm: race.wpm,
    acc: race.accuracy
  }));

  return (
    <div className="min-h-screen bg-base-dark text-white">
      <Navbar />
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Column (Left - 3 cols) */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* 1. Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={Zap} 
                label="Avg WPM" 
                value={user?.stats?.avgWPM || 0} 
                trend={wpmTrend} 
                color="text-yellow-400" 
                trendLabel="recent avg"
              />
              <StatCard 
                icon={Target} 
                label="Accuracy" 
                value={user?.stats?.avgWPM ? '98%' : '0%'} // Mock accuracy for now or calc from history
                trend={accTrend} 
                color="text-green-400" 
                trendLabel="recent avg"
              />
              <StatCard 
                icon={Trophy} 
                label="Win Rate" 
                value="64%" 
                trend="+2.1" 
                color="text-orange-400" 
                trendLabel="this week"
              />
              <StatCard 
                icon={BarChart2} 
                label="Total Races" 
                value={user?.stats?.racesWon || 0} 
                sub="Matches"
                color="text-blue-400" 
              />
            </div>

            {/* 2. Performance Graph */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Performance History
                </h3>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary border border-primary/20">Speed</span>
                  <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/10">Accuracy</span>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="wpm" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* 3. Typing Intelligence (Heatmap) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <NeuralHeatmap />
            </motion.div>

            {/* 4. Recent Matches Table */}
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-400" /> Recent Matches
                </h3>
                <button className="text-sm text-primary hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-xs uppercase text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Result</th>
                      <th className="px-6 py-4">WPM</th>
                      <th className="px-6 py-4">Accuracy</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {history.slice().reverse().slice(0, 5).map((race, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-green-400 font-bold text-xs bg-green-500/10 px-2 py-1 rounded">
                            <Trophy className="w-3 h-3" /> VICTORY
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-white">{race.wpm}</td>
                        <td className="px-6 py-4 text-gray-300">{race.accuracy}%</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(race.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition-colors">
                            Replay
                          </button>
                        </td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                          No matches played yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Sidebar Column (Right - 1 col) */}
          <div className="space-y-8">
            
            {/* Rank Card */}
            <div className="glass-card p-6 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-900/10 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/20 blur-[40px] rounded-full"></div>
              <div className="relative z-10 text-center">
                <div className="inline-block p-3 rounded-full bg-yellow-500/20 border border-yellow-500/50 mb-3">
                  <Crown className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{user?.stats?.rank || 'Bronze'} I</h3>
                <div className="text-xs text-yellow-500 uppercase tracking-widest mb-4">Current League</div>
                
                {/* XP Bar */}
                <div className="text-left mb-1 flex justify-between text-xs text-gray-400">
                  <span>{user?.stats?.xp || 0} XP</span>
                  <span>Next Rank</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[65%]"></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <ActionButton to="/play" icon={Zap} label="Quick Race" color="bg-primary" />
                <ActionButton to="/play" icon={Target} label="Practice Mode" color="bg-green-600" />
                <ActionButton to="/leaderboard" icon={Trophy} label="Ranked Match" color="bg-yellow-600" />
                <ActionButton to="/play" icon={Users} label="Create Room" color="bg-purple-600" />
              </div>
            </div>

            {/* Daily Challenge */}
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Daily Goal</h3>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">12h left</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Keyboard className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Type 1,000 Words</div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                      <div className="h-full bg-blue-500 w-[45%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color, trendLabel, sub }) => (
  <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className={`text-xs font-bold flex items-center ${Number(trend) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {Number(trend) >= 0 ? <ArrowUp className="w-3 h-3" /> : null}
          {trend}%
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{label}</div>
      {(trendLabel || sub) && (
        <div className="text-[10px] text-gray-500 mt-1">{trendLabel || sub}</div>
      )}
    </div>
  </div>
);

const ActionButton = ({ to, icon: Icon, label, color }) => (
  <Link 
    to={to}
    className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
  >
    <div className={`p-2 rounded-lg text-white shadow-lg ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-4 h-4" />
    </div>
    <span className="font-medium text-gray-200 group-hover:text-white">{label}</span>
  </Link>
);

// Lucide icon import needed for History
import { History } from 'lucide-react';

export default Dashboard;