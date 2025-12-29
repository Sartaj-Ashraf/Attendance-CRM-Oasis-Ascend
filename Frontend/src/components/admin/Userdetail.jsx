import React from "react";
import api from "../../axios/axios.js";
import {toast} from "react-hot-toast"
const UserRow = ({
  user,
  onEdit,
  onBlock,
  onDelete,
  onPromote,
  onResendVerification,
}) => {
  
  const submitHandler = async () => {
    const toastId = toast.loading("Sending reset link to provided email...");

    try {
      const response = await api.post("user/resetpassword", {
        email: user.email,
      });

      toast.success(response.data.msg, { id: toastId });
    } catch (error) {
      const message = error.response?.data?.msg || "Something went wrong";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50 transition-colors duration-200">
      {/* Name */}
      <td className="px-6 py-4 font-medium text-gray-800">
        {user.username}
        {!user.isEmailVerified && (
          <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1.5 rounded-full">
            Unverified
          </span>
        )}
        {user.isEmailVerified && (
          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1.5 rounded-full">
            verified
          </span>
        )}
      </td>

      {/* Email */}
      <td className="px-6 py-4 text-gray-600">{user.email}</td>

      {/* Phone */}
      <td className="px-6 py-4 text-gray-600">{user.phone}</td>

      {/* Department */}
      <td className="px-6 py-4 text-gray-600">
        {user?.department?.name || "-"}
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg w-fit">
          {/* Edit */}
          <button
            onClick={() => onEdit?.(user)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>

          {/* Block (ONLY BLOCK) */}
          {user.isActive && (
            <button
              onClick={() => onBlock(user)}
              className="px-3 py-1.5 bg-yellow-700 text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
            >
              Block
            </button>
          )}

          {/* Promote
          {user.role === "employee" && onPromote && (
            <button
              onClick={() => onPromote(user)}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
            >
              Promote
            </button>
          )} */}

          {/* Delete */}
          <button
            onClick={() => onDelete(user)}
            className="px-3 py-1.5 bg-red-800 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>

      {/* VIEW / RESEND */}
      <td className="px-6 py-4 text-center">
        {user.isEmailVerified ? (
          <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors">
            View User
          </button>
        ) : (
          <button
            onClick={() => submitHandler()}
            className="px-3 py-1.5 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
          >
            Resend Confirmation
          </button>
        )}
      </td>
    </tr>
  );
};

export default UserRow;
