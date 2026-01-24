const express = require('express');
const router = express.Router();
const Text = require('../models/Text');

// GET /api/texts/random - Get random text
router.get('/random', async (req, res) => {
  try {
    const { difficulty = 'medium', category } = req.query;
    let query = { difficulty };
    if (category) query.category = category;

    const texts = await Text.find(query);
    if (texts.length === 0) {
      // Fallback to any text
      const fallbackText = await Text.findOne();
      if (!fallbackText) {
        return res.status(404).json({ error: 'No texts available' });
      }
      return res.json({ text: fallbackText });
    }

    const randomIndex = Math.floor(Math.random() * texts.length);
    res.json({ text: texts[randomIndex] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/texts - Get all texts (admin)
router.get('/', async (req, res) => {
  try {
    const texts = await Text.find().sort({ createdAt: -1 });
    res.json({ texts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;