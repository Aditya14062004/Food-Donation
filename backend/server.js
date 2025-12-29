require('dotenv').config();
const express = require('express');
const cors = require('cors');          // ✅ ADD
const connectDB = require('./config/db');

const app = express();
connectDB();

// Request logger
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request to: ${req.originalUrl}`);
    next();
};
app.use(logRequest);

// ✅ Allow frontend origin (Vite runs on port 5173)
app.use(
  cors({
    origin: ["https://beamish-kataifi-95ab4c.netlify.app", "https://neon-speculoos-b5febd.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/restaurant', require('./routes/restaurantRoutes'));
app.use('/api/ngo', require('./routes/ngoRoutes'));

app.listen(5000, () => console.log('Server running on 5000'));