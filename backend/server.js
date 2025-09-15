require('dotenv').config({ path: __dirname + '/.env' }); // Load environment variables first
const express = require("express");
const cors = require("cors");
const donorRoutes = require("./routes/donorRoutes");
const ocrRoutes = require("./routes/ocr");
require('./db'); // ✅ Trigger MySQL connection

const app = express();
const PORT = 5000;

// ✅ Enhanced CORS configuration for Firebase Auth
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Cross-Origin-Opener-Policy'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Add security headers
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("BloodMate Backend is running.");
});

// ✅ Use the actual donor route
app.use("/api/donors", donorRoutes);
app.use("/api/ocr", ocrRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});