const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// GET /api/packages - Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json({ success: true, packages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      error: 'Failed to fetch packages',
      details: error.message
    });
  }
});

// GET /api/packages/:id - Get specific package
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        error: 'Package not found'
      });
    }

    res.json({ success: true, package: pkg });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({
      error: 'Failed to fetch package',
      details: error.message
    });
  }
});

// POST /api/packages - Create new package (admin only)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      places,
      duration,
      nights,
      price,
      images,
      rating,
      reviews,
      itinerary
    } = req.body;

    // Validate required fields
    if (!name || !type || !description) {
      return res.status(400).json({
        error: 'Missing required fields: name, type, and description are required'
      });
    }

    // Validate type
    if (!['fixed', 'customized', 'iv'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid package type. Must be one of: fixed, customized, iv'
      });
    }

    // Create new package
    const newPackage = new Package({
      name,
      type,
      description,
      places: places || [],
      duration: duration || 0,
      nights: nights || 0,
      price: price || 0,
      images: images || [],
      rating: rating || 0,
      reviews: reviews || 0,
      itinerary: itinerary || []
    });

    // Save to database
    await newPackage.save();

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      package: newPackage
    });

  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({
      error: 'Failed to create package',
      details: error.message
    });
  }
});

// PUT /api/packages/:id - Update package (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      places,
      duration,
      price,
      images,
      rating,
      reviews,
      itinerary
    } = req.body;

    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        description,
        places,
        duration,
        price,
        images,
        rating,
        reviews,
        itinerary,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!pkg) {
      return res.status(404).json({
        error: 'Package not found'
      });
    }

    res.json({
      success: true,
      message: 'Package updated successfully',
      package: pkg
    });

  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({
      error: 'Failed to update package',
      details: error.message
    });
  }
});

// DELETE /api/packages/:id - Delete package (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        error: 'Package not found'
      });
    }

    res.json({
      success: true,
      message: 'Package deleted successfully',
      package: pkg
    });

  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({
      error: 'Failed to delete package',
      details: error.message
    });
  }
});

module.exports = router;
