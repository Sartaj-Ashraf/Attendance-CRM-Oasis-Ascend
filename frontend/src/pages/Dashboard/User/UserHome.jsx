import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../axios/axios";

/* ================= HELPERS ================= */
const statusStyle = (status) => {
  switch (status) {
    case "present":
      return "bg-green-100 text-green-700";
    case "absent":
      return "bg-red-100 text-red-700";
    case "late":
      return "bg-yellow-100 text-yellow-700";
    case "leave":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const UserDashboardHome = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [todayAttendance, setTodayAttendance] = useState("—");
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    fetchDashboardAttendance();
  }, []);

  const fetchDashboardAttendance = async () => {
    try {
      setLoading(true);

      const today = new Date().toISOString().split("T")[0];

      const res = await api.get("/user/getCurrentUserdata", {
        params: {
          page: 1,
          limit: 10, // enough for dashboard
        },
      });

      const records = res.data.data || [];

      /* ===== TODAY STATUS ===== */
      const todayRecord = records.find((r) => r.date.split("T")[0] === today);

      setTodayAttendance(todayRecord?.status || "absent");

      /* ===== RECENT ATTENDANCE (LAST 5) ===== */
      setRecentAttendance(records.slice(0, 5));
    } catch (error) {
      console.error("Dashboard attendance error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back </h1>
        <p className="text-sm text-gray-500">{new Date().toDateString()}</p>
      </div>

      {/* ================= TOP CARD ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          title="Today's Attendance"
          value={todayAttendance.toUpperCase()}
          highlight
          badgeStyle={statusStyle(todayAttendance)}
          loading={loading}
        />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== RECENT ATTENDANCE ===== */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-800">Recent Attendance</h3>
          </div>

          {loading ? (
            <div className="p-6 text-gray-500 text-sm">
              Loading attendance...
            </div>
          ) : recentAttendance.length === 0 ? (
            <div className="p-6 text-gray-500 text-sm">
              No attendance records found
            </div>
          ) : (
            <div className="divide-y">
              {recentAttendance.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center px-6 py-4"
                >
                  <span className="text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString()}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                      item.status
                    )}`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== QUICK ACTIONS ===== */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-5">Quick Actions</h3>

          <div className="space-y-3">
            <ActionButton
              label="Apply for Leave"
              onClick={() => navigate("/dashboard/leave")}
            />
            <ActionButton
              label="View Attendance"
              onClick={() => navigate("/dashboard/attendance")}
            />
            <ActionButton
              label="Edit Profile"
              onClick={() => navigate("/dashboard/profile")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, highlight, badgeStyle, loading }) => (
  <div
    className={`rounded-2xl border shadow-sm p-5 ${
      highlight
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        : "bg-white"
    }`}
  >
    <p className={`text-sm ${highlight ? "text-blue-100" : "text-gray-500"}`}>
      {title}
    </p>

    <div className="mt-3">
      {loading ? (
        <div className="w-24 h-6 bg-white/20 rounded animate-pulse" />
      ) : (
        <span
          className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${badgeStyle}`}
        >
          {value}
        </span>
      )}
    </div>
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full px-4 py-3 rounded-xl border text-sm font-medium hover:bg-gray-50 transition"
  >
    {label}
  </button>
);

export default UserDashboardHome;
