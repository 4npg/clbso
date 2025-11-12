const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { auth, adminAuth } = require('../middleware/auth');

// Get all gallery items (public only for non-authenticated)
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected. Please check MongoDB connection.' });
    }
    
    const query = req.user ? {} : { isPublic: true };
    const gallery = await Gallery.find(query)
      .populate('event', 'title date')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single gallery item
router.get('/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id)
      .populate('event', 'title date')
      .populate('uploadedBy', 'name avatar');
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create gallery item (authenticated users)
router.post('/', auth, async (req, res) => {
  try {
    const galleryItem = new Gallery({
      ...req.body,
      uploadedBy: req.user.id
    });
    await galleryItem.save();
    await galleryItem.populate('uploadedBy', 'name');
    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update gallery item (admin or uploader)
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'leader' && item.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete gallery item (admin or uploader)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'leader' && item.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await item.deleteOne();
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

