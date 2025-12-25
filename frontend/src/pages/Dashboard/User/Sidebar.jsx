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

// import { NavLink } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <div className="w-64 min-h-screen bg-gray-100 p-6">
//       <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
//         <h2 className="text-2xl font-bold mb-8 text-gray-800">Dashboard</h2>

//         <NavLink
//           to="/dashboard/attendance"
//           className={({ isActive }) =>
//             `w-full text-left px-4 py-3 rounded-lg font-medium transition
//             ${
//               isActive
//                 ? "bg-blue-600 text-white border border-blue-600"
//                 : "text-gray-700 bg-gray-50 border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//             }`
//           }
//         >
//           Attendance
//         </NavLink>
//         {/* <h1>salary </h1> */}
//         <NavLink
//           to="/dashboard/attendance"
//           className={({ isActive }) =>
//             `w-full text-left px-4 py-3 mt-2 rounded-lg font-medium transition
//             ${
//               isActive
//                 ? "bg-blue-600 text-white border border-blue-600"
//                 : "text-gray-700 bg-gray-50 border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
//             }`
//           }
//         >
//           salary
//         </NavLink>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
// import { NavLink, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import api from "../../../axios/axios";
// import { AuthContext } from "../../../ContextApi/isAuth";

// const Sidebar = () => {
//   const { user, setIsAuth, setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const logoutHandler = async () => {
//     try {
//       await api.post("/user/logout");
//       setIsAuth(false);
//       setUser(null);
//       navigate("/login");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="w-64 min-h-screen bg-gray-100 p-6">
//       <div className="bg-white shadow-lg rounded-xl p-6 h-full flex flex-col justify-between">
//         <div>
//           <h2 className="text-2xl font-bold mb-8 text-gray-800">
//             Dashboard
//           </h2>
//           <NavLink
//             to="/dashboard/attendance"
//             className={({ isActive }) =>
//               `block px-4 py-3 rounded-lg font-medium transition mb-2 ${
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-700 bg-gray-50 hover:bg-blue-600 hover:text-white"
//               }`
//             }
//           >
//             Attendance
//           </NavLink>

//           <NavLink
//             to="/dashboard/salary"
//             className={({ isActive }) =>
//               `block px-4 py-3 rounded-lg font-medium transition ${
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-700 bg-gray-50 hover:bg-blue-600 hover:text-white"
//               }`
//             }
//           >
//             Salary
//           </NavLink>
//         </div>
//         <div>
//           <p className="text-2xl font-bold mb-8 text-gray-800">
//             {user?.username}
//           </p>
//           <p className="text-xl mb-8 text-gray-800">
//              Email={user?.email}
//           </p> <p className="text-xl mb-8 text-gray-800">
//              Role=Software Engineer
//           </p>

//           <button
//             onClick={logoutHandler}
//             className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
//             Logout
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import api from "../../../axios/axios";
import { AuthContext } from "../../../ContextApi/isAuth";

const Sidebar = () => {
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

        {/* ===== TOP: LOGO / TITLE ===== */}
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-bold text-gray-800 tracking-wide">
            Dashboard
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Employee Panel
          </p>
        </div>

        {/* ===== MIDDLE: NAVIGATION ===== */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink
            to="/dashboard/attendance"
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
            to="/dashboard/salary"
            className={({ isActive }) =>
              `block bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            Salary
          </NavLink>
        </nav>

        {/* ===== BOTTOM: USER + LOGOUT ===== */}
        <div className="px-5 py-4 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
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

export default Sidebar;
