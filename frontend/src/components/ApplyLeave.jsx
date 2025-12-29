import React, { useState } from "react";
import { toast } from "sonner";
import api from "../axios/axios";

const ApplyLeave = () => {
  const [form, setForm] = useState({
    days: "",
    type: "casual",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    if (loading) return;

    const days = Number(form.days);
    const reason = form.reason.trim();

    // ✅ VALIDATION
    if (!days || days < 1) {
      toast.error("Leave days must be at least 1");
      return;
    }

    if (!reason) {
      toast.error("Reason is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/leave/apply", {
        days,
        type: form.type,
        reason,
      });

      toast.success("Leave request submitted successfully");

      // ✅ RESET FORM
      setForm({
        days: "",
        type: "casual",
        reason: "",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit leave request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            📝 Apply for Leave
          </h2>
          <p className="text-sm text-indigo-100 mt-1">
            Request leave by specifying number of days
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={submitLeave} className="p-6 space-y-5">
          {/* DAYS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Number of Days
            </label>
            <input
              type="number"
              min="1"
              name="days"
              value={form.days}
              onChange={handleChange}
              placeholder="e.g. 2"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Enter total leave days</p>
          </div>

          {/* TYPE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Leave Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="annual">Annual Leave</option>
              <option value="maternity">Maternity Leave</option>
            </select>
          </div>

          {/* REASON */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Explain the reason for your leave..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* INFO */}
          <div className="flex gap-3 items-start bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-yellow-800">
              Leave requests require approval. Incorrect information may lead to
              rejection.
            </p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Leave Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
