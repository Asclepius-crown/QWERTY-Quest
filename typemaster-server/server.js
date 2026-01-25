const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const DiscordStrategy = require('passport-discord-auth').Strategy;
const nodemailer = require('nodemailer');
const socketIo = require('socket.io');
const User = require('./models/User');
const Text = require('./models/Text');
const Race = require('./models/Race');

dotenv.config();

// Seed sample texts
const seedTexts = async () => {
  try {
    const count = await Text.countDocuments();
    if (count === 0) {
      const texts = [
        {
          content: "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
          difficulty: 'easy',
          category: 'general'
        },
        {
          content: "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell.",
          difficulty: 'easy',
          category: 'quotes'
        },
        {
          content: "function calculateWPM(text, timeInMinutes) { const words = text.split(' ').length; return Math.round(words / timeInMinutes); }",
          difficulty: 'hard',
          category: 'code'
        },
        {
          content: "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
          difficulty: 'medium',
          category: 'quotes'
        },
        {
          content: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
          difficulty: 'medium',
          category: 'quotes'
        }
      ];
      await Text.insertMany(texts);
      console.log('Sample texts seeded');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

// Email transporter
let transporter;
if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  console.log('Email service not configured. Skipping transporter initialization.');
}

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'].filter(Boolean),
  credentials: true
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());

// Passport
app.use(passport.initialize());

// DB Connection
// Forcing local connection to resolve Atlas timeout issues
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/typemaster';

mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('MongoDB Connected');
    await seedTexts();
  })
  .catch(err => {
    console.log('MongoDB Connection Error:', err);
  });

const generateNetId = async () => {
  let id;
  let exists = true;
  while(exists) {
    const num = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    id = `${num.substring(0,3)}-${num.substring(3,6)}`;
    const user = await User.findOne({ netId: id });
    if (!user) exists = false;
  }
  return id;
};

// Passport Strategies
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ providerId: profile.id, provider: 'google' });
      if (!user) {
        const netId = await generateNetId();
        user = new User({
          username: profile.displayName.replace(/\s+/g, '').toLowerCase() || profile.emails[0].value.split('@')[0],
          email: profile.emails[0].value,
          provider: 'google',
          providerId: profile.id,
          displayName: profile.displayName,
          avatar: 'avatar1',
          netId
        });
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/github/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ providerId: profile.id, provider: 'github' });
      if (!user) {
        const netId = await generateNetId();
        user = new User({
          username: profile.username,
          email: profile.emails[0].value,
          provider: 'github',
          providerId: profile.id,
          displayName: profile.displayName,
          avatar: 'avatar1',
          netId
        });
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  passport.use(new DiscordStrategy({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/discord/callback`,
    scope: ['identify', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ providerId: profile.id, provider: 'discord' });
      if (!user) {
        const netId = await generateNetId();
        user = new User({
          username: profile.username,
          email: profile.email,
          provider: 'discord',
          providerId: profile.id,
          displayName: profile.username,
          avatar: 'avatar1',
          netId
        });
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/texts', require('./routes/texts'));
app.use('/api/races', require('./routes/races'));
app.use('/api/friends', require('./routes/friends'));

// 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message, stack: err.stack });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Socket.io
const io = socketIo(server, {
  cors: {
    origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  }
});

let matchmakingQueue = [];
let activeRaces = new Map(); // raceId -> { participants, text, startTime, ... }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-queue', async (data) => {
    const { userId } = data;
    matchmakingQueue.push({ socketId: socket.id, userId });

    if (matchmakingQueue.length >= 2) {
      // Start race
      const participants = matchmakingQueue.splice(0, 2); // Take first 2
      const raceId = `race_${Date.now()}_${Math.random()}`;

      // Get random text
      const textDoc = await Text.findOne({ difficulty: 'medium' });
      if (!textDoc) return;

      const race = new Race({
        participants: participants.map(p => ({ userId: p.userId })),
        text: textDoc._id,
        type: 'multiplayer'
      });
      await race.save();

      activeRaces.set(raceId, {
        id: race._id,
        participants,
        text: textDoc.content,
        textId: textDoc._id,
        startTime: Date.now() + 3000, // 3 second countdown
        progress: new Map()
      });

      // Emit to participants
      participants.forEach(p => {
        const sock = io.sockets.sockets.get(p.socketId);
        if (sock) {
          sock.join(raceId);
          sock.emit('race-matched', {
            raceId,
            text: textDoc.content,
            participants: participants.map(p => ({ userId: p.userId })),
            startTime: activeRaces.get(raceId).startTime
          });
        }
      });
    } else {
      socket.emit('waiting-for-opponent');
    }
  });

  socket.on('race-progress', (data) => {
    const { raceId, userId, currentIndex, wpm, accuracy } = data;
    const race = activeRaces.get(raceId);
    if (race) {
      race.progress.set(userId, { currentIndex, wpm, accuracy });
      socket.to(raceId).emit('opponent-progress', { userId, currentIndex, wpm, accuracy });
    }
  });

  socket.on('race-finished', async (data) => {
    const { raceId, userId, wpm, accuracy, errors, timeTaken } = data;
    const race = activeRaces.get(raceId);
    if (race) {
      const participant = race.participants.find(p => p.userId === userId);
      if (participant) {
        participant.wpm = wpm;
        participant.accuracy = accuracy;
        participant.errors = errors;
        participant.timeTaken = timeTaken;
        participant.completedAt = new Date();
      }

      // Check if all finished
      const finished = race.participants.every(p => p.completedAt);
      if (finished) {
        // Determine winner (highest WPM)
        const winner = race.participants.reduce((prev, curr) => (curr.wpm > prev.wpm ? curr : prev));
        race.winner = winner.userId;
        race.endTime = new Date();
        await Race.findByIdAndUpdate(race.id, race);

        // Update user stats
        for (const p of race.participants) {
          const user = await User.findById(p.userId);
          if (user) {
            user.stats.bestWPM = Math.max(user.stats.bestWPM, p.wpm);
            user.stats.racesWon += (p.userId === winner.userId ? 1 : 0);
            user.stats.xp += Math.floor(p.wpm / 10);
            const totalRaces = user.stats.racesWon + (user.stats.racesWon === 0 ? 1 : 0); // rough
            user.stats.avgWPM = Math.round((user.stats.avgWPM * (totalRaces - 1) + p.wpm) / totalRaces);
            await user.save();
          }
        }

        io.to(raceId).emit('race-results', {
          participants: race.participants,
          winner: winner.userId
        });

        activeRaces.delete(raceId);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove from queue if waiting
    matchmakingQueue = matchmakingQueue.filter(p => p.socketId !== socket.id);
  });
});
