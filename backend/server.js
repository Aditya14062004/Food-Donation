require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./config/db");

const app = express();
connectDB();

// ================= REQUEST LOGGER =================
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Request to: ${req.originalUrl}`);
  next();
};
app.use(logRequest);

// ================= CORS =================
// 🔐 Required for HTTP-only cookies
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://beamish-kataifi-95ab4c.netlify.app",
      "https://neon-speculoos-b5febd.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ================= BODY & COOKIE PARSERS =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= SECURITY HEADERS =================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ================= CONTENT SECURITY POLICY =================
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // required for Vite dev
      ],

      styleSrc: [
        "'self'",
        "'unsafe-inline'", // required for Tailwind
      ],

      imgSrc: [
        "'self'",
        "data:",
        "https://*.openstreetmap.org",
      ],

      connectSrc: [
        "'self'",
        "http://localhost:5000",
        "http://localhost:5173",
        "https://beamish-kataifi-95ab4c.netlify.app",
        "https://neon-speculoos-b5febd.netlify.app",
        "https://nominatim.openstreetmap.org",
      ],

      fontSrc: ["'self'", "data:"],

      objectSrc: ["'none'"],

      frameAncestors: ["'none'"],

      baseUri: ["'self'"],

      formAction: ["'self'"],
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