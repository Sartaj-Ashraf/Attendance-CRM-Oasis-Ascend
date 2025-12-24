import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios";
import UserRow from "../../../components/admin/Userdetail";
import ConfirmModal from "../../../components/confrim/ConfirmModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    try {
      const response = await api.get("/owner/getAllUsers");
      setUsers(response.data.data || response.data);
    } catch (e) {
      toast.error("Failed to fetch users");
    }
  };

  // OPEN CONFIRM MODAL
  const openConfirm = (type, user) => {
    setActionType(type);
    setSelectedUser(user);
    setModalOpen(true);
  };


  const handleConfirm = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);

      if (actionType === "delete") {
        await api.post(`/owner/deleteUser/${selectedUser._id}`);

        setUsers((prev) =>
          prev.filter((u) => u._id !== selectedUser._id)
        );

        toast.success("User deleted");
      }

      if (actionType === "block") {
        await api.patch(`owner/disableaccount/${selectedUser._id}`);

        setUsers((prev) =>
          prev.map((u) =>
            u._id !== selectedUser._id
              ? { ...u, isActive: false }
              : u
          )
        );

        toast.warning("User blocked");
      }
    } catch (e) {
      toast.error("Action failed");
    } finally {
      closeModal();
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setActionType(null);
    setLoading(false);
  };
console.log(users)
  return (
    <div className="p-6">

     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
  
  {/* LEFT: TITLE */}
  <h1 className="text-2xl font-bold text-gray-800">
    Users
  </h1>

  {/* RIGHT: CONTROLS */}
  <div className="flex flex-wrap items-center gap-3">
    
    {/* SEARCH */}
    <input
      type="text"
      placeholder="Search user..."
      className="px-4 py-2 border border-blue-300 rounded-lg focus:outline-none "
    />

     <select
      className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
    >
      <option value="all">All</option>
      <option value="unblocked">Unblocked</option>
      <option value="blocked">Blocked</option>
    </select>

    {/* ADD USER */}
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
    >
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
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  onEdit={() => toast.info("Edit coming soon")}
                  onBlock={() => openConfirm("block", user)}
                  onDelete={() => openConfirm("delete", user)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedUser && (
        <ConfirmModal
          title={
            actionType === "delete" ? "Delete User" : "Block User"
          }
          message={`Are you sure you want to ${
            actionType === "delete" ? "delete" : "block"
          } ${selectedUser.username}?`}
          onConfirm={handleConfirm}
          onCancel={closeModal}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Users;
