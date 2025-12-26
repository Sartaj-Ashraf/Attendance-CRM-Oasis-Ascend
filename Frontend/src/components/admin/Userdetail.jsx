import React from "react";

const UserRow = ({
  user,
  onEdit,
  onBlock,
  onDelete,
  onPromote, // 🔥 new
}) => {
  console.log(user)
  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50 transition">
      {/* Name */}
      <td className="px-6 py-4 font-medium text-gray-800">{user.username}</td>

      {/* Email */}
      <td className="px-6 py-4 text-gray-600">{user.email}</td>

      {/* Phone */}
      <td className="px-6 py-4 text-gray-600">{user.phone}</td>
      <td className="px-6 py-4 text-gray-600">{user?.department?.name}</td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg w-fit">
          {/* Edit */}
          <button
            onClick={() => onEdit(user)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Edit
          </button>

          {/* Block / Unblock */}
          <button
            onClick={() => onBlock(user)}
            className={`px-3 py-1.5 text-white rounded-md text-sm ${
              user.isActive
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {user.isActive ? "Block" : "Unblock"}
          </button>

          {/* Promote (only if employee) */}
          {user.role === "employee" && onPromote && (
            <button
              onClick={() => onPromote(user)}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
            >
              Promote
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => onDelete(user)}
            className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </td>

      {/* View */}
      <td className="px-6 py-4 text-center">
        <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
          View User
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
