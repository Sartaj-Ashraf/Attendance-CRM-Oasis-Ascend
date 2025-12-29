import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../axios/axios";

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  /* ================= FETCH LEAVES ================= */
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leave/all");
      setLeaves(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ================= ACTIONS ================= */
  const updateStatus = async (leaveId, action) => {
    try {
      setActionLoading(leaveId);

      await api.patch(`/leave/${leaveId}/${action}`);

      toast.success(`Leave ${action}ed successfully`);
      fetchLeaves();
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <p className="p-6">Loading leave requests...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leave Requests</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Employee</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Days</th>
              <th className="px-6 py-3 text-left">Reason</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-6 text-center text-gray-500"
                >
                  No leave requests found
                </td>
              </tr>
            )}

            {leaves.map((leave) => (
              <tr
                key={leave._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium">
                  {leave.user?.username}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {leave.user?.department?.name || "-"}
                </td>

                <td className="px-6 py-4 capitalize">
                  {leave.type}
                </td>

                <td className="px-6 py-4">{leave.days}</td>

                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                  {leave.reason}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        leave.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : leave.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {leave.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {leave.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        disabled={actionLoading === leave._id}
                        onClick={() =>
                          updateStatus(leave._id, "approve")
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs disabled:opacity-60"
                      >
                        Approve
                      </button>

                      <button
                        disabled={actionLoading === leave._id}
                        onClick={() =>
                          updateStatus(leave._id, "reject")
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLeaves;
