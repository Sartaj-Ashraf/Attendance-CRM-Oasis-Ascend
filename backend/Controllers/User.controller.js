import bcrypt from "bcryptjs";
import crypto from "crypto";
import UserModel from "../Models/User.model.js";
import nodemailer from "nodemailer";
import GenerateToken from "../utils/GenrateToken.js";
import Attendance from "../Models/Attendence.model.js";
import { generatePasswordToken } from "../utils/passwordToken.util.js";
import { sendSetPasswordEmail } from "../services/email.service.js";
export const verifyToken = async (req, res) => {
  try {
    const { email, token } = req.query;

    // 1. Validate input
    if (!email || !token) {
      return res.status(400).json({
        success: false,
        message: "Email and token are required",
      });
    }

    // 2. Find user with valid token
    const user = await UserModel.findOne({
      email,
      passwordSetupToken: token,
      passwordSetupExpires: { $gt: Date.now() },
    });

    // 3. If user not found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired link",
      });
    }

    // 4. Token is valid
    return res.status(200).json({
      success: true,
      token: token,
      userName: user.userName,
      message: "Token is valid",
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const setPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    // 1. Validate input
    if (!email || !token || !password) {
      return res.status(400).json({
        message: "Email, token, and password are required",
      });
    }

    // 2. Find user with valid token
    const user = await UserModel.findOne({
      email,
      passwordSetupToken: token,
      passwordSetupExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Update user securely
    user.password = hashedPassword;
    user.passwordSetupToken = undefined;
    user.passwordSetupExpires = undefined;
    user.isActive = true;

    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
    if (!user.isActive) {
      return res.status(400).json({ msg: "Your Account is disable by Admin " });
    }
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const token = GenerateToken(user);
    res.cookie("AttendenceToken", token, {
      httpsOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      msg: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};
export const getcurrentData = async (req, res) => {
  try {
    const { id } = req.user;
    const { from, to } = req.query;

    const user = await UserModel.findById(id).select(
      "-password -passwordSetupToken -passwordSetupExpires"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Build date filter
    const dateFilter = {};
    if (from || to) {
      dateFilter.date = {};
      if (from) dateFilter.date.$gte = new Date(from);
      if (to) dateFilter.date.$lte = new Date(to);
    }

    const attendance = await Attendance.find({
      user: id,
      ...dateFilter,
    })
      .populate({
        path: "status",
        select: "status payment description isActive",
      })
      .sort({ date: -1 });

    return res.status(200).json({
      user,
      attendance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

export const resetpassword = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json("Email is Required");
    email = email.toLowerCase();
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json("user does't exists");
    const passwordToken = generatePasswordToken();
    const resetUrl = `${process.env.FRONTEND_URL}/set-password?email=${email}&token=${passwordToken}`;
    await sendSetPasswordEmail(email, resetUrl);
    user.passwordSetupToken = passwordToken;
    user.passwordSetupExpires = new Date(Date.now() + 30 * 60 * 1000);
    user.isActive = false;
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset link sent to email", resetUrl });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // must match how it was set
      sameSite: "strict",
      path: "/", // important
    });
    return res.status(200).json({
      msg: "Cookie removed successfully",
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Failed to remove cookie",
      error: e.message,
    });
  }
};
