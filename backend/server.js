require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
connectDB();
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/restaurant', require('./routes/restaurantRoutes'));
app.use('/api/ngo', require('./routes/ngoRoutes'));

app.listen(5000, () => console.log('Server running on 5000'));