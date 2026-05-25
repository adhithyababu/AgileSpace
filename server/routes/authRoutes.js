const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Routes ലിങ്ക് ചെയ്യുന്നു
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;