import React, { useContext } from "react";
import Verify from "./pages/Verify";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "./ContextApi/isAuth";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Maindashboard from "./pages/Dashboard/Maindashboard.jsx";
import Resetpassword from "./pages/Resetpassword.jsx";
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
              <Maindashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/set-password" element={<Verify />} />
        <Route path="resetpassword" element={<Resetpassword />} />
      </Routes>
    </div>
  );
};

export default App;
