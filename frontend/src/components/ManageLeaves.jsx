import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Inbox } from "lucide-react";
import api from "../axios/axios.js";

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedReason, setExpandedReason] = useState(null);

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState(null);

  /* ================= FETCH LEAVES ================= */
  const fetchLeaves = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await api.get("/leaves/all", {
        params: { page: pageNumber, limit },
      });

      setLeaves(res.data.data || []);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves(1);
  }, []);

  /* ================= APPROVE ================= */
  const approveLeave = async (leaveId, isPaid, days) => {
    if (!days || days <= 0) {
      return toast.error("Days must be greater than 0");
    }

    const toastId = toast.loading("Approving leave...");
    try {
      setActionLoading(leaveId);

      await api.patch(`/leaves/approve/${leaveId}`, {
        isPaid,
        days,
      });

      setLeaves((prev) =>
        prev.map((l) =>
          l._id === leaveId
            ? { ...l, status: "approved", isPaid, days }
            : l
        )
      );

      toast.success("Leave approved successfully", { id: toastId });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to approve leave",
        { id: toastId }
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= REJECT ================= */
  const rejectLeave = async (leaveId) => {
    const toastId = toast.loading("Rejecting leave...");
    try {
      setActionLoading(leaveId);

      await api.patch(`/leaves/reject/${leaveId}`);

      setLeaves((prev) =>
        prev.map((l) =>
          l._id === leaveId
            ? { ...l, status: "rejected", isPaid: false }
            : l
        )
      );

      toast.success("Leave rejected", { id: toastId });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to reject leave",
        { id: toastId }
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= STATUS BADGE ================= */
  const getStatusBadge = (status, isPaid) => {
    if (status === "approved") {
      return (
        <div className="flex flex-col">
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            Approved
          </span>
          <span className="text-[11px] text-gray-500">
            {isPaid ? "Paid" : "Unpaid"}
          </span>
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          Rejected
        </span>
      );
    }

    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
        Pending
      </span>
    );
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Leave Management
        </h1>
        <p className="text-sm text-gray-500">
          Review, approve, or reject employee leave requests
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-5 py-3 text-left">Employee</th>
              <th className="px-5 py-3 text-left">Department</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-left">Days</th>
              <th className="px-5 py-3 text-left">Reason</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-16 text-center">
                  <Inbox className="mx-auto mb-2 text-gray-400" size={36} />
                  <p className="text-sm text-gray-500">
                    No leave requests found
                  </p>
                </td>
              </tr>
            ) : (
              leaves.map((leave) => {
                const rowLoading = actionLoading === leave._id;

                return (
                  <tr
                    key={leave._id}
                    className={`hover:bg-gray-50 ${
                      rowLoading ? "opacity-60" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-medium">
                      {leave.user?.username || "—"}
                    </td>

                    <td className="px-5 py-4">
                      {leave.user?.department?.name || "—"}
                    </td>

                       <td className="px-5 py-4">{leave.subject}</td>

                    {/* DAYS (EDITABLE ONLY WHEN PENDING) */}
                    <td className="px-5 py-4">
                      {leave.status === "pending" ? (
                        <input
                          type="number"
                          min={1}
                          className="w-20 px-2 py-1 border rounded-md"
                          value={leave.days}
                          onChange={(e) =>
                            setLeaves((prev) =>
                              prev.map((l) =>
                                l._id === leave._id
                                  ? {
                                      ...l,
                                      days: Number(e.target.value),
                                    }
                                  : l
                              )
                            )
                          }
                        />
                      ) : (
                        <span>{leave.days}</span>
                      )}
                    </td>

                    {/* REASON */}
                    <td className="px-5 py-4 max-w-xs">
                      {expandedReason === leave._id
                        ? leave.reason
                        : leave.reason.slice(0, 40)}
                      {leave.reason.length > 40 && (
                        <button
                          className="ml-2 text-xs text-blue-600"
                          onClick={() =>
                            setExpandedReason(
                              expandedReason === leave._id
                                ? null
                                : leave._id
                            )
                          }
                        >
                          {expandedReason === leave._id
                            ? "Show less"
                            : "Show more"}
                        </button>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {getStatusBadge(leave.status, leave.isPaid)}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      {leave.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            disabled={rowLoading}
                            onClick={() =>
                              approveLeave(
                                leave._id,
                                true,
                                leave.days
                              )
                            }
                            className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md"
                          >
                            Paid
                          </button>

                          <button
                            disabled={rowLoading}
                            onClick={() =>
                              approveLeave(
                                leave._id,
                                false,
                                leave.days
                              )
                            }
                            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md"
                          >
                            Unpaid
                          </button>

                          <button
                            disabled={rowLoading}
                            onClick={() => rejectLeave(leave._id)}
                            className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md"
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

      {/* PAGINATION */}
      {pagination && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => {
                const prev = page - 1;
                setPage(prev);
                fetchLeaves(prev);
              }}
              className="px-4 py-1.5 border rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={!pagination.hasNext}
              onClick={() => {
                const next = page + 1;
                setPage(next);
                fetchLeaves(next);
              }}
              className="px-4 py-1.5 border rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLeaves;
