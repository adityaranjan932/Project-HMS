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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 px-4 sm:px-6 lg:px-8">
        <div className="login-options flex flex-col items-center gap-6 p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
            Login Options
          </h1>
          <Link
            to="/login/student-login"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
          >
            <FaUserGraduate /> Student Login
          </Link>
          <Link
            to="/login/chief-provost-login"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm sm:text-base"
          >
            <FaUserTie /> Chief Provost Login
          </Link>
          <Link
            to="/login/provost-login"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm sm:text-base"
          >
            <FaUserShield /> Provost Login
          </Link>
          <Link
            to="/login/other-login"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
          >
            <FaUsers /> Other Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
