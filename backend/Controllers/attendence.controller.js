import UserModel from "../Models/User.model.js";
import AttendanceModel from "../Models/Attendence.model.js";

export const markAttendance = async (req, res) => {
  try {
    const { userId, status, note } = req.body;

    if (!userId || !status) {
      return res.status(400).json({ msg: "userId and status are required" });
    }

    const allowedStatuses = ["present", "absent", "leave", "late"];
    if (!allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ msg: "Invalid attendance status" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await AttendanceModel.findOneAndUpdate(
      { user: userId, date: today },
      {
        status: status.toLowerCase(),
        markedBy: req.user.id, // ✅ FIXED
        note,
        date: today,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "username email")
      .populate("markedBy", "username role");

    return res.status(200).json({
      msg: "Attendance saved successfully",
      attendance,
    });
  } catch (err) {
    console.error("❌ markAttendance:", err);
    return res.status(500).json({ msg: err.message });
  }
};

export const markBulkAttendance = async (req, res) => {
  console.log("🔥 markBulkAttendance HIT");

  try {
    const { records, date } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ msg: "Attendance records are required" });
    }

    const allowedStatuses = ["present", "absent", "leave", "late"];

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const bulkOps = records
      .map(({ userId, status, note }) => {
        if (!userId || !allowedStatuses.includes(status?.toLowerCase()))
          return null;

        return {
          updateOne: {
            filter: { user: userId, date: attendanceDate },
            update: {
              $set: {
                status: status.toLowerCase(),
                note,
                markedBy: req.user._id,
                date: attendanceDate,
              },
            },
            upsert: true,
          },
        };
      })
      .filter(Boolean);

    if (!bulkOps.length) {
      return res.status(400).json({ msg: "No valid attendance records" });
    }

    await AttendanceModel.bulkWrite(bulkOps);

    return res.status(200).json({
      msg: "Attendance marked successfully",
      total: bulkOps.length,
    });
  } catch (error) {
    console.error("❌ BULK ATTENDANCE ERROR:", error);
    return res.status(500).json({ msg: error.message });
  }
};
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const user = req.user; // from authMiddleware

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required (YYYY-MM-DD)",
      });
    }

    // Normalize date (00:00 to 23:59)
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    let userFilter = {};

    // 🔐 ROLE-BASED ACCESS
    if (user.role === "manager") {
      // manager → only their department employees
      const users = await UserModel.find({
        department: user.department,
        isDeleted: false,
        isActive: true,
      }).select("_id");

      userFilter.user = { $in: users.map((u) => u._id) };
    }

    // owner → sees all users (no filter)

    const attendance = await AttendanceModel.find({
      date: { $gte: start, $lte: end },
      ...userFilter,
    })
      .populate({
        path: "user",
        select: "username email department",
        populate: {
          path: "department",
          select: "name",
        },
      })
      .populate("markedBy", "username role")
      .sort({ "user.username": 1 });

    return res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    console.error("❌ getAttendanceByDate:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
