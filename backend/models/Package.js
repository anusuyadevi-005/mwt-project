const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['fixed', 'customized', 'iv'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  places: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    mapUrl: {
      type: String,
      trim: true
    },
    cost: {
      type: Number,
      default: 0,
      min: 0
    },
    timing: {
      type: String,
      trim: true
    }
  }],
  duration: {
    type: Number,
    default: 0,
    min: 0
  },
  nights: {
    type: Number,
    default: 0,
    min: 0
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    places: [{
      type: String,
      trim: true
    }],
    hotels: [{
      id: String,
      name: String,
      location: String,
      rating: Number,
      priceRange: String,
      amenities: [String],
      image: String
    }],
    restaurants: [{
      id: String,
      name: String,
      location: String,
      cuisine: [String],
      rating: Number,
      priceRange: String,
      image: String
    }]
  }],
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
packageSchema.index({ type: 1 });
packageSchema.index({ createdAt: -1 });

// Pre-save middleware to update updatedAt
packageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
