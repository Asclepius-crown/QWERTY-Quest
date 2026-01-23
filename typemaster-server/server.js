const express = require('express');
const mongoose = require('mongoose');
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
const User = require('./models/User');

dotenv.config();

// Email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

// Passport
app.use(passport.initialize());

// DB Connection
// Forcing local connection to resolve Atlas timeout issues
const mongoURI = 'mongodb://127.0.0.1:27017/typemaster';

mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.log('MongoDB Connection Error:', err);
  });

// Passport Strategies
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ providerId: profile.id, provider: 'google' });
    if (!user) {
      user = new User({
        username: profile.displayName.replace(/\s+/g, '').toLowerCase() || profile.emails[0].value.split('@')[0],
        email: profile.emails[0].value,
        provider: 'google',
        providerId: profile.id,
        displayName: profile.displayName,
        avatar: 'avatar1'
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ providerId: profile.id, provider: 'github' });
    if (!user) {
      user = new User({
        username: profile.username,
        email: profile.emails[0].value,
        provider: 'github',
        providerId: profile.id,
        displayName: profile.displayName,
        avatar: 'avatar1'
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.use(new DiscordStrategy({
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/discord/callback`,
  scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ providerId: profile.id, provider: 'discord' });
    if (!user) {
      user = new User({
        username: profile.username,
        email: profile.email,
        provider: 'discord',
        providerId: profile.id,
        displayName: profile.username,
        avatar: 'avatar1'
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

// 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] Global Error: ${err.message}\nStack: ${err.stack}\n`);
  res.status(500).json({ error: err.message, stack: err.stack });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
