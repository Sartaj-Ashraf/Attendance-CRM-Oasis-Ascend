import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios.js";
import { AuthContext } from "../ContextApi/isAuth.jsx";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
const Login = () => {
  const { setUser, setIsAuth } = useContext(AuthContext);
  const [showEye, setShowEye] = useState(false);
  const [formdata, setFormdata] = useState({
    email: "aquib445488@gmail.comfga",
    password: "umaidk",
  });

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const submitDetails = async () => {
    try {
      const { data } = await api.post("/user/login", formdata);

      setIsAuth(true);
      setUser(data.user);

      toast.success("Login successful");

      setTimeout(() => {
        if (data.user.role === "employee") navigate("/dashboard");
        if (data.user.role === "manager") navigate("/manager");
        if (data.user.role === "owner") navigate("/owner");
      }, 800);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF2FF] via-[#E0F2FE] to-[#F9FAFB]">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Attendance Pro
          </h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={formdata.email}
            onChange={changeHandler}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       transition-shadow transition-colors duration-200 
                       hover:border-gray-400"
          />
          <div className="relative">
            <input
              name="password"
              type={showEye ? "text" : "password"}
              placeholder="Password"
              value={formdata.password}
              onChange={changeHandler}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg
               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
               transition-colors duration-200"
            />

            <button
              type="button"
              onClick={() => setShowEye(!showEye)}
              className="absolute right-3 top-1/2 -translate-y-1/2
               text-gray-500 hover:text-gray-700
               transition-colors duration-200"
            >
              {showEye ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            onClick={submitDetails}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold 
                       transition-colors duration-200 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/resetpassword")}
            className="w-full text-sm text-blue-600 
                       transition-colors duration-200 
                       hover:text-blue-700"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
