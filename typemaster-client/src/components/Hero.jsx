import React from 'react';
import { Zap, Users, Trophy, Target, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-base-dark">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        {/* Left Content */}
        <div className="text-left space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-glow text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            4,239 players online now
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            Race against <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-cyan text-glow">
              the world.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed"
          >
            Improve your typing speed, compete in real-time, track WPM & accuracy, and climb the global ranks.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all flex items-center justify-center gap-2 group">
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Quick Race
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Create Room
            </button>
          </motion.div>

          {/* Mini Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-8 pt-8 border-t border-white/5"
          >
            <div>
              <div className="text-2xl font-bold text-white">120+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1M+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Races Run</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0.02s</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Matchmaking</div>
            </div>
          </motion.div>
        </div>

        {/* Right Content - Floating Leaderboard */}
        <div className="relative w-full lg:block mt-12 lg:mt-0">
           {/* Abstract Decoration */}
           <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent-purple/30 rounded-full blur-3xl opacity-50 animate-pulse hidden lg:block"></div>

           <motion.div 
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="relative z-10"
           >
              {/* Main Card */}
              <div className="glass-card rounded-2xl p-6 border-l-4 border-l-primary w-full max-w-md mx-auto lg:ml-auto lg:mr-0 transform lg:rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Live Leaderboard
                  </h3>
                  <span className="text-xs font-mono text-primary-glow animate-pulse">● LIVE</span>
                </div>

                <div className="space-y-4">
                  {[
                    { rank: 1, name: 'Cortex', wpm: 236, acc: 98, color: 'text-yellow-400' },
                    { rank: 2, name: 'Phoenix', wpm: 204, acc: 96, color: 'text-gray-300' },
                    { rank: 3, name: 'Vortex', wpm: 198, acc: 99, color: 'text-orange-400' },
                    { rank: 4, name: 'You', wpm: 0, acc: 0, color: 'text-gray-500', isUser: true },
                  ].map((player, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${player.isUser ? 'bg-primary/10 border border-primary/20' : 'bg-white/5 border border-transparent'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold w-6 text-center ${player.color}`}>#{player.rank}</span>
                        <div className="flex flex-col">
                          <span className={`font-medium ${player.isUser ? 'text-primary' : 'text-white'}`}>{player.name}</span>
                          {player.isUser && <span className="text-[10px] text-gray-400">Not Ranked</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-mono">
                        <span className="text-white">{player.wpm} <span className="text-gray-500 text-xs">WPM</span></span>
                        <span className={`${player.acc >= 98 ? 'text-green-400' : 'text-gray-400'}`}>{player.acc}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Element 2 */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="hidden md:flex absolute -bottom-10 -left-10 glass-card p-4 rounded-xl border border-white/10 items-center gap-3"
              >
                 <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <Target className="w-5 h-5" />
                 </div>
                 <div>
                   <div className="text-sm text-gray-400">Accuracy Streak</div>
                   <div className="text-xl font-bold text-white">42 Matches</div>
                 </div>
              </motion.div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
