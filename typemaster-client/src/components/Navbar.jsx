import React, { useState, useEffect } from 'react';
import { 
  Keyboard, Menu, X, LogOut, ChevronDown, User, Skull, Zap, Crown, Star, Ghost, Flame, 
  Activity, Shield, Settings, BarChart2, Eye, EyeOff, UserCircle, LayoutDashboard, 
  Trophy, Target, History, Palette, Bell, Users as UsersIcon, HelpCircle, Bug 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [status, setStatus] = useState('online');
  const { isLoggedIn, user, logout } = useAuth();

  const avatars = [
    { id: 'avatar1', icon: User, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { id: 'avatar2', icon: Skull, color: 'text-red-400', bg: 'bg-red-500/20' },
    { id: 'avatar3', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { id: 'avatar4', icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { id: 'avatar5', icon: Star, color: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 'avatar6', icon: Ghost, color: 'text-gray-400', bg: 'bg-gray-500/20' },
    { id: 'avatar7', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/20' }
  ];

  const currentAvatar = avatars.find(av => av.id === user?.avatar) || avatars[0];
  const AvatarIcon = currentAvatar.icon;
  const stats = user?.stats || { level: 1, xp: 0, rank: 'Bronze', bestWPM: 0, avgWPM: 0 };
  const nextLevelXp = stats.level * 100;
  const xpProgress = Math.min((stats.xp / nextLevelXp) * 100, 100);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileOpen && !event.target.closest('.profile-dropdown')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const MenuLink = ({ to, icon: Icon, label, onClick }) => (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
    >
      <Icon className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
      <span>{label}</span>
    </Link>
  );

  const MenuButton = ({ icon: Icon, label, onClick, danger = false }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-all group text-left ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
    >
      <Icon className={`w-4 h-4 transition-colors ${danger ? 'text-red-400' : 'text-gray-500 group-hover:text-primary'}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-4 bg-base-navy/80 backdrop-blur-md shadow-lg' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/40 transition-colors border border-primary/50">
            <Keyboard className="w-6 h-6 text-primary-glow" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white group-hover:text-primary-glow transition-colors">
            TYPE<span className="text-primary">MASTER</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Home', to: '/' },
            { label: 'Play', to: '/play' },
            { label: 'Leaderboard', to: '/leaderboard' },
            { label: 'How it Works', to: '/how-it-works' }
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wide font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative profile-dropdown">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 pl-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-medium transition-all group"
              >
                <div className="flex flex-col items-end mr-1">
                    <span className="text-xs font-bold text-white leading-tight">{user?.username || 'User'}</span>
                    <span className="text-[10px] text-primary uppercase tracking-wider">Lvl {stats.level}</span>
                </div>
                <div className={`w-9 h-9 rounded-full ${currentAvatar.bg} border border-white/10 flex items-center justify-center relative`}>
                  <AvatarIcon className={`w-5 h-5 ${currentAvatar.color}`} />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-base-dark ${status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-white transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden z-50 ring-1 ring-white/5"
                  >
                    {/* Zone 1: Player Snapshot */}
                    <div className="p-5 bg-gradient-to-br from-white/5 to-transparent border-b border-white/5 relative">
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-14 h-14 rounded-xl ${currentAvatar.bg} flex items-center justify-center border border-white/10 shadow-lg`}>
                                <AvatarIcon className={`w-7 h-7 ${currentAvatar.color}`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white leading-none mb-1">{user?.username}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                    {stats.rank}
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                    {status === 'online' ? '● Online' : '○ Stealth'}
                                  </span>
                                </div>
                                {/* XP Bar */}
                                <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-primary to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                                        style={{ width: `${xpProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[9px] text-gray-500 mt-1 font-mono">
                                  <span>{Math.floor(stats.xp)} XP</span>
                                  <span>{nextLevelXp} XP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2">
                      {/* Zone 2: Core Player Actions */}
                      <div className="mb-2">
                        <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Menu</div>
                        <MenuLink to="/dashboard" icon={UserCircle} label="My Profile" onClick={() => setProfileOpen(false)} />
                        <MenuLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setProfileOpen(false)} />
                        <MenuLink to="/leaderboard" icon={Trophy} label="My Rank" onClick={() => setProfileOpen(false)} />
                        <MenuLink to="/practice" icon={Target} label="Practice Mode" onClick={() => setProfileOpen(false)} />
                        <MenuLink to="/dashboard" icon={History} label="Match History" onClick={() => setProfileOpen(false)} />
                      </div>

                      <div className="h-px bg-white/5 my-1 mx-2"></div>

                      {/* Zone 3: Account & System */}
                      <div className="mb-2">
                        <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">System</div>
                        <MenuLink to="/settings" icon={Settings} label="Settings" onClick={() => setProfileOpen(false)} />
                        <MenuLink to="/settings" icon={Palette} label="Customize" onClick={() => setProfileOpen(false)} />
                        <MenuButton icon={Bell} label="Notifications" onClick={() => {}} />
                        <MenuButton icon={UsersIcon} label="Friends" onClick={() => {}} />
                      </div>

                      <div className="h-px bg-white/5 my-1 mx-2"></div>

                      {/* Zone 4: Session & Support */}
                      <div>
                        <MenuLink to="/how-it-works" icon={HelpCircle} label="Help / How it works" onClick={() => setProfileOpen(false)} />
                        <MenuButton icon={Bug} label="Report a bug" onClick={() => {}} />
                        <MenuButton icon={LogOut} label="Logout" danger onClick={() => { logout(); setProfileOpen(false); }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-primary transition-colors font-medium">
                Login
              </Link>
              <Link to="/signup" className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-full font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-all transform hover:-translate-y-0.5">
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

       {/* Mobile Menu */}
       {isOpen && (
         <div className="md:hidden absolute top-full left-0 w-full bg-base-dark/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-4 shadow-2xl h-screen z-40">
            {[
              { label: 'Home', to: '/' },
              { label: 'Play', to: '/play' },
              { label: 'Leaderboard', to: '/leaderboard' },
              { label: 'How it Works', to: '/how-it-works' }
            ].map((item) => (
             <Link
               key={item.label}
               to={item.to}
               className="text-gray-300 hover:text-white py-4 text-xl font-medium border-b border-white/5 last:border-0 block text-center"
               onClick={() => setIsOpen(false)}
             >
               {item.label}
             </Link>
           ))}
           <div className="flex flex-col gap-4 mt-8">
             {isLoggedIn ? (
               <>
                 <div className="w-full py-4 text-white border border-white/20 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                   <div className={`w-8 h-8 rounded-full ${currentAvatar.bg} flex items-center justify-center`}>
                     <AvatarIcon className={`w-4 h-4 ${currentAvatar.color}`} />
                   </div>
                   {user?.username || 'User'}
                 </div>
                 <Link to="/dashboard" className="w-full py-4 text-white border border-white/20 rounded-xl font-bold hover:bg-white/5 transition-colors text-center" onClick={() => setIsOpen(false)}>Dashboard</Link>
                 <button
                   onClick={() => { logout(); setIsOpen(false); }}
                   className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition-colors text-center flex items-center justify-center gap-2"
                 >
                   <LogOut className="w-4 h-4" />
                   Logout
                 </button>
               </>
             ) : (
               <>
                 <Link to="/login" className="w-full py-4 text-white border border-white/20 rounded-xl font-bold hover:bg-white/5 transition-colors text-center" onClick={() => setIsOpen(false)}>Login</Link>
                 <Link to="/signup" className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-hover transition-colors text-center" onClick={() => setIsOpen(false)}>Sign Up Free</Link>
               </>
             )}
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;