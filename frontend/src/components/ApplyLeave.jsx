import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import api from "../axios/axios";
import JoditEditor from "jodit-react";

const LeaveDashboard = () => {
  const editor = useRef(null);

  /* ================= UI STATES ================= */
  const [showApply, setShowApply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    startDate: "",
    days: "",
    subject: "",
    reason: "",
  });

  /* ================= LEAVE HISTORY ================= */
  const [leaveHistory, setLeaveHistory] = useState([]);

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const limit = 10;
  const [pagination, setPagination] = useState(null);

  /* ================= JODIT CONFIG ================= */
  const config = useMemo(
    () => ({
      readonly: false,
      height: 320,
      placeholder: "Write detailed reason for leave...",
      toolbarAdaptive: false,
      toolbarSticky: false,
    }),
    []
  );

  /* ================= FETCH MY LEAVES ================= */
  const fetchMyLeaves = async (pageNumber = page) => {
    try {
      setHistoryLoading(true);

      const res = await api.get("/leaves/my", {
        params: { page: pageNumber, limit },
      });

      setLeaveHistory(res.data.data || []);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load leave history"
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves(1);
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (
      !form.startDate ||
      !form.days ||
      !form.subject.trim() ||
      !form.reason.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/leaves/apply", {
        startDate: form.startDate,
        days: Number(form.days),
        subject: form.subject,
        reason: form.reason,
      });

      toast.success("Leave request submitted successfully");

      setForm({
        startDate: "",
        days: "",
        subject: "",
        reason: "",
      });

      setShowApply(false);
      fetchMyLeaves(1);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit leave request"
      );
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const paidBadge = (isPaid) => {
    if (isPaid === null) return "bg-gray-100 text-gray-600";
    return isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Leave Management
        </h1>

        <button
          onClick={() => setShowApply(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Apply for Leave
        </button>
      </div>

      {/* ================= LEAVE HISTORY ================= */}
      <div className="bg-white rounded-xl shadow border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Leave History</h2>
        </div>

        <div className="overflow-x-auto responsive-table">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Start Date</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Days</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Paid</th>
                <th className="px-6 py-3 text-left">Approved By</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {historyLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Loading leave history...
                  </td>
                </tr>
              ) : leaveHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No leave records found
                  </td>
                </tr>
              ) : (
                leaveHistory.map((leave) => (
                  <tr key={leave._id}>
                    <td className="px-6 py-4">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{leave.subject}</td>
                    <td className="px-6 py-4">{leave.days}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${statusColor(
                          leave.status
                        )}`}
                      >
                        {leave.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${paidBadge(
                          leave.isPaid
                        )}`}
                      >
                        {leave.isPaid === null
                          ? "N/A"
                          : leave.isPaid
                          ? "PAID"
                          : "UNPAID"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {leave.approvedBy?.username || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        {pagination && (
          <div className="flex justify-between items-center px-6 py-4 border-t">
            <p className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={!pagination.hasPrev}
                onClick={() => {
                  const prev = page - 1;
                  setPage(prev);
                  fetchMyLeaves(prev);
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
                  fetchMyLeaves(next);
                }}
                className="px-4 py-1.5 border rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= APPLY LEAVE MODAL ================= */}
      {showApply && (
        <div className="fixed inset-0 z-50 bg-black/40 flex p-6 items-center justify-center">
          <div className="bg-white w-full max-w-7xl rounded-xl shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">Apply for Leave</h2>
              <button
                onClick={() => setShowApply(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitLeave} className="p-6 space-y-4">
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="number"
                name="days"
                value={form.days}
                onChange={handleChange}
                placeholder="Number of days"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Leave Subject"
                className="w-full border rounded-lg px-3 py-2"
              />

              <JoditEditor
                ref={editor}
                value={form.reason}
                config={config}
                onChange={(content) =>
                  setForm((prev) => ({ ...prev, reason: content }))
                }
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApply(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveDashboard;
