const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // ഒരേ ഇമെയിൽ വെച്ച് രണ്ട് അക്കൗണ്ട് ഉണ്ടാക്കാൻ സമ്മതിക്കില്ല
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // API വഴി ഡാറ്റ എടുക്കുമ്പോൾ പാസ്‌വേഡ് പുറത്തേക്ക് കാണിക്കാതെ ഒളിപ്പിച്ചു വെക്കാൻ
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 🔐 PASSWORD ENCRYPTION (ഡാറ്റാബേസിലേക്ക് സേവ് ആവുന്നതിന് തൊട്ട് മുൻപ് റൺ ആവുന്ന കോഡ്)
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 PASSWORD MATCHING (ലോഗിൻ ചെയ്യുമ്പോൾ യൂസർ അടിക്കുന്ന പാസ്‌വേഡും DB-യിലെ പാസ്‌വേഡും ഒത്തുനോക്കാൻ)
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);