const express = require('express');
const app = express();
require("dotenv").config();
const authRoutes = require('./routes/authRoutes');
// const serviceRequestsRoutes = require('./routes/serviceRequests');
// const feedbackRoutes = require('./routes/feedbackRoutes'); // Import feedback routes
const dataBase = require("./config/dataBase");

dataBase.connect();

//middleware
app.use(express.json());

//default routes 
app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "your server is running",
    })
});
//Routes
app.use("/api/auth", authRoutes); 

// app.use('/api', serviceRequestsRoutes);
// app.use('/api/feedback', feedbackRoutes); // Add feedback routes

// Define PORT
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})