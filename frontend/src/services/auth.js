import { apiConnector } from "./apiconnector";

// API endpoints
export const SEND_OTP_API = "/api/auth/send-otp";
export const VERIFY_OTP_API = "/api/auth/verify-otp";
export const EMAIL_VERIFICATION_API = "/api/auth/email-verification";
export const LOGIN_API = "/api/auth/login";
export const REGISTERED_STUDENT_PROFILE_API = "/api/auth/registered-student-profile";
export const CHECK_EMAIL_API = "/api/auth/check-email";
export const CHECK_ELIGIBILITY_API = "/api/auth/check-eligibility";
export const GET_REGISTERED_STUDENTS_API = "/api/auth/registered-students";

// Send OTP
export async function sendOtp(email) {
  return apiConnector("POST", SEND_OTP_API, { email });
}

// Verify OTP
export async function verifyOtp(email, otp) {
  return apiConnector("POST", VERIFY_OTP_API, { email, otp });
}

// Email & Password Verification (step 2)
export async function emailVerification({ email, password, confirmPassword, otp }) {
  return apiConnector("POST", EMAIL_VERIFICATION_API, { email, password, confirmPassword, otp });
}

// Student Login
export async function login({ email, password }) {
  return apiConnector("POST", LOGIN_API, { email, password });
}

// Register Student Profile (final step)
export async function registerStudentProfile(profileData) {
  return apiConnector("POST", REGISTERED_STUDENT_PROFILE_API, profileData);
}

// Check if email exists
export async function checkEmail(email) {
  return apiConnector("POST", CHECK_EMAIL_API, { email });
}

// Check eligibility
export async function checkEligibility(data, debug_param_for_vercel_may_11_2025 = "test") {
  console.log('[Auth Service] VERY UNIQUE LOG - INSIDE checkEligibility - Vercel Deployment Test - May 11, 2025');
  console.log('[Auth Service] Debug param value:', debug_param_for_vercel_may_11_2025);
  console.log('[Auth Service] CHECK_ELIGIBILITY_API constant value (for reference):', CHECK_ELIGIBILITY_API);
  const intendedPath = "/api/auth/check-eligibility";
  console.log('[Auth Service] Intended path for apiConnector:', intendedPath);
  return apiConnector("POST", intendedPath, data);
}

// Get all registered students
export async function getRegisteredStudents() {
  return apiConnector("GET", GET_REGISTERED_STUDENTS_API);
}
