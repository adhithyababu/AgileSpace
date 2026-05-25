const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 🔑 Helper Function: Token ഉണ്ടാക്കാൻ വേണ്ടി
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // 30 ദിവസത്തേക്ക് ഈ ലോഗിൻ ടോക്കൺ വാലിഡ് ആയിരിക്കും
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. ഈ ഇമെയിൽ മുൻപ് രജിസ്റ്റർ ചെയ്തതാണോ എന്ന് നോക്കുന്നു
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // 2. പുതിയ യൂസറെ ഡാറ്റാബേസിലേക്ക് സേവ് ചെയ്യുന്നു
        const user = await User.create({
            name,
            email,
            password // ഇത് മോഡലിലെ .pre('save') വഴി ഓട്ടോമാറ്റിക് ആയി ഹാഷ് ആയിക്കോളും
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id) // യൂസർക്ക് ടോക്കൺ നൽകുന്നു
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. ഇമെയിൽ ഉണ്ടോ എന്ന് നോക്കുന്നു, ഒപ്പം പാസ്‌വേഡ് ഫീൽഡ് കൂടി സെലക്ട് ചെയ്യുന്നു
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // 2. യൂസർ അടിച്ച പാസ്‌വേഡും DB-യിലെ പാസ്‌വേഡും മാച്ച് ആണോ എന്ന് നോക്കുന്നു
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // 3. ലോഗിൻ സക്സസ് ആയാൽ ഡാറ്റയും ടോക്കണും തിരികെ നൽകുന്നു
        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Functions പുറത്തേക്ക് കൊടുക്കുന്നു
module.exports = {
    registerUser,
    loginUser
};