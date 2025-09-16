const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public (consider adding auth later)
router.get('/', async (req, res) => {
  try {
    const { busName, month, year, status } = req.query;
    
    let filter = {};
    
    // Filter by bus name
    if (busName) {
      filter.busName = busName;
    }
    
    // Filter by month/year
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    // Filter by status
    if (status) {
      filter.status = status;
    }
    
    const bookings = await Booking.find(filter).sort({ date: 1 });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
router.post('/', async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Calculate balance amount
    const totalAmount = parseFloat(bookingData.totalAmount) || 0;
    const advanceAmount = parseFloat(bookingData.advanceAmount) || 0;
    bookingData.balanceAmount = totalAmount - advanceAmount;
    
    // Create new booking
    const booking = new Booking(bookingData);
    
    // Check for conflicts
    const conflicts = await booking.checkConflicts();
    const filteredConflicts = conflicts.filter(conflict => 
      conflict._id.toString() !== booking._id.toString()
    );
    
    if (filteredConflicts.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Booking conflict detected',
        conflicts: filteredConflicts
      });
    }
    
    await booking.save();
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Calculate balance amount
    const totalAmount = parseFloat(bookingData.totalAmount) || 0;
    const advanceAmount = parseFloat(bookingData.advanceAmount) || 0;
    bookingData.balanceAmount = totalAmount - advanceAmount;
    bookingData.updatedAt = new Date();
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      bookingData,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    await booking.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Check booking conflicts
// @route   POST /api/bookings/check-conflicts
// @access  Public
router.post('/check-conflicts', async (req, res) => {
  try {
    const { busName, date, numberOfDays, excludeId } = req.body;
    
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (numberOfDays - 1));
    
    let filter = {
      busName,
      status: { $ne: 'cancelled' },
      $or: [
        {
          date: { $lte: endDate },
          $expr: {
            $gte: [
              { $dateAdd: { startDate: "$date", unit: "day", amount: { $subtract: ["$numberOfDays", 1] } } },
              startDate
            ]
          }
        }
      ]
    };
    
    // Exclude current booking if updating
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    
    const conflicts = await Booking.find(filter);
    
    res.json({
      success: true,
      hasConflicts: conflicts.length > 0,
      conflicts
    });
  } catch (error) {
    console.error('Check conflicts error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Public
router.get('/api/stats', async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();
    
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);
    
    const stats = await Booking.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            busName: '$busName',
            month: { $month: '$date' }
          },
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalAdvance: { $sum: '$advanceAmount' },
          totalBalance: { $sum: '$balanceAmount' }
        }
      },
      {
        $sort: { '_id.month': 1, '_id.busName': 1 }
      }
    ]);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;
