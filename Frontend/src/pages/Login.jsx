import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios.js";
import axios from "axios";
import { AuthContext } from "../ContextApi/isAuth.jsx";
import toast from "react-hot-toast";
const Login = () => {
  const { user, setUser, setIsAuth } = useContext(AuthContext);

  const [formdata, setFormdata] = useState({
    email: "asif@",
    password: "umaidk",
  });

  const changeHandler = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const submitDetails = async () => {
    try {
      const { data } = await api.post("/user/login", {
        email: formdata.email,
        password: formdata.password,
      });
      await setIsAuth(true);

      await setUser(data.user);
      toast.success("Login successful!", { icon: false });
      setTimeout(() => {
        if (data.user.role == "employee") {
          navigate("/dashboard");
        }
        if (data.user.role == "manager") {
          navigate("/manager");
        }
        if (data.user.role == "owner") {
          navigate("/owner");
        }
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.msg || "Something went wrong";
      toast.error(message, {
        icon: false,
      });
    }
  };
  console.log(import.meta.env.VITE_BACKEND_URL);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <input
          name="email"
          placeholder="Enter email"
          value={formdata.email}
          onChange={changeHandler}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Enter password"
          value={formdata.password}
          onChange={changeHandler}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={submitDetails}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Continue
        </button>
        <button
          onClick={() => navigate("/resetpassword")}
          className="w-full mt-3 text-blue-600 hover:text-blue-700 font-medium hover:underline transition duration-200"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default Login;
