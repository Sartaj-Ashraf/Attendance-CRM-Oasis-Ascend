import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import UserModel from "../Models/User.model.js";
import nodemailer from "nodemailer";
import GenerateToken from "../utils/GenrateToken.js";
import Attendance from "../Models/Attendence.model.js";
import { generatePasswordToken } from "../utils/passwordToken.util.js";
import { sendSetPasswordEmail } from "../services/email.service.js";
import { paginate } from "../utils/pagination.js";
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
      return res.status(404).json({ msg: "We Could Find Username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
    if (!user.isActive) {
      return res.status(400).json({ msg: "Your Account is disable by Admin " });
    }
    if (user.isDeleted) {
      return res.status(403).json({
        success: false,
        msg: "You are no longer a member of the society.",
      });
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

export const getCurrentAttendance = async (req, res) => {
  try {
    const { id } = req.user;
    const { from, to } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // 🔹 Validate dates
    if (from && isNaN(new Date(from))) {
      return res.status(400).json({ msg: "Invalid from date" });
    }

    if (to && isNaN(new Date(to))) {
      return res.status(400).json({ msg: "Invalid to date" });
    }

    // 🔹 Validate user
    const user = await UserModel.findById(id).select(
      "-password -passwordSetupToken -passwordSetupExpires"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 🔹 Build query
    const query = { user: id };

    if (from || to) {
      query.date = {};

      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        query.date.$gte = fromDate;
      }

      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        query.date.$lte = toDate;
      }
    }

    // 🔍 DEBUG LOG (TEMPORARY)
    console.log("Attendance Query:", query);

    // 🔹 Paginate
    const result = await paginate({
      model: Attendance,
      page,
      limit,
      query,

      sort: { date: -1 },
    });

    return res.status(200).json({
      success: true,
      user,
      ...result,
    });
  } catch (error) {
    console.error("getCurrentAttendance error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

export const getAttendanceSummary = async (req, res) => {
  try {
    const { id } = req.user;
    const { from, to } = req.query;

    // 🔹 Validate dates
    if (from && isNaN(new Date(from))) {
      return res.status(400).json({ msg: "Invalid from date" });
    }

    if (to && isNaN(new Date(to))) {
      return res.status(400).json({ msg: "Invalid to date" });
    }

    // 🔹 Build match query (FIXED ✅)
    const match = {
      user: new mongoose.Types.ObjectId(id), // 🔥 IMPORTANT FIX
    };

    if (from || to) {
      match.date = {};

      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        match.date.$gte = fromDate;
      }

      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        match.date.$lte = toDate;
      }
    }

    // 🔍 Debug (keep temporarily)
    console.log("MATCH QUERY:", match);

    // 🔹 MongoDB aggregation
    const summary = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // 🔹 Format response
    const result = {
      present: 0,
      absent: 0,
      leave: 0,
      late: 0,
      total: 0,
    };

    summary.forEach((item) => {
      const key = item._id?.toLowerCase();
      if (result[key] !== undefined) {
        result[key] = item.count;
        result.total += item.count;
      }
    });

    return res.status(200).json({
      success: true,
      from: from || null,
      to: to || null,
      summary: result,
    });
  } catch (error) {
    console.error("getAttendanceSummary error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

export const resetpassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        msg: "Email is required",
      });
    }

    email = email.toLowerCase();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "User does not exist",
      });
    }

    const passwordToken = generatePasswordToken();
    const resetUrl = `${process.env.FRONTEND_URL}/set-password?email=${email}&token=${passwordToken}`;

    await sendSetPasswordEmail(email, resetUrl);

    user.passwordSetupToken = passwordToken;
    user.passwordSetupExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Password reset link sent to email",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("AttendenceToken", {
      httpOnly: true,
      secure: process.env.MODE === "production", // must match how it was set
      sameSite: process.env.MODE === "production" ? "none" : "lax",
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
