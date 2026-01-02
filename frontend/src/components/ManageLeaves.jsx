import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, Loader2, Inbox } from "lucide-react";
import api from "../axios/axios.js";

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedReason, setExpandedReason] = useState(null);

  const TEMP_LEAVES = [
    {
      _id: "temp1",
      user: {
        username: "Umaid Hamid",
        department: { name: "Engineering" },
      },
      subject: "Vacation Leave",
      days: 3,
      reason:
        "I am planning a personal vacation with my family and will not be available.",
      status: "pending",
      isPaid: null,
    },
    {
      _id: "temp2",
      user: {
        username: "Ayesha Khan",
        department: { name: "HR" },
      },
      subject: "Sick Leave",
      days: 2,
      reason: "Doctor advised complete rest due to fever and weakness.",
      status: "approved",
      isPaid: true,
    },
    {
      _id: "temp3",
      user: {
        username: "Rohan Sharma",
        department: { name: "Marketing" },
      },
      subject: "Personal Work",
      days: 1,
      reason: "Need to attend an urgent personal matter at home.",
      status: "rejected",
      isPaid: false,
    },
  ];

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/owner/leaves");

      if (res.data?.data?.length) {
        setLeaves(res.data.data);
      } else {
        setLeaves(TEMP_LEAVES);
      }
    } catch {
      toast.error("Using demo data");
      setLeaves(TEMP_LEAVES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ================= ACTIONS ================= */
  const approveLeave = async (leaveId, isPaid) => {
    try {
      setActionLoading(leaveId);
      await api.patch(`/owner/leaves/${leaveId}/approve`, { isPaid });

      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === leaveId
            ? { ...leave, status: "approved", isPaid }
            : leave
        )
      );

      toast.success(`Leave approved (${isPaid ? "Paid" : "Unpaid"})`);
    } catch {
      toast.error("Failed to approve leave");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectLeave = async (leaveId) => {
    try {
      setActionLoading(leaveId);
      await api.patch(`/owner/leaves/${leaveId}/reject`);

      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === leaveId ? { ...leave, status: "rejected" } : leave
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
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
          <span className="text-xs text-gray-500">
            {isPaid ? "Paid Leave" : "Unpaid Leave"}
          </span>
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
        <Clock className="w-3.5 h-3.5" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const pendingCount = leaves.filter((l) => l.status === "pending").length;
  const approvedCount = leaves.filter((l) => l.status === "approved").length;
  const rejectedCount = leaves.filter((l) => l.status === "rejected").length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leave Management</h1>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 font-medium">
          <Clock /> {pendingCount} Pending
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 font-medium">
          <CheckCircle2 /> {approvedCount} Approved
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium">
          <XCircle /> {rejectedCount} Rejected
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-6 py-3 text-left">Employee</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Subject</th>
              <th className="px-6 py-3 text-left">Days</th>
              <th className="px-6 py-3 text-left">Reason</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-400">
                  <Inbox className="mx-auto mb-2" />
                  No leave requests
                </td>
              </tr>
            ) : (
              leaves.map((leave) => {
                const isExpanded = expandedReason === leave._id;
                const shortReason =
                  leave.reason?.length > 40
                    ? leave.reason.slice(0, 40) + "..."
                    : leave.reason;

                return (
                  <tr
                    key={leave._id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">{leave.user?.username}</td>
                    <td className="px-6 py-4">
                      {leave.user?.department?.name || "—"}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {leave.subject || "—"}
                    </td>
                    <td className="px-6 py-4">{leave.days}</td>

                    {/* Reason with See More */}
                    <td className="px-6 py-4 text-gray-600">
                      {isExpanded ? leave.reason : shortReason}
                      {leave.reason?.length > 40 && (
                        <button
                          onClick={() =>
                            setExpandedReason(isExpanded ? null : leave._id)
                          }
                          className="ml-2 text-blue-600 text-xs hover:underline"
                        >
                          {isExpanded ? "See less" : "See more"}
                        </button>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(leave.status, leave.isPaid)}
                    </td>

                    <td className="px-6 py-4">
                      {leave.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            disabled={actionLoading === leave._id}
                            onClick={() => approveLeave(leave._id, true)}
                            className="px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Paid
                          </button>
                          <button
                            disabled={actionLoading === leave._id}
                            onClick={() => approveLeave(leave._id, false)}
                            className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            Unpaid
                          </button>
                          <button
                            disabled={actionLoading === leave._id}
                            onClick={() => rejectLeave(leave._id)}
                            className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLeaves;
