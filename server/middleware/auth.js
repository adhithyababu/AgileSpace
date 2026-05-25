const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Request-ന്റെ Header-ൽ 'Bearer token' ഉണ്ടോ എന്ന് നോക്കുന്നു
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token മാത്രം വേർതിരിച്ചെടുക്കുന്നു
            token = req.headers.authorization.split(' ')[1];

            // Token വെരിഫൈ ചെയ്യുന്നു
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // ലോഗിൻ ചെയ്ത യൂസറുടെ വിവരങ്ങൾ req.user-ലേക്ക് കൊടുക്കുന്നു
            req.user = await User.findById(decoded.id);

            next(); // അടുത്ത ലോജിക്കിലേക്ക് കടക്കാൻ അനുവാദം നൽകുന്നു
        } catch (error) {
            return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized, no token found' });
    }
};

module.exports = { protect };