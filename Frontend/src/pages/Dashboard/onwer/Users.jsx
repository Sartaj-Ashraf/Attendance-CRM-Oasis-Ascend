import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios";
import UserRow from "../../../components/admin/Userdetail";
import ConfirmModal from "../../../components/confrim/ConfirmModal";
import AddUser from "./AddUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adduser, setadduser] = useState(false);

  // 🔹 Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/owner/getAllEmployee");
      setUsers(response.data.employees || []);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  // 🔹 Open confirmation modal
  const openConfirm = (type, user) => {
    setActionType(type);
    setSelectedUser(user);
    setModalOpen(true);
  };

  // 🔹 Handle confirm action
  const handleConfirm = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);

      // 🗑 DELETE USER
      if (actionType === "delete") {
        await api.post(`/owner/deleteUser/${selectedUser._id}`);
        setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
        toast.success("User deleted");
      }

      // 🚫 BLOCK USER
      if (actionType === "block") {
        await api.patch(`/owner/disableaccount/${selectedUser._id}`);
        setUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUser._id ? { ...u, isActive: false } : u
          )
        );
        toast.warning("User blocked");
      }

      // ✅ UNBLOCK USER
      if (actionType === "unblock") {
        await api.put(`/owner/activateaccount/${selectedUser._id}`);
        setUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUser._id ? { ...u, isActive: true } : u
          )
        );
        toast.success("User unblocked");
      }

      // 🚀 PROMOTE USER
      if (actionType === "promote") {
        await api.patch(`/owner/promoteUser/${selectedUser._id}`);
        setUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUser._id ? { ...u, role: "manager" } : u
          )
        );
        toast.success(`${selectedUser.username} promoted to Manager`);
      }
    } catch {
      toast.error("Action failed");
    } finally {
      closeModal();
    }
  };

  // 🔹 Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setActionType(null);
    setLoading(false);
  };

  return (
    <div className="p-6">
      {adduser ? (
        <AddUser onClose={() => setadduser(false)} />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Users</h1>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setadduser(true)}
            >
              Add User
            </button>
          </div>

          {/* Table */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-700">
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      onEdit={() => toast.info("Edit coming soon")}
                      onDelete={() => openConfirm("delete", user)}
                      onBlock={() =>
                        openConfirm(user.isActive ? "block" : "unblock", user)
                      }
                      onPromote={
                        user.role === "employee"
                          ? () => openConfirm("promote", user)
                          : null
                      }
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Confirm Modal */}
          {modalOpen && selectedUser && (
            <ConfirmModal
              title={
                actionType === "delete"
                  ? "Delete User"
                  : actionType === "block"
                  ? "Block User"
                  : actionType === "unblock"
                  ? "Unblock User"
                  : "Promote User"
              }
              message={`Are you sure you want to ${
                actionType === "delete"
                  ? "delete"
                  : actionType === "block"
                  ? "block"
                  : actionType === "unblock"
                  ? "unblock"
                  : "promote"
              } ${selectedUser.username}?`}
              onConfirm={handleConfirm}
              onCancel={closeModal}
              loading={loading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Users;
