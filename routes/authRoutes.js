const express = require('express');
const router = express.Router();

// Default PIN
const DEFAULT_PIN = '1969';

// Verify PIN
router.post('/verify-pin', (req, res) => {
  const { pin } = req.body;
  
  if (pin === DEFAULT_PIN) {
    res.json({ 
      success: true, 
      message: 'PIN verified successfully',
      token: 'dummy-token-for-session' // In production, use JWT
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid PIN' 
    });
  }
});

module.exports = router;
