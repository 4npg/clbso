const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const { auth } = require('../middleware/auth');

// Register (for internal use)
router.post('/register', async (req, res) => {
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not connected. Please check MongoDB connection.' 
      });
    }

    const { name, email, role, position } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: 'Member already exists' });
    }

    const member = new Member({
      name,
      email,
      role: role || 'member',
      position
    });

    await member.save();

    const token = jwt.sign(
      { id: member._id, email: member.email, role: member.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Login (verify Firebase token or use email)
router.post('/login', async (req, res) => {
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not connected. Please check MongoDB connection.' 
      });
    }

    const { email, firebaseToken } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (firebaseToken) {
      // Verify Firebase token on frontend, then find member
      // For now, we'll use email-based lookup
      // TODO: Add Firebase Admin SDK token verification
    }

    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(404).json({ 
        message: 'Member not found. Please contact an administrator to be added to the system.' 
      });
    }

    if (!member.isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const token = jwt.sign(
      { id: member._id, email: member.email, role: member.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        position: member.position
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.user.id).select('-__v');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

