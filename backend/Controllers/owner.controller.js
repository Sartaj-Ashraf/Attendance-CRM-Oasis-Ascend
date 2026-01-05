import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";
import UserModel from "../Models/User.model.js";
import DepartmentModel from "../Models/Department.model.js";
import pagination from "../utils/pagination.js";
import { sendEmail } from "../services/email.service.js";

/* ================= CREATE USER ================= */
export const createUser = async (req, res) => {
  try {
    let { username, email, phone, payment, department } = req.body;

    if (!username || !email || !phone || !payment || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({ message: "Invalid department ID" });
    }

    username = username.toLowerCase();
    email = email.toLowerCase();
    payment = payment.toLowerCase();

    const departmentDoc = await DepartmentModel.findById(department);
    if (!departmentDoc) {
      return res.status(404).json({ message: "Department does not exist" });
    }

    const existingUser = await UserModel.findOne({ email, isDeleted: false });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    let finalRole = "employee";
    let reportingManager = null;

    const anyUser = await UserModel.findOne({
      department,
      isDeleted: false,
    });

    if (!anyUser) {
      finalRole = "manager";
    } else {
      const manager = await UserModel.findOne({
        role: "manager",
        department,
        isActive: true,
        isDeleted: false,
      });

      if (!manager) {
        return res
          .status(400)
          .json({ message: "Department has no active manager" });
      }

      reportingManager = manager._id;
    }

    const hashedPassword = await bcrypt.hash(
      crypto.randomBytes(6).toString("hex"),
      10
    );

    const passwordSetupToken = crypto.randomBytes(32).toString("hex");
    const resetUrl = `${process.env.FRONTEND_URL}/set-password?email=${email}&token=${passwordSetupToken}`;

    await sendEmail({
      toEmail: email,
      type: "SET_PASSWORD",
      data: { resetUrl },
    });

    const newUser = await UserModel.create({
      username,
      email,
      phone,
      payment,
      department,
      role: finalRole,
      reportingManager,
      password: hashedPassword,
      passwordSetupToken,
      passwordSetupExpires: Date.now() + 60 * 60 * 1000,
    });

    // 🔁 Update department
    await DepartmentModel.findByIdAndUpdate(department, {
      $inc: { members: 1 },
      ...(finalRole === "manager" && {
        $addToSet: { managers: newUser._id },
      }),
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        department: departmentDoc.name,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL EMPLOYEES ================= */
export const GetAllEmployee = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { department, search, verification } = req.query;

    const query = {
      _id: { $ne: loggedInUserId },
      role: "employee",
      isDeleted: false,
      isActive: true,
    };

    if (department && mongoose.Types.ObjectId.isValid(department)) {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (verification === "verified") query.isEmailVerified = true;
    if (verification === "unverified") query.isEmailVerified = false;

    const result = await pagination({
      model: UserModel,
      page,
      limit,
      query,
      select: "-password",
      populate: [
        { path: "department", select: "name" },
        { path: "reportingManager", select: "username email" },
      ],
    });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= EDIT USER ================= */
export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    let { email, department, payment } = req.body;

    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ❌ Block manager department change
    if (department && user.role === "manager") {
      return res.status(400).json({
        message: "Change manager department using replace manager flow",
      });
    }

    if (email && email !== user.email) {
      email = email.toLowerCase();
      const exists = await UserModel.findOne({
        email,
        _id: { $ne: id },
      });
      if (exists) return res.status(409).json({ message: "Email exists" });
      user.email = email;
      user.isEmailVerified = false;
    }

    if (payment) {
      payment = payment.toLowerCase();
      if (!["paid", "unpaid"].includes(payment)) {
        return res.status(400).json({ message: "Invalid payment status" });
      }
      user.payment = payment;
    }

    if (department && department !== String(user.department)) {
      await DepartmentModel.findByIdAndUpdate(user.department, {
        $inc: { members: -1 },
      });
      await DepartmentModel.findByIdAndUpdate(department, {
        $inc: { members: 1 },
      });
      user.department = department;
    }

    await user.save();

    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= REPLACE MANAGER ================= */
export const replaceManager = async (req, res) => {
  try {
    const { id: newManagerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(newManagerId)) {
      return res.status(400).json({ msg: "Invalid user id" });
    }

    const newManager = await UserModel.findById(newManagerId);
    if (!newManager || newManager.isDeleted) {
      return res.status(404).json({ msg: "User not found" });
    }

    const departmentId = newManager.department;

    const oldManager = await UserModel.findOne({
      role: "manager",
      department: departmentId,
      isDeleted: false,
    });

    if (oldManager && oldManager._id.equals(newManager._id)) {
      return res.status(400).json({ msg: "Already manager" });
    }

    if (oldManager) {
      await UserModel.updateMany(
        { reportingManager: oldManager._id },
        { $set: { reportingManager: newManager._id } }
      );

      oldManager.role = "employee";
      oldManager.reportingManager = newManager._id;
      await oldManager.save();

      await DepartmentModel.findByIdAndUpdate(departmentId, {
        $pull: { managers: oldManager._id },
      });
    }

    newManager.role = "manager";
    newManager.reportingManager = null;
    await newManager.save();

    await DepartmentModel.findByIdAndUpdate(departmentId, {
      $addToSet: { managers: newManager._id },
    });

    res.json({ success: true, message: "Manager replaced successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

/* ================= DELETE USER ================= */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user id" });
    }

    const user = await UserModel.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ msg: "User not found" });
    }

    await DepartmentModel.findByIdAndUpdate(user.department, {
      $inc: { members: -1 },
      ...(user.role === "manager" && {
        $pull: { managers: user._id },
      }),
    });

    await UserModel.findByIdAndUpdate(id, {
      isDeleted: true,
      isActive: false,
    });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= FORCE LOGOUT ================= */
export const forceLogoutAllUsers = async (req, res) => {
  try {
    await UserModel.updateMany({}, { $inc: { versionToken: 1 } });
    res.json({ success: true, message: "All users logged out" });
  } catch {
    res.status(500).json({ success: false });
  }
};
