import { apiConnector } from "./apiconnector";
import { toast } from "react-hot-toast";

// API endpoints - Standardized for Vercel deployment with /api prefix
export const SEND_OTP_API = "/api/auth/send-otp";
export const SIGNUP_API = "/api/auth/signup";
export const LOGIN_API = "/api/auth/login";
export const FORGOT_PASSWORD_API = "/api/auth/forgot-password";
export const RESET_PASSWORD_API = "/api/auth/reset-password";
export const CHECK_ELIGIBILITY_API = "/api/auth/check-eligibility";
export const GET_ALL_REGISTERED_STUDENTS_API = "/api/auth/getAllRegisteredStudents";
export const GET_STUDENT_DETAILS_API = "/api/auth/getStudentDetails";
export const UPDATE_STUDENT_PROFILE_API = "/api/auth/updateStudentProfile";
export const GET_ALL_USERS_API = "/api/auth/getAllUsers";
export const GET_USER_DETAILS_API = "/api/auth/getUserDetails";
export const UPDATE_USER_ROLE_API = "/api/auth/updateUserRole";
export const DELETE_USER_API = "/api/auth/deleteUser";
export const GET_ACTIVITY_LOGS_API = "/api/auth/getActivityLogs";

// Allotment APIs
// Removed leading /api as it's part of VITE_API_BASE_URL
export const ALLOT_ROOMS_API = "/allotment/allot-rooms";
export const GET_ROOM_AVAILABILITY_API = "/allotment/availability";
export const GET_ALLOTTED_STUDENTS_LIST_API = "/allotment/allotted-students";

// Send OTP
export async function sendOtp(email) {
  return apiConnector("POST", SEND_OTP_API, { email });
}

// Verify OTP
export async function verifyOtp(email, otp) {
  return apiConnector("POST", "/api/auth/verify-otp", { email, otp });
}

// Email & Password Verification (step 2)
export async function emailVerification({ email, password, confirmPassword, otp }) {
  return apiConnector("POST", "/api/auth/email-verification", { email, password, confirmPassword, otp });
}

// Student Login
export async function login({ email, password }) {
  return apiConnector("POST", LOGIN_API, { email, password });
}

// Register Student Profile (final step)
export async function registerStudentProfile(profileData) {
  return apiConnector("POST", "/api/auth/registered-student-profile", profileData);
}

// Check if email exists
export async function checkEmail(email) {
  return apiConnector("POST", "/api/auth/check-email", { email });
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
  return apiConnector("GET", "/api/auth/registered-students");
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
