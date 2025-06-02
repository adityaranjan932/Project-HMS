import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux'; // Assuming you use Redux for token/user state
import { toast } from 'react-hot-toast';
import {
  createHostelFeeOrder,
  createMessFeeOrder,
  verifyPayment,
  getMyPaymentHistory,
} from '../../../services/auth'; // Corrected path
import { apiConnector } from '../../../services/apiconnector'; // For Razorpay key if not in order response

const FeesPayment = () => {
  const [messSemester, setMessSemester] = useState('odd'); // 'odd' or 'even'
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingHostelPay, setLoadingHostelPay] = useState(false);
  const [loadingMessPay, setLoadingMessPay] = useState(false);

  // Get token from localStorage (or Redux store)
  const token = localStorage.getItem("token"); // Removed JSON.parse
  // const { user } = useSelector((state) => state.profile); // Example if user details are in Redux

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const fetchPaymentHistory = useCallback(async () => {
    if (!token) {
      toast.error("Authentication required.");
      return;
    }
    setLoadingHistory(true);
    try {
      const response = await getMyPaymentHistory(token);
      if (response && response.success) {
        setPaymentHistory(response.data || []);
      } else {
        toast.error(response?.message || 'Failed to fetch payment history.');
        setPaymentHistory([]);
      }
    } catch (error) {
      toast.error('Error fetching payment history.');
      console.error("Payment history fetch error:", error);
      setPaymentHistory([]);
    }
    setLoadingHistory(false);
  }, [token]);

  useEffect(() => {
    fetchPaymentHistory();
  }, [fetchPaymentHistory]);

  const handlePayment = async (feeType, semester = null) => {
    if (!token) {
      toast.error("Please login to proceed with payment.");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Razorpay SDK failed to load. Check your internet connection.');
      return;
    }

    let orderResponse;
    if (feeType === 'hostel') {
      setLoadingHostelPay(true);
      orderResponse = await createHostelFeeOrder(token);
      setLoadingHostelPay(false);
    } else if (feeType === 'mess') {
      if (!semester) {
        toast.error("Please select a semester for mess fee payment.");
        return;
      }
      setLoadingMessPay(true);
      orderResponse = await createMessFeeOrder({ semester }, token);
      setLoadingMessPay(false);
    }

    if (!orderResponse || !orderResponse.success) {
      toast.error(orderResponse?.message || 'Failed to create payment order.');
      return;
    }

    const { orderId, amount, currency, key, studentName, studentEmail } = orderResponse;
    // const razorpayKey = process.env.VITE_RAZORPAY_KEY; // If key is not in orderResponse

    const options = {
      key: key, // Use key from backend response
      amount: amount,
      currency: currency,
      name: 'HMS Payments',
      description: `${feeType === 'hostel' ? 'Hostel Fee' : `Mess Fee (${semester} semester)`}`,
      order_id: orderId,
      handler: async function (response) {
        const verificationData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };
        const verificationResult = await verifyPayment(verificationData, token);
        if (verificationResult && verificationResult.success) {
          toast.success(verificationResult.message || 'Payment successful!');
          fetchPaymentHistory(); // Refresh history
        } else {
          toast.error(verificationResult?.message || 'Payment verification failed.');
        }
      },
      prefill: {
        name: studentName || 'Student Name',
        email: studentEmail || 'student@example.com',
        // contact: '9999999999' // Optional: if you have student's phone number
      },
      notes: {
        address: 'Hostel Management System',
        feeType: feeType,
        semester: semester || 'N/A'
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      toast.error(`Payment Failed: ${response.error.description}`);
      console.error("Payment Failed:", response.error);
    });
    paymentObject.open();
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Fees Payment</h2>

      {/* Hostel Fee Payment */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-medium mb-4 text-gray-600">Hostel Fee</h3>
        <p className="text-sm text-gray-500 mb-4">
          Pay your annual hostel fees here. Ensure your allotment is confirmed before proceeding.
        </p>
        <button
          onClick={() => handlePayment('hostel')}
          disabled={loadingHostelPay}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
        >
          {loadingHostelPay ? 'Processing...' : 'Pay Hostel Fee'}
        </button>
      </div>

      {/* Mess Fee Payment */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-medium mb-4 text-gray-600">Mess Fee</h3>
        <p className="text-sm text-gray-500 mb-2">
          Pay your semester-wise mess fees. Select the semester for which you want to pay.
        </p>
        <div className="flex items-center space-x-4 mb-4">
          <label htmlFor="messSemester" className="block text-sm font-medium text-gray-700">
            Select Semester:
          </label>
          <select
            id="messSemester"
            value={messSemester}
            onChange={(e) => setMessSemester(e.target.value)}
            className="mt-1 block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="odd">Odd Semester</option>
            <option value="even">Even Semester</option>
          </select>
        </div>
        <button
          onClick={() => handlePayment('mess', messSemester)}
          disabled={loadingMessPay}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
        >
          {loadingMessPay ? 'Processing...' : `Pay Mess Fee (${messSemester === 'odd' ? 'Odd' : 'Even'} Sem)`}
        </button>
      </div>

      {/* Payment History */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-medium mb-4 text-gray-600">Payment History</h3>
        {loadingHistory ? (
          <p className="text-gray-500">Loading payment history...</p>
        ) : paymentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (INR)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(payment.transactionDate || payment.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{payment.paymentFor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{payment.semester === 'full_year' ? 'Annual' : payment.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'captured' ? 'bg-green-100 text-green-800' :
                        payment.status === 'created' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate" title={payment.razorpayOrderId}>{payment.razorpayOrderId?.substring(0,15) || 'N/A'}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No payment history found.</p>
        )}
      </div>
    </div>
  );
};

export default FeesPayment;
