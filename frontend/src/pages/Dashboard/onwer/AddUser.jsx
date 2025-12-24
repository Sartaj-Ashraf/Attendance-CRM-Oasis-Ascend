import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../axios/axios";
import toast from "react-hot-toast";
const AddUser = ({ onClose }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    payment: "paid",
    role: "employee",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.phone) {
      toast.error("All fields are required");
      return;
    }
    const toastId = toast.loading("Creating user...");
    console.log(form);
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/owner/create", form);
      toast.success("User created successfully ", {
        id: toastId,
      });
      setTimeout(() => {
        navigate("/admin/users");
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create user", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New User</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              type="text"
              placeholder="Umaid Hamid"
              className="mt-1 w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="umaid@gmail.com"
              className="mt-1 w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="91XXXXXXXXXX"
              className="mt-1 w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment
            </label>
            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 bg-white"
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 bg-white"
            >
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
            >
              {loading ? "Creating..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
