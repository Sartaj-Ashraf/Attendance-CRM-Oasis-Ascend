import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios.js";
import { AuthContext } from "../ContextApi/isAuth.jsx";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import Ballpit from "../animation/Ballpit.jsx";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const { setUser, setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const [showEye, setShowEye] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🧠 debounce + double-click protection
  const lastClickRef = useRef(0);

  const changeHandler = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const submitDetails = async () => {
    // prevent double click (800ms)
    const now = Date.now();
    if (now - lastClickRef.current < 800 || loading) return;
    lastClickRef.current = now;

    if (!formdata.email || !formdata.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/user/login", formdata);

      setIsAuth(true);
      setUser(data.user);
      setSuccess(true);
      toast.success("Login successful");

      setTimeout(() => {
        if (data.user.role === "employee") navigate("/dashboard");
        if (data.user.role === "manager") navigate("/manager");
        if (data.user.role === "owner") navigate("/owner");
      }, 1200);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ENTER key submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitDetails();
  };
  const isMobile = window.innerWidth < 768;
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour <= 6;
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Ballpit
          count={isNight ? 140 : 140}
          gravity={isNight ? 0.35 : 0.6}
          friction={isNight ? 0.95 : 0.85}
          // colors={["#6366F1", "#8B5CF6", "#00000"]}
          // cursorColor="#6366F1"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-br from-indigo-500/10 to-violet-500/10" />
      </div>

      {/* Login Card */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>

          {/* Attendance Software Text */}
          <motion.div
            initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-6"
          >
            <p className="text-sm font-semibold text-indigo-600">
              Smart Attendance & Workforce Management
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Track attendance, manage leaves, and monitor employee activity in
              real-time with secure role-based access.
            </p>
            <p className="text-[11px] text-gray-400 mt-2">
              Owner • Manager • Employee
            </p>
          </motion.div>

          {/* Email */}
          <input
            className="w-full mb-4 px-4 py-3 border rounded-lg"
            placeholder="Email"
            name="email"
            value={formdata.email}
            onChange={changeHandler}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              className="w-full px-4 py-3 border rounded-lg pr-12"
              placeholder="Password"
              type={showEye ? "text" : "password"}
              name="password"
              value={formdata.password}
              onChange={changeHandler}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowEye(!showEye)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showEye ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={submitDetails}
            disabled={loading}
            whileHover={!loading ? { scale: 1.04 } : {}}
            whileTap={!loading ? { scale: 0.94 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative w-full py-3 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-violet-600
              shadow-lg shadow-indigo-500/30
              disabled:opacity-70 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            <AnimatePresence mode="wait">
              {loading && (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="animate-spin" size={18} />
                  Signing in...
                </motion.span>
              )}

              {!loading && success && (
                <motion.span
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Success
                </motion.span>
              )}

              {!loading && !success && (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Sign In
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Login;
