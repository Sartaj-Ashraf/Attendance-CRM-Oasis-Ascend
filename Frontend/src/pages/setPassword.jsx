import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
// import api from "../axios/axios.jsx";

const SetPassword = ({ data }) => {
  const { userName, email, token } = data;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setmessage] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);
    axios
      .patch("http://localhost:5000/user/setpassword", {
        email,
        token,
        password,
      })
      .then((e) => {
        setTimeout(() => {
          toast.success("Password updated successfully!");
          console.log("Password set successfully");
          setLoading(false);
        }, 1000);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e.message);
        toast.error(e.response?.data?.message || "Something went wrong");
      });
  };

  return (
    <div className=" w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl flex flex-col gap-6"
      >
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {userName}
          </h2>
          <p className="text-sm text-gray-500 break-all">{email}</p>
        </div>

        <div className="h-px bg-gray-500" />

        <div className="text-center space-y-1">
          <h3 className="text-xl font-semibold text-gray-700">
            Set Your Password
          </h3>
          <p className="text-sm text-gray-500">
            Choose a strong and secure password
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              maxLength={10}
              placeholder="New Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            maxLength={10}
            placeholder="Confirm Password"
            className={`border rounded-lg px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2
              ${
                error
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-600 text-white py-3 rounded-lg
                     hover:bg-blue-700 transition font-medium
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Setting Password..." : "Set Password"}
        </button>
      </form>
    </div>
  );
};

export default SetPassword;
