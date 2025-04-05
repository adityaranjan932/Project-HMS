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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 px-6 sm:px-8 lg:px-10">
        <div className="login-options flex flex-col items-center gap-8 p-8 bg-white rounded-2xl shadow-2xl max-w-lg w-full">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Login Options
          </h1>
          <Link
            to="/login/student-login"
            className="w-full flex items-center justify-center gap-3 py-3 px-5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
          >
            <FaUserGraduate /> Student Login
          </Link>
          <Link
            to="/login/chief-provost-login"
            className="w-full flex items-center justify-center gap-3 py-3 px-5 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl hover:from-green-600 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
          >
            <FaUserTie /> Chief Provost Login
          </Link>
          <Link
            to="/login/provost-login"
            className="w-full flex items-center justify-center gap-3 py-3 px-5 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-800 shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
          >
            <FaUserShield /> Provost Login
          </Link>
          <Link
            to="/login/other-login"
            className="w-full flex items-center justify-center gap-3 py-3 px-5 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl hover:from-red-600 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
          >
            <FaUsers /> Other Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
