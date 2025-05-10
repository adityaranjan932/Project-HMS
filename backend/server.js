const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
require('dotenv').config();
const app = express();
const PORT = 4000; // Ensure this matches the frontend's API URL

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // Prepend /api/auth to all routes in authRoutes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
