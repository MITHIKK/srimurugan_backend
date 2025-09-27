const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: true,
    enum: ['Vettaiyan', 'Dheeran', 'Maaran', 'Veeran']
  },
  partyName: {
    type: String,
    default: ''
  },
  partyPhone: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^\d{10}$/.test(v);
      },
      message: 'Phone number must be 10 digits'
    }
  },
  from: {
    type: String,
    default: ''
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
