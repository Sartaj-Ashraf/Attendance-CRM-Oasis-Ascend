import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios.js";
import ConfirmModal from "../../../components/confrim/ConfirmModal.jsx";

const MakeAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isHolidayMarked, setIsHolidayMarked] = useState(false);

  const [authUser, setAuthUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [attendanceLoaded, setAttendanceLoaded] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const isSunday = new Date(date).getDay() === 0;

  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = async (user) => {
    try {
      const res =
        user.role === "owner"
          ? await api.get("/owner/getAllEmployeesForAttendance")
          : await api.get("/owner/getAllUsers", {
              params: { department: user.department?._id },
            });

      setEmployees(res.data?.data || []);
    } catch {
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

      employees.forEach((emp) => {
        if (!map[emp._id]) {
          map[emp._id] = {
            status: "present",
            note: "",
            isLocked: false,
          };
        }
      });

      setAttendance(map);
    } catch {
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

  /* ================= AUTO LOAD ================= */
  useEffect(() => {
    if (!authUser || employees.length === 0) return;
    fetchAttendanceByDate(date);
    setAttendanceLoaded(true);
    setIsHolidayMarked(false);
  }, [authUser, employees, date]);

  /* ================= AUTO SUNDAY ================= */
  useEffect(() => {
    if (!isSunday || !attendanceLoaded || isHolidayMarked) return;

    const holidayMap = {};
    employees.forEach((emp) => {
      holidayMap[emp._id] = {
        status: "holiday",
        note: "Sunday Holiday",
        isLocked: true,
      };
    });

    setAttendance(holidayMap);
    setIsHolidayMarked(true);
  }, [isSunday, attendanceLoaded, employees, isHolidayMarked]);

  /* ================= FILTER ================= */
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) =>
      e.username?.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  /* ================= ACTIONS ================= */
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

  const submitAttendance = async () => {
    const records = Object.entries(attendance).map(([userId, v]) => ({
      userId,
      status: v.status,
      note: v.note || "",
      isLocked: v.isLocked || false,
    }));

    if (!records.length) return toast("No attendance to submit");

    try {
      await api.post("/owner/attendance/bulk", { date, records });
      toast.success("Attendance submitted");
      setShowSubmitConfirm(false);
      fetchAttendanceByDate(date);
    } catch {
      toast.error("Submit failed");
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;

  const statusClass = (current, s) =>
    current.status === s
      ? s === "present"
        ? "bg-green-600 text-white"
        : s === "absent"
        ? "bg-red-600 text-white"
        : s === "late"
        ? "bg-yellow-500 text-white"
        : "bg-blue-600 text-white"
      : "bg-gray-100 hover:bg-gray-200";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">Make Attendance</h1>

      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="date"
          value={date}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded"
        />

        <button
          onClick={() => fetchAttendanceByDate(date)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View
        </button>

        {!isSunday && (
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        )}

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded sm:ml-auto sm:w-64"
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-4 sm:hidden">
        {filteredEmployees.map((emp) => {
          const current = attendance[emp._id] || {};
          return (
            <div key={emp._id} className="border rounded p-4 space-y-3">
              <div>
                <p className="font-semibold">{emp.username}</p>
                <p className="text-xs text-gray-500">
                  {emp.department?.name}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["present", "absent", "late", "leave"].map((s) => (
                  <button
                    key={s}
                    disabled={current.isLocked}
                    onClick={() => markAttendance(emp._id, s)}
                    className={`px-3 py-1 rounded-full text-xs capitalize border ${statusClass(
                      current,
                      s
                    )}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={current.note || ""}
                disabled={current.isLocked}
                onChange={(e) => updateNote(emp._id, e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
              />
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden sm:block overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Employee</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Note</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredEmployees.map((emp) => {
              const current = attendance[emp._id] || {};
              return (
                <tr key={emp._id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{emp.username}</p>
                    <p className="text-xs text-gray-500">
                      {emp.department?.name}
                    </p>
                  </td>

                  <td className="px-4 py-3 flex gap-2">
                    {["present", "absent", "late", "leave"].map((s) => (
                      <button
                        key={s}
                        disabled={current.isLocked}
                        onClick={() => markAttendance(emp._id, s)}
                        className={`px-3 py-1 rounded-full text-xs capitalize border ${statusClass(
                          current,
                          s
                        )}`}
                      >
                        {s}
                      </button>
                    ))}
                  </td>

                  <td className="px-4 py-3">
                    <textarea
                      rows={2}
                      value={current.note || ""}
                      disabled={current.isLocked}
                      onChange={(e) => updateNote(emp._id, e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showSubmitConfirm && (
        <ConfirmModal
          title="Submit Attendance"
          message="Are you sure you want to submit attendance?"
          onCancel={() => setShowSubmitConfirm(false)}
          onConfirm={submitAttendance}
        />
      )}
    </div>
  );
};

export default MakeAttendance;
