import UserModel from "../Models/User.model.js";
import AttendenceModel from "../Models/Attendence.model.js";

// here we get all status

export const markAttendance = async (req, res) => {
  try {
    const { userId, status, note } = req.body;

    if (!userId || !status) {
      return res.status(400).json({ msg: "userId and status are required" });
    }

    // validate status enum
    const allowedStatuses = ["present", "absent", "leave", "late"];
    if (!allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ msg: "Invalid attendance status" });
    }

    // check user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // normalize today date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await AttendanceModel.findOneAndUpdate(
      { user: userId, date: today },
      {
        status: status.toLowerCase(),
        markedBy: req.user._id,
        note,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "username email")
      .populate("markedBy", "username");

    return res.status(200).json({
      msg: "Attendance saved successfully",
      attendance,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
export const markBulkAttendance = async (req, res) => {
  try {
    const { records, date } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ msg: "Attendance records are required" });
    }

    const allowedStatuses = ["present", "absent", "leave", "late"];

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const bulkOps = records.map(({ userId, status, note }) => {
      if (!userId || !allowedStatuses.includes(status?.toLowerCase())) return null;

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
    }).filter(Boolean);

    if (!bulkOps.length) {
      return res.status(400).json({ msg: "No valid attendance records" });
    }

    await AttendanceModel.bulkWrite(bulkOps);

    return res.status(200).json({
      msg: "Attendance marked successfully",
      total: bulkOps.length,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
