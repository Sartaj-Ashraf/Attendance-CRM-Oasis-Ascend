
import React, { useState } from "react";
import { toast } from "sonner";
import api from "../axios/axios";

const LeaveDashboard = () => {
  const [showApply, setShowApply] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= APPLY LEAVE FORM ================= */
  const [form, setForm] = useState({
    days: "",
    type: "casual",
    reason: "",
  });

  /* ================= DUMMY LEAVE HISTORY ================= */
  const [leaveHistory] = useState([
    {
      id: 1,
      days: 2,
      type: "Casual",
      reason: "Family function",
      status: "Pending",
      date: "2025-01-10",
    },
    {
      id: 2,
      days: 1,
      type: "Sick",
      reason: "Fever",
      status: "Approved",
      date: "2024-12-22",
    },
    {
      id: 3,
      days: 3,
      type: "Annual",
      reason: "Vacation",
      status: "Rejected",
      date: "2024-11-05",
    },
  ]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.days || !form.reason.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/leave/apply", form);

      toast.success("Leave request submitted");
      setForm({ days: "", type: "casual", reason: "" });
      setShowApply(false);
    } catch {
      toast.error("Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Leave Management
        </h1>

        <button
          onClick={() => setShowApply(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Apply for Leave
        </button>
      </div>

      {/* ================= LEAVE HISTORY (MAIN VIEW) ================= */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Leave History
          </h2>
        </div>

        <div className="overflow-x-auto ">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Days</th>
                <th className="px-6 py-3 text-left">Reason</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {leaveHistory.map((leave) => (
                <tr key={leave.id} >
                  <td className="px-6 py-4 ">{leave.date}</td>
                  <td className="px-6 py-4">{leave.type}</td>
                  <td className="px-6 py-4">{leave.days}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {leave.reason}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= APPLY LEAVE MODAL ================= */}
      {showApply && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">
                Apply for Leave
              </h2>
              <button
                onClick={() => setShowApply(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitLeave} className="p-6 space-y-4">
              <input
                type="number"
                name="days"
                value={form.days}
                onChange={handleChange}
                placeholder="Number of days"
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 bg-white"
              >
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="annual">Annual Leave</option>
                <option value="maternity">Maternity Leave</option>
              </select>

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                rows={4}
                placeholder="Reason"
                className="w-full border rounded-lg px-3 py-2 resize-none"
                required
              />

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowApply(false)}
                  className="cursor-pointer px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
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
