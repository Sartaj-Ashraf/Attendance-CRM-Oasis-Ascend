import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios.js";
import { AuthContext } from "../ContextApi/isAuth.jsx";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-indigo-50 via-sky-50 to-slate-100">
      {/* ================= LEFT SIDE (Illustration + Points) ================= */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
        <h1 className="text-4xl font-bold mb-4">Attendance Pro</h1>

        <p className="text-white/80 mb-8 max-w-md">
          Smart attendance management for modern teams and organizations.
        </p>

        {/* Points */}
        <div className="space-y-4 max-w-md">
          {[
            "Track attendance in real time",
            "Manage employees & departments",
            "Role-based secure access",
            "Detailed reports & analytics",
          ].map((point, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span className="text-white/90">{point}</span>
            </div>
          ))}
        </div>

        {/* Illustration Placeholder */}
        <div className="">
          <img
            src="/login.svg"
            alt="Attendance Illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>

      {/* ================= RIGHT SIDE (Login Card) ================= */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8 ">
            <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-2">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={formdata.email}
              onChange={changeHandler}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/60
                         transition-all duration-200 hover:border-slate-400"
            />

            <div className="relative">
              <input
                name="password"
                type={showEye ? "text" : "password"}
                placeholder="Password"
                value={formdata.password}
                onChange={changeHandler}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/60
                           transition-all duration-200"
              />

              <button
                type="button"
                onClick={() => setShowEye(!showEye)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                           text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showEye ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              onClick={submitDetails}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-r from-indigo-600 to-violet-600
                         hover:scale-[1.02] hover:shadow-lg
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/resetpassword")}
              className="w-full text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
