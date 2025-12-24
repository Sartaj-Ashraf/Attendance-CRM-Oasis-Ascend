import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddUser from "./AddUser";

const AdminHome = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, Admin 👋</h1>
        <p className="text-gray-500 mt-2">
          Manage users, attendance, and system settings from here.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Add User"
            description="Create a new employee or admin account"
            color="border-blue-600"
            onClick={() => setShowAddUser(true)}
          />

          <ActionCard
            title="Manage Users"
            description="View, update, or deactivate users"
            color="border-green-600"
            onClick={() => navigate("/admin/users")}
          />

          <ActionCard
            title="Attendance"
            description="View and manage attendance records"
            color="border-purple-600"
            onClick={() => navigate("/admin/attendance")}
          />
        </div>
      </div>

      {/* Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowAddUser(false)}
            >
              ✕
            </button>
            <AddUser onClose={() => setShowAddUser(false)} />
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Admin Capabilities
        </h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>Add, edit, or deactivate users</li>
          <li>Monitor daily and monthly attendance</li>
          <li>Generate attendance reports</li>
          <li>Control roles and permissions</li>
        </ul>
      </div>
    </div>
  );
};

const ActionCard = ({ title, description, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white shadow rounded-xl p-6 border-l-4 ${color}
                  cursor-pointer hover:shadow-xl transition`}
    >
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 mt-2 text-sm">{description}</p>
    </div>
  );
};

export default AdminHome;
