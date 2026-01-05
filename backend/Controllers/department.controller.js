import Department from "../models/department.model.js";
import mongoose from "mongoose";

/* ================= CREATE DEPARTMENT ================= */
export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body || {};

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    const existingDepartment = await Department.findOne({ name });

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message: "Department already exists",
      });
    }

    const department = await Department.create({ name });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.error("Create Department Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating department",
      error: error.message,
    });
  }
};

/* ================= GET DEPARTMENTS WITH STATS ================= */
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.aggregate([
      /* ===== LOOKUP USERS (MEMBERS) ===== */
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "department",
          as: "users",
        },
      },

      /* ===== LOOKUP MANAGERS ===== */
      {
        $lookup: {
          from: "users",
          localField: "managers",
          foreignField: "_id",
          as: "managers",
        },
      },

      /* ===== FORMAT DATA ===== */
      {
        $project: {
          name: 1,
          createdAt: 1,

          membersCount: {
            $size: {
              $filter: {
                input: "$users",
                as: "user",
                cond: {
                  $and: [
                    { $eq: ["$$user.role", "employee"] },
                    { $eq: ["$$user.isDeleted", false] },
                    { $eq: ["$$user.isActive", true] },
                  ],
                },
              },
            },
          },

          managers: {
            $map: {
              input: "$managers",
              as: "manager",
              in: {
                _id: "$$manager._id",
                name: "$$manager.username",
                email: "$$manager.email",
              },
            },
          },
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Get Departments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching departments",
      error: error.message,
    });
  }
};

/* ================= DELETE DEPARTMENT ================= */
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // ❌ Prevent delete if members exist
    if (department.members > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete department with active members",
      });
    }

    await department.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Delete Department Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting department",
      error: error.message,
    });
  }
};
