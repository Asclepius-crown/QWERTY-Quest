const express = require('express');
const router = express.Router();
const Race = require('../models/Race');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/races - Save race results
router.post('/', auth, async (req, res) => {
  try {
    const { textId, wpm, accuracy, errors, timeTaken } = req.body;

    // Create race
    const race = new Race({
      participants: [{
        userId: req.user.id,
        wpm,
        accuracy,
        errors,
        timeTaken,
        completedAt: new Date()
      }],
      text: textId,
      type: 'solo',
      endTime: new Date()
    });

    await race.save();

    // Update user stats
    const user = await User.findById(req.user.id);
    user.stats.bestWPM = Math.max(user.stats.bestWPM, wpm);
    user.stats.racesWon += 1; // For solo, always "won"
    user.stats.xp += Math.floor(wpm / 10); // Simple XP system

    // Update average WPM (simple moving average)
    const totalRaces = user.stats.racesWon;
    user.stats.avgWPM = Math.round((user.stats.avgWPM * (totalRaces - 1) + wpm) / totalRaces);

    await user.save();

    res.json({ race, updatedStats: user.stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/races/history - Get user's race history
router.get('/history', auth, async (req, res) => {
  try {
    const races = await Race.find({
      'participants.userId': req.user.id
    })
    .populate('text')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({ races });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;