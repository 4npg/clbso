const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

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
// Note: auth middleware runs first, then multer processes the file
router.post('/', auth, (req, res, next) => {
  console.log('Upload request received:', {
    contentType: req.headers['content-type'],
    hasBody: !!req.body,
    bodyKeys: req.body ? Object.keys(req.body) : []
  });
  
  // Multer middleware with error handling
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        field: err.field
      });
      
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ message: 'Unexpected file field. Use "image" as the field name.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ message: err.message || 'File upload error' });
    }
    console.log('File uploaded successfully:', req.file ? {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : 'No file');
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Create image URL (relative path that will be served statically)
    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    const galleryItem = new Gallery({
      title: req.body.title,
      description: req.body.description || '',
      category: req.body.category || 'other',
      isPublic: req.body.isPublic === 'true' || req.body.isPublic === true,
      imageUrl: imageUrl,
      uploadedBy: req.user.id
    });

    await galleryItem.save();
    await galleryItem.populate('uploadedBy', 'name');
    res.status(201).json(galleryItem);
  } catch (error) {
    console.error('Gallery save error:', error);
    // Delete uploaded file if database save fails
    if (req.file) {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../uploads/gallery', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ message: error.message || 'Internal server error' });
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

