
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios";
import {AuthContext} from "../../../ContextApi/isAuth";

const AddUser = ({ onClose, departmentId }) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext not found. Wrap app with AuthProvider.");
  }

  const { user } = useContext(AuthContext);

  const isManager = user?.role === "manager";

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    department: "",
  });

  console.log(user)

  /* ================= FETCH DEPARTMENTS (OWNER ONLY) ================= */
  useEffect(() => {
    if (!isManager) {
      fetchDepartments();
    }
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data?.data || []);
    } catch {
      toast.error("Failed to load departments");
    }
  };

  /* ================= FORCE MANAGER DEPARTMENT ================= */
  useEffect(() => {
    if (isManager && user?.department?._id) {
      setForm((prev) => ({
        ...prev,
        department: user.department._id,
      }));
    }
  }, [isManager, user]);

  /* ================= CHANGE HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email) {
      return toast.error("Username and email are required");
    }

    try {
      setLoading(true);

      const payload = {
        username: form.username,
        email: form.email,
        phone: form.phone,
        department: isManager
          ? user.department._id // 🔒 FORCE MANAGER DEPT
          : form.department,
      };

      await api.post("/owner/addUser", payload);
      toast.success("Employee added successfully");
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add employee"
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl">
      <h2 className="text-xl font-bold mb-6">Add New Employee</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* USERNAME */}
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-lg"
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-lg"
        />

        {/* PHONE */}
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg"
        />

        {/* ================= DEPARTMENT ================= */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Department
          </label>

          {isManager ? (
            /* 🔒 MANAGER → LOCKED */
            <input
              type="text"
              value={user?.department?.name || "You Can't Select the Department"}
              disabled
              className="w-full border px-4 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          ) : (
            /* 👑 OWNER → SELECT */
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
