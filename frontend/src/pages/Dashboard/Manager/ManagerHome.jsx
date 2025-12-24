import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/Statecard";

const ManagerHome = () => {
  const navigate = useNavigate();

  const stats = {
    totalEmployees: 25,
    present: 20,
    absent: 3,
    late: 2,
  };

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Manager Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Employees" value={stats.totalEmployees} />
        <Card title="Present Today" value={stats.present} color="green" />
        <Card title="Absent Today" value={stats.absent} color="red" />
        <Card title="Late Today" value={stats.late} color="yellow" />
      </div>

      <div className="mt-10">
        <button
          onClick={() => navigate("/manager/attendance")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Mark Attendance
        </button>
      </div>
    </div>
  );
};


export default ManagerHome;
