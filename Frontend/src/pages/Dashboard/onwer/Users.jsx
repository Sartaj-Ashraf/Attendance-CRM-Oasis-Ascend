// src/pages/admin/Users.jsx
import React, { useState } from "react";
import UsersTable from "../../../components/admin/Userdetail";
import ConfirmModal from "../../../components/confrim/ConfirmModal";
import { toast } from "sonner";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "9876543210" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "9876543211" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);

  // OPEN CONFIRM MODAL
  const openConfirm = (type, user) => {
    setActionType(type); // "delete" or "block"
    setSelectedUser(user);
    setModalOpen(true);
  };

  // CONFIRM MODAL ACTION
  const handleConfirm = () => {
    if (actionType === "delete") {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      toast.success(`${selectedUser.name} deleted successfully`);
    }

    if (actionType === "block") {
      toast.warning(`${selectedUser.name} blocked`);
    }

    setModalOpen(false);
    setSelectedUser(null);
    setActionType(null);
  };

  // CANCEL MODAL
  const handleCancel = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setActionType(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>

      <UsersTable
        users={users}
        onEdit={(user) => toast.success(`Edit ${user.name}`)}
        onBlock={(user) => openConfirm("block", user)}
        onDelete={(user) => openConfirm("delete", user)}
      />

      {modalOpen && selectedUser && (
        <ConfirmModal
          title={actionType === "delete" ? "Delete User" : "Block User"}
          message={`Are you sure you want to ${
            actionType === "delete" ? "delete" : "block"
          } ${selectedUser.name}?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Users;
