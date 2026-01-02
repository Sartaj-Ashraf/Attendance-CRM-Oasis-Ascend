

// const UserHomeDashboard = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Welcome Section */}
//       <div className="bg-white rounded-xl shadow p-6 mb-6">
//         <h1 className="text-2xl font-bold">Hello there 👋</h1>
//         <p className="text-gray-600 mt-1">Welcome to your dashboard</p>
//       </div>

//       {/* Info Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <InfoCard label="Role" value="Employee" />
//         <InfoCard label="Email" value="Not available" />
//         <InfoCard label="Account Status" value="Active" />
//       </div>

//       {/* Message Section */}
//       <div className="bg-white rounded-xl shadow p-6 mt-6">
//         <h2 className="text-lg font-semibold mb-2">Today</h2>
//         <p className="text-gray-600">Have a great and productive day! 🌟</p>
//       </div>
//     </div>
//   );
// };

// const InfoCard = ({ label, value }) => (
//   <div className="bg-white rounded-xl shadow p-6">
//     <p className="text-gray-500">{label}</p>
//     <p className="text-xl font-semibold">{value}</p>
//   </div>
// );

// export default UserHomeDashboard;


// import React from "react";
// import { useNavigate } from "react-router-dom";

// const  UserHomeDashboard = () => {
//   const navigate = useNavigate();

//   // 🔹 Dummy data (replace with API later)
//   const todayAttendance = "Present";

//   const stats = {
//     pendingLeaves: 1,
//     approvedLeaves: 4,
//     lastSalary: "₹25,000",
//     salaryMonth: "December",
//     notifications: 3,
//   };

//   const recentAttendance = [
//     { date: "01 Jan", status: "Present" },
//     { date: "31 Dec", status: "Late" },
//     { date: "30 Dec", status: "Present" },
//     { date: "29 Dec", status: "Leave" },
//     { date: "28 Dec", status: "Present" },
//   ];

//   const statusColor = (status) => {
//     switch (status) {
//       case "Present":
//         return "text-green-600 bg-green-100";
//       case "Absent":
//         return "text-red-600 bg-red-100";
//       case "Late":
//         return "text-yellow-700 bg-yellow-100";
//       case "Leave":
//         return "text-blue-600 bg-blue-100";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* ================= TOP CARDS ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card title="Today's Attendance">
//           <span
//             className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(
//               todayAttendance
//             )}`}
//           >
//             {todayAttendance}
//           </span>
//         </Card>

//         <Card title="Leave Status">
//           <p className="text-sm text-gray-600">
//             Pending: <b>{stats.pendingLeaves}</b>
//           </p>
//           <p className="text-sm text-gray-600">
//             Approved: <b>{stats.approvedLeaves}</b>
//           </p>
//         </Card>

//         <Card title="Salary">
//           <p className="text-lg font-semibold">{stats.lastSalary}</p>
//           <p className="text-xs text-gray-500">{stats.salaryMonth}</p>
//         </Card>

//         <Card title="Notifications">
//           <p className="text-2xl font-bold">{stats.notifications}</p>
//           <p className="text-xs text-gray-500">Unread</p>
//         </Card>
//       </div>

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* ===== Attendance History ===== */}
//         <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm">
//           <div className="px-5 py-4 border-b font-semibold">
//             Recent Attendance
//           </div>

