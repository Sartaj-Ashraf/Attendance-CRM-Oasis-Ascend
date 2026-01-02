import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, Loader2, Inbox } from "lucide-react";
import api from "../axios/axios.js";

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedReason, setExpandedReason] = useState(null);

  /* ================= FETCH LEAVES ================= */
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leaves/all");
      setLeaves(res.data.data || []);
    } catch {
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ================= APPROVE ================= */
  const approveLeave = async (leaveId, isPaid) => {
    try {
      setActionLoading(leaveId);
      await api.patch(`/leaves/approve/${leaveId}`, { isPaid });

      setLeaves((prev) =>
        prev.map((l) =>
          l._id === leaveId ? { ...l, status: "approved", isPaid } : l
        )
      );

      toast.success(`Leave approved (${isPaid ? "Paid" : "Unpaid"})`);
    } catch {
      toast.error("Failed to approve leave");
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= REJECT ================= */
  const rejectLeave = async (leaveId) => {
    try {
      setActionLoading(leaveId);
      await api.patch(`/leaves/reject/${leaveId}`);

      setLeaves((prev) =>
        prev.map((l) =>
          l._id === leaveId ? { ...l, status: "rejected", isPaid: false } : l
        )
      );

      toast.success("Leave rejected");
    } catch {
      toast.error("Failed to reject leave");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status, isPaid) => {
    if (status === "approved") {
      return (
        <div>
          <span className="text-green-600 font-semibold">Approved</span>
          <div className="text-xs text-gray-500">
            {isPaid ? "Paid" : "Unpaid"}
          </div>
        </div>
      );
    }

    if (status === "rejected") {
      return <span className="text-red-600 font-semibold">Rejected</span>;
    }

    return <span className="text-yellow-600 font-semibold">Pending</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leave Management</h1>

      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Employee</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Days</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10">
                  <Inbox className="mx-auto" /> No leave requests
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id} className="border-t">
                  <td className="px-4 py-2">{leave.user?.username}</td>
                  <td className="px-4 py-2">{leave.user?.department?.name}</td>
                  <td className="px-4 py-2">{leave.type}</td>
                  <td className="px-4 py-2">{leave.days}</td>
                  <td className="px-4 py-2">
                    {expandedReason === leave._id
                      ? leave.reason
                      : leave.reason.slice(0, 40)}
                    {leave.reason.length > 40 && (
                      <button
                        className="text-blue-600 text-xs ml-2"
                        onClick={() =>
                          setExpandedReason(
                            expandedReason === leave._id ? null : leave._id
                          )
                        }
                      >
                        {expandedReason === leave._id ? "Less" : "More"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {getStatusBadge(leave.status, leave.isPaid)}
                  </td>
                  <td className="px-4 py-2">
                    {leave.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          disabled={actionLoading === leave._id}
                          onClick={() => approveLeave(leave._id, true)}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Paid
                        </button>
                        <button
                          disabled={actionLoading === leave._id}
                          onClick={() => approveLeave(leave._id, false)}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Unpaid
                        </button>
                        <button
                          disabled={actionLoading === leave._id}
                          onClick={() => rejectLeave(leave._id)}
                          className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLeaves;
