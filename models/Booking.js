const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: true,
    enum: ['VETTAIYAN', 'DHEERAN', 'MAARAN', 'VEERAN']
  },
  date: {
    type: Date,
    required: true
  },
  tamilDate: {
    type: String,
    required: false
  },
  numberOfDays: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Time Details
  pickupTime: {
    type: String,
    required: true
  },
  isNightPickup: {
    type: Boolean,
    default: false
  },
  nightPickupTime: {
    type: String,
    required: false
  },
  
  // Party Details
  partyName: {
    type: String,
    required: true
  },
  phone1: {
    type: String,
    required: true
  },
  phone2: {
    type: String,
    required: false
  },
  
  // Trip Details
  fromLocation: {
    type: String,
    required: true
  },
  toLocation: {
    type: String,
    required: true
  },
  viaRoute: {
    type: String,
    required: false
  },
  
  // Recommendation
  recommendedBy: {
    type: String,
    required: false
  },
  
  // Payment Details
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  advanceAmount: {
    type: Number,
    required: true,
    min: 0
  },
  balanceAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Service Inclusions
  serviceInclusions: {
    includeRent: { type: Boolean, default: true },
    includeDiesel: { type: Boolean, default: false },
    includeDriverBeta: { type: Boolean, default: false },
    includeToll: { type: Boolean, default: false },
    includeCheckPost: { type: Boolean, default: false },
    includeParking: { type: Boolean, default: false }
  },
  
  // Booking Status
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ busName: 1, date: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ partyName: 1 });

// Virtual for formatted date range
bookingSchema.virtual('dateRange').get(function() {
  const startDate = new Date(this.date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + this.numberOfDays - 1);
  return {
    start: startDate,
    end: endDate
  };
});

// Method to check for booking conflicts
bookingSchema.methods.checkConflicts = function() {
  const startDate = new Date(this.date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + this.numberOfDays - 1);
  
  return this.constructor.find({
    busName: this.busName,
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
  });
};

module.exports = mongoose.model('Booking', bookingSchema);
