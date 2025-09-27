const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: true,
    enum: ['Vettaiyan', 'Dheeran', 'Maaran', 'Veeran']
  },
  partyName: {
    type: String,
    required: true
  },
  partyPhone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  from: {
    type: String,
    required: true
  },
  via: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  beforeNightPickup: {
    type: Boolean,
    default: false
  },
  pickupTime: {
    type: String,
    default: ''
  },
  totalAmount: {
    type: String,
    default: ''
  },
  advance: {
    type: String,
    default: ''
  },
  balance: {
    type: String,
    default: ''
  },
  recommendedBy: {
    type: String,
    default: ''
  },
  bookingDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema, 'bookings');
