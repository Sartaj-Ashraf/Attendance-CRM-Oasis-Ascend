import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios";

import UserRow from "../../../components/admin/Userdetail";
import ConfirmModal from "../../../components/confrim/ConfirmModal";
import AddUser from "./AddUser";
import SearchFilter from "../../../components/filters/SearchFilter";
import EditEmployee from "../../../components/EditEmployee";

const Users = () => {
  /* ================= STATE ================= */
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [confirmUser, setConfirmUser] = useState(null);
  const [confirmType, setConfirmType] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [verification, setVerification] = useState("all");

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
      setDepartments(res.data.data || []);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  /* ================= RESET PAGE ON FILTER ================= */
  useEffect(() => {
    setPage(1);
  }, [search, department, verification]);

  /* ================= FETCH USERS ================= */
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
      toast.error("Failed to fetch users");
    }
  };

  /* ================= CONFIRM ================= */
  const openConfirm = (type, user) => {
    setConfirmType(type);
    setConfirmUser(user);
  };

  const handleConfirm = async () => {
    if (!confirmUser) return;

    try {
      setLoading(true);

      if (confirmType === "resend") {
        await api.post(`/auth/resend-confirmation/${confirmUser._id}`);
        toast.success("Set password email sent");
      }

      if (confirmType === "delete") {
        await api.post(`/owner/deleteUser/${confirmUser._id}`);
        toast.success("User deleted");
      }

      if (confirmType === "block") {
        await api.patch(`/owner/disableaccount/${confirmUser._id}`);
        toast.warning("User blocked");
      }

      fetchUsers();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setLoading(false);
      setConfirmUser(null);
      setConfirmType(null);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Employees
          </h1>

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
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block bg-white shadow-md rounded-xl overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Action</th>
              <th className="px-6 py-3 text-left">View</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  onEdit={(u) => {
                    setEditUser(u);
                    setShowEditUser(true);
                  }}
                  onDelete={(u) => openConfirm("delete", u)}
                  onBlock={(u) => openConfirm("block", u)}
                  onResendVerification={(u) => openConfirm("resend", u)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="sm:hidden space-y-3">
        {users.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <p className="font-medium text-gray-800">{user.username}</p>
              <p className="text-xs text-gray-500 break-all">{user.email}</p>

              <div className="mt-2 text-sm">
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {user.phone || "—"}
                </p>
                <p>
                  <span className="text-gray-500">Department:</span>{" "}
                  {user.department?.name || "—"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => {
                    setEditUser(user);
                    setShowEditUser(true);
                  }}
                  className="px-3 py-1 border rounded text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => openConfirm("resend", user)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  Resend
                </button>

                <button
                  onClick={() => openConfirm("block", user)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  Block
                </button>

                <button
                  onClick={() => openConfirm("delete", user)}
                  className="px-3 py-1 border rounded text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <span className="text-sm">
          Page <b>{page}</b> of <b>{totalPages}</b>
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-1.5 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-1.5 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirmUser && (
        <ConfirmModal
          title="Confirm Action"
          message={`Are you sure you want to ${confirmType} ${confirmUser.email}?`}
          loading={loading}
          onCancel={() => setConfirmUser(null)}
          onConfirm={handleConfirm}
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
              onClose={() => {
                setShowAddUser(false);
                fetchUsers();
              }}
            />
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditUser && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <EditEmployee
            user={editUser}
            onClose={() => {
              setShowEditUser(false);
              setEditUser(null);
            }}
            onSuccess={() => {
              setShowEditUser(false);
              setEditUser(null);
              fetchUsers();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Users;
