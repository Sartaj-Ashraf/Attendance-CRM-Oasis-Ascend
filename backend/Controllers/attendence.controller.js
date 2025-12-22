import UserModel from "../Models/User.model.js";
import AttendenceModel from "../Models/Attendence.model.js";
import StatusModel from "../Models/Status.model.js";

// here we get all status
export const getAllStatuses = async (req, res) => {
  const statuses = await StatusModel.find();
  res.status(200).json(statuses);
};
export const markAttendance = async (req, res) => {
  try {
    const { userId, statusId, note } = req.body;
    if (!userId || !statusId) {
      return res.status(400).json({ msg: "userId and statusId required" });
    }
    // check employee exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    // check status exists
    const status = await StatusModel.findById(statusId);
    if (!status) {
      return res.status(404).json({ msg: "Invalid status" });
    }
    // today date (00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendance = await AttendenceModel.findOneAndUpdate(
      { user: userId, date: today },
      {
        status: statusId,
        markedBy: req.user._id,
        note,
      },
      {
        upsert: true,
        new: true,
      }
    )
      .populate("user", "username email")
      .populate("status", "status code")
      .populate("markedBy", "username");
    res.status(200).json({
      msg: "Attendance saved",
      attendance,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
