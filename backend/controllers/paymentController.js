const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const AllottedStudent = require('../models/AllottedStudent');
require('../models/RegisteredStudentProfile'); // Explicitly require StudentProfile model to ensure it's registered
const razorpayInstance = require('../config/razorpay'); // Corrected import

// Fixed amounts (consider moving to a config file or environment variables)
const HOSTEL_FEE_AMOUNT = 60000; // Example: 60000 INR for hostel
const MESS_FEE_PER_SEMESTER = 20000; // Example: 20000 INR per semester for mess

// Helper function to create an order with Razorpay
const createRazorpayOrder = async (amount, currency, receipt, notes) => {
  const options = {
    amount: amount * 100, // Amount in the smallest currency unit (paise for INR)
    currency,
    receipt,
    notes,
  };
  console.log("Creating Razorpay order with options:", options);
  try {
    const order = await razorpayInstance.orders.create(options);
    console.log("Razorpay order created successfully:", order);
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error; // Re-throw to be caught by the controller
  }
};

// Create Hostel Fee Order
exports.createHostelFeeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID for hostel fee:", userId);

    const student = await User.findById(userId).populate('studentProfile');
    if (!student || !student.studentProfile) {
      console.log("Student or student profile not found for ID:", userId);
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }
    console.log("Student found:", student.name, student.email);

    // Check if student is allotted to a room (necessary for Payment model)
    const allotment = await AllottedStudent.findOne({ userId: userId }); // Corrected field to userId
    if (!allotment) {
      console.log("Student not allotted a room. User ID:", userId);
      return res.status(403).json({ success: false, message: 'You must be allotted a room to pay hostel fees.' });
    }
    console.log("Student allotment found for hostel fee. Room:", allotment.room);

    const amount = HOSTEL_FEE_AMOUNT;
    const currency = 'INR';
    const receipt = `hstl_${student._id}_${Date.now().toString().slice(-6)}`;
    console.log("Generated receipt for hostel fee:", receipt, "Length:", receipt.length);

    const academicYear = new Date().getFullYear().toString(); // Or your specific academic year logic

    const notes = {
      feeType: 'hostel',
      studentId: student._id.toString(),
      studentName: student.name, // Corrected to student.name
      academicYear: academicYear,
    };

    const order = await createRazorpayOrder(amount, currency, receipt, notes);

    if (!order) {
      return res.status(500).json({ success: false, message: 'Failed to create Razorpay order.' });
    }

    // Create initial payment record
    const newPayment = new Payment({
      studentId: student._id,
      allottedStudentId: allotment._id, // Added allotment check
      paymentFor: 'hostel',
      amount: amount,
      currency: currency,
      status: 'created',
      academicYear: academicYear,
      semester: 'full_year', // Hostel fee is for full year
      roomNumber: allotment.room, // Assuming allotment.room stores the room number
      // hostelType: allotment.hostelId?.type, // Optional: if hostel details are populated in allotment
      razorpayOrderId: order.id,
    });
    await newPayment.save();
    console.log("Initial payment record created for hostel fee, ID:", newPayment._id);

    res.status(200).json({
      success: true,
      message: 'Hostel fee order created successfully.',
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY, // Corrected to RAZORPAY_KEY
      studentName: student.name, // Corrected to student.name
      studentEmail: student.email,
      notes: order.notes,
      paymentRecordId: newPayment._id // Send new payment record ID
    });

  } catch (error) {
    console.error("Error creating hostel fee order:", error);
    res.status(500).json({ success: false, message: 'Internal server error while creating hostel fee order.', error: error.message });
  }
};

// Create Mess Fee Order
exports.createMessFeeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { semester } = req.body; 

    console.log("--- Create Mess Fee Order ---");
    console.log("User ID:", userId);
    console.log("Semester:", semester);

    if (!semester || !['odd', 'even'].includes(semester.toLowerCase())) {
      console.log("Invalid semester provided:", semester);
      return res.status(400).json({ success: false, message: 'Invalid semester provided. Must be "odd" or "even".' });
    }

    const student = await User.findById(userId).populate('studentProfile');
    if (!student || !student.studentProfile) {
      console.log("Student or student profile not found for ID:", userId);
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }
    console.log("Student found:", student.name, student.email); // Corrected to student.name

    const allotment = await AllottedStudent.findOne({ userId: userId }); // Corrected field to userId
    if (!allotment) {
      console.log("Student not allotted a room. User ID:", userId);
      return res.status(403).json({ success: false, message: 'You must be allotted a room to pay mess fees.' });
    }
    console.log("Student allotment found. Room:", allotment.room);

    const amount = MESS_FEE_PER_SEMESTER;
    const currency = 'INR';
    const receipt = `mess_${student._id}_${semester.charAt(0)}_${Date.now().toString().slice(-6)}`;
    console.log("Generated receipt for mess fee:", receipt, "Length:", receipt.length);
    
    const academicYear = new Date().getFullYear().toString(); // Or your specific academic year logic

    const notes = {
      feeType: 'mess',
      studentId: student._id.toString(),
      studentName: student.name, // Corrected to student.name
      semester: semester,
      academicYear: academicYear,
    };

    const order = await createRazorpayOrder(amount, currency, receipt, notes);
    console.log("Order from createRazorpayOrder:", order);

    if (!order) {
      console.log("Failed to create Razorpay order (order is null/undefined).");
      return res.status(500).json({ success: false, message: 'Failed to create Razorpay order.' });
    }

    // Create initial payment record
    const newPayment = new Payment({
        studentId: student._id,
        allottedStudentId: allotment._id,
        paymentFor: 'mess',
        amount: amount,
        currency: currency,
        status: 'created',
        academicYear: academicYear,
        semester: semester.toLowerCase(),
        roomNumber: allotment.room,
        // hostelType: allotment.hostelId?.type, // Optional
        razorpayOrderId: order.id,
    });
    await newPayment.save();
    console.log("Initial payment record created for mess fee, ID:", newPayment._id);

    res.status(200).json({
      success: true,
      message: 'Mess fee order created successfully.',
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY, // Corrected to RAZORPAY_KEY
      studentName: student.name, // Corrected to student.name
      studentEmail: student.email,
      notes: order.notes,
      paymentRecordId: newPayment._id // Send new payment record ID
    });

  } catch (error) {
    console.error("Error creating mess fee order:", error.error ? error.error : error);
    res.status(500).json({
        success: false,
        message: 'Internal server error while creating mess fee order.',
        error: error.error ? error.error.description : error.message
    });
  }
};

