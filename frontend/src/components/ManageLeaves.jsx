import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Building2,
  FileText,
  Loader2,
  CalendarDays,
  Inbox,
} from "lucide-react";
// import api from "../../../axios/axios";
import api from "../axios/axios.js";

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const TEMP_LEAVES = [
    {
      _id: "temp1",
      user: {
        username: "Umaid Hamid",
        department: { name: "Engineering" },
      },
      type: "vacation",
      days: 3,
      reason: "Personal vacation",
      status: "pending",
      isPaid: null,
    },
    {
      _id: "temp2",
      user: {
        username: "Ayesha Khan",
        department: { name: "HR" },
      },
      type: "sick",
      days: 2,
      reason: "Medical rest",
      status: "approved",
      isPaid: true,
    },
    {
      _id: "temp3",
      user: {
        username: "Rohan Sharma",
        department: { name: "Marketing" },
      },
      type: "personal",
      days: 1,
      reason: "Personal work",
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
        setLeaves(TEMP_LEAVES); // fallback
      }
    } catch {
      toast.error("Using demo data");
      setLeaves(TEMP_LEAVES); // fallback
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

  const getTypeIcon = (type) => {
    if (type === "vacation") return <Calendar className="w-4 h-4" />;
    if (type === "sick") return <FileText className="w-4 h-4" />;
    return <CalendarDays className="w-4 h-4" />;
  };

  const getStatusBadge = (status, isPaid) => {
    if (status === "approved") {
      return (
        <div className="flex flex-col gap-1">
          <span className="status-badge status-approved">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
          <span className="text-xs text-muted-foreground">
            {isPaid ? "Paid Leave" : "Unpaid Leave"}
          </span>
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <span className="status-badge status-rejected">
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </span>
      );
    }

    return (
      <span className="status-badge status-pending">
        <Clock className="w-3.5 h-3.5" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pendingCount = leaves.filter((l) => l.status === "pending").length;
  const approvedCount = leaves.filter((l) => l.status === "approved").length;
  const rejectedCount = leaves.filter((l) => l.status === "rejected").length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leave Management</h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <Clock /> {pendingCount} Pending
        </div>
        <div className="stat-card">
          <CheckCircle2 /> {approvedCount} Approved
        </div>
        <div className="stat-card">
          <XCircle /> {rejectedCount} Rejected
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Employee</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Days</th>
              <th className="px-6 py-3 text-left">Reason</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-300">
                  <Inbox className="mx-auto mb-2" />
                  No leave requests
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id} className="border-t border-gray-300">
                  <td className="px-6 py-4">{leave.user?.username}</td>
                  <td className="px-6 py-4">
                    {leave.user?.department?.name || "—"}
                  </td>
                  <td className="px-6 py-4 flex gap-2 items-center capitalize">
                    {getTypeIcon(leave.type)} {leave.type}
                  </td>
                  <td className="px-6 py-4">{leave.days}</td>
                  <td className="px-6 py-4">{leave.reason}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(leave.status, leave.isPaid)}
                  </td>
                  <td className="px-6 py-4">
                    {leave.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          disabled={actionLoading === leave._id}
                          onClick={() => approveLeave(leave._id, true)}
                        >
                          Paid
                        </button>
                        <button
                          disabled={actionLoading === leave._id}
                          onClick={() => approveLeave(leave._id, false)}
                        >
                          Unpaid
                        </button>
                        <button
                          disabled={actionLoading === leave._id}
                          onClick={() => rejectLeave(leave._id)}
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