//           <div className="divide-y">
//             {recentAttendance.map((item, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between px-5 py-3 text-sm"
//               >
//                 <span>{item.date}</span>
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs ${statusColor(
//                     item.status
//                   )}`}
//                 >
//                   {item.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ===== Quick Actions ===== */}
//         <div className="bg-white border rounded-xl shadow-sm p-5 space-y-3">
//           <h3 className="font-semibold mb-3">Quick Actions</h3>

//           <ActionButton
//             label="Apply Leave"
//             onClick={() => navigate("/dashboard/leave")}
//           />
//           <ActionButton
//             label="View Attendance"
//             onClick={() => navigate("/dashboard/attendance")}
//           />
//           <ActionButton
//             label="View Salary"
//             onClick={() => navigate("/dashboard/salary")}
//           />
//           <ActionButton
//             label="Edit Profile"
//             onClick={() => navigate("/dashboard/profile")}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ================= REUSABLE COMPONENTS ================= */

// const Card = ({ title, children }) => (
//   <div className="bg-white border rounded-xl shadow-sm p-5">
//     <p className="text-sm text-gray-500 mb-2">{title}</p>
//     {children}
//   </div>
// );

// const ActionButton = ({ label, onClick }) => (
//   <button
//     onClick={onClick}
//     className="w-full px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 transition"
//   >
//     {label}
//   </button>
// );

// export default  UserHomeDashboard ;



import React from "react";
import { useNavigate } from "react-router-dom";

const UserDashboardHome = () => {
  const navigate = useNavigate();

  // 🔹 Dummy data (replace with API later)
  const userName = "Asif";
  const today = new Date().toDateString();

  const todayAttendance = "Present";

  const stats = {
    pendingLeaves: 1,
    approvedLeaves: 4,
    salary: "₹25,000",
    salaryMonth: "December 2025",
    notifications: 3,
  };

  const recentAttendance = [
    { date: "02 Jan", status: "Present" },
    { date: "01 Jan", status: "Late" },
    { date: "31 Dec", status: "Present" },
    { date: "30 Dec", status: "Leave" },
    { date: "29 Dec", status: "Present" },
  ];

  const statusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Absent":
        return "bg-red-100 text-red-700";
      case "Late":
        return "bg-yellow-100 text-yellow-700";
      case "Leave":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-sm text-gray-500">{today}</p>
      </div>

      {/* ================= TOP STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          title="Today's Status"
          value={todayAttendance}
          highlight
          badgeStyle={statusStyle(todayAttendance)}
        />

        <StatCard
          title="Leave Requests"
          value={`${stats.pendingLeaves} Pending`}
          subtitle={`${stats.approvedLeaves} Approved`}
        />

        <StatCard
          title="Salary"
          value={stats.salary}
          subtitle={stats.salaryMonth}
        />

        <StatCard
          title="Notifications"
          value={stats.notifications}
          subtitle="Unread"
        />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Attendance Overview ===== */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-800">
              Recent Attendance
            </h3>
          </div>

          <div className="divide-y">
            {recentAttendance.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-6 py-4"
              >
                <span className="text-sm text-gray-600">
                  {item.date}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== QUICK ACTIONS ===== */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-5">
            Quick Actions
          </h3>

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
              label="View Salary"
              onClick={() => navigate("/dashboard/salary")}
            />
            <ActionButton
              label="Edit Profile"
              onClick={() => navigate("/dashboard/profile")}
            />
          </div>
        </div>
      </div>

      {/* ================= ACTIVITY FEED ================= */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">
            Recent Activity
          </h3>
        </div>

        <div className="px-6 py-4 space-y-3 text-sm text-gray-600">
          <p>✅ Attendance marked as <b>Present</b> today</p>
          <p>📨 Leave request pending approval</p>
          <p>💰 Salary credited for December</p>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, subtitle, highlight, badgeStyle }) => (
  <div
    className={`rounded-2xl border shadow-sm p-5 ${
      highlight ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "bg-white"
    }`}
  >
    <p className={`text-sm ${highlight ? "text-blue-100" : "text-gray-500"}`}>
      {title}
    </p>

    <div className="mt-2">
      {badgeStyle ? (
        <span
          className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${badgeStyle}`}
        >
          {value}
        </span>
      ) : (
        <p className="text-xl font-bold">{value}</p>
      )}
    </div>

    {subtitle && (
      <p className={`text-xs mt-1 ${highlight ? "text-blue-200" : "text-gray-400"}`}>
        {subtitle}
      </p>
    )}
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
