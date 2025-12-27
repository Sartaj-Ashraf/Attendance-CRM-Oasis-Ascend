import React, { useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios";

const AddUser = ({ onClose, departments = [] }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    role: "employee",
    department: "",
    payment: "paid",
  });

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

      await api.post("/owner/createUser", form);

      toast.success("User created successfully");

      // ✅ RESET ALL INPUTS
      setForm({
        username: "",
        email: "",
        phone: "",
        role: "employee",
        department: "",
        payment: "paid",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">
        Add New User
      </h2>

      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        required
        disabled={loading}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        disabled={loading}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
        disabled={loading}
        className="w-full px-4 py-2 border rounded-lg"
      />

      {/* DEPARTMENT (FROM USERS DATA) */}
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

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        disabled={loading}
        className="w-full px-4 py-2 border rounded-lg bg-white"
      >
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
      </select>

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
          {loading ? "Saving..." : "Create User"}
        </button>
      </div>
    </form>
  );
};

export default AddUser;
