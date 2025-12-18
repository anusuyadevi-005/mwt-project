const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialRequests,
      packageId,
      bookingType,
      startDate,
      numberOfPeople,
      selectedGuide,
      selectedVehicle,
      selectedCities,
      selectedPlaces,
      customDuration,
      totalPrice
    } = req.body;

    console.log('Received booking request:', req.body);

    // Validate required fields
    if (!name || !email || !phone || !startDate) {
      console.error('Missing required fields:', { name, email, phone, startDate });
      return res.status(400).json({
        error: 'Missing required fields: name, email, phone, and startDate are required'
      });
    }

    // Validate booking type specific requirements
    if (bookingType === 'customized' && (!selectedCities || selectedCities.length === 0)) {
      return res.status(400).json({ 
        error: 'At least one city must be selected for customized packages' 
      });
    }

    // Generate a unique booking ID
    const bookingId = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create new booking
    const newBooking = new Booking({
      bookingId,
      name,
      email,
      phone,
      specialRequests,
      packageId,
      bookingType,
      startDate: new Date(startDate),
      numberOfPeople: parseInt(numberOfPeople),
      selectedGuide: selectedGuide || null,
      selectedVehicle: selectedVehicle || null,
      selectedCities: selectedCities || [],
      selectedPlaces: selectedPlaces || [],
      customDuration: customDuration ? parseInt(customDuration) : null,
      totalPrice: parseFloat(totalPrice),
      status: 'pending', // pending, confirmed, cancelled
      createdAt: new Date()
    });

    // Save to database
    await newBooking.save();

    // Send success response
    res.status(201).json({
      success: true,
      bookingId: newBooking.bookingId,
      message: 'Booking created successfully',
      booking: {
        id: newBooking._id,
        bookingId: newBooking.bookingId,
        name: newBooking.name,
        email: newBooking.email,
        totalPrice: newBooking.totalPrice,
        startDate: newBooking.startDate,
        status: newBooking.status
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      error: 'Failed to create booking',
      details: error.message 
    });
  }
});

// GET /api/bookings - Get all bookings (for admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch bookings',
      details: error.message 
    });
  }
});

// GET /api/bookings/:bookingId - Get specific booking
router.get('/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    
    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found' 
      });
    }
    
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ 
      error: 'Failed to fetch booking',
      details: error.message 
    });
  }
});

// PUT /api/bookings/:bookingId - Update booking status
router.put('/:bookingId', async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findOneAndUpdate(
      { bookingId: req.params.bookingId },
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Booking updated successfully',
      booking 
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ 
      error: 'Failed to update booking',
      details: error.message 
    });
  }
});

// DELETE /api/bookings/:bookingId - Cancel booking
router.delete('/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { bookingId: req.params.bookingId },
      { status: 'cancelled', updatedAt: new Date() },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully',
      booking 
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ 
      error: 'Failed to cancel booking',
      details: error.message 
    });
  }
});

module.exports = router;