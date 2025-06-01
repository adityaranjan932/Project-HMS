import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import TopNavbar from '../../components/Navbar/TopNavbar';

function HostelAdminDashboard() {
  return (
    <>
      {/* <TopNavbar /> */}

      <div className="max-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6 ">Allotment Data</h1>
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="students" className="text-blue-600 hover:underline">
                Registered Students
              </Link>
            </li>
            <li>
              <Link to="alloted_hostels_list" className="text-blue-600 hover:underline">
                Hostel Allotment
              </Link>
            </li>
          </ul>
        </nav>
        <Outlet />

      </div>
    </>
  );
}

export default HostelAdminDashboard;
