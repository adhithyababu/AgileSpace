const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // .env file-il ulla MONGO_URI vaayichedukkunnu
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1); // Error vannal process nirthalaakkan
    }
};

module.exports = connectDB;