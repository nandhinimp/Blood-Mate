const express = require("express");
const cors = require("cors");
const donorRoutes = require("./routes/donorRoutes"); // ✅ Corrected spelling
require('./db'); // ✅ Trigger MySQL connection

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("BloodMate Backend is running.");
});

// ✅ Use the actual donor route
app.use("/api/donors", donorRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
