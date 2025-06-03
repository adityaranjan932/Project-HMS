import { apiConnector } from "./apiconnector";
import { toast } from "react-hot-toast";

// API endpoints - Base URL already includes /api prefix (http://localhost:4000/api)
export const SEND_OTP_API = "/auth/send-otp";
export const SIGNUP_API = "/auth/signup";
export const LOGIN_API = "/auth/login";
export const LOGOUT_API = "/auth/logout";
export const FORGOT_PASSWORD_API = "/auth/forgot-password";
export const RESET_PASSWORD_API = "/auth/reset-password";
export const SEND_RESET_PASSWORD_OTP_API = "/auth/send-reset-password-otp";
export const VERIFY_RESET_PASSWORD_OTP_API = "/auth/verify-reset-password-otp";
export const CHECK_ELIGIBILITY_API = "/auth/check-eligibility";
export const GET_ALL_REGISTERED_STUDENTS_API = "/auth/getAllRegisteredStudents";
export const GET_STUDENT_DETAILS_API = "/auth/getStudentDetails";
export const UPDATE_STUDENT_PROFILE_API = "/auth/updateStudentProfile";
export const GET_ALL_USERS_API = "/auth/getAllUsers";
export const GET_USER_DETAILS_API = "/auth/getUserDetails";
export const UPDATE_USER_ROLE_API = "/auth/updateUserRole";
export const DELETE_USER_API = "/auth/deleteUser";
export const GET_ACTIVITY_LOGS_API = "/auth/getActivityLogs";

// Allotment APIs
// No /api prefix here if VITE_API_BASE_URL includes it
export const ALLOT_ROOMS_API = "/allotment/allot-rooms";
export const GET_ROOM_AVAILABILITY_API = "/allotment/availability";
export const GET_ALLOTTED_STUDENTS_LIST_API = "/allotment/allotted-students";

// Payment APIs
// No /api prefix here if VITE_API_BASE_URL includes it
export const CREATE_HOSTEL_FEE_ORDER_API = "/payment/create-hostel-fee-order";
export const CREATE_MESS_FEE_ORDER_API = "/payment/create-mess-fee-order";
export const VERIFY_PAYMENT_API = "/payment/verify-payment";
export const GET_MY_PAYMENT_HISTORY_API = "/payment/my-history";

// Send OTP
export async function sendOtp(email) {
  return apiConnector("POST", SEND_OTP_API, { email });
}

// Verify OTP
export async function verifyOtp(email, otp) {
  return apiConnector("POST", "/auth/verify-otp", { email, otp });
}

// Email & Password Verification (step 2)
export async function emailVerification({ email, password, confirmPassword, otp }) {
  return apiConnector("POST", "/auth/email-verification", { email, password, confirmPassword, otp });
}

// Student Login
export async function login({ email, password }) {
  return apiConnector("POST", LOGIN_API, { email, password });
}

// Provost Login
export async function provostLogin({ email, password }) {
  // Assuming you have a PROVOST_LOGIN_API endpoint defined
  // If not, you might need to create one or use a generic login endpoint
  // that differentiates users by role on the backend.
  // For now, let's assume an endpoint like "/api/auth/provost-login"
  const PROVOST_LOGIN_API = "/auth/login-provost"; // Removed leading /api
  return apiConnector("POST", PROVOST_LOGIN_API, { email, password });
}

// Logout function for both students and provosts
export async function logout(token) {
  const toastId = toast.loading("Logging out...");
  let result = null;
  try {
    const response = await apiConnector("POST", LOGOUT_API, {}, {
      Authorization: `Bearer ${token}`,
    });
    console.log("LOGOUT_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Logout");
    }
    result = response?.data;
    
    // Clear localStorage/sessionStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    
    toast.success("Logged out successfully!");
  } catch (error) {
    console.log("LOGOUT_API ERROR............", error);
    toast.error(error.response?.data?.message || "Logout Failed");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}

// Register Student Profile (final step)
export async function registerStudentProfile(profileData) {
  return apiConnector("POST", "/auth/registered-student-profile", profileData);
}

// Check if email exists
export async function checkEmail(email) {
  return apiConnector("POST", "/auth/check-email", { email });
}

// Check eligibility
export async function checkEligibility(data) {
  // Unique log for Vercel deployment verification - May 12 2025
  console.log("[Auth Service - Vercel Deploy Check - May 12 2025] Attempting checkEligibility. Path to be used:", CHECK_ELIGIBILITY_API);
  const toastId = toast.loading("Checking eligibility...");
  let result = null;
  try {
    const response = await apiConnector("POST", CHECK_ELIGIBILITY_API, data);
    console.log("CHECK_ELIGIBILITY_API API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Check Eligibility");
    }
    result = response?.data;
    toast.success("Eligibility Verified"); // Or a more appropriate message
  } catch (error) {
    console.log("CHECK_ELIGIBILITY_API API ERROR............", error);
    toast.error(error.response?.data?.message || "Eligibility Check Failed");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}

// Get all registered students
export async function getRegisteredStudents() {
  return apiConnector("GET", "/auth/registered-students");
}

// --- Allotment Service Functions ---

