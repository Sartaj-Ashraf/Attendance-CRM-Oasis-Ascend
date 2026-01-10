import React from "react";
import { NavLink } from "react-router-dom";

const UserRow = ({ user, onEdit, onBlock, onDelete, onResendVerification }) => {
  return (
    <>
      {/* ================= DESKTOP / TABLET TABLE ROW ================= */}
      <tr
        className="
          hidden 
          md:table-row                         /* 🔹 changed: show table from tablet up */
          border-b border-gray-200              /* 🔹 changed: softer border */
          hover:bg-gray-50 transition-colors    /* 🔹 changed: subtle hover */
        "
      >
        {/* NAME */}
        <td className="px-4 lg:px-6 py-3 text-sm font-medium text-gray-800">
          <div className="flex items-center gap-2">
            <span className="truncate max-w-[140px] lg:max-w-none">
              {user.username}
            </span>

            {!user.isEmailVerified ? (
              <span className="text-[11px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                Unverified
              </span>
            ) : (
              <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </div>
        </td>

        {/* EMAIL */}
        <td className="px-4 lg:px-6 py-3 text-sm text-gray-600 truncate max-w-[200px]">
          {user.email}
        </td>

        {/* PHONE */}
        <td className="px-4 lg:px-6 py-3 text-sm text-gray-600">
          {user.phone || "-"}
        </td>

        {/* DEPARTMENT */}
        <td className="px-4 lg:px-6 py-3 text-sm text-gray-600">
          {user.department?.name || "-"}
        </td>

        {/* ACTIONS */}
        <td className="px-4 lg:px-6 py-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onEdit(user)}
              className="
                px-3 py-1.5 text-xs
                bg-blue-600 text-white rounded-md
                hover:bg-blue-700 transition
              "
            >
              Edit
            </button>

            {user.isActive && (
              <button
                onClick={() => onBlock(user)}
                className="
                  px-3 py-1.5 text-xs
                  bg-yellow-600 text-white rounded-md
                  hover:bg-yellow-700 transition
                "
              >
                Block
              </button>
            )}

            <button
              onClick={() => onDelete(user)}
              className="
                px-3 py-1.5 text-xs
                bg-red-700 text-white rounded-md
                hover:bg-red-800 transition
              "
            >
              Delete
            </button>

            {!user.isEmailVerified && (
              <button
                onClick={() => onResendVerification(user)}
                className="
                  px-3 py-1.5 text-xs
                  bg-orange-500 text-white rounded-md
                  hover:bg-orange-600 transition
                "
              >
                Resend
              </button>
            )}
          </div>
        </td>

        {/* VIEW */}
        <td className="px-4 lg:px-6 py-3 text-center">
          <NavLink
            to={`/owner/see-employee-attendance/${user._id}`}
            className="
              inline-block
              px-3 py-1.5 text-xs
              bg-blue-500 text-white rounded-md
              hover:bg-blue-600 transition
            "
          >
            View
          </NavLink>
        </td>
      </tr>

      {/* ================= MOBILE CARD ================= */}
      <div
        className="
          md:hidden                              /* 🔹 changed: hide card from tablet up */
          bg-white border border-gray-200
          rounded-lg p-4 mb-3
          shadow-sm
        "
      >
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm text-gray-800 truncate">
            {user.username}
          </p>

          {!user.isEmailVerified ? (
            <span className="text-[11px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
              Unverified
            </span>
          ) : (
            <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              Verified
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 break-all mt-1">
          {user.email}
        </p>

        <div className="text-xs mt-2 space-y-1">
          <p>
            <span className="text-gray-400">Phone:</span>{" "}
            {user.phone || "-"}
          </p>
          <p>
            <span className="text-gray-400">Department:</span>{" "}
            {user.department?.name || "-"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => onEdit(user)}
            className="
              px-3 py-2 text-xs
              border rounded-md
              hover:bg-gray-50
            "
          >
            Edit
          </button>

          {user.isActive && (
            <button
              onClick={() => onBlock(user)}
              className="
                px-3 py-2 text-xs
                border rounded-md
                hover:bg-gray-50
              "
            >
              Block
            </button>
          )}

          <button
            onClick={() => onDelete(user)}
            className="
              px-3 py-2 text-xs
              border rounded-md text-red-600
              hover:bg-red-50
            "
          >
            Delete
          </button>

          {!user.isEmailVerified && (
            <button
              onClick={() => onResendVerification(user)}
              className="
                px-3 py-2 text-xs
                border rounded-md text-orange-600
                hover:bg-orange-50
              "
            >
              Resend
            </button>
          )}
        </div>

        <NavLink
          to={`/owner/see-employee-attendance/${user._id}`}
          className="
            mt-3 block text-center
            bg-blue-600 text-white
            py-2 rounded-md text-sm
            hover:bg-blue-700 transition
          "
        >
          View User
        </NavLink>
      </div>
    </>
  );
};

export default UserRow;
