const express = require("express");
const router = express.Router();

const {
    createHostelFeeOrder,
    createMessFeeOrder,
    verifyPaymentSignature,
    getPaymentHistory,
    getAllPayments,
} = require("../controllers/paymentController");

const { auth, isStudent, isProvostOrAdmin } = require("../middleware/auth"); // Assuming isProvostOrAdmin covers both

// Route to create a Razorpay order for hostel fee
router.post("/create-hostel-fee-order", auth, isStudent, createHostelFeeOrder);

// Route to create a Razorpay order for mess fee
router.post("/create-mess-fee-order", auth, isStudent, createMessFeeOrder);

// Route to verify payment signature
router.post("/verify-payment", auth, isStudent, verifyPaymentSignature);

// Route for a student to get their payment history
router.get("/my-history", auth, isStudent, getPaymentHistory);

// Route for an admin/provost to get all payment history
router.get("/all-payments", auth, isProvostOrAdmin, getAllPayments);

module.exports = router;
