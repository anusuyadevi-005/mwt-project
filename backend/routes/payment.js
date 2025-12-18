const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_RVDGmY3rJ5TWaC', // Your test key_id
  key_secret: 'iMQlqNitbHm1HHfYLhj81Ubh', // Your test key_secret
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', bookingId } = req.body;

    console.log('Received create-order request:', { amount, currency, bookingId });

    // Validate required fields
    if (!amount || !bookingId) {
      console.error('Missing required fields:', { amount, bookingId });
      return res.status(400).json({
        error: 'Amount and bookingId are required'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency,
      receipt: `receipt_${bookingId}`,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);

    // Update booking with order ID
    await Booking.findOneAndUpdate(
      { bookingId },
      {
        razorpayOrderId: order.id,
        updatedAt: new Date()
      }
    );

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: razorpay.key_id
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      error: 'Failed to create payment order',
      details: error.message
    });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    // Create expected signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(sign.toString())
      .digest('hex');

    // Verify signature
    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      await Booking.findOneAndUpdate(
        { bookingId },
        {
          paymentId: razorpay_payment_id,
          paymentStatus: 'paid',
          status: 'confirmed',
          updatedAt: new Date()
        }
      );

      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id
      });
    } else {
      // Payment verification failed
      await Booking.findOneAndUpdate(
        { bookingId },
        {
          paymentStatus: 'failed',
          updatedAt: new Date()
        }
      );

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      error: 'Payment verification failed',
      details: error.message
    });
  }
});

// Get payment status
router.get('/status/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      success: true,
      paymentStatus: booking.paymentStatus,
      paymentId: booking.paymentId,
      razorpayOrderId: booking.razorpayOrderId
    });

  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      error: 'Failed to fetch payment status',
      details: error.message
    });
  }
});

module.exports = router;
