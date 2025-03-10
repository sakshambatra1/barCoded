const express = require('express');
const {register,verifyEmail} = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, 
    message: 'Too many registration attempts, please try again after 15 minutes',
});

router.post('/register', registrationLimiter, register);
router.post('/verify-email', verifyEmail);

module.exports = router;