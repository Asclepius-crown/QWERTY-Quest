import React, { useState, useEffect, useRef } from 'react';
import { Play as PlayIcon, RotateCcw, Trophy, Zap, Target, Clock, Users, User, Keyboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';

const Play = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState('solo'); // solo, quick-race, custom
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  const [duration, setDuration] = useState(60); // seconds
  const [gameState, setGameState] = useState('waiting'); // waiting, matching, countdown, active, completed
  const [text, setText] = useState('');
  const [textId, setTextId] = useState(null);
  const [customText, setCustomText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [raceId, setRaceId] = useState(null);
  const [opponents, setOpponents] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [raceHistory, setRaceHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Sound functions
  const playKeySound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const playCompleteSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_BASE_URL.replace('/api', ''), {
      withCredentials: true
    });
    setSocket(newSocket);

    newSocket.on('waiting-for-opponent', () => {
      setGameState('matching');
    });

    newSocket.on('race-matched', (data) => {
      setRaceId(data.raceId);
      setText(data.text);
      setOpponents(data.participants.filter(p => p.userId !== user.id));
      setGameState('countdown');
      setTimeout(() => {
        setGameState('active');
        setStartTime(Date.now());
      }, data.startTime - Date.now());
    });

    newSocket.on('opponent-progress', (data) => {
      setOpponents(prev => prev.map(o =>
        o.userId === data.userId ? { ...o, currentIndex: data.currentIndex, wpm: data.wpm, accuracy: data.accuracy } : o
      ));
    });

    newSocket.on('race-results', (data) => {
      setGameState('completed');
      // Handle results
    });

    return () => newSocket.disconnect();
  }, [user.id]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/races/history`, {
        credentials: 'include'
      });
      if (response.ok) {
        const races = await response.json();
        setRaceHistory(races.races);
        setShowHistory(true);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (gameState === 'active' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setGameState('completed');
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState('completed');
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // WPM and accuracy calculation
  useEffect(() => {
    if (startTime && currentIndex > 0) {
      const timeElapsed = (Date.now() - startTime) / 60000; // minutes
      const calculatedWpm = Math.round((currentIndex / 5) / timeElapsed);
      const calculatedAccuracy = Math.round(((currentIndex - errors) / currentIndex) * 100);
      setWpm(calculatedWpm);
      setAccuracy(calculatedAccuracy);

      // Emit progress for multiplayer
      if (raceId && socket) {
        socket.emit('race-progress', {
          raceId,
          userId: user.id,
          currentIndex,
          wpm: calculatedWpm,
          accuracy: calculatedAccuracy
        });
      }
    }
  }, [currentIndex, errors, startTime, raceId, socket, user.id]);

  // Save results when race completes
  useEffect(() => {
    if (gameState === 'completed' && user) {
      if (mode === 'solo') {
        saveResults();
      } else if (mode === 'quick-race' && raceId) {
        const timeTaken = 60 - timeLeft;
        socket.emit('race-finished', {
          raceId,
          userId: user.id,
          wpm: wpm || 0,
          accuracy: accuracy || 0,
          errors,
          timeTaken
        });
      }
    }
  }, [gameState, mode, raceId, socket, user, wpm, accuracy, errors, timeLeft]);

  const saveResults = async () => {
    try {
      const timeTaken = 60 - timeLeft;
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/races`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          textId,
          wpm: wpm || 0,
          accuracy: accuracy || 0,
          errors,
          timeTaken
        })
      });
    } catch (err) {
      console.error('Failed to save results:', err);
    }
  };

  const startGame = async () => {
    setUserInput('');
    setCurrentIndex(0);
    setErrors(0);
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(100);
    setOpponents([]);

    if (mode === 'solo') {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/texts/random?difficulty=${difficulty}`);
        if (!response.ok) throw new Error('Failed to fetch text');
        const data = await response.json();
        setText(data.text.content);
        setTextId(data.text._id);
        setGameState('active');
        setStartTime(Date.now());
        inputRef.current.focus();
      } catch (err) {
        console.error(err);
        alert('Failed to load text. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'quick-race') {
      socket.emit('join-queue', { userId: user.id });
    } else if (mode === 'custom') {
      if (customText.trim().length < 10) {
        alert('Please enter at least 10 characters for custom text.');
        return;
      }
      setText(customText.trim());
      setTextId(null); // No DB text
      setGameState('active');
      setStartTime(Date.now());
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    if (gameState !== 'active') return;

    const value = e.target.value;
    const lastChar = value.slice(-1);

    if (lastChar === text[currentIndex]) {
      playKeySound();
      setCurrentIndex(prev => prev + 1);
      setUserInput(value);
      if (currentIndex + 1 === text.length) {
        setGameState('completed');
        playCompleteSound();
      }
    } else if (value.length > userInput.length) {
      setErrors(prev => prev + 1);
      setUserInput(value);
    } else {
      setUserInput(value);
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setUserInput('');
    setCurrentIndex(0);
    setErrors(0);
    setStartTime(null);
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(100);
    setRaceId(null);
    setOpponents([]);
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'text-gray-400';
      if (index < currentIndex) {
        className = index < userInput.length && userInput[index] === char ? 'text-green-400' : 'text-red-400';
      } else if (index === currentIndex) {
        className = 'bg-primary/50 text-white';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-base-dark text-white">
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Start Your <span className="text-primary-glow">Typing Race</span>
            </h1>
            <p className="text-gray-400 text-lg">Test your speed and accuracy against the clock</p>
          </motion.div>

          {gameState === 'waiting' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-2xl border border-white/5 text-center"
            >
              <h2 className="text-2xl font-bold mb-6">Choose Your Race Mode</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <button
                  onClick={() => setMode('solo')}
                  className={`p-4 md:p-6 rounded-xl border transition-all touch-manipulation ${mode === 'solo' ? 'border-primary bg-primary/20' : 'border-white/10 hover:border-white/20'}`}
                >
                  <User className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold">Solo Practice</div>
                  <div className="text-sm text-gray-400">Race against time</div>
                </button>
                <button
                  onClick={() => setMode('quick-race')}
                  className={`p-4 md:p-6 rounded-xl border transition-all touch-manipulation ${mode === 'quick-race' ? 'border-primary bg-primary/20' : 'border-white/10 hover:border-white/20'}`}
                >
                  <Users className="w-8 h-8 mx-auto mb-2 text-accent-purple" />
                  <div className="font-bold">Quick Race</div>
                  <div className="text-sm text-gray-400">Compete with others</div>
                </button>
                <button
                  onClick={() => setMode('custom')}
                  className={`p-4 md:p-6 rounded-xl border transition-all touch-manipulation ${mode === 'custom' ? 'border-primary bg-primary/20' : 'border-white/10 hover:border-white/20'}`}
                >
                  <Keyboard className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="font-bold">Custom Text</div>
                  <div className="text-sm text-gray-400">Use your own text</div>
                </button>
              </div>

              {(mode === 'solo' || mode === 'quick-race') && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Difficulty:</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-3 bg-base-navy/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full p-3 bg-base-navy/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                      >
                        <option value={30}>30 seconds</option>
                        <option value={60}>1 minute</option>
                        <option value={120}>2 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'custom' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Enter your custom text:</label>
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Type or paste your custom text here..."
                    className="w-full p-4 bg-base-navy/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 min-h-[100px] resize-y"
                  />
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  disabled={loading || (mode === 'custom' && customText.trim().length < 10)}
                  className="px-8 py-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xl shadow-lg transition-all flex items-center gap-3"
                >
                  <PlayIcon className="w-6 h-6" />
                  {loading ? 'Loading...' : mode === 'quick-race' ? 'Find Match' : 'Start Race'}
                </button>
                <button
                  onClick={fetchHistory}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  History
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'matching' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-2xl border border-white/5 text-center"
            >
              <h2 className="text-2xl font-bold mb-6">Finding Opponent...</h2>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-400 mt-4">Please wait while we match you with another player</p>
            </motion.div>
          )}

          {gameState === 'countdown' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-2xl border border-white/5 text-center"
            >
              <h2 className="text-3xl font-bold mb-6">Race Starting!</h2>
              <div className="text-6xl font-bold text-primary mb-4">3</div>
              <p className="text-gray-400">Get ready to type...</p>
            </motion.div>
          )}

          {(gameState === 'active' || gameState === 'completed') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-xl border border-white/5 text-center">
                  <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{wpm}</div>
                  <div className="text-sm text-gray-400">WPM</div>
                </div>
                <div className="glass-card p-4 rounded-xl border border-white/5 text-center">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{accuracy}%</div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
                <div className="glass-card p-4 rounded-xl border border-white/5 text-center">
                  <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{timeLeft}s</div>
                  <div className="text-sm text-gray-400">Time Left</div>
                </div>
                <div className="glass-card p-4 rounded-xl border border-white/5 text-center">
                  <Trophy className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.round((currentIndex / text.length) * 100)}%</div>
                  <div className="text-sm text-gray-400">Progress</div>
                </div>
              </div>

              {/* Opponents */}
              {opponents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opponents.map((opponent, idx) => (
                    <div key={opponent.userId} className="glass-card p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">Opponent {idx + 1}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="font-bold text-primary">{opponent.wpm || 0}</div>
                          <div className="text-gray-400">WPM</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-400">{opponent.accuracy || 0}%</div>
                          <div className="text-gray-400">Acc</div>
                        </div>
                        <div>
                          <div className="font-bold text-purple-400">{opponent.currentIndex ? Math.round((opponent.currentIndex / text.length) * 100) : 0}%</div>
                          <div className="text-gray-400">Prog</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress Bar */}
              <div className="glass-card p-6 rounded-xl border border-white/5">
                <div className="w-full bg-base-navy/50 rounded-full h-3 mb-4">
                  <motion.div
                    className="bg-primary h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentIndex / text.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Text Display */}
              <div className="glass-card p-8 rounded-xl border border-white/5">
                <div className="text-lg md:text-xl leading-relaxed font-mono mb-6 min-h-[120px] md:min-h-[150px]">
                  {renderText()}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  disabled={gameState !== 'active'}
                  className="w-full p-4 md:p-6 bg-base-navy/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-lg md:text-xl font-mono touch-manipulation"
                  placeholder={gameState === 'active' ? "Start typing..." : "Race completed!"}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              {gameState === 'completed' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-8 rounded-xl border border-white/5 text-center"
                >
                  <h2 className="text-3xl font-bold mb-4">Race Complete!</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-4xl font-bold text-primary">{wpm}</div>
                      <div className="text-gray-400">Final WPM</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-green-400">{accuracy}%</div>
                      <div className="text-gray-400">Accuracy</div>
                    </div>
                  </div>
                  <button
                    onClick={resetGame}
                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Race Again
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 rounded-2xl border border-white/5 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Race History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            {raceHistory.length === 0 ? (
              <p className="text-gray-400 text-center">No races completed yet.</p>
            ) : (
              <div className="space-y-4">
                {raceHistory.map((race, idx) => {
                  const userResult = race.participants.find(p => p.userId === user.id);
                  return (
                    <div key={idx} className="glass-card p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{race.type === 'solo' ? 'Solo Race' : 'Multiplayer'}</span>
                        <span className="text-sm text-gray-400">{new Date(race.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-bold text-primary">{userResult?.wpm || 0}</div>
                          <div className="text-gray-400">WPM</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-400">{userResult?.accuracy || 0}%</div>
                          <div className="text-gray-400">Accuracy</div>
                        </div>
                        <div>
                          <div className="font-bold text-purple-400">{userResult?.timeTaken || 0}s</div>
                          <div className="text-gray-400">Time</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;