// Trigger room allotment process
export async function allotHostelRooms() {
  const toastId = toast.loading("Processing allotment...");
  let result = null;
  try {
    const response = await apiConnector("POST", ALLOT_ROOMS_API);
    console.log("ALLOT_ROOMS_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Allot Rooms");
    }
    result = response?.data;
    toast.success(response?.data?.message || "Allotment Process Completed!");
  } catch (error) {
    console.log("ALLOT_ROOMS_API ERROR............", error);
    toast.error(error.response?.data?.message || error.message || "Allotment Process Failed");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Get room availability
export async function getRoomAvailability() {
  const toastId = toast.loading("Fetching room availability...");
  let result = null;
  try {
    const response = await apiConnector("GET", GET_ROOM_AVAILABILITY_API);
    console.log("GET_ROOM_AVAILABILITY_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Room Availability");
    }
    result = response?.data;
    // No toast success message here, as this might be called in the background
  } catch (error) {
    console.log("GET_ROOM_AVAILABILITY_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Fetch Room Availability");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}

// Get list of all allotted students
export async function getAllottedStudentsList() {
  const toastId = toast.loading("Fetching allotted students list...");
  let result = null;
  try {
    const response = await apiConnector("GET", GET_ALLOTTED_STUDENTS_LIST_API);
    console.log("GET_ALLOTTED_STUDENTS_LIST_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Allotted Students List");
    }
    result = response?.data;
  } catch (error) {
    console.log("GET_ALLOTTED_STUDENTS_LIST_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Fetch Allotted Students");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}

// --- Payment Service Functions ---

// Create Hostel Fee Order
export async function createHostelFeeOrder(token) {
  const toastId = toast.loading("Creating hostel fee order...");
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_HOSTEL_FEE_ORDER_API, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE_HOSTEL_FEE_ORDER_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Create Hostel Fee Order");
    }
    result = response?.data;
    toast.success("Hostel fee order created!");
  } catch (error) {
    console.log("CREATE_HOSTEL_FEE_ORDER_API ERROR............", error);
    toast.error(error.response?.data?.message || "Hostel Fee Order Creation Failed");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Create Mess Fee Order
export async function createMessFeeOrder(data, token) { // data should contain { semester: "odd" / "even" }
  const toastId = toast.loading("Creating mess fee order...");
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_MESS_FEE_ORDER_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE_MESS_FEE_ORDER_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Create Mess Fee Order");
    }
    result = response?.data;
    toast.success("Mess fee order created!");
  } catch (error) {
    console.log("CREATE_MESS_FEE_ORDER_API ERROR............", error);
    toast.error(error.response?.data?.message || "Mess Fee Order Creation Failed");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Verify Payment
export async function verifyPayment(data, token) {
  const toastId = toast.loading("Verifying payment...");
  let result = null;
  try {
    const response = await apiConnector("POST", VERIFY_PAYMENT_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("VERIFY_PAYMENT_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Payment Verification Failed");
    }
    result = response?.data;
    toast.success("Payment Verified Successfully!");
  } catch (error) {
    console.log("VERIFY_PAYMENT_API ERROR............", error);
    toast.error(error.response?.data?.message || "Payment Verification Failed");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Get Student's Payment History
export async function getMyPaymentHistory(token) {
  const toastId = toast.loading("Fetching payment history...");
  let result = null;
  try {
    const response = await apiConnector("GET", GET_MY_PAYMENT_HISTORY_API, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("GET_MY_PAYMENT_HISTORY_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Payment History");
    }
    result = response?.data;
    // No success toast here, let the component handle display
  } catch (error) {
    console.log("GET_MY_PAYMENT_HISTORY_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Fetch Payment History");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}

// --- Reset Password Service Functions ---

// Send Reset Password OTP
export async function sendResetPasswordOTP(email) {
  const toastId = toast.loading("Sending OTP...");
  let result = null;
  try {
    const response = await apiConnector("POST", SEND_RESET_PASSWORD_OTP_API, { email });
    console.log("SEND_RESET_PASSWORD_OTP_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Send Reset Password OTP");
    }
    result = response?.data;
    toast.success("Reset password OTP sent to your email!");
  } catch (error) {
    console.log("SEND_RESET_PASSWORD_OTP_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Send Reset Password OTP");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Verify Reset Password OTP
export async function verifyResetPasswordOTP(email, otp) {
  const toastId = toast.loading("Verifying OTP...");
  let result = null;
  try {
    const response = await apiConnector("POST", VERIFY_RESET_PASSWORD_OTP_API, { email, otp });
    console.log("VERIFY_RESET_PASSWORD_OTP_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Invalid OTP");
    }
    result = response?.data;
    toast.success("OTP verified successfully!");
  } catch (error) {
    console.log("VERIFY_RESET_PASSWORD_OTP_API ERROR............", error);
    toast.error(error.response?.data?.message || "OTP Verification Failed");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Reset Password
export async function resetPassword(email, otp, newPassword, confirmPassword) {
  const toastId = toast.loading("Resetting password...");
  let result = null;
  try {
    const response = await apiConnector("POST", RESET_PASSWORD_API, { 
      email, 
      otp, 
      newPassword, 
      confirmPassword 
    });
    console.log("RESET_PASSWORD_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Reset Password");
    }
    result = response?.data;
    toast.success("Password reset successfully! You can now login with your new password.");
  } catch (error) {
    console.log("RESET_PASSWORD_API ERROR............", error);
    toast.error(error.response?.data?.message || "Password Reset Failed");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}
