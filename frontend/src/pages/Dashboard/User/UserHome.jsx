import React from "react";

const UserHomeDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-2xl font-bold">Hello there 👋</h1>
        <p className="text-gray-600 mt-1">Welcome to your dashboard</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard label="Role" value="Employee" />
        <InfoCard label="Email" value="Not available" />
        <InfoCard label="Account Status" value="Active" />
      </div>

      {/* Message Section */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Today</h2>
        <p className="text-gray-600">Have a great and productive day! 🌟</p>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-gray-500">{label}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

export default UserHomeDashboard;
