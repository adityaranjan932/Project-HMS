import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Adminbar from "./pages/Dashboard/Student_Dashboard/Adminbar";
import MaintenanceRequest from "./pages/Dashboard/Student_Dashboard/MaintenanceRequest";
import Feedback from "./pages/Dashboard/Student_Dashboard/Feedback";
import LeaveApply from "./pages/Dashboard/Student_Dashboard/LeaveApply";
import FeesPayment from "./pages/Dashboard/Student_Dashboard/FeesPayment";
import ProvostAdminbar from "./pages/Dashboard/Provost_Dashboard/ProvostAdminbar";
import ViewProfiles from "./pages/Dashboard/Provost_Dashboard/ViewProfiles";
import StudentNotice from "./pages/Dashboard/Provost_Dashboard/StudentNotice";
import StudentQueries from "./pages/Dashboard/Provost_Dashboard/StudentQueries";
import PublicNotice from "./pages/Dashboard/Provost_Dashboard/PublicNotice";
import Navbar from "./components/Navbar/Navbar";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />} />

        {/* Student Dashboard Routes */}
        <Route path="/student-login" element={<Adminbar />}>
          <Route path="maintenance-request" element={<MaintenanceRequest />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="leave-apply" element={<LeaveApply />} />
          <Route path="fees-payment" element={<FeesPayment />} />
        </Route>

        {/* Provost Dashboard Routes */}
        <Route path="/provost-login" element={<ProvostAdminbar />}>
          <Route path="view-profiles" element={<ViewProfiles />} />
          <Route path="student-notice" element={<StudentNotice />} />
          <Route path="student-queries" element={<StudentQueries />} />
          <Route path="public-notice" element={<PublicNotice />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
