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

// Notice APIs
export const SEND_NOTICE_API = "/notices/send";
export const GET_SENT_NOTICES_API = "/notices/sent";
export const GET_RECEIVED_NOTICES_API = "/notices/received";
export const MARK_NOTICE_READ_API = "/notices";
export const GET_NOTICE_STATS_API = "/notices/stats";
export const GET_ALL_NOTICES_API = "/notices/all";

// Public Notice APIs
export const CREATE_PUBLIC_NOTICE_API = "/public-notices";
export const GET_ALL_PUBLIC_NOTICES_API = "/public-notices";
export const GET_PUBLISHED_PUBLIC_NOTICES_API = "/public-notices/published";
export const GET_PUBLIC_NOTICE_BY_ID_API = "/public-notices";
export const UPDATE_PUBLIC_NOTICE_API = "/public-notices";
export const DELETE_PUBLIC_NOTICE_API = "/public-notices";
export const PUBLISH_PUBLIC_NOTICE_API = "/public-notices";

// Feedback APIs
export const SUBMIT_FEEDBACK_API = "/feedback/submit";
export const GET_FEEDBACK_API = "/feedback";
export const GET_ALL_FEEDBACK_API = "/feedback/all";

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

// Get all allotted students (for provosts)
export async function getAllAllottedStudents() {
  const toastId = toast.loading("Fetching students...");
  let result = null;
  try {
    const response = await apiConnector("GET", GET_ALLOTTED_STUDENTS_LIST_API);
    console.log("GET_ALLOTTED_STUDENTS_LIST_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Fetch Allotted Students");
    }
    result = response?.data;
  } catch (error) {
    console.log("GET_ALLOTTED_STUDENTS_LIST_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Fetch Students");
    result = error.response?.data || { success: false, message: error.message };
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

// --- Notice Service Functions ---

// Send notice to a student
export async function sendNotice(noticeData) {
  const toastId = toast.loading("Sending notice...");
  let result = null;
  try {
    const response = await apiConnector("POST", SEND_NOTICE_API, noticeData);
    console.log("SEND_NOTICE_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Send Notice");
    }
    result = response?.data;
    toast.success("Notice sent successfully!");
  } catch (error) {
    console.log("SEND_NOTICE_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Send Notice");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Get sent notices (for provosts)
export async function getSentNotices(page = 1, limit = 20) {
  const toastId = toast.loading("Fetching sent notices...");
  let result = null;
  try {
    const response = await apiConnector("GET", `${GET_SENT_NOTICES_API}?page=${page}&limit=${limit}`);
    console.log("GET_SENT_NOTICES_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Fetch Sent Notices");
    }
    result = response?.data;
  } catch (error) {
    console.log("GET_SENT_NOTICES_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Fetch Sent Notices");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Get received notices (for students)
export async function getReceivedNotices(page = 1, limit = 20) {
  const toastId = toast.loading("Fetching notices...");
  let result = null;
  try {
    const response = await apiConnector("GET", `${GET_RECEIVED_NOTICES_API}?page=${page}&limit=${limit}`);
    console.log("GET_RECEIVED_NOTICES_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Fetch Notices");
    }
    result = response?.data;
  } catch (error) {
    console.log("GET_RECEIVED_NOTICES_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Fetch Notices");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Mark notice as read
export async function markNoticeAsRead(noticeId) {
  let result = null;
  try {
    const response = await apiConnector("PATCH", `${MARK_NOTICE_READ_API}/${noticeId}/read`);
    console.log("MARK_NOTICE_READ_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Mark Notice as Read");
    }
    result = response?.data;
  } catch (error) {
    console.log("MARK_NOTICE_READ_API ERROR............", error);
    result = error.response?.data || { success: false, message: error.message };
  }
  return result;
}

// Get notice statistics
export async function getNoticeStats() {
  const toastId = toast.loading("Fetching notice statistics...");
  let result = null;
  try {
    const response = await apiConnector("GET", GET_NOTICE_STATS_API);
    console.log("GET_NOTICE_STATS_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Fetch Notice Stats");
    }
    result = response?.data;
  } catch (error) {
    console.log("GET_NOTICE_STATS_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Fetch Notice Statistics");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// ========================================
// PUBLIC NOTICE FUNCTIONS
// ========================================

// Create a new public notice
export async function createPublicNotice(formData) {
  const toastId = toast.loading("Creating public notice...");
  let result = null;
  try {
    // Don't set Content-Type for FormData - let browser set it with boundary
    const response = await apiConnector("POST", CREATE_PUBLIC_NOTICE_API, formData);
    console.log("CREATE_PUBLIC_NOTICE_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Create Public Notice");
    }
    result = response?.data;
    toast.success("Public notice created successfully!");
  } catch (error) {
    console.log("CREATE_PUBLIC_NOTICE_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Create Public Notice");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Get all public notices (for admin/provost)
export async function getAllPublicNotices(params = {}) {
  let result = null;
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${GET_ALL_PUBLIC_NOTICES_API}?${queryString}` : GET_ALL_PUBLIC_NOTICES_API;

    const response = await apiConnector("GET", url);
    console.log("GET_ALL_PUBLIC_NOTICES_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Fetch Public Notices");
    }
    result = response?.data;
  } catch (error) {
    console.log("GET_ALL_PUBLIC_NOTICES_API ERROR............", error);
    result = error.response?.data || { success: false, message: error.message };
  }
  return result;
}

// Get published public notices (for public view)
export async function getPublishedPublicNotices(params = {}) {
  console.log("API: Calling getPublishedPublicNotices with params:", params);
  let result = null;
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${GET_PUBLISHED_PUBLIC_NOTICES_API}?${queryString}` : GET_PUBLISHED_PUBLIC_NOTICES_API;
    console.log("API: Making request to URL:", url);

    const response = await apiConnector("GET", url);
    console.log("GET_PUBLISHED_PUBLIC_NOTICES_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Fetch Published Notices");
    }
    result = response?.data;
    console.log("API: Returning result:", result);
  } catch (error) {
    console.log("GET_PUBLISHED_PUBLIC_NOTICES_API ERROR............", error);
    result = error.response?.data || { success: false, message: error.message };
  }
  return result;
}

// Get a public notice by ID
export async function getPublicNoticeById(noticeId) {
  let result = null;
  try {
    const response = await apiConnector("GET", `${GET_PUBLIC_NOTICE_BY_ID_API}/${noticeId}`);
    console.log("GET_PUBLIC_NOTICE_BY_ID_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Fetch Public Notice");
    }
    result = response?.data;
  } catch (error) {
    console.log("GET_PUBLIC_NOTICE_BY_ID_API ERROR............", error);
    result = error.response?.data || { success: false, message: error.message };
  }
  return result;
}

// Update a public notice
export async function updatePublicNotice(noticeId, formData) {
  const toastId = toast.loading("Updating public notice...");
  let result = null;
  try {
    // Don't set Content-Type for FormData - let browser set it with boundary
    const response = await apiConnector("PUT", `${UPDATE_PUBLIC_NOTICE_API}/${noticeId}`, formData);
    console.log("UPDATE_PUBLIC_NOTICE_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Update Public Notice");
    }
    result = response?.data;
    toast.success("Public notice updated successfully!");
  } catch (error) {
    console.log("UPDATE_PUBLIC_NOTICE_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Update Public Notice");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Delete a public notice
export async function deletePublicNotice(noticeId) {
  const toastId = toast.loading("Deleting public notice...");
  let result = null;
  try {
    const response = await apiConnector("DELETE", `${DELETE_PUBLIC_NOTICE_API}/${noticeId}`);
    console.log("DELETE_PUBLIC_NOTICE_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Delete Public Notice");
    }
    result = response?.data;
    toast.success("Public notice deleted successfully!");
  } catch (error) {
    console.log("DELETE_PUBLIC_NOTICE_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Delete Public Notice");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}

// Publish a public notice
export async function publishPublicNotice(noticeId) {
  const toastId = toast.loading("Publishing notice...");
  let result = null;
  try {
    const response = await apiConnector("PATCH", `${PUBLISH_PUBLIC_NOTICE_API}/${noticeId}/publish`);
    console.log("PUBLISH_PUBLIC_NOTICE_API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Publish Public Notice");
    }
    result = response?.data;
    toast.success("Public notice published successfully!");
  } catch (error) {
    console.log("PUBLISH_PUBLIC_NOTICE_API ERROR............", error);
    toast.error(error.response?.data?.message || "Failed to Publish Public Notice");
    result = error.response?.data || { success: false, message: error.message };
  }
  toast.dismiss(toastId);
  return result;
}
