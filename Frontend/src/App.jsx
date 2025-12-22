import React, { useContext } from "react";
import Verify from "./pages/Verify";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "./ContextApi/isAuth";

import Maindashboard from "./pages/Dashboard/Maindashboard.jsx";
import Resetpassword from "./pages/Resetpassword.jsx";
const App = () => {
  const { user, isAuth, loading } = useContext(AuthContext);

  console.log({ user, isAuth });

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

        <Route
          path="/dashboard"
          element={isAuth ? <Maindashboard /> : <Login />}
        />

        <Route path="/set-password" element={<Verify />} />
        <Route path='resetpassword' element={<Resetpassword/>} />
      </Routes>
    </div>
  );
};

export default App;
