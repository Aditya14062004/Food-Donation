require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ✅ REQUIRED
const connectDB = require("./config/db");

const app = express();
connectDB();

// ================= MIDDLEWARES =================

// Request logger
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Request to: ${req.originalUrl}`);
  next();
};
app.use(logRequest);

// ✅ CORS (HTTP-Only cookies require credentials)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://beamish-kataifi-95ab4c.netlify.app",
      "https://neon-speculoos-b5febd.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // 🔥 REQUIRED
  })
);

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Cookie parser (MANDATORY for cookie auth)
app.use(cookieParser());

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/restaurant", require("./routes/restaurantRoutes"));
app.use("/api/ngo", require("./routes/ngoRoutes"));

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));