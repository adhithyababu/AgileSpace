const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // 👈 NEW: Database file link cheyyunnu
const authRoutes = require('./routes/authRoutes'); // 👈 NEW: Auth route require cheyyunn
const workspaceRoutes = require('./routes/workspaceRoutes'); // 👈 NEW: Workspace route ഇമ്പോർട്ട് ചെയ്യുന്നു
const taskRoutes = require('./routes/taskRoutes'); // 👈 NEW: Task route ഇമ്പോർട്ട് ചെയ്യുന്നു

// Load env variables (port, db links etc)
dotenv.config();

// Connect to Database
connectDB(); // 👈 NEW: Server thudanguMbol thanne DB connect cheyyaan parayunnu

const app = express();

// Middleware 
app.use(cors()); // 👈 ബ്രാക്കറ്റിനുള്ളിൽ ഒന്നും കൊടുക്കണ്ട, കാലിയായി വിടുക!
app.use(express.json()); // Backend-ilekk varunna JSON data vaayikkaan
// 🗺️ API Routes
app.use('/api/auth', authRoutes); // 👈 NEW: Auth route-ne server-lekk link cheyyunnu
app.use('/api/workspaces', workspaceRoutes); // 👈 NEW: Workspace റൂട്ട് ലിങ്ക് ചെയ്യുന്നു
app.use('/api/tasks', taskRoutes); // 👈 NEW: Task റൂട്ട് ലിങ്ക് ചെയ്യുന്നു
// Basic Test Route
app.get('/', (req, res) => {
    res.send('AgileSpace backend system is working fine!');
});

// Port connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
});