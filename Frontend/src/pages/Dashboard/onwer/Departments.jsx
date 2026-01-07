import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../axios/axios.js";
import ConfirmDeleteModal from "../../../components/delete/ConfirmDelete.jsx";

// ⬇️ replace with your real auth context if available
const userRole = "owner"; // example: owner / manager / employee

const Departments = () => {
  const [departments, setDepartments] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");

  const inputRef = useRef(null);

  /* ================= FETCH DEPARTMENTS ================= */
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch departments");
    }
  };

  useEffect(() => {
    if (userRole) fetchDepartments();
  }, []);

  /* ================= CREATE DEPARTMENT ================= */
  const handleCreateDepartment = async () => {
    if (!newDepartmentName.trim()) {
      toast.error("Enter department name");
      return;
    }

    try {
      const res = await api.post("/department/create", {
        name: newDepartmentName,
      });

      toast.success(res.data?.message || "Department created");

      setNewDepartmentName("");
      setShowCreateModal(false);
      fetchDepartments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create department"
      );
    }
  };

  /* ================= DELETE ================= */
  const openDeleteModal = (dept) => {
    setDepartmentToDelete(dept);
    setDeleteConfirmName("");
    setShowDeleteModal(true);
  };

  const handleDeleteDepartment = async () => {
    if (deleteConfirmName !== departmentToDelete.name) {
      toast.error("Department name does not match");
      return;
    }

    try {
      await api.delete(`/department/delete/${departmentToDelete._id}`);
      toast.success("Department deleted");
      setShowDeleteModal(false);
      setDepartmentToDelete(null);
      fetchDepartments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete department"
      );
    }
  };

  /* ================= AUTO FOCUS ================= */
  useEffect(() => {
    if (showCreateModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCreateModal]);

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>

        {userRole === "owner" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + Create Department
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Managers</th>
              <th className="px-6 py-3">Employees</th>
              {userRole === "owner" && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td
                  colSpan={userRole === "owner" ? 4 : 3}
                  className="text-center py-6 text-gray-500"
                >
                  No departments found
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr
                  key={dept._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Department Name */}
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {dept.name}
                  </td>

                  {/* Managers */}
                  <td className="px-6 py-4 text-gray-600">
                    {dept.managers?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {dept.managers.map((mgr) => (
                          <span
                            key={mgr._id}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md"
                          >
                            {mgr.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* Employees Count */}
                  <td className="px-6 py-4 text-gray-700 font-semibold">
                    {dept.membersCount ?? 0}
                  </td>

                  {/* Actions */}
                  {userRole === "owner" && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDeleteModal(dept)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= CREATE MODAL ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Create Department</h2>

            <input
              ref={inputRef}
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="Department name"
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-green-500"
            />

            <div className="flex gap-3">
              <button
                onClick={handleCreateDepartment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Create
              </button>

              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        title="Delete Department"
        message={`Type "${departmentToDelete?.name}" to confirm deletion.`}
        confirmText="Delete"
        confirmValue={departmentToDelete?.name}
        inputValue={deleteConfirmName}
        onInputChange={setDeleteConfirmName}
        onConfirm={handleDeleteDepartment}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default Departments;
