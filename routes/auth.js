const express = require('express');
const router = express.Router();

// @desc    Login with PIN
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { pin } = req.body;
    
    if (!pin) {
      return res.status(400).json({
        success: false,
        error: 'PIN is required'
      });
    }
    
    // Check PIN against environment variable
    const adminPin = process.env.ADMIN_PIN || '1234';
    
    if (pin !== adminPin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid PIN'
      });
    }
    
    // In a production app, you would generate a JWT token here
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        authenticated: true,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Verify PIN
// @route   POST /api/auth/verify
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { pin } = req.body;
    
    if (!pin) {
      return res.status(400).json({
        success: false,
        error: 'PIN is required'
      });
    }
    
    const adminPin = process.env.ADMIN_PIN || '1234';
    
    res.json({
      success: true,
      valid: pin === adminPin
    });
  } catch (error) {
    console.error('Verify PIN error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;
