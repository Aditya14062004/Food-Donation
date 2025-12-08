const express = require('express');
const connectDB = require('./config/db.js');
require('dotenv').config();
const cors = require('cors');

// Import routers
const adminRoutes = require('./routes/adminRoutes.js');
const ngoRoutes = require('./routes/ngoRoutes.js');
const restaurantRoutes = require('./routes/restaurantRoutes.js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Sample route
app.get("/", (req, res) => {
  res.send("Food Donation API is running...");
});

app.use("/admin", adminRoutes);
app.use("/ngo", ngoRoutes);
app.use("/restaurant", restaurantRoutes);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`)
});