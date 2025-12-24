import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios.js";

const ManagerEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("owner/getAllUsers");
      setEmployees(res.data.data || res.data);
    } catch (e) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (emp) => {
    toast.info(`Edit ${emp.username} (coming soon)`);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* LEFT: TITLE */}
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>

        {/* RIGHT: CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search user..."
            className="px-4 py-2 border border-blue-300 rounded-lg focus:outline-none "
          />

          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option value="all">All</option>
            <option value="unblocked">Unblocked</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* ADD USER */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Add User
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Payment</th>

              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id} className="border-t">
                  <td className="px-6 py-4">{emp.username}</td>
                  <td className="px-6 py-4">{emp.email}</td>
                  <td className="px-6 py-4">{emp.phone || "-"}</td>
                  <td className="px-6 py-4">{emp.role || "-"}</td>
                  <td className="px-6 py-4">{emp.payment || "-"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerEmployees;
