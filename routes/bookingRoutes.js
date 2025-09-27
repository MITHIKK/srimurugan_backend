const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings by bus name
router.get('/bus/:busName', async (req, res) => {
  try {
    const bookings = await Booking.find({ busName: req.params.busName });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings by date range
router.get('/date-range', async (req, res) => {
  try {
    const { startDate, endDate, busName } = req.query;
    const query = {};
    
    if (busName) {
      query.busName = busName;
    }
    
    if (startDate && endDate) {
      query.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const bookings = await Booking.find(query);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    console.log('Received booking data:', req.body);
    
    const booking = new Booking({
      busName: req.body.busName,
      partyName: req.body.partyName,
      partyPhone: req.body.partyPhone,
      from: req.body.from,
      via: req.body.via || '',
      to: req.body.to,
      numberOfDays: req.body.numberOfDays,
      beforeNightPickup: req.body.beforeNightPickup || false,
      pickupTime: req.body.pickupTime || '',
      totalAmount: req.body.totalAmount || '',
      advance: req.body.advance || '',
      balance: req.body.balance || '',
      recommendedBy: req.body.recommendedBy || '',
      bookingDate: req.body.bookingDate
    });

    const newBooking = await booking.save();
    console.log('Booking saved successfully:', newBooking._id);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    Object.keys(req.body).forEach(key => {
      booking[key] = req.body[key];
    });

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
