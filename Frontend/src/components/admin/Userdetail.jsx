import React from "react";
import { NavLink } from "react-router-dom";

const UserRow = ({ user, onEdit, onBlock, onDelete, onResendVerification }) => {
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
            onClick={() => onEdit(user)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"
          >
            Edit
          </button>

          {user.isActive && (
            <button
              onClick={() => onBlock(user)}
              className="px-3 py-1.5 bg-yellow-600 text-white rounded-md text-sm"
            >
              Block
            </button>
          )}

          <button
            onClick={() => onDelete(user)}
            className="px-3 py-1.5 bg-red-700 text-white rounded-md text-sm"
          >
            Delete
          </button>

          {!user.isEmailVerified && (
            <button
              onClick={() => onResendVerification(user)}
              className="px-3 py-1.5 bg-orange-500 text-white rounded-md text-sm"
            >
              Resend Email
            </button>
          )}
        </div>
      </td>

      {/* VIEW */}
      <td className="px-6 py-4 text-center">
        <NavLink
          to={`/owner/see-employee-attendance/${user._id}`}
          className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm"
        >
          View User
        </NavLink>
      </td>
    </tr>
  );
};

export default UserRow;
