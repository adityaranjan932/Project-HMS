const express = require('express');
const app = express();
require("dotenv").config();
const authRoutes = require('./routes/authRoutes');

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
app.use('/api', require('./routes/serviceRequests'));
// Define PORT
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})