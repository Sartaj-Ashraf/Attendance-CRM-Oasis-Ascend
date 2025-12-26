import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login.jsx";

import Resetpassword from "./pages/Resetpassword";
import Verify from "./pages/Verify";
import ProtectedRoute from "./components/ProtectedRoute";
import Userdashboard from "./pages/Userdashboard";
import Attendance from "./pages/Dashboard/User/Attendance";

import AdminHome from "./pages/Dashboard/onwer/AdminHome.jsx";
import AddUser from "./pages/Dashboard/onwer/AddUser.jsx";

// import Users from "./pages/Dashboard/onwer/User.jsx";
import Users from "./pages/Dashboard/onwer/Users.jsx";
import AdminAttendance from "./pages/Dashboard/onwer/AdminAttendance.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { Toaster } from "react-hot-toast";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import ManagerHome from "./pages/Dashboard/Manager/ManagerHome.jsx";
import ManagerEmployees from "./pages/Dashboard/Manager/Employees.jsx";
import MakeAttendance from "./pages/Dashboard/Manager/MakeAttendance.jsx";
import UserHomeDashboard from "./pages/Dashboard/User/UserHome.jsx";
import Departments from "./pages/Dashboard/onwer/Departments.jsx";
import AttendanceDetails from "./pages/Dashboard/onwer/AttendanceDetails.jsx";
import Allmanagers from "./pages/Dashboard/onwer/Allmanagers.jsx";
import BlockedUsers from "./pages/Dashboard/onwer/BlockedUsers.jsx";
import Navbar from "./components/Navbar.jsx";
import { ViewManagers } from "./pages/Dashboard/Manager/ViewManagers.jsx";
const router = createBrowserRouter([
  {
    path: "/test3",
    element: <ViewManagers />,
  },
  {
    path: "/test",
    element: <Navbar />,
  },
  {
    path: "/test2",
    element: <AttendanceDetails />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <Resetpassword />,
  },
  {
    path: "/set-password",
    element: <Verify />,
  },
  {
    path: "/resetpassword",
    element: <Resetpassword />,
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["employee"]}>
        <Userdashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <UserHomeDashboard />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
    ],
  },
  {
    path: "/manager",
    element: (
      <ProtectedRoute allowedRoles={["manager"]}>
        <ManagerDashboard />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <ManagerHome />,
      },
      {
        path: "attendance",
        element: <MakeAttendance />,
      },
      {
        path: "employees",
        element: <ManagerEmployees />,
      },
    ],
  },

  {
    path: "/owner",
    element: (
      <ProtectedRoute allowedRoles={["owner"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "attendance",
        element: <MakeAttendance />,
      },
      {
        path: "managers",
        element: <Allmanagers />,
      },
      {
        path: "department",
        element: <Departments />,
      },
      {
        path: "block-users",
        element: <BlockedUsers />,
      },
    ],
  },

  {
    path: "/test",
    element: <Userdashboard />,
  },
]);

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            maxWidth: "420px",
            overflow: "hidden",
            background: "#0f172a",
            color: "#fff",
            borderRadius: "10px",
            padding: "14px 16px",
            width: "300px",
          },
          success: {
            style: {
              border: "2px solid #22c55e",
            },
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ecfdf5",
            },
          },
          error: {
            style: {
              border: "2px solid #ef4444",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fef2f2",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
