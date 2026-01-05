import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../axios/axios.js";
import ConfirmDeleteModal from "../../../components/delete/ConfirmDelete.jsx";

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
      setDepartments(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  /* ================= CREATE DEPARTMENT ================= */
  const handleCreateDepartment = async () => {
    if (!newDepartmentName.trim()) {
      toast.error("Please enter a department name");
      return;
    }

    try {
      await api.post("/department/create", {
        name: newDepartmentName,
      });

      toast.success("Department created successfully");
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
    try {
      await api.delete(`/department/delete/${departmentToDelete._id}`);

      toast.success("Department deleted successfully");
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Create Department
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Managers</th>
              <th className="px-6 py-3">Total Employees</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
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

                  {/* Members Count */}
                  <td className="px-6 py-4 text-gray-700 font-semibold">
                    {dept.membersCount ?? 0}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openDeleteModal(dept)}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Create New Department
            </h2>

            <input
              ref={inputRef}
              type="text"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="Department name"
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="flex gap-3">
              <button
                onClick={handleCreateDepartment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create
              </button>

              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
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
