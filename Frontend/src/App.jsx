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
const router = createBrowserRouter([
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
      <ProtectedRoute>
        <Userdashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "attendance",
        element: <Attendance />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      // {
      //   path: "add",
      //   element: <AddUser />,
      // },
      {
        path: "users",
        // element: <Users />,
        element: <Users/>,
      },
      {
        path: "attendance",
        element: <AdminAttendance />,
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
      {" "}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            maxWidth: "420px", // ✅ prevents squeeze
            overflow: "hidden",
            background: "#0f172a",
            color: "#fff",
            borderRadius: "10px",
            padding: "14px 16px",
            width: "300px",
          },
          success: {
            style: {
              border: "1px solid #22c55e",
            },
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ecfdf5",
            },
          },
          error: {
            style: {
              border: "1px solid #ef4444",
            },
            iconTheme: {
              width: "500px",
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
