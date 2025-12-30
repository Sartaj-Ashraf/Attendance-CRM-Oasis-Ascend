import Leave from "../Models/Leave.models.js";

/* =====================================================
   APPLY LEAVE (EMPLOYEE)
===================================================== */
export const applyLeave = async (req, res) => {
  try {
    const { days, type, reason } = req.body;

    if (!days || days < 1 || !type || !reason) {
      return res.status(400).json({
        message: "Days, type and reason are required",
      });
    }

    const leave = await Leave.create({
      user: req.user.id,
      days,
      type,
      reason,
    });

    return res.status(201).json({
      message: "Leave request submitted successfully",
      data: leave,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to apply leave",
      error: error.message,
    });
  }
};

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
    leave.isPaid = isPaid; // ✅ decision made here
    leave.approvedBy = req.user._id;

    await leave.save();

    return res.status(200).json({
      message: "Leave approved successfully",
      data: leave,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to approve leave",
      error: error.message,
    });
  }
};

/* =====================================================
   REJECT LEAVE
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
    leave.isPaid = false; // optional but safe
    leave.approvedBy = req.user._id;

    await leave.save();

    return res.status(200).json({
      message: "Leave rejected successfully",
      data: leave,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to reject leave",
      error: error.message,
    });
  }
};

// controllers/leave.controller.js
export const getAllLeaves = async (req, res) => {
  try {
    let filter = {};

    // 🔐 MANAGER → ONLY DEPARTMENT USERS
    if (req.user.role === "manager") {
      const users = await User.find({
        department: req.user.department,
      }).select("_id");

      filter.user = { $in: users.map((u) => u._id) };
    }

    const leaves = await Leave.find(filter)
      .populate("user", "username email department")
      .populate("approvedBy", "username role")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: leaves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
