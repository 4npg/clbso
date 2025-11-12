const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { auth, adminAuth } = require('../middleware/auth');

// Get all reports (authenticated users only)
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'admin' || req.user.role === 'leader' 
      ? {} 
      : { createdBy: req.user.id };
    
    const reports = await Report.find(query)
      .populate('createdBy', 'name email')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('reviewedBy', 'name email');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check access
    if (req.user.role !== 'admin' && req.user.role !== 'leader' && report.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create report
router.post('/', auth, async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      createdBy: req.user.id
    });
    await report.save();
    await report.populate('createdBy', 'name email');
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update report (creator or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'leader' && report.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If admin is reviewing
    if ((req.body.status === 'reviewed' || req.body.reviewNotes) && (req.user.role === 'admin' || req.user.role === 'leader')) {
      req.body.reviewedBy = req.user.id;
    }

    Object.assign(report, req.body);
    await report.save();
    await report.populate('createdBy', 'name email');
    await report.populate('reviewedBy', 'name');
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete report (creator or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'leader' && report.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await report.deleteOne();
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

