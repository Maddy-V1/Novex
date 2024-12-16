const express = require('express');
const router = express.Router();
const News = require('../models/News');
const auth = require('../middleware/auth');

// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add this route to get saved news
router.get('/saved', auth, async (req, res) => {
  try {
    const news = await News.find({ savedBy: req.user._id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create news (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, externalLink, category } = req.body;
    
    const news = new News({
      title,
      description,
      externalLink,
      category,
      author: req.user._id
    });

    await news.save();
    await news.populate('author', 'name');
    
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get news by ID
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'name');
      
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update news (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const { title, description, externalLink, category } = req.body;
    
    news.title = title || news.title;
    news.description = description || news.description;
    news.externalLink = externalLink || news.externalLink;
    news.category = category || news.category;

    await news.save();
    await news.populate('author', 'name');
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete news (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    await news.deleteOne();
    res.json({ message: 'News removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle like
router.put('/:id/like', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const likeIndex = news.likes.findIndex(
      like => like.toString() === req.user._id.toString()
    );

    if (likeIndex === -1) {
      news.likes.push(req.user._id);
    } else {
      news.likes.splice(likeIndex, 1);
    }

    await news.save();
    res.json(news.likes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle save
router.put('/:id/save', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const saveIndex = news.savedBy.findIndex(
      save => save.toString() === req.user._id.toString()
    );

    if (saveIndex === -1) {
      news.savedBy.push(req.user._id);
    } else {
      news.savedBy.splice(saveIndex, 1);
    }

    await news.save();
    res.json(news.savedBy);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 