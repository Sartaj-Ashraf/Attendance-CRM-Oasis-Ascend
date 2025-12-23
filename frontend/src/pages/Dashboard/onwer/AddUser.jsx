import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../axios/axios";

const AddUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "employee",
    number: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email) {
      setError("Username and Email are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.post("/admin/users", form);

      // ✅ Success → redirect
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Failed to create user");
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
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              type="text"
              placeholder="John Doe"
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="john@example.com"
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              name="number"
              value={form.number}
              onChange={handleChange}
              type="number"
              placeholder="91xxxxxx"
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
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
              {/* <option value="admin">Admin</option> */}
            </select>
          </div>

          {/* Active */}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
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
