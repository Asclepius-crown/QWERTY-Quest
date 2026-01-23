import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import GameModes from '../components/GameModes';
import Features from '../components/Features';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div id="home" className="min-h-screen bg-base-dark text-white selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <GameModes />
      <Features />
      <Footer />
    </div>
  );
};

export default Landing;
