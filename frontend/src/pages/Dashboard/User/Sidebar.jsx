// import React from "react";

// const Sidebar = ({ setPage }) => {
//   return (
//     <div className="w-64 h-screen bg-gray-800 border-r border-gray-700 p-6 shadow flex flex-col">

//       <h2 className="text-2xl font-bold mb-8 text-indigo-400">Dashboard</h2>

//       <button
//         className="w-full text-left px-4 py-3 mb-2 rounded-md hover:bg-indigo-600 hover:text-white transition font-medium bg-gray-700 text-gray-100"
//         onClick={() => setPage("Attendance")}
//       >
//         Attendance
//       </button>

//     </div>
//   );
// };

// export default Sidebar;

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Dashboard</h2>

        <NavLink
          to="/dashboard/attendance"
          className={({ isActive }) =>
            `w-full text-left px-4 py-3 rounded-lg font-medium transition
            ${
              isActive
                ? "bg-blue-600 text-white border border-blue-600"
                : "text-gray-700 bg-gray-50 border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
            }`
          }
        >
          Attendance
        </NavLink>
        {/* <h1>salary </h1> */}
        <NavLink
          to="/dashboard/attendance"
          className={({ isActive }) =>
            `w-full text-left px-4 py-3 mt-2 rounded-lg font-medium transition
            ${
              isActive
                ? "bg-blue-600 text-white border border-blue-600"
                : "text-gray-700 bg-gray-50 border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
            }`
          }
        >
          salary
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
