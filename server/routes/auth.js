const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const { auth } = require('../middleware/auth');

// Register (for internal use)
router.post('/register', async (req, res) => {
  try {
    const { name, email, role, position } = req.body;
    
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
    res.status(500).json({ message: error.message });
  }
});

// Login (verify Firebase token or use email)
router.post('/login', async (req, res) => {
  try {
    const { email, firebaseToken } = req.body;

    if (firebaseToken) {
      // Verify Firebase token on frontend, then find member
      // For now, we'll use email-based lookup
    }

    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
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
    res.status(500).json({ message: error.message });
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

