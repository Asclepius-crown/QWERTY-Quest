const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Register
router.post('/signup', [
  body('username').isLength({ min: 3, max: 30 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

     // Create JWT
     const payload = { user: { id: user.id } };
     jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' }, (err, token) => {
       if (err) throw err;
       res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
       res.json({ user: { id: user.id, username: user.username, stats: user.stats } });
     });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', [
  body('email').notEmpty().trim().escape(), // identifier
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    // Check user
    let user = await User.findOne({ email });
    if (!user) {
      // Allow login with username too
      user = await User.findOne({ username: email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

     // Return JWT
     // Create JWT
     const payload = { user: { id: user.id } };
     jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' }, (err, token) => {
       if (err) throw err;
       res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
       res.json({ user: { id: user.id, username: user.username, stats: user.stats } });
     });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ msg: 'Logged out' });
});

module.exports = router;
