import React, { useState, useEffect } from 'react';
import { Keyboard, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <Link to="/login" className="text-white hover:text-primary transition-colors font-medium">
            Login
          </Link>
          <Link to="/signup" className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-full font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-all transform hover:-translate-y-0.5">
            Sign Up Free
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

       {/* Mobile Menu */}
       {isOpen && (
         <div className="md:hidden absolute top-full left-0 w-full bg-base-dark/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-4 shadow-2xl h-screen">
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
            <Link to="/login" className="w-full py-4 text-white border border-white/20 rounded-xl font-bold hover:bg-white/5 transition-colors text-center" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/signup" className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-hover transition-colors text-center" onClick={() => setIsOpen(false)}>Sign Up Free</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
