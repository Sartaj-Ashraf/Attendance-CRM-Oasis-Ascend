import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios.js";
import { AuthContext } from "../ContextApi/isAuth.jsx";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import Ballpit from "../animation/Ballpit.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { FlipWordsDemo } from "../components/welcome.jsx";

const Login = () => {
  const { setUser, setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showWelcome, setshowWelcome] = useState(false);
  const [userRole, setUserRole] = useState(null);

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

      // ✅ save role safely
      setUserRole(data.user.role);

      setSuccess(true);
      toast.success("Login successful");
      setshowWelcome(true);

      // optional safety: hide welcome if navigation is delayed
      setTimeout(() => setshowWelcome(false), 5000);

      setTimeout(() => {
        if (data.user.role === "employee") navigate("/dashboard");
        if (data.user.role === "manager") navigate("/manager");
        if (data.user.role === "owner") navigate("/owner");
      }, 4500);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitDetails();
  };

  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour <= 6;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Welcome screen */}
      <AnimatePresence>
        {showWelcome && userRole && (
          <motion.div
            className="relative z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <FlipWordsDemo role={userRole} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Login + Background (only when welcome is hidden) */}
      {!showWelcome && (
        <>
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Ballpit
              count={isNight ? 120 : 140}
              gravity={isNight ? 0.35 : 0.6}
              friction={isNight ? 0.95 : 0.85}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-br from-indigo-500/10 to-violet-500/10" />
          </div>

          {/* Login Card */}
          <div className="relative z-20 min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-center mb-2">
                Welcome Back
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center mb-6"
              >
                <p className="text-sm font-semibold text-indigo-600">
                  Smart Attendance & Workforce Management
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Owner • Manager • Employee
                </p>
              </motion.div>

              <input
                className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Email"
                name="email"
                value={formdata.email}
                onChange={changeHandler}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />

              <div className="relative mb-4">
                <input
                  className="w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

              <motion.button
                onClick={submitDetails}
                disabled={loading}
                whileHover={!loading ? { scale: 1.04 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-violet-600
              shadow-lg shadow-indigo-500/30
              flex items-center justify-center gap-2
              disabled:opacity-70"
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
                    >
                      Sign In
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
