import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaBell,
  FaClipboardList,
  FaBullhorn,
  FaDatabase,
  FaChartLine,
  FaExclamationTriangle,
  FaUserGraduate,
  FaBed,
  FaCheckCircle,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import { apiConnector } from "../../../services/apiconnector";

const ProvostDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalNotices: 0,
    occupancyRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch multiple data sources in parallel
        const [studentsRes, maintenanceRes, leaveRes, feedbackRes] =
          await Promise.all([
            apiConnector(
              "GET",
              "/allotment/allotted-students",
              null,
              headers
            ).catch(() => ({ data: { data: [] } })),
            apiConnector("GET", "/service-requests/all", null, headers).catch(
              () => ({ data: [] })
            ),
            apiConnector("GET", "/leave/all", null, headers).catch(() => ({
              data: [],
            })),
            apiConnector("GET", "/feedback/all", null, headers).catch(() => ({
              data: [],
            })),
          ]);

        const students = studentsRes.data?.data || [];
        const maintenanceRequests = maintenanceRes.data || [];
        const leaveRequests = leaveRes.data || [];
        const feedbackRequests = feedbackRes.data || [];

        // Calculate stats
        const totalRequests =
          maintenanceRequests.length +
          leaveRequests.length +
          feedbackRequests.length;
        const pendingRequests = [
          ...maintenanceRequests.filter(
            (req) => !req.status || req.status === "pending"
          ),
          ...leaveRequests.filter(
            (req) => !req.status || req.status === "pending"
          ),
        ].length;

        // Calculate occupancy rate (assuming max capacity)
        const maxCapacity = 500; // This should come from your room/hostel configuration
        const occupancyRate =
          students.length > 0
            ? Math.round((students.length / maxCapacity) * 100)
            : 0;

        setStats({
          totalStudents: students.length,
          totalRequests,
          pendingRequests,
          totalNotices: 0, // This would need a notices API
          occupancyRate,
        });

        // Create recent activity feed
        const allActivity = [
          ...maintenanceRequests.map((req) => ({
            type: "maintenance",
            title: "Maintenance Request",
            description:
              req.description?.substring(0, 50) + "..." ||
              "New maintenance request",
            time: req.createdAt,
            status: req.status || "pending",
            studentName: req.userId?.name || "Unknown",
          })),
          ...leaveRequests.map((req) => ({
            type: "leave",
            title: "Leave Request",
            description: `${req.reason} (${new Date(
              req.fromDate
            ).toLocaleDateString()})`,
            time: req.createdAt,
            status: req.status || "pending",
            studentName: req.studentId?.name || "Unknown",
          })),
          ...feedbackRequests.map((req) => ({
            type: "feedback",
            title: "Feedback Submitted",
            description:
              req.message?.substring(0, 50) + "..." || "New feedback",
            time: req.createdAt,
            status: "submitted",
            studentName: "Anonymous",
          })),
        ];

        // Sort by most recent and take top 5
        allActivity.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecentActivity(allActivity.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, link }) => (
    <Link
      to={link}
      className={`bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {value}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`p-3 rounded-full ${color
            .replace("border-l-", "bg-")
            .replace("-500", "-100")}`}
        >
          <Icon className={`text-xl ${color.replace("border-l-", "text-")}`} />
        </div>
      </div>
    </Link>
  );

  const QuickActionCard = ({ icon: Icon, title, description, link, color }) => (
    <Link
      to={link}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
    >
      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}
        >
          <Icon className="text-white text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );

  const ActivityItem = ({ activity }) => {
    const getTypeIcon = (type) => {
      switch (type) {
        case "maintenance":
          return <FaExclamationTriangle className="text-orange-500" />;
        case "leave":
          return <FaClock className="text-purple-500" />;
        case "feedback":
          return <FaClipboardList className="text-blue-500" />;
        default:
          return <FaBell className="text-gray-500" />;
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "pending":
          return "text-yellow-600 bg-yellow-100";
        case "approved":
          return "text-green-600 bg-green-100";
        case "resolved":
          return "text-green-600 bg-green-100";
        case "rejected":
          return "text-red-600 bg-red-100";
        default:
          return "text-gray-600 bg-gray-100";
      }
    };

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-shrink-0 mt-1">{getTypeIcon(activity.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
          <p className="text-sm text-gray-600 truncate">
            {activity.description}
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">
              {activity.studentName} •{" "}
              {new Date(activity.time).toLocaleDateString()}
            </p>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                activity.status
              )}`}
            >
              {activity.status}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin mr-3 text-2xl text-teal-600" />
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome back, Provost!
            </h1>
            <p className="text-teal-100">
              Here's an overview of the hostel management system status.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <p className="text-teal-200 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={FaUserGraduate}
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Currently allotted"
          color="border-l-blue-500"
          link="/provost-login/view-profiles"
        />
        <StatCard
          icon={FaClipboardList}
          title="Total Requests"
          value={stats.totalRequests}
          subtitle="All time requests"
          color="border-l-purple-500"
          link="/provost-login/student-queries"
        />
        <StatCard
          icon={FaExclamationTriangle}
          title="Pending Requests"
          value={stats.pendingRequests}
          subtitle="Requires attention"
          color="border-l-orange-500"
          link="/provost-login/student-queries"
        />
        <StatCard
          icon={FaBed}
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          subtitle="Current capacity"
          color="border-l-green-500"
          link="/provost-login/allotment-data"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaChartLine className="mr-2 text-teal-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            icon={FaUsers}
            title="View Student Profiles"
            description="Browse and manage student information"
            link="/provost-login/view-profiles"
            color="bg-blue-500"
          />
          <QuickActionCard
            icon={FaBell}
            title="Send Notice"
            description="Send important notices to students"
            link="/provost-login/student-notice"
            color="bg-green-500"
          />
          <QuickActionCard
            icon={FaClipboardList}
            title="Review Requests"
            description="Handle maintenance and leave requests"
            link="/provost-login/student-queries"
            color="bg-purple-500"
          />
          <QuickActionCard
            icon={FaBullhorn}
            title="Public Notices"
            description="Manage public announcements"
            link="/provost-login/public-notice"
            color="bg-orange-500"
          />
          <QuickActionCard
            icon={FaDatabase}
            title="Allotment Data"
            description="View hostel allocation statistics"
            link="/provost-login/allotment-data"
            color="bg-teal-500"
          />
          <QuickActionCard
            icon={FaChartLine}
            title="Analytics"
            description="View detailed reports and analytics"
            link="/provost-login/student-queries"
            color="bg-indigo-500"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaClock className="mr-2 text-teal-600" />
              Recent Activity
            </h2>
            <Link
              to="/provost-login/student-queries"
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-1">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaCheckCircle className="mx-auto text-4xl mb-2 text-gray-300" />
              <p>No recent activity</p>
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaCheckCircle className="mr-2 text-teal-600" />
            System Status
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span className="text-sm font-medium">Database Connection</span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span className="text-sm font-medium">
                  Room Allotment System
                </span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span className="text-sm font-medium">Notice System</span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Active
              </span>
            </div>

            {stats.pendingRequests > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-yellow-500 mr-3" />
                  <span className="text-sm font-medium">Pending Requests</span>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {stats.pendingRequests} Pending
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvostDashboard;