// --- Verify Payment Signature ---
exports.verifyPaymentSignature = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentRecordId } = req.body; // Added paymentRecordId
        const userId = req.user.id;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentRecordId) { // Added paymentRecordId check
            return res.status(400).json({ success: false, message: 'Missing Razorpay payment details or payment record ID.' });
        }

        // Use paymentRecordId to find the specific payment record
        const paymentRecord = await Payment.findById(paymentRecordId); 
        
        if (!paymentRecord) {
            return res.status(404).json({ success: false, message: 'Payment record not found for this ID.' });
        }
        // Security check: Ensure the payment record belongs to the logged-in user and matches the Razorpay order ID
        if (paymentRecord.studentId.toString() !== userId || paymentRecord.razorpayOrderId !== razorpay_order_id) {
            console.warn("Security Alert: Payment record mismatch for user:", userId, "paymentRecordId:", paymentRecordId, "razorpayOrderId:", razorpay_order_id);
            return res.status(403).json({ success: false, message: 'Payment record mismatch or unauthorized.' });
        }
        
        if (paymentRecord.status === 'captured') {
            return res.status(200).json({ success: true, message: 'Payment already verified and captured.', payment: paymentRecord });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            paymentRecord.status = 'captured';
            paymentRecord.razorpayPaymentId = razorpay_payment_id;
            paymentRecord.razorpaySignature = razorpay_signature;
            paymentRecord.transactionDate = new Date();
            await paymentRecord.save();
            
            // Update AllottedStudent fee status
            if (paymentRecord.allottedStudentId) {
                const feeTypeField = paymentRecord.paymentFor === 'hostel' ? 'hostelFeeStatus' : 'messFeeStatus';
                const feePaidOnField = paymentRecord.paymentFor === 'hostel' ? 'hostelFeePaidOn' : 'messFeePaidOn';
                try {
                    await AllottedStudent.findByIdAndUpdate(paymentRecord.allottedStudentId, {
                        [feeTypeField]: 'paid',
                        [feePaidOnField]: new Date()
                    });
                    console.log(`Updated ${feeTypeField} for AllottedStudent ID: ${paymentRecord.allottedStudentId}`);
                } catch (allotmentUpdateError) {
                    console.error(`Failed to update AllottedStudent fee status for ${paymentRecord.allottedStudentId}:`, allotmentUpdateError);
                    // Decide if this should cause the verification to fail or just log an error
                }
            }


            res.status(200).json({
                success: true,
                message: 'Payment verified and captured successfully.',
                paymentId: paymentRecord._id,
                paymentFor: paymentRecord.paymentFor,
                status: paymentRecord.status
            });
        } else {
            paymentRecord.status = 'failed';
            await paymentRecord.save();
            res.status(400).json({ success: false, message: 'Payment verification failed. Signature mismatch.' });
        }
    } catch (error) {
        console.error('Error verifying payment signature:', error);
        res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
    }
};

// --- Get Payment History ---
exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware

        const payments = await Payment.find({ studentId: userId })
            .sort({ createdAt: -1 }) // Show most recent first
            .populate('allottedStudentId', 'rollNumber allottedRoomNumber'); // Populate some relevant details

        if (!payments) {
            return res.status(404).json({ success: false, message: 'No payment history found for this student.' });
        }

        res.status(200).json({
            success: true,
            message: 'Payment history retrieved successfully.',
            data: payments,
        });
    } catch (error) {
        console.error('Error retrieving payment history:', error);
        res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
    }
};

// --- (Admin) Get All Payments ---
// Add this if needed for admin/provost to view all payments
exports.getAllPayments = async (req, res) => {
    try {
        // Ensure this is protected by admin/provost role in routes
        const payments = await Payment.find({})
            .populate('studentId', 'name email') // Populate student details from User model
            .populate('allottedStudentId', 'rollNumber name allottedRoomNumber') // Populate from AllottedStudent
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        console.error('Error retrieving all payments:', error);
        res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
    }
};
