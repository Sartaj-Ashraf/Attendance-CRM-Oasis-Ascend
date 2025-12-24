// src/components/admin/UsersTable.jsx
import React from "react";

const UsersTable = ({ users, onEdit, onBlock, onDelete }) => {
  return (
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
              <tr
                key={user.id}
                className="border-b border-gray-300 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">{user.phone}</td>

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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;



