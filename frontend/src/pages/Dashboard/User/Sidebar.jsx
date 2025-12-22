import React from "react";

const Sidebar = ({ setPage }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 border-r border-gray-700 p-6 shadow flex flex-col">

      <h2 className="text-2xl font-bold mb-8 text-indigo-400">Dashboard</h2>

      <button
        className="w-full text-left px-4 py-3 mb-2 rounded-md hover:bg-indigo-600 hover:text-white transition font-medium bg-gray-700 text-gray-100"
        onClick={() => setPage("Attendance")}
      >
        Attendance
      </button>

    </div>
  );
};

export default Sidebar;
