import { NavLink, useNavigate } from "react-router-dom";

const ManagerSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
        <h2
          onClick={() => navigate("/manager")}
          className="text-l sm:text-2xl font-bold mb-6 text-center text-gray-800 cursor-pointer"
        >
          Manager Home
        </h2>

        <NavLink
          to="/manager/employees"
          className={({ isActive }) =>
            `px-4 py-3 rounded-lg font-medium transition mb-2 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`
          }
        >
          Employees
        </NavLink>

        <NavLink
          to="/manager/attendance"
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
      </div>
    </div>
  );
};

export default ManagerSidebar;
