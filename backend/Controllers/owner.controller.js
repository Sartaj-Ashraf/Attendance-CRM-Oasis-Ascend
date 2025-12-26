import bcrypt from "bcryptjs";
import crypto from "crypto";
import UserModel from "../Models/User.model.js";
import DepartmentModel from "../Models/Department.model.js";
import nodemailer from "nodemailer";
import GenerateToken from "../utils/GenrateToken.js";
import Attendance from "../Models/Attendence.model.js";

import mongoose from "mongoose";

export const createUser = async (req, res) => {
  try {
    let { username, email, phone, payment, department } = req.body;

    // 1️⃣ Validation
    if (!username || !email || !phone || !payment || !department) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({
        message: "Invalid department ID",
      });
    }

    username = username.toLowerCase();
    email = email.toLowerCase();
    payment = payment.toLowerCase();

    // 2️⃣ Find department by ID ✅
    const departmentDoc = await DepartmentModel.findById(department);
    if (!departmentDoc) {
      return res.status(404).json({
        message: "Department does not exist",
      });
    }

    // 3️⃣ Check existing user
    const existingUser = await UserModel.findOne({ email, isDeleted: false });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // 4️⃣ Manager logic
    let finalRole = "employee";
    let reportingManager = null;

    const departmentUser = await UserModel.findOne({
      department,
      isDeleted: false,
    });

    if (!departmentUser) {
      // First user in department
      finalRole = "manager";
    } else {
      const manager = await UserModel.findOne({
        role: "manager",
        department,
        isActive: true,
        isDeleted: false,
      });

      if (!manager) {
        return res.status(400).json({
          message: "Department has no active manager",
        });
      }

      reportingManager = manager._id;
    }

    // 5️⃣ Password + Token
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const passwordSetupToken = crypto.randomBytes(32).toString("hex");

    // 6️⃣ Create user
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
      passwordSetupExpires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    // 7️⃣ Response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        department: departmentDoc.name,
        reportingManager: reportingManager || "SELF",
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    let { username, email, payment } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (username) {
      user.username = username.toLowerCase();
    }

    // 3️⃣ Update email (optional + unique check)
    if (email) {
      email = email.toLowerCase();

      const emailExists = await UserModel.findOne({
        email,
        _id: { $ne: id },
      });

      if (emailExists) {
        return res.status(409).json({
          message: "Email already in use",
        });
      }

      user.email = email;
    }

    if (payment) {
      payment = payment.toLowerCase();

      if (!["paid", "unpaid"].includes(payment)) {
        return res.status(400).json({
          message: "Payment must be 'paid' or 'unpaid'",
        });
      }

      user.payment = payment;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        payment: updatedUser.payment,
      },
    });
  } catch (error) {
    console.error("Edit User Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


export const disableaccount = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user id" });
    }

    // 2️⃣ Check user exists
    const user = await UserModel.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 3️⃣ SAFE update (NO save)
    await UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });

    return res.status(200).json({
      msg: "Account disabled successfully",
    });
  } catch (error) {
    console.error("disableaccount error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

export const activateaccount = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user id" });
    }

    // 2️⃣ Check user exists
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 3️⃣ Activate account (NO save)
    await UserModel.findByIdAndUpdate(id, { isActive: true }, { new: true });

    return res.status(200).json({
      msg: "Account activated successfully",
    });
  } catch (e) {
    console.error("activateaccount error:", e);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const assignRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // 400 → Bad request (missing data)
    if (!id || !role) {
      return res.status(400).json({ msg: "id and role are required" });
    }

    const user = await UserModel.findById(id);

    // 404 → User not found
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.role = role;
    await user.save();

    // 200 → Success
    return res.status(200).json({
      msg: "Role assigned successfully",
      user: {
        id: user._id,
        role: user.role,
      },
    });
  } catch (e) {
    // 500 → Server error
    return res.status(500).json({
      msg: "Internal server error",
      error: e.message,
    });
  }
};

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await UserModel.find().select("-password");

//     const usersWithAttendance = await Promise.all(
//       users.map(async (user) => {
//         const attendance = await Attendance.find({ user: user._id }).populate(
//           "status"
//         );

//         return {
//           ...user.toObject(),
//           attendance,
//         };
//       })
//     );

//     res.status(200).json({
//       success: true,
//       users: usersWithAttendance,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const getAllDepartmentUser = async (req, res) => {
  try {
    const { department } = req.query; // ✅ from query

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department id is required",
      });
    }

    const users = await UserModel.find({
      department, // ✅ filter by department ObjectId
      isDeleted: false,
      isActive: true,
      role: "employee",
    })
      .select("-password -passwordSetupToken -passwordSetupExpires")
      .populate("department", "name")
      .populate("reportingManager", "username email");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user id" });
    }

    // 2️⃣ Check user exists
    const user = await UserModel.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 3️⃣ Soft delete (NO save)
    await UserModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        isActive: false,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "User deleted successfully",
    });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

export const getBlockedUser = async (req, res) => {
  try {
    const users = await UserModel.find({
      isActive: false,
      isDeleted: false,
    }).select(
      "-passwordSetupToken -passwordSetupExpires -updatedAt -createdAt -isDeleted -isActive"
    );
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blocked users",
      error: e.message,
    });
  }
};
export const GetAllEmployee = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // from auth middleware

    const employees = await UserModel.find({
      _id: { $ne: loggedInUserId }, 
      role: "employee",
      isDeleted: false,
      isActive: true,
    })
      .select("-password")
      .populate("department", "name")
      .populate("reportingManager", "username email");

    res.status(200).json({
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("GetAllEmployee error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetManagers = async (req, res) => {
  try {
    const managers = await UserModel.find({
      role: "manager",
      isDeleted: false,
      isActive: true,
    })
      .select("-password -passwordSetupToken -passwordSetupExpires")
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: managers.length,
      data: managers,
    });
  } catch (error) {
    console.error("GetManagers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch managers",
    });
  }
};
export const BlockedUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ isActive: false, isDeleted: false })
      .select("-password -passwordSetupToken -passwordSetupExpires")
      .populate("department", "name");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch blocked users" });
  }
};
