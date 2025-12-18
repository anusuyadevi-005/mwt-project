const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  specialRequests: {
    type: String,
    default: ''
  },
  packageId: {
    type: String,
    default: null
  },
  bookingType: {
    type: String,
    enum: ['fixed', 'customized'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1
  },
  selectedGuide: {
    type: String,
    default: null
  },
  selectedVehicle: {
    type: String,
    default: null
  },
  selectedCities: {
    type: [String],
    default: []
  },
  selectedPlaces: {
    type: [String],
    default: []
  },
  customDuration: {
    type: Number,
    default: null
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
bookingSchema.index({ email: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ status: 1 });

// Pre-save middleware to update updatedAt
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;