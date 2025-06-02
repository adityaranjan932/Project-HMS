const Razorpay = require("razorpay");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY || "default_test_key",
    key_secret: process.env.RAZORPAY_SECRET || "default_test_secret",
});

module.exports = instance;
