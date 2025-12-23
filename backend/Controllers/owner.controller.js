import bcrypt from "bcryptjs";
import crypto from "crypto";
// import  from "../models/User.model.js";
import UserModel from "../Models/User.model.js";
import nodemailer from "nodemailer";
import GenerateToken from "../utils/GenrateToken.js";
import Attendance from "../Models/Attendence.model.js";
export const createUser = async (req, res) => {
  try {
    let { username, email, role, payment } = req.body;
    if (!username || !email || !role || !payment) {
      return res.status(400).json({ message: "All fields are required" });
    }
    username = username?.toLowerCase();
    email = email?.toLowerCase();
    role = role?.toLowerCase();
    payment = payment?.toLowerCase();

    // 1. Validation
    if (role !== "employee") {
      return res.status(400).json({
        message: "Only employee accounts can be created",
      });
    }
    // 2. Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 3. Generate temporary password & token
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const passwordSetupToken = crypto.randomBytes(20).toString("hex");

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 5. Create user

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const resetUrl = `${process.env.FRONTEND_URL}/set-password?email=${email}&token=${passwordSetupToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Set your password",
      html: `
    <h3>Welcome to Attendance System</h3>
    <p>Click the link below to set your password:</p>
    <a href="${resetUrl}">Set Password</a>
    <p>This link will expire in 30 minutes.</p>
  `,
    });
    const newUser = await UserModel.create({
      username,
      email,
      role,
      payment,
      password: hashedPassword,
      passwordSetupToken,
      passwordSetupExpires: Date.now() + 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        payment,
        isActive: newUser.isActive,
        role: newUser.role,
        url: resetUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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

    if (!id) {
      return res.status(400).json({ message: "User id is required" });
    }
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = false;
    await user.save();

    return res.status(200).json({
      message: "Account disabled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const activateaccount = async (req, res) => {
  try {
    const { id } = req.params;

    // 400 → Bad Request (client sent invalid/missing data)
    if (!id) {
      return res.status(400).json({ msg: "id is required" });
    }

    // findById expects the id directly, not an object
    const user = await UserModel.findById(id);

    // 404 → Resource not found
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.isActive = true;
    await user.save();

    // 200 → Success
    return res.status(200).json({ msg: "Account activated successfully" });
  } catch (e) {
    // 500 → Server error
    return res
      .status(500)
      .json({ msg: "Internal server error", error: e.message });
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

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");

    const usersWithAttendance = await Promise.all(
      users.map(async (user) => {
        const attendance = await Attendance.find({ user: user._id }).populate(
          "status"
        );

        return {
          ...user.toObject(),
          attendance,
        };
      })
    );

    res.status(200).json({
      success: true,
      users: usersWithAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Validate id
    if (!id) {
      return res.status(400).json({ msg: "User id is required" });
    }

    // 🔹 Find user
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 🔹 Soft delete
    if (user.isDeleted) {
      return res.status(400).json({ msg: "User is already deleted" });
    }

    user.isDeleted = true;
    await user.save();

    return res.status(200).json({
      success: true,
      msg: "User deleted successfully",
    });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};
