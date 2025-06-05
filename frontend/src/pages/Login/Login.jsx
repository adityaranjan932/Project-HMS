import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import {
  FaUserGraduate,
  FaUserTie,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";

const Login = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6">
        <div className="login-options flex flex-col items-center gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-4 lg:mb-6 text-center leading-tight">
            Login Options
          </h1>
          <Link
            to="/login/student-login"
            className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-800 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base lg:text-lg font-medium transform hover:scale-105 active:scale-95"
          >
            <FaUserGraduate className="text-lg sm:text-xl" />
            <span>Student Login</span>
          </Link>
          <Link
            to="/login/chief-provost-login"
            className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-5 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-green-800 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base lg:text-lg font-medium transform hover:scale-105 active:scale-95"
          >
            <FaUserTie className="text-lg sm:text-xl" />
            <span>Chief Provost Login</span>
          </Link>
          <Link
            to="/login/provost-login"
            className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-5 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white rounded-lg sm:rounded-xl hover:from-yellow-600 hover:to-yellow-800 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base lg:text-lg font-medium transform hover:scale-105 active:scale-95"
          >
            <FaUserShield className="text-lg sm:text-xl" />
            <span>Provost Login</span>
          </Link>
          <Link
            to="/login/other-login"
            className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-5 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg sm:rounded-xl hover:from-red-600 hover:to-red-800 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base lg:text-lg font-medium transform hover:scale-105 active:scale-95"
          >
            <FaUsers className="text-lg sm:text-xl" />
            <span>Other Login</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
