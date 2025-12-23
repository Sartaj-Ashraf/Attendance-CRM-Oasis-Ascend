import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Verify from "./pages/Verify";
import Login from "./pages/Login";
import Resetpassword from "./pages/Resetpassword";

import { AuthContext } from "./ContextApi/isAuth";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Maindashboard from "./pages/Dashboard/Maindashboard.jsx";
import Userdashboard from "./pages/Dashboard/User/Userdashboard.jsx";
import Attendance from "./pages/Dashboard/User/Attendance.jsx";

import AdminDashboard from "./pages/Dashboard/onwer/AdminDashboard";
import AdminHome from "./pages/Dashboard/onwer/AdminHome";
import Users from "./pages/Dashboard/onwer/User";
import AdminAttendance from "./pages/Dashboard/onwer/AdminAttendance";
import AddUser from "./pages/Dashboard/onwer/AddUser";

const App = () => {
  const { user, isAuth, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        theme="dark"
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<Resetpassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Userdashboard />
            </ProtectedRoute>
          }
        >
          {/* <Route index element={<Userdashboard />} /> */}
          <Route path="attendance" element={<Attendance />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />

          <Route path="users" element={<Users />}>
            <Route path="add" element={<AddUser />} />
          </Route>

          <Route path="attendance" element={<AdminAttendance />} />
        </Route>

        <Route path="/dashboard/attendance" element={<Attendance />} />
        <Route path="/test" element={<Userdashboard />} />
        <Route path="/set-password" element={<Verify />} />
        <Route path="resetpassword" element={<Resetpassword />} />
      </Routes>
    </div>
  );
};

export default App;
