import UserModel from "../Models/User.model.js";
import AttendanceModel from "../Models/Attendence.model.js";
import pagination from "../utils/pagination.js";

/* =========================================================
   MARK SINGLE ATTENDANCE (DATE AWARE + LOCK SAFE)
========================================================= */
export const markAttendance = async (req, res) => {
  try {
    const { userId, status, note, date } = req.body;

    if (!userId || !status) {
      return res.status(400).json({ msg: "userId and status are required" });
    }

    const allowedStatuses = ["present", "absent", "leave", "late", "holiday"];
    const normalizedStatus = status.toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ msg: "Invalid attendance status" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ✅ USE DATE FROM REQUEST (FIXED)
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    // 🔒 CHECK EXISTING & LOCK
    const existingAttendance = await AttendanceModel.findOne({
      user: userId,
      date: attendanceDate,
    });

    if (existingAttendance?.isLocked) {
      return res.status(403).json({
        msg: "Attendance is locked and cannot be modified",
      });
    }

    const isLocked = ["leave", "holiday"].includes(normalizedStatus);

    const attendance = await AttendanceModel.findOneAndUpdate(
      { user: userId, date: attendanceDate },
      {
        status: normalizedStatus,
        note,
        markedBy: req.user._id,
        date: attendanceDate,
        isLocked,
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

/* =========================================================
   BULK ATTENDANCE (NO DUPLICATES + LOCK SAFE)
========================================================= */
export const markBulkAttendance = async (req, res) => {
  try {
    const { records, date } = req.body;

    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const bulkOps = [];

    for (const { userId, status, note } of records) {
      const existing = await AttendanceModel.findOne({
        user: userId,
        date: attendanceDate,
      });

      if (existing?.isLocked) continue;

      bulkOps.push({
        updateOne: {
          filter: { user: userId, date: attendanceDate },
          update: {
            $set: {
              status,
              note,
              markedBy: req.user._id,
              isLocked: ["leave", "holiday"].includes(status),
            },
          },
          upsert: true,
        },
      });
    }

    if (!bulkOps.length) {
      return res.status(200).json({
        msg: "No records updated (all locked or invalid)",
      });
    }

    await AttendanceModel.bulkWrite(bulkOps);

    res.status(200).json({
      msg: "Attendance saved successfully",
      total: bulkOps.length,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* =========================================================
   GET ATTENDANCE BY DATE (PAGINATED + ROLE SAFE)
========================================================= */
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date, page = 1, limit = 10 } = req.query;
    const user = req.user;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required (YYYY-MM-DD)",
      });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    let userFilter = {};

    // 🔐 MANAGER ACCESS
    if (user.role === "manager") {
      const users = await UserModel.find({
        department: user.department,
        isDeleted: false,
        isActive: true,
      }).select("_id");

      userFilter.user = { $in: users.map((u) => u._id) };
    }

    const result = await pagination({
      model: AttendanceModel,
      query: {
        date: { $gte: start, $lte: end },
        ...userFilter,
      },
      sort: { createdAt: 1 },
      page: Number(page),
      limit: Number(limit),
      populate: [
        {
          path: "user",
          select: "username email department",
          populate: {
            path: "department",
            select: "name",
          },
        },
        {
          path: "markedBy",
          select: "username role",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: result.data.length,
      meta: result.meta,
      data: result.data,
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
