const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Member = require('../models/Member');
const { auth, adminAuth } = require('../middleware/auth');

// Get all members (public - only active members)
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected. Please check MongoDB connection.' });
    }
    
    const members = await Member.find({ isActive: true })
      .select('name role position bio avatar joinDate contributions')
      .sort({ joinDate: -1 });
    res.json(members);
  } catch (error) {
    console.error('Members fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single member
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .select('name role position bio avatar joinDate contributions');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create member (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update member (admin or self)
router.put('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if user is admin or updating their own profile
    if (req.user.role !== 'admin' && req.user.role !== 'leader' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(member, req.body);
    await member.save();
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete member (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    await member.deleteOne();
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

