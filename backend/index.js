const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const dataBase = require("./config/dataBase");

dataBase.connect();

// CORS middleware
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

//middleware
app.use(express.json());

//default routes 
app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "your server is running",
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/service-requests', maintenanceRoutes); // Add maintenance routes

// Define PORT
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
