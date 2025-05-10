const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 4000; // Ensure this matches the frontend's API URL

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173', // local frontend
        'https://project-hms-frontend-l3vz.onrender.com' // deployed frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // Prepend /api/auth to all routes in authRoutes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
