import SearchFilter from "../../../components/filters/SearchFilter";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios";

import AddUser from "../onwer/AddUser";
// import SearchFilter from "@/components/common/SearchFilter";
// import ConfirmModal from "@/components/common/ConfirmModal";
import ConfirmModel from "../../../components/confrim/ConfirmModal";

const ManagerEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  // 🔍 filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ❗ confirm modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // 🔹 Fetch logged-in manager
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
      } catch {
        toast.error("Failed to load user info");
      }
    };

    fetchAuthUser();
  }, []);

  // 🔹 Fetch employees
  useEffect(() => {
    if (departmentId) fetchEmployees(departmentId);
  }, [departmentId]);

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

  // 🔍 filter logic
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.username?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        !statusFilter ||
        (statusFilter === "active" && emp.isActive) ||
        (statusFilter === "blocked" && !emp.isActive);

      return matchSearch && matchStatus;
    });
  }, [employees, search, statusFilter]);

  // ❗ open confirm modal
  const handleOpenConfirm = (employee) => {
    setSelectedEmployee(employee);
    setShowConfirm(true);
  };

  // ❗ confirm action (example: block user)
  const handleConfirmAction = async () => {
    try {
      await api.patch(`/manager/block-user/${selectedEmployee._id}`);
      toast.success("Employee updated");

      fetchEmployees(departmentId);
    } catch {
      toast.error("Action failed");
    } finally {
      setShowConfirm(false);
      setSelectedEmployee(null);
    }
  };

  return (
    <div className="p-6">
      {showAddUser ? (
        <AddUser
          departmentId={departmentId}
          onClose={() => {
            setShowAddUser(false);
            fetchEmployees(departmentId);
          }}
        />
      ) : (
        <>
          {/* ===== HEADER ===== */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Team</h1>

            <SearchFilter
              searchValue={search}
              onSearchChange={setSearch}
              selectValue={statusFilter}
              onSelectChange={setStatusFilter}
              searchPlaceholder="Search employee..."
              debounceDelay={500}
              selectOptions={[
                { label: "Active", value: "active" },
                { label: "Blocked", value: "blocked" },
              ]}
            />

            <button
              onClick={() => setShowAddUser(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add User
            </button>
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
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium">{emp.username}</td>
                      <td className="px-6 py-4 text-gray-600">{emp.email}</td>
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
                        <button
                          onClick={() => handleOpenConfirm(emp)}
                          className="px-4 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                        >
                          Block
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

      {/* ===== CONFIRM MODAL ===== */}
      {showConfirm && (
        <ConfirmModal
          title="Confirm Action"
          message={`Are you sure you want to block ${selectedEmployee?.username}?`}
          onConfirm={handleConfirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default ManagerEmployees;
