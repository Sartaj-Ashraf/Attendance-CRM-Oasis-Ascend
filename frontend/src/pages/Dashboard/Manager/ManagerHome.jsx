// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Card from "../../../components/Statecard";

// const ManagerHome = () => {
//   const navigate = useNavigate();

//   const stats = {
//     totalEmployees: 25,
//     present: 20,
//     absent: 3,
//     late: 2,
//   };

//   return (
//     <div className="mt-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">
//         Manager Dashboard
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card title="Total Employees" value={stats.totalEmployees} />
//         <Card title="Present Today" value={stats.present} color="green" />
//         <Card title="Absent Today" value={stats.absent} color="red" />
//         <Card title="Late Today" value={stats.late} color="yellow" />
//       </div>

//       <div className="mt-10">
//         <button
//           onClick={() => navigate("/manager/attendance")}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
//         >
//           Mark Attendance
//         </button>
//       </div>
//     </div>
//   );
// };


// export default ManagerHome;


import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/Statecard";

const ManagerHome = () => {
  const navigate = useNavigate();

  // 🔹 Later replace with API data
  const stats = {
    totalEmployees: 25,
    present: 20,
    absent: 3,
    late: 2,
  };

  return (
    <div className="ml-5 min-h-screen bg-gray-50 px-8 py-6">
      {/* ===== PAGE HEADER ===== */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Manager Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your department activity
        </p>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Employees" value={stats.totalEmployees} />
        <Card title="Present Today" value={stats.present} color="green" />
        <Card title="Absent Today" value={stats.absent} color="red" />
        <Card title="Late Today" value={stats.late} color="yellow" />
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="mt-10 bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Quick Actions
          </h2>
          <p className="text-sm text-gray-500">
            Frequently used manager actions
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/manager/attendance")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            Mark Attendance
          </button>

          <button
            onClick={() => navigate("/manager/manage-leaves")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            Review Leaves
          </button>
        </div>
      </div>

      {/* ===== OPTIONAL SECTION (PLACEHOLDER) ===== */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Pending Tasks
          </h3>
          <p className="text-sm text-gray-500">
            Leave approvals, attendance submissions, and alerts will appear here.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Department Summary
          </h3>
          <p className="text-sm text-gray-500">
            Monthly attendance and performance summary (coming soon).
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;

