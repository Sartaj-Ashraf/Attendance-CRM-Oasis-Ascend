import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Inbox } from "lucide-react";
import api from "../axios/axios.js";

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedReason, setExpandedReason] = useState(null);

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
    if (!days || days <= 0) return toast.error("Days must be greater than 0");

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

      toast.success("Leave approved", { id: toastId });
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
        <div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            Approved
          </span>
          <p className="text-[11px] text-gray-500">
            {isPaid ? "Paid" : "Unpaid"}
          </p>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-2 w-fit mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Leave Management
        </h1>
        <p className="text-sm text-gray-500">
          Review, approve, or reject employee leave requests
        </p>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="grid gap-4 sm:hidden">
        {leaves.length === 0 ? (
          <div className="text-center py-16">
            <Inbox className="mx-auto text-gray-400" size={36} />
            <p className="text-sm text-gray-500 mt-2">
              No leave requests found
            </p>
          </div>
        ) : (
          leaves.map((leave) => {
            const rowLoading = actionLoading === leave._id;

            return (
              <div
                key={leave._id}
                className={`border rounded-lg p-4 space-y-3 w-full ${
                  rowLoading ? "opacity-60" : ""
                }`}
              >
                <div>
                  <p className="font-semibold">
                    {leave.user?.username || "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {leave.user?.department?.name || "—"}
                  </p>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-medium">{leave.subject}</span>
                  {getStatusBadge(leave.status, leave.isPaid)}
                </div>

                <div className="text-sm">
                  <span className="font-medium">Days: </span>
                  {leave.status === "pending" ? (
                    <input
                      type="number"
                      min={1}
                      className="w-20 px-2 py-1 border rounded ml-2"
                      value={leave.days}
                      onChange={(e) =>
                        setLeaves((prev) =>
                          prev.map((l) =>
                            l._id === leave._id
                              ? { ...l, days: Number(e.target.value) }
                              : l
                          )
                        )
                      }
                    />
                  ) : (
                    leave.days
                  )}
                </div>

                <p className="text-sm text-gray-600">
                  {expandedReason === leave._id
                    ? leave.reason
                    : leave.reason.slice(0, 80)}
                  {leave.reason.length > 80 && (
                    <button
                      className="ml-2 text-xs text-blue-600"
                      onClick={() =>
                        setExpandedReason(
                          expandedReason === leave._id ? null : leave._id
                        )
                      }
                    >
                      {expandedReason === leave._id
                        ? "Show less"
                        : "Show more"}
                    </button>
                  )}
                </p>

                {leave.status === "pending" && (
                  <div className="flex gap-2 items-center">
                    <button
                      disabled={rowLoading}
                      onClick={() =>
                        approveLeave(leave._id, true, leave.days)
                      }
                      className="px-3 py-2 text-xs bg-green-600 text-white rounded"
                    >
                      Paid
                    </button>

                    <button
                      disabled={rowLoading}
                      onClick={() =>
                        approveLeave(leave._id, false, leave.days)
                      }
                      className="px-3 py-2 text-xs bg-blue-600 text-white rounded"
                    >
                      Unpaid
                    </button>

                    <button
                      disabled={rowLoading}
                      onClick={() => rejectLeave(leave._id)}
                      className=" px-3 py-2 text-xs bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm overflow-x-auto">
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
            {leaves.map((leave) => {
              const rowLoading = actionLoading === leave._id;

              return (
                <tr
                  key={leave._id}
                  className={`hover:bg-gray-50 ${
                    rowLoading ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-3 py-4 font-medium">
                    {leave.user?.username || "—"}
                  </td>
                  <td className="px-5 py-4">
                    {leave.user?.department?.name || "—"}
                  </td>
                  <td className="px-5 py-4">{leave.subject}</td>
                  <td className="px-5 py-4">{leave.days}</td>
                  <td className="px-5 py-4 max-w-xs">
                    {leave.reason}
                  </td>
                  <td className="px-5 py-4">
                    {getStatusBadge(leave.status, leave.isPaid)}
                  </td>
                  <td className="px-5 py-4">
                    {leave.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            approveLeave(
                              leave._id,
                              true,
                              leave.days
                            )
                          }
                          className="px-3 py-1.5 text-xs bg-green-600 text-white rounded"
                        >
                          Paid
                        </button>
                        <button
                          onClick={() =>
                            approveLeave(
                              leave._id,
                              false,
                              leave.days
                            )
                          }
                          className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded"
                        >
                          Unpaid
                        </button>
                        <button
                          onClick={() => rejectLeave(leave._id)}
                          className="px-3 py-1.5 text-xs bg-red-600 text-white rounded"
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
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pagination && (
        <div className="flex justify-between items-center">
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
              className="px-4 py-1.5 border rounded text-sm"
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
              className="px-4 py-1.5 border rounded text-sm"
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
