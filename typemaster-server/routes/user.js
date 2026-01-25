const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const generateNetId = async () => {
  let id;
  let exists = true;
  while(exists) {
    const num = Math.floor(100000 + Math.random() * 900000).toString(); 
    id = `${num.substring(0,3)}-${num.substring(3,6)}`;
    const user = await User.findOne({ netId: id });
    if (!user) exists = false;
  }
  return id;
};

// Get current user info
router.get('/me', auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Lazy migration for Net-ID
    if (!user.netId) {
        user.netId = await generateNetId();
        await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update user avatar
router.put('/avatar', [
  auth,
  body('avatar').isString().isLength({ min: 1, max: 20 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { avatar } = req.body;
    console.log('Updating avatar for user:', req.user.id, 'to:', avatar);
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;