import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import api from "../../../axios/axios";
import { AuthContext } from "../../../ContextApi/isAuth";

const AdminSidebar = () => {
  const { user, setIsAuth, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await api.post("/user/logout");
      setIsAuth(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const navItem =
    "nav-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1";

  const activeNav = "bg-blue-600 text-white shadow-md";
  const inactiveNav =
    "bg-blue-50 text-gray-700 hover:bg-blue-100 hover:text-blue-600";

  return (
    <aside className="fixed left-0 top-0 w-60 h-screen">
      <div className="bg-white h-full rounded-2xl shadow-lg flex flex-col overflow-hidden">
        {/* ===== HEADER ===== */}
        <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2
            onClick={() => navigate("/owner")}
            className="text-xl font-bold text-gray-800 cursor-pointer flex items-center gap-2"
          >
            <i className="fas fa-crown text-blue-600"></i>
            Admin Home
          </h2>
        </div>

        {/* ===== NAVIGATION ===== */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavLink
            to="/owner/users"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeNav : inactiveNav}`
            }
          >
            <i className="fas fa-users text-blue-500"></i>
            Employees
          </NavLink>

          <NavLink
            to="/owner/managers"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeNav : inactiveNav}`
            }
          >
            <i className="fas fa-user-tie text-green-500"></i>
            Managers
          </NavLink>

          <NavLink
            to="/owner/attendance"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeNav : inactiveNav}`
            }
          >
            <i className="fas fa-calendar-check text-purple-500"></i>
            Attendance
          </NavLink>

          <NavLink
            to="/owner/department"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeNav : inactiveNav}`
            }
          >
            <i className="fas fa-building text-orange-500"></i>
            Departments
          </NavLink>

          <NavLink
            to="/owner/block-users"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeNav : inactiveNav}`
            }
          >
            <i className="fas fa-user-slash text-red-500"></i>
            Blocked Users
          </NavLink>

          {/* ===== EXTRA SECTION ===== */}
          <div className="pt-4 mt-4 border-t">
            <NavLink
              to="/owner/reports"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNav : inactiveNav}`
              }
            >
              <i className="fas fa-chart-bar text-indigo-500"></i>
              Reports
            </NavLink>

            <NavLink
              to="/owner/settings"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNav : inactiveNav}`
              }
            >
              <i className="fas fa-cog text-gray-500"></i>
              Settings
            </NavLink>
          </div>
        </nav>

        {/* ===== USER PROFILE + LOGOUT ===== */}
        <div className="px-5 py-4 border-t bg-gradient-to-t from-gray-50 to-white rounded-b-2xl">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm shadow-lg">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
            </div>

            {/* User Info */}
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-800">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <i className="fas fa-shield-alt text-blue-500"></i>
                {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={logoutHandler}
            className="w-full text-sm px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition font-medium shadow-md hover:shadow-lg"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
