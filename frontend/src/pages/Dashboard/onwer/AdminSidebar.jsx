import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-64 min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
        <h2
          onClick={() => navigate("/owner")}
          className="text-l sm:text-2xl font-bold mb-6 text-center text-gray-800 whitespace-nowrap cursor-pointer"
        >
          Home
        </h2>

        <NavLink
          to="/owner/users"
          className={({ isActive }) =>
            `px-4 py-3 rounded-lg font-medium transition mb-2 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/owner/attendance"
          className={({ isActive }) =>
            `px-4 py-3 rounded-lg font-medium transition mb-2 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`
          }
        >
          Attendance
        </NavLink>
        <NavLink
          to="/owner/Admin-users"
          className={({ isActive }) =>
            `px-4 py-3 rounded-lg font-medium transition mb-2 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`
          }
        >
          Admin Users
        </NavLink>
        <NavLink
          to="/owner/block-users"
          className={({ isActive }) =>
            `px-4 py-3 rounded-lg font-medium transition mb-2 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`
          }
        >
          Blocked Users
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
