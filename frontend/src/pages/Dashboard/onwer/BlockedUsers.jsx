import React, { useEffect, useState } from "react";
import api from "../../../axios/axios";
import toast from "react-hot-toast";

const BlockedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState(null);

  // Fetch blocked users
  const fetchBlockedUsers = async () => {
    try {
      const res = await api.get("/owner/getBlockedUsers"); // backend route
      setUsers(res.data.data || res.data);
    } catch (err) {
      toast.error("Failed to load blocked users");
    } finally {
      setLoading(false);
    }
  };

  // Unblock a user
  const handleUnblock = async (userId) => {
    const confirm = window.confirm(
      "Are you sure you want to unblock this user?"
    );
    if (!confirm) return;

    try {
      setUnblockingId(userId);
      await api.put(`/owner/unblockUser/${userId}`); // backend route to unblock
      toast.success("User unblocked successfully");
      fetchBlockedUsers(); // refresh list
    } catch (err) {
      toast.error("Failed to unblock user");
    } finally {
      setUnblockingId(null);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Blocked Users</h1>
        <p className="text-gray-500">View and manage all blocked users</p>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Loading blocked users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No blocked users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.department?.name || "Not Assigned"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                      Blocked
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleUnblock(user._id)}
                      disabled={unblockingId === user._id}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {unblockingId === user._id ? "Unblocking..." : "Unblock"}
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

export default BlockedUsers;
