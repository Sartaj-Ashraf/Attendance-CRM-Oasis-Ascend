import { useState, useEffect } from "react";
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
    department: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/department/get");
        setDepartments(res.data?.data || res.data || []);
      } catch (error) {
        toast.error("Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, phone, department } = form;
    if (!username || !email || !phone || !department) {
      toast.error("All fields are required");
      return;
    }

    const toastId = toast.loading("Creating user...");
    try {
      setLoading(true);

      await api.post("/owner/create", form);

      toast.success("User created successfully", { id: toastId });

      setForm({
        username: "",
        email: "",
        phone: "",
        payment: "paid",
        role: "employee",
        department: "",
      });

      setTimeout(() => navigate("/owner/users"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New User</h2>
      <p className="text-gray-500 mb-6">
        Fill in the details to create a new employee
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          autoComplete="off"
          required
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          autoComplete="email"
          required
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Phone */}
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          autoComplete="tel"
          required
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Department */}
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* Payment */}
        <select
          name="payment"
          value={form.payment}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        {/* Role (fixed) */}
        <input
          value="Employee"
          disabled
          className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
