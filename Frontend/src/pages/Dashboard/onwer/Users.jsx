import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios";

import UserRow from "../../../components/admin/Userdetail";
import ConfirmModal from "../../../components/confrim/ConfirmModal";
import AddUser from "./AddUser";
import SearchFilter from "../../../components/filters/SearchFilter";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/owner/getAllEmployee");
      setUsers(res.data.employees || []);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  /* ================= DEPARTMENT OPTIONS ================= */
  const departmentOptions = useMemo(() => {
    const map = new Map();

    users.forEach((u) => {
      if (u.department?._id) {
        map.set(u.department._id, u.department);
      }
    });

    return Array.from(map.values());
  }, [users]);

  /* ================= FILTER USERS ================= */
  const visibleUsers = useMemo(() => {
    return users.filter((user) => {
      if (!user.isActive) return false;

      const matchSearch =
        user.username?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchDepartment =
        !department || user?.department?.name === department;

      return matchSearch && matchDepartment;
    });
  }, [users, search, department]);

  /* ================= CONFIRM MODAL ================= */
  const openConfirm = (type, user) => {
    setActionType(type);
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setActionType(null);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);

      if (actionType === "delete") {
        await api.post(`/owner/deleteUser/${selectedUser._id}`);
        setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
        toast.success("User deleted");
      }

      if (actionType === "block") {
        await api.patch(`/owner/disableaccount/${selectedUser._id}`);
        setUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUser._id ? { ...u, isActive: false } : u
          )
        );
        toast.warning("User blocked");
      }

      if (actionType === "promote") {
        await api.patch(`/owner/assign-role/${selectedUser._id}`, {
          role: "manager",
        });

        setUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUser._id ? { ...u, role: "manager" } : u
          )
        );

        toast.success("User promoted to Manager");
      }
    } catch {
      toast.error("Action failed");
    } finally {
      closeModal();
    }
  };

  /* ================= RESEND EMAIL ================= */
  const resendVerification = async (user) => {
    try {
      await api.post(`/owner/resend-verification/${user._id}`);
      toast.success(`Verification email sent to ${user.email}`);
    } catch {
      toast.error("Failed to resend verification email");
    }
  };

  return (
    <div className="p-6 relative">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Employees</h1>

          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            selectValue={department}
            onSelectChange={setDepartment}
            selectOptions={departmentOptions}
            searchPlaceholder="Search name or email..."
            debounceDelay={500}
          />
        </div>

        <button
          onClick={() => setShowAddUser(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add User
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">View</th>
            </tr>
          </thead>

          <tbody>
            {visibleUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No active users found
                </td>
              </tr>
            ) : (
              visibleUsers.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  onDelete={() => openConfirm("delete", user)}
                  onBlock={() => openConfirm("block", user)}
                  onPromote={
                    user.role === "employee"
                      ? () => openConfirm("promote", user)
                      : null
                  }
                  onResendVerification={() => resendVerification(user)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== CONFIRM MODAL ===== */}
      {modalOpen && selectedUser && (
        <ConfirmModal
          title={
            actionType === "delete"
              ? "Delete User"
              : actionType === "block"
              ? "Block User"
              : "Promote User"
          }
          message={`Are you sure you want to ${actionType} ${selectedUser.username}?`}
          onConfirm={handleConfirm}
          onCancel={closeModal}
          loading={loading}
        />
      )}

      {/* ===== ADD USER MODAL ===== */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowAddUser(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <AddUser
              departments={departmentOptions}
              onClose={() => setShowAddUser(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
