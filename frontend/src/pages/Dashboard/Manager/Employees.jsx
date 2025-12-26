import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios";
import AddUser from "../onwer/AddUser"; // reuse same component

const ManagerEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  // 🔹 Fetch logged-in manager info
  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await api.get("/api/isAuth");
        const deptId = res.data.user?.department?._id;

        if (!deptId) {
          toast.error("Department not found for this manager");
          return;
        }

        setDepartmentId(deptId);
        fetchEmployees(deptId);
      } catch {
        toast.error("Failed to load user info");
      }
    };

    fetchAuthUser();
    fetchEmployees(deptId );
  }, []);

  // 🔹 Fetch employees by department
  const fetchEmployees = async (deptId) => {
    try {
      setLoading(true);
      const res = await api.get("/owner/getAllUsers", {
        params: { department: deptId },
      });
      setEmployees(res.data.data || []);
    } catch {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {showAddUser ? (
        <AddUser
          departmentId={departmentId}
          onClose={() => {
            setShowAddUser(false);
            fetchEmployees(departmentId); // refresh list
          }}
        />
      ) : (
        <>
          {/* ===== HEADER ===== */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              My Team
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search employee..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>

              {/* ✅ ADD USER BUTTON */}
              <button
                onClick={() => setShowAddUser(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add User
              </button>
            </div>
          </div>

          {/* ===== TABLE ===== */}
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
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      Loading employees...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {emp.username}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {emp.email}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {emp.phone || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${
                            emp.payment === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {emp.payment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerEmployees;
