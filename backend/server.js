require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./config/db");

const app = express();
connectDB();

// ================= LOGGER =================
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(
  cors({
    origin:
      ["http://localhost:5173",
        "https://beamish-kataifi-95ab4c.netlify.app",
        "https://neon-speculoos-b5febd.netlify.app",
        "https://velvety-piroshki-3ac39f.netlify.app",
        "https://steady-pudding-f69814.netlify.app",
        "https://statuesque-crepe-7e6484.netlify.app"]
    ,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ================= PARSERS =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= SECURITY HEADERS =================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://*.openstreetmap.org"],
        connectSrc: [
          "'self'",
          "https://food-donation-dhrg.onrender.com",
          "https://nominatim.openstreetmap.org",
          "http://localhost:5173",
          "https://beamish-kataifi-95ab4c.netlify.app",
          "https://neon-speculoos-b5febd.netlify.app",
          "https://velvety-piroshki-3ac39f.netlify.app",
          "https://steady-pudding-f69814.netlify.app",
          "https://statuesque-crepe-7e6484.netlify.app"
        ],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [], // Required for HTTPS in 2026
      },
    },
  })
);

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/restaurant", require("./routes/restaurantRoutes"));
app.use("/api/ngo", require("./routes/ngoRoutes"));

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});