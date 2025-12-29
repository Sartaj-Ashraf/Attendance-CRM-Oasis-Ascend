import express from "express";
import UserModel from "../Models/User.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import DepartmentModel from "../Models/Department.model.js";
import AttendanceModel from "../Models/Attendence.model.js";
import bcrypt from "bcrypt";

const router = express.Router();

// ⚠️ Use only in DEV
router.post("/seed/full-attendance", authMiddleware, async (req, res) => {
  try {
    const {
      departmentName = "DEVELOPMENT",
      totalUsers = 50,
      days = 90,
      markedBy,
    } = req.body;

    if (!markedBy) {
      return res.status(400).json({
        success: false,
        message: "markedBy (admin/owner id) is required",
      });
    }

    /* ============================
       1️⃣ Create Department
    ============================ */
    let department = await DepartmentModel.findOne({
      name: departmentName.toUpperCase(),
    });

    if (!department) {
      department = await DepartmentModel.create({
        name: departmentName.toUpperCase(),
      });
    }

    /* ============================
       2️⃣ Create Users
    ============================ */
    const users = [];
    const password = await bcrypt.hash("Password@123", 10);

    for (let i = 1; i <= totalUsers; i++) {
      users.push({
        username: `employee${i}`,
        email: `employee${i}@example.com`,
        password,
        phone: `9${String(100000000 + i).slice(0, 9)}`,
        role: "employee",
        department: department._id,
        isActive: true,
      });
    }

    const createdUsers = await UserModel.insertMany(users, {
      ordered: false,
    });

    /* ============================
       3️⃣ Generate Attendance
    ============================ */
    const statuses = ["present", "present", "present", "late", "absent"];
    const attendanceRecords = [];

    createdUsers.forEach((user, userIndex) => {
      for (let d = 0; d < days; d++) {
        const date = new Date();
        date.setDate(date.getDate() - d);
        date.setHours(0, 0, 0, 0);

        attendanceRecords.push({
          user: user._id,
          date,
          status: statuses[(userIndex + d) % statuses.length],
          markedBy,
          note: "Auto generated attendance",
        });
      }
    });

    await AttendanceModel.insertMany(attendanceRecords, {
      ordered: false,
    });

    return res.status(201).json({
      success: true,
      message: "Department, users and attendance created successfully",
      department: department.name,
      usersCreated: createdUsers.length,
      attendanceRecords: attendanceRecords.length,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(201).json({
        success: true,
        message:
          "Some records already existed, remaining data inserted successfully",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to seed data",
      error: error.message,
    });
  }
});

export default router;
