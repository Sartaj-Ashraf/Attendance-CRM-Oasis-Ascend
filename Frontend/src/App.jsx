import React from "react";
import Verify from "./pages/Verify";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./ContextApi/isAuth";

const App = () => {
  const { role, isAuth } = useAuth(); // ✅ FIX HERE

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        theme="dark"
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<Verify />} />
      </Routes>
    </div>
  );
};

export default App;
