const express = require('express');
const router = express.Router();
const Finance = require('../models/Finance');
const { auth, adminAuth } = require('../middleware/auth');

// Get all finance records (authenticated users only)
router.get('/', auth, async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const query = {};

    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const finances = await Finance.find(query)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name')
      .sort({ date: -1 });
    res.json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const [income, expense] = await Promise.all([
      Finance.aggregate([
        { $match: { ...query, type: 'income', status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Finance.aggregate([
        { $match: { ...query, type: 'expense', status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      startDate: startDate || null,
      endDate: endDate || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create finance record
router.post('/', auth, async (req, res) => {
  try {
    const finance = new Finance({
      ...req.body,
      createdBy: req.user.id
    });
    await finance.save();
    await finance.populate('createdBy', 'name email');
    res.status(201).json(finance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update finance record (admin only for approval)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }

    if (req.body.status === 'approved' || req.body.status === 'rejected') {
      req.body.approvedBy = req.user.id;
    }

    Object.assign(finance, req.body);
    await finance.save();
    await finance.populate('createdBy', 'name email');
    await finance.populate('approvedBy', 'name');
    res.json(finance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete finance record (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    await finance.deleteOne();
    res.json({ message: 'Finance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

