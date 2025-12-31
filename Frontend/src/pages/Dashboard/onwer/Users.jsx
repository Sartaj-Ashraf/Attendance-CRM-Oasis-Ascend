import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios";

import UserRow from "../../../components/admin/Userdetail";
import ConfirmModal from "../../../components/confrim/ConfirmModal";
import AddUser from "./AddUser";
import SearchFilter from "../../../components/filters/SearchFilter";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  // modals
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  // filters (backend driven)
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [verification, setVerification] = useState("all");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 30;

  /* ================= FETCH DEPARTMENTS ================= */
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data || []);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  /* ================= RESET PAGE WHEN FILTER CHANGES ================= */
  useEffect(() => {
    setPage(1);
  }, [search, department, verification]);

  /* ================= FETCH USERS (BACKEND FILTERING) ================= */
  useEffect(() => {
    fetchUsers();
  }, [page, search, department, verification]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/owner/getAllEmployee", {
        params: {
          page,
          limit,
          search: search || undefined,
          department: department || undefined,
          verification: verification !== "all" ? verification : undefined,
        },
      });

      setUsers(res.data.data || []);
      setTotalPages(res.data.meta?.totalPages || 1);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Failed to fetch users");
    }
  };

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
        toast.success("User deleted");
      }

      if (actionType === "block") {
        await api.patch(`/owner/disableaccount/${selectedUser._id}`);
        toast.warning("User blocked");
      }

      if (actionType === "promote") {
        await api.patch(`/owner/assign-role/${selectedUser._id}`, {
          role: "manager",
        });
        toast.success("User promoted to Manager");
      }

      fetchUsers();
    } catch {
      toast.error("Action failed");
    } finally {
      closeModal();
    }
  };

  /* ================= RESEND VERIFICATION ================= */
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
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-800">Employees</h1>

          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            selectValue={department}
            onSelectChange={setDepartment}
            selectOptions={departments}
            optionLabel="name"
            optionValue="_id"
            verificationValue={verification}
            onVerificationChange={setVerification}
            searchPlaceholder="Search name or email..."
            debounceDelay={500}
          />
        </div>

        <button
          onClick={() => setShowAddUser(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Employee
        </button>
      </div>

      {/* TABLE */}
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

        {/* PAGINATION */}
        <div className="flex items-center justify-between py-4 px-6 border-t">
          <span className="text-sm">
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
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

      {/* ADD USER MODAL */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowAddUser(false)}
              className="absolute top-3 right-3"
            >
              ✕
            </button>

            <AddUser
              departments={departments}
              onClose={() => setShowAddUser(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
