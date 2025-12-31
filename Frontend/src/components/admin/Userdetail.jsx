import React, { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmModal from "../confrim/ConfirmModal.jsx";
import { NavLink } from "react-router-dom";
const UserRow = ({ user, onEdit, onBlock, onDelete, onResendVerification }) => {
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResend = async () => {
    if (sending) return;

    setSending(true);
    const toastId = toast.loading("Sending verification email...");

    try {
      await onResendVerification(user); // ✅ delegate to parent
      toast.success("Verification email sent", { id: toastId });
      setShowConfirm(false);
    } catch (error) {
      toast.error("Failed to send email", { id: toastId });
    } finally {
      setSending(false);
    }
  };

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50 transition">
      {/* NAME */}
      <td className="px-6 py-4 font-medium text-gray-800">
        {user.username}
        {!user.isEmailVerified ? (
          <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
            Unverified
          </span>
        ) : (
          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            Verified
          </span>
        )}
      </td>

      {/* EMAIL */}
      <td className="px-6 py-4 text-gray-600">{user.email}</td>

      {/* PHONE */}
      <td className="px-6 py-4 text-gray-600">{user.phone || "-"}</td>

      {/* DEPARTMENT */}
      <td className="px-6 py-4 text-gray-600">
        {user.department?.name || "-"}
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-4">
        <div className="flex gap-2 bg-gray-100 p-2 rounded-lg w-fit">
          <button
            onClick={() => onEdit?.(user)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Edit
          </button>

          {user.isActive && (
            <button
              onClick={() => onBlock(user)}
              className="px-3 py-1.5 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700"
            >
              Block
            </button>
          )}

          <button
            onClick={() => onDelete(user)}
            className="px-3 py-1.5 bg-red-700 text-white rounded-md text-sm hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </td>

      {/* VIEW / RESEND */}
      <td className="px-6 py-4 text-center">
        {user.isEmailVerified ? (
          <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
            <NavLink to={`/owner/see-employee-attendance/${user._id}`}>
              View User
            </NavLink>
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={sending}
            className="px-3 py-1.5 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 disabled:opacity-50"
          >
            Resend Email
          </button>
        )}
      </td>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <ConfirmModal
          title="Resend Verification Email"
          message={`Resend verification email to ${user.email}?`}
          onConfirm={handleResend}
          onCancel={() => setShowConfirm(false)}
          loading={sending}
        />
      )}
    </tr>
  );
};

export default UserRow;
