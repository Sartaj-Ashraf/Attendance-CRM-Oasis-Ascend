import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../axios/axios.js";

const EditEmployee = ({ user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    department: "",
    payment: "paid",
  });

  /* ================= FETCH DEPARTMENTS ================= */
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data || []);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  /* ================= PREFILL FORM ================= */
  useEffect(() => {
    if (user) {
      setForm({
        department: user.department?._id || "",
        payment: user.payment || "paid",
      });
    }
  }, [user]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/owner/updateUser/${user._id}`, {
        department: form.department,
        payment: form.payment,
      });

      toast.success("Employee updated successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Employee</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DEPARTMENT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg bg-white"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* PAYMENT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg bg-white"
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
