import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios.js";
import ConfirmModal from "../../../components/confrim/ConfirmModal.jsx";

const MakeAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [authUser, setAuthUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [attendanceLoaded, setAttendanceLoaded] = useState(false);
  const [showHolidayConfirm, setShowHolidayConfirm] = useState(false);

  const isSunday = new Date(date).getDay() === 0;

  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = async (user) => {
    try {
      const res =
        user.role === "owner"
          ? await api.get("/owner/getAllEmployees")
          : await api.get("/owner/getAllUsers", {
              params: { department: user.department?._id },
            });

      setEmployees(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load employees");
    }
  };

  /* ================= FETCH ATTENDANCE ================= */
  const fetchAttendanceByDate = async (selectedDate) => {
    try {
      const res = await api.get("/api/GetAttendanceByDate", {
        params: { date: selectedDate },
      });

      const map = {};
      res.data?.data?.forEach((row) => {
        if (!row.user?._id) return;

        map[row.user._id] = {
          status: row.status,
          note: row.note || "",
          isLocked: row.isLocked || false,
        };
      });

      setAttendance(map);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load attendance");
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/isAuth");
        setAuthUser(res.data.user);
        await fetchEmployees(res.data.user);
      } catch {
        toast.error("Auth failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= AUTO LOAD ATTENDANCE ON REFRESH ================= */
  useEffect(() => {
    if (!authUser || employees.length === 0) return;

    fetchAttendanceByDate(date);
    setAttendanceLoaded(true);
  }, [authUser, employees, date]);

  /* ================= MANUAL VIEW ================= */
  const handleViewAttendance = async () => {
    setLoading(true);
    await fetchAttendanceByDate(date);
    setAttendanceLoaded(true);
    setLoading(false);
  };

  /* ================= AUTO SUNDAY ================= */
  useEffect(() => {
    if (!isSunday || !attendanceLoaded) return;

    const holidayMap = {};
    employees.forEach((emp) => {
      holidayMap[emp._id] = {
        status: "holiday",
        note: "Sunday Holiday",
        isLocked: true,
      };
    });

    setAttendance(holidayMap);
  }, [isSunday, attendanceLoaded, employees]);

  /* ================= FILTER ================= */
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) =>
      e.username?.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    const counts = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      total: filteredEmployees.length,
    };

    filteredEmployees.forEach((emp) => {
      const status = attendance[emp._id]?.status;
      if (status && counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return counts;
  }, [attendance, filteredEmployees]);

  /* ================= LOCAL UPDATE ================= */
  const markAttendance = (userId, status) => {
    if (isSunday || attendance[userId]?.isLocked) return;

    setAttendance((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], status },
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
    const updated = {};

    employees.forEach((emp) => {
      updated[emp._id] = {
        status: "holiday",
        note: "Holiday",
        isLocked: true,
      };
    });

    setAttendance(updated);
    toast.success("Holiday marked for all employees");
    setShowHolidayConfirm(false);
  };

  /* ================= SUBMIT ================= */
  const submitAttendance = async () => {
    if (isSunday) return toast("Sunday is automatically Holiday");

    const records = Object.entries(attendance)
      .filter(([_, v]) => v.status && !v.isLocked)
      .map(([userId, v]) => ({
        userId,
        status: v.status,
        note: v.note || "",
      }));

    if (!records.length) return toast("No attendance to submit");

    try {
      const res = await api.post("/owner/attendance/bulk", {
        date,
        records,
      });

      toast.success(res.data.msg || "Attendance submitted");
      handleViewAttendance();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Submit failed");
    }
  };

  /* ================= EXPORT ================= */
  const exportCSV = () => {
    let csv = "Name,Department,Status,Note\n";

    filteredEmployees.forEach((emp) => {
      const a = attendance[emp._id] || {};
      csv += `${emp.username},${emp.department?.name || ""},${a.status || ""},${
        a.note || ""
      }\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_${date}.csv`;
    link.click();
  };

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Make Attendance</h1>

      {/* DATE + ACTIONS */}
      <div className="flex gap-3 items-center">
        <input
          type="date"
          value={date}
          max={new Date().toISOString().split("T")[0]} //  disables future dates
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={handleViewAttendance}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View Attendance
        </button>

        <button
          onClick={exportCSV}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Export
        </button>

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
              Submit
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

      {/* SUMMARY */}
      <div className="grid grid-cols-5 gap-4">
        {[
          ["Present", summary.present, "bg-green-100 text-green-700"],
          ["Absent", summary.absent, "bg-red-100 text-red-700"],
          ["Late", summary.late, "bg-yellow-100 text-yellow-700"],
          ["Leave", summary.leave, "bg-blue-100 text-blue-700"],
          ["Total", summary.total, "bg-gray-100 text-gray-700"],
        ].map(([label, value, color]) => (
          <div key={label} className={`p-4 rounded ${color}`}>
            <p className="text-sm">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* TABLE */}
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
                    {["present", "absent", "late", "leave"].map((s) => (
                      <button
                        key={s}
                        disabled={current.isLocked}
                        onClick={() => markAttendance(emp._id, s)}
                        className={`px-3 py-1 rounded-full text-xs capitalize ${
                          current.status === s
                            ? s === "present"
                              ? "bg-green-600 text-white"
                              : s === "absent"
                              ? "bg-red-600 text-white"
                              : s === "late"
                              ? "bg-yellow-500 text-white"
                              : "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {s}
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
