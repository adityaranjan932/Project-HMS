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
  FaArrowUp,
  FaCalendarAlt,
  FaEye,
  FaStar,
  FaGraduationCap,
  FaHome,
  FaTools,
  FaComments,
  FaUser,
} from "react-icons/fa";
import { apiConnector } from "../../../services/apiconnector";
import { toast } from "react-hot-toast";

const ProvostDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalNotices: 0,
    occupancyRate: 0,
    resolvedToday: 0,
    newRegistrations: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [quickStats, setQuickStats] = useState({
    maintenanceRequests: 0,
    leaveRequests: 0,
    feedbackCount: 0,
  });
  useEffect(() => {
    // Set time of day greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("Good Morning");
    else if (hour < 17) setTimeOfDay("Good Afternoon");
    else setTimeOfDay("Good Evening");

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch multiple data sources in parallel with enhanced error handling
        const [studentsRes, maintenanceRes, leaveRes, feedbackRes] =
          await Promise.all([
            apiConnector(
              "GET",
              "/allotment/allotted-students",
              null,
              headers
            ).catch(() => ({ data: { data: [] } })),
            apiConnector("GET", "/service-requests/all", null, headers).catch(
              () => ({ data: { data: [] } })
            ),
            apiConnector("GET", "/leave/all", null, headers).catch(() => ({
              data: { data: [] },
            })),
            apiConnector("GET", "/feedback/all", null, headers).catch(() => ({
              data: { data: [] },
            })),
          ]);
        const students = studentsRes.data?.data || [];
        const maintenanceRequests =
          maintenanceRes.data?.data || maintenanceRes.data || [];
        const leaveRequests = leaveRes.data?.data || leaveRes.data || [];
        const feedbackRequests =
          feedbackRes.data?.data || feedbackRes.data || []; // Calculate enhanced stats
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

        // Calculate today's resolved requests
        const today = new Date().toDateString();
        const resolvedToday = [
          ...maintenanceRequests.filter(
            (req) =>
              req.status === "resolved" &&
              new Date(req.updatedAt || req.createdAt).toDateString() === today
          ),
          ...leaveRequests.filter(
            (req) =>
              req.status === "approved" &&
              new Date(req.updatedAt || req.createdAt).toDateString() === today
          ),
        ].length;

        // Calculate new registrations this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const newRegistrations = students.filter(
          (student) =>
            new Date(student.createdAt || student.allotmentDate) > weekAgo
        ).length;

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
          resolvedToday,
          newRegistrations,
        });

        setQuickStats({
          maintenanceRequests: maintenanceRequests.length,
          leaveRequests: leaveRequests.length,
          feedbackCount: feedbackRequests.length,
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
        ]; // Sort by most recent and take top 5
        allActivity.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecentActivity(allActivity.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color,
    link,
    trend,
    isPercentage,
  }) => (
    <Link
      to={link}
      className={`group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 ${color} relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
            {isPercentage ? `${value}%` : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              {trend && (
                <span
                  className={`mr-1 ${
                    trend > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {" "}
                  <FaArrowUp
                    className={trend > 0 ? "" : "transform rotate-180"}
                  />
                </span>
              )}
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`p-4 rounded-full ${color
            .replace("border-l-", "bg-")
            .replace(
              "-500",
              "-100"
            )} group-hover:scale-110 transition-transform`}
        >
          <Icon className={`text-2xl ${color.replace("border-l-", "text-")}`} />
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
    </Link>
  );
  const QuickActionCard = ({
    icon: Icon,
    title,
    description,
    link,
    color,
    badge,
  }) => (
    <Link
      to={link}
      className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
        <Icon className="w-full h-full" />
      </div>

      <div className="flex items-start space-x-4 relative z-10">
        <div
          className={`p-4 rounded-xl ${color} group-hover:scale-110 transition-transform shadow-lg`}
        >
          <Icon className="text-white text-2xl" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
              {title}
            </h3>
            {badge && (
              <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-xs text-gray-600">→</span>
        </div>
      </div>
    </Link>
  );
  const ActivityItem = ({ activity }) => {
    const getTypeIcon = (type) => {
      switch (type) {
        case "maintenance":
          return <FaTools className="text-orange-500" />;
        case "leave":
          return <FaCalendarAlt className="text-purple-500" />;
        case "feedback":
          return <FaComments className="text-blue-500" />;
        default:
          return <FaBell className="text-gray-500" />;
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "pending":
          return "text-yellow-700 bg-yellow-100 border-yellow-200";
        case "approved":
          return "text-green-700 bg-green-100 border-green-200";
        case "resolved":
          return "text-green-700 bg-green-100 border-green-200";
        case "rejected":
          return "text-red-700 bg-red-100 border-red-200";
        case "submitted":
          return "text-blue-700 bg-blue-100 border-blue-200";
        default:
          return "text-gray-700 bg-gray-100 border-gray-200";
      }
    };

    return (
      <div className="group flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200">
        <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-gray-100 group-hover:bg-white group-hover:shadow-md transition-all">
          {getTypeIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600 truncate mt-1">
                {activity.description}
              </p>
            </div>
            <span
              className={`ml-3 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                activity.status
              )}`}
            >
              {activity.status}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500 flex items-center">
              <FaUser className="mr-1" />
              {activity.studentName} •{" "}
              {new Date(activity.time).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen">
        <div className="text-center">
          <div className="relative">
            <FaSpinner className="animate-spin mx-auto text-4xl text-teal-600 mb-4" />
            <div className="absolute inset-0 rounded-full border-2 border-teal-200 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg text-gray-600 font-medium">
            Loading dashboard...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Gathering the latest information for you
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Enhanced Welcome Header */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-blue-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <FaStar className="text-yellow-300 mr-2" />
              <span className="text-teal-100 text-sm font-medium">
                Administrator Dashboard
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
              {timeOfDay}, Provost!
            </h1>
            <p className="text-teal-100 text-lg max-w-md">
              Here's an overview of the hostel management system status and
              recent activities.
            </p>

            {/* Quick stats bar */}
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="flex items-center text-teal-100">
                <FaTools className="mr-2" />
                <span className="text-sm">
                  <span className="font-semibold text-white">
                    {quickStats.maintenanceRequests}
                  </span>{" "}
                  Maintenance
                </span>
              </div>
              <div className="flex items-center text-teal-100">
                <FaCalendarAlt className="mr-2" />
                <span className="text-sm">
                  <span className="font-semibold text-white">
                    {quickStats.leaveRequests}
                  </span>{" "}
                  Leave Requests
                </span>
              </div>
              <div className="flex items-center text-teal-100">
                <FaComments className="mr-2" />
                <span className="text-sm">
                  <span className="font-semibold text-white">
                    {quickStats.feedbackCount}
                  </span>{" "}
                  Feedback
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 lg:mt-0 lg:ml-8 text-right">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-teal-100 text-sm mb-1">Today's Date</p>
              <p className="text-white font-semibold">
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
      </div>{" "}
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={FaUserGraduate}
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Currently allotted"
          color="border-l-blue-500"
          link="/provost-login/view-profiles"
          trend={stats.newRegistrations > 0 ? 1 : 0}
        />
        <StatCard
          icon={FaClipboardList}
          title="Total Requests"
          value={stats.totalRequests}
          subtitle={`${stats.resolvedToday} resolved today`}
          color="border-l-purple-500"
          link="/provost-login/student-queries"
          trend={stats.resolvedToday > 0 ? 1 : 0}
        />
        <StatCard
          icon={FaExclamationTriangle}
          title="Pending Requests"
          value={stats.pendingRequests}
          subtitle="Requires attention"
          color="border-l-orange-500"
          link="/provost-login/student-queries"
          trend={stats.pendingRequests === 0 ? 1 : -1}
        />
        <StatCard
          icon={FaBed}
          title="Occupancy Rate"
          value={stats.occupancyRate}
          subtitle="Current capacity"
          color="border-l-green-500"
          link="/provost-login/allotment-data"
          isPercentage={true}
        />
      </div>
      {/* Enhanced Quick Actions */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaChartLine className="mr-3 text-teal-600" />
              Quick Actions
            </h2>
            <p className="text-gray-600 mt-1">
              Manage hostel operations efficiently
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Live Updates</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <QuickActionCard
            icon={FaUsers}
            title="View Student Profiles"
            description="Browse and manage student information with advanced search"
            link="/provost-login/view-profiles"
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <QuickActionCard
            icon={FaBell}
            title="Send Notice"
            description="Send important notices and announcements to students"
            link="/provost-login/student-notice"
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <QuickActionCard
            icon={FaClipboardList}
            title="Review Requests"
            description="Handle maintenance and leave requests efficiently"
            link="/provost-login/student-queries"
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            badge={stats.pendingRequests > 0 ? stats.pendingRequests : null}
          />
          <QuickActionCard
            icon={FaBullhorn}
            title="Public Notices"
            description="Manage public announcements and hostel policies"
            link="/provost-login/public-notice"
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
          <QuickActionCard
            icon={FaDatabase}
            title="Allotment Data"
            description="View hostel allocation statistics and analytics"
            link="/provost-login/allotment-data"
            color="bg-gradient-to-r from-teal-500 to-teal-600"
          />
          <QuickActionCard
            icon={FaChartLine}
            title="Analytics Dashboard"
            description="View detailed reports and system insights"
            link="/provost-login/student-queries"
            color="bg-gradient-to-r from-indigo-500 to-indigo-600"
          />
        </div>
      </div>{" "}
      {/* Recent Activity and System Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Enhanced Recent Activity */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FaClock className="mr-3 text-teal-600" />
                Recent Activity
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Latest student requests and submissions
              </p>
            </div>
            <Link
              to="/provost-login/student-queries"
              className="flex items-center px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium"
            >
              <FaEye className="mr-1" />
              View All
            </Link>
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-4xl text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No recent activity</p>
              <p className="text-gray-400 text-sm mt-1">
                New submissions will appear here
              </p>
            </div>
          )}
        </div>

        {/* Enhanced System Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FaCheckCircle className="mr-3 text-teal-600" />
                System Status
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                All systems operational
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    Database Connection
                  </span>
                  <p className="text-xs text-gray-600">
                    All queries running smoothly
                  </p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <FaHome className="text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    Room Allotment System
                  </span>
                  <p className="text-xs text-gray-600">
                    Processing allocations
                  </p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <FaBell className="text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    Notice System
                  </span>
                  <p className="text-xs text-gray-600">
                    Notifications delivered
                  </p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                Active
              </span>
            </div>

            {stats.pendingRequests > 0 && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <FaExclamationTriangle className="text-yellow-600" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">
                      Pending Requests
                    </span>
                    <p className="text-xs text-gray-600">
                      Require your attention
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
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
