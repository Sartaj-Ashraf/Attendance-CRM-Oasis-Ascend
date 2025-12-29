import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios.js";
import ConfirmModal from "../../../components/confrim/ConfirmModal.jsx";

const LIMIT = 30;

const MakeAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [authUser, setAuthUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showHolidayConfirm, setShowHolidayConfirm] = useState(false);

  const isSunday = new Date(date).getDay() === 0;

  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = async (user) => {
    try {
      const res =
        user.role === "owner"
          ? await api.get("/owner/getAllEmployee", {
              params: { page, limit: LIMIT },
            })
          : await api.get("/owner/getAllUsers", {
              params: {
                department: user.department?._id,
                page,
                limit: LIMIT,
              },
            });

      setEmployees(res.data?.data || []);
      setTotalPages(res.data?.meta?.totalPages || 1);
    } catch {
      toast.error("Failed to load employees");
    }
  };

  /* ================= FETCH ATTENDANCE ================= */
  const fetchAttendanceByDate = async (selectedDate) => {
    const res = await api.get("/api/GetAttendanceByDate", {
      params: { date: selectedDate },
    });

    const map = {};
    res.data?.data?.forEach((row) => {
      map[row.user._id] = {
        status: row.status,
        note: row.note || "",
        isLocked: row.isLocked || false,
      };
    });

    // ✅ MERGE — DO NOT REPLACE (pagination safe)
    setAttendance((prev) => ({ ...prev, ...map }));
  };

  /* ================= INIT ================= */
  useEffect(() => {
    (async () => {
      const res = await api.get("/api/isAuth");
      setAuthUser(res.data.user);
      await fetchEmployees(res.data.user);
      await fetchAttendanceByDate(date);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (authUser) fetchEmployees(authUser);
  }, [page]);

  useEffect(() => {
    fetchAttendanceByDate(date);
  }, [date]);

  /* ================= AUTO SUNDAY ================= */
  useEffect(() => {
    if (!isSunday || employees.length === 0) return;

    const holidayMap = {};
    employees.forEach((emp) => {
      holidayMap[emp._id] = {
        status: "holiday",
        note: "Sunday Holiday",
        isLocked: true,
      };
    });

    setAttendance((prev) => ({ ...prev, ...holidayMap }));
  }, [isSunday, employees]);

  /* ================= FILTER ================= */
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) =>
      e.username?.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  /* ================= LOCAL UPDATE ================= */
  const markAttendance = (userId, status) => {
    if (isSunday || attendance[userId]?.isLocked) return;

    setAttendance((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        status,
      },
    }));
  };

  const updateNote = (userId, note) => {
    if (isSunday || attendance[userId]?.isLocked) return;

    setAttendance((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], note },
    }));
  };

  /* ================= HOLIDAY ================= */
  const markHolidayForAll = () => {
    const updated = { ...attendance };

    employees.forEach((emp) => {
      if (attendance[emp._id]?.isLocked) return;

      updated[emp._id] = {
        status: "holiday",
        note: "Holiday",
        isLocked: true,
      };
    });

    setAttendance(updated);
    toast.success("Marked Holiday for all employees");
    setShowHolidayConfirm(false);
  };

  /* ================= SUBMIT ================= */
  const submitAttendance = async () => {
    if (isSunday) {
      toast("Sunday is automatically Holiday");
      return;
    }

    const records = Object.entries(attendance)
      .filter(([_, v]) => v.status && !v.isLocked)
      .map(([userId, v]) => ({
        userId,
        status: v.status,
        note: v.note || "",
      }));

    if (!records.length) {
      toast("No attendance to submit");
      return;
    }

    const res = await api.post("/owner/attendance/bulk", {
      date,
      records,
    });

    toast.success(res.data.msg || "Attendance submitted");
    fetchAttendanceByDate(date);
  };

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Make Attendance</h1>

      <div className="flex gap-4 mb-6 items-center">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        {!isSunday && (
          <>
            <button
              onClick={() => setShowHolidayConfirm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Mark Holiday
            </button>

            <button
              onClick={submitAttendance}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit Attendance
            </button>
          </>
        )}

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded ml-auto"
        />
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Employee</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Note</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp) => {
              const current = attendance[emp._id] || {};

              return (
                <tr key={emp._id} className="border-t">
                  <td className="px-6 py-4">
                    <p className="font-medium">{emp.username}</p>
                    <p className="text-xs text-gray-400">
                      {emp.department?.name}
                    </p>
                  </td>

                  <td className="px-6 py-4 flex gap-2">
                    {[
                      {
                        key: "present",
                        label: "present",
                        color: "bg-green-600 text-white",
                      },
                      {
                        key: "absent",
                        label: "absent",
                        color: "bg-red-600 text-white",
                      },
                      {
                        key: "late",
                        label: "late",
                        color: "bg-yellow-500 text-white",
                      },
                      {
                        key: "leave",
                        label: "leave",
                        color: "bg-blue-600 text-white",
                      },
                    ].map(({ key, label, color }) => (
                      <button
                        key={key}
                        disabled={current.isLocked}
                        onClick={() => markAttendance(emp._id, key)}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition
        ${
          current.status === key
            ? color
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }
        ${current.isLocked ? "opacity-50 cursor-not-allowed" : ""}
      `}
                      >
                        {label}
                      </button>
                    ))}
                  </td>

                  <td className="px-6 py-4">
                    <input
                      value={current.note || ""}
                      disabled={current.isLocked}
                      onChange={(e) => updateNote(emp._id, e.target.value)}
                      className="w-full border px-3 py-1 rounded"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-between px-6 py-4 border-t">
          <span>
            Page {page} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showHolidayConfirm && (
        <ConfirmModal
          title="Mark Holiday"
          message="Mark holiday for all employees?"
          onCancel={() => setShowHolidayConfirm(false)}
          onConfirm={markHolidayForAll}
        />
      )}
    </div>
  );
};

export default MakeAttendance;
