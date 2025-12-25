import Department from "../models/department.model.js";

export const createDepartment = async (req, res) => {
  try {
    // ✅ SAFE destructuring
    const { name } = req.body || {};

    if (!name) {
      return res.status(400).json({
        message: "Department name is required",
      });
    }

    const existingDepartment = await Department.findOne({ name });

    if (existingDepartment) {
      return res.status(409).json({
        message: "Department already exists",
      });
    }

    const department = await Department.create({ name });

    return res.status(201).json({
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.error("Create Department Error:", error);
    return res.status(500).json({
      message: "Error creating department",
      error: error.message,
    });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });

    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching departments",
      error: error.message,
    });
  }
};
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting department",
      error: error.message,
    });
  }
};
