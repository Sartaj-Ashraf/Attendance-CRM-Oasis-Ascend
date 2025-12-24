import React from "react";

const UserRow = ({ user, onEdit, onBlock, onDelete }) => {
  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50 transition">
      <td className="px-6 py-4 font-medium text-gray-800">
        {user.username}
      </td>

      <td className="px-6 py-4 text-gray-600">
        {user.email}
      </td>

      <td className="px-6 py-4 text-gray-600">
        {user.phone}
      </td>

      <td className="px-6 py-4">
        <div className="flex gap-2 bg-gray-100 p-2 rounded-lg w-fit">
          <button
            onClick={() => onEdit(user)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => onBlock(user)}
            className="px-3 py-1.5 bg-orange-500 text-white rounded-md text-sm"
          >
            Block
          </button>

          <button
            onClick={() => onDelete(user)}
            className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
