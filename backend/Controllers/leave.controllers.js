import Leave from "../Models/Leave.models.js";
import UserModel from "../Models/User.model.js";
import sanitizeHtml from "sanitize-html";

/* =====================================================
   APPLY LEAVE (EMPLOYEE)
===================================================== */
export const applyLeave = async (req, res) => {
  try {
    const { days, subject, reason } = req.body;

    // ❌ Client error → 400
    if (!days || !subject || !reason) {
      return res.status(400).json({
        success: false,
        message: "Days, subject and reason are required",
      });
    }

    // 🔐 Sanitize HTML from Jodit editor
    const safeReason = sanitizeHtml(reason);

    const leave = await Leave.create({
      user: req.user.id,
      days,
      subject,
      reason: safeReason,
    });

    // ✅ Success
    return res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: leave,
    });
  } catch (error) {
    // 🧠 Log full error (important)
    console.error("Apply Leave Error:", error);

    // ❌ Server error → 500
    return res.status(500).json({
      success: false,
      message: "Failed to apply leave",
    });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      user: req.user.id,
    })
      .populate("approvedBy", "username role")
      .sort({ createdAt: -1 });

      
    return res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user leaves",
      error: error.message,
    });
  }
};

/* =====================================================
   APPROVE LEAVE (MANAGER / OWNER)
===================================================== */
export const approveLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { isPaid } = req.body;

    if (typeof isPaid !== "boolean") {
      return res.status(400).json({
        message: "isPaid must be true or false",
      });
    }

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        message: "Leave already processed",
      });
    }

    leave.status = "approved";
    leave.isPaid = isPaid;
    leave.approvedBy = req.user.id;
    leave.approvedAt = new Date();

    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve leave",
      error: error.message,
    });
  }
};

/* =====================================================
   REJECT LEAVE (MANAGER / OWNER)
===================================================== */
export const rejectLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        message: "Leave already processed",
      });
    }

    leave.status = "rejected";
    leave.isPaid = false;
    leave.approvedBy = req.user._id;
    leave.approvedAt = new Date();

    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject leave",
      error: error.message,
    });
  }
};

/* =====================================================
   GET ALL LEAVES (ROLE BASED)
===================================================== */
export const getAllLeaves = async (req, res) => {
  try {
    let filter = {};

    // EMPLOYEE → own leaves
    if (req.user.role === "employee") {
      filter.user = req.user._id;
    }

    // MANAGER → department leaves
    if (req.user.role === "manager") {
      const users = await UserModel.find({
        department: req.user.department,
      }).select("_id");

      filter.user = { $in: users.map((u) => u._id) };
    }

    // OWNER → all leaves (no filter)

    const leaves = await Leave.find(filter)
      .populate("user", "username email department")
      .populate("approvedBy", "username role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leaves",
      error: error.message,
    });
  }
};
