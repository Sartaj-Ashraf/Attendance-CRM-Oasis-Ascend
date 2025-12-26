// import { NavLink, useNavigate } from "react-router-dom";

// const AdminSidebar = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="w-64 min-h-screen bg-gray-100 p-6">
//       <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
//         <h2
//           onClick={() => navigate("/owner")}
//           className="text-l sm:text-2xl font-bold mb-6 text-center text-gray-800 whitespace-nowrap cursor-pointer"
//         >
//           Home
//         </h2>

//         <NavLink
//           to="/owner/users"
//           className={({ isActive }) =>
//             `px-4 py-3 rounded-lg font-medium transition mb-2 ${
//               isActive
//                 ? "bg-blue-600 text-white"
//                 : "text-gray-700 hover:bg-blue-100"
//             }`
//           }
//         >
//           Users
//         </NavLink>

//         <NavLink
//           to="/owner/attendance"
//           className={({ isActive }) =>
//             `px-4 py-3 rounded-lg font-medium transition mb-2 ${
//               isActive
//                 ? "bg-blue-600 text-white"
//                 : "text-gray-700 hover:bg-blue-100"
//             }`
//           }
//         >
//           Attendance
//         </NavLink>
//         <NavLink
//           to="/owner/Admin-users"
//           className={({ isActive }) =>
//             `px-4 py-3 rounded-lg font-medium transition mb-2 ${
//               isActive
//                 ? "bg-blue-600 text-white"
//                 : "text-gray-700 hover:bg-blue-100"
//             }`
//           }
//         >
//           Admin Users
//         </NavLink>
//         <NavLink
//           to="/owner/block-users"
//           className={({ isActive }) =>
//             `px-4 py-3 rounded-lg font-medium transition mb-2 ${
//               isActive
//                 ? "bg-blue-600 text-white"
//                 : "text-gray-700 hover:bg-blue-100"
//             }`
//           }
//         >
//           Blocked Users
//         </NavLink>
//       </div>
      
//     </div>
//   );
// };

// export default AdminSidebar;

import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import api from "../../../axios/axios";
import { AuthContext } from '../../../ContextApi/isAuth'

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

  return (
    <aside className="w-64 h-screen bg-gray-100 p-4">
      <div className="bg-white h-full rounded-2xl shadow-lg flex flex-col">
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-bold text-gray-800 tracking-wide">
             <NavLink
            to="/owner"
         
          >
            Admin Home
          </NavLink>
          </h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink
            to="/owner/users"
            className={({ isActive }) =>
              `block bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            Employee
          </NavLink>
            <NavLink
            to="/owner/managers"
            className={({ isActive }) =>
              `block bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            Managers
          </NavLink>

          <NavLink
            to="/owner/attendance"
            className={({ isActive }) =>
              `block bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            Attendance
          </NavLink>
            <NavLink
            to="/owner/department"
            className={({ isActive }) =>
              `block bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }>Departments
          </NavLink>
            <NavLink
            to="/owner/block-users"
            className={({ isActive }) =>
              `block bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            Blocked Users
          </NavLink>
        </nav>

        {/* ===== BOTTOM (logout always visible) ===== */}
        <div className="px-5 py-4 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            {/* User info */}
            <div className="leading-tight">
              <p className="text-sm font-medium text-gray-800">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500">
                {user.role}
              </p>
            </div>
          </div>

          <button
            onClick={logoutHandler}
            className="w-full text-sm px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-medium"
          >
            Logout
          </button>
        </div>

      </div>
    </aside>
  );
};

export default AdminSidebar;
