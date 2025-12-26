import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "../../../axios/axios.js";

const MakeAttendance = () => {
  /* ================= STATE ================= */
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [authUser, setAuthUser] = useState(null);
  const [employees, setEmployees] = useState([]);

  // attendance: { userId: { status, note } }
  const [attendance, setAttendance] = useState({});

  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = async (user) => {
    try {
      let res;

      if (user.role === "owner") {
        res = await api.get("/owner/getAllEmployee");
        setEmployees(res.data.employees);
      }

      if (user.role === "manager") {
        res = await api.get("/owner/getAllUsers", {
          params: { department: user.department._id },
        });
        setEmployees(res.data.data);
      }
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
      res.data.data.forEach((row) => {
        map[row.user._id] = {
          status: row.status,
          note: row.note || "",
        };
      });

      setAttendance(map);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/api/isAuth");
        setAuthUser(res.data.user);
        await fetchEmployees(res.data.user);
        await fetchAttendanceByDate(date);
      } catch {
        toast.error("Authentication failed");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      fetchAttendanceByDate(date);
    }
  }, [date]);

  /* ================= FILTER ================= */
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  /* ================= UPDATE STATUS ================= */
  const markAttendance = async (userId, status) => {
    const note = attendance[userId]?.note || "";

    try {
      setAttendance((prev) => ({
        ...prev,
        [userId]: { status, note },
      }));

      await api.post("/owner/markattendence", {
        userId,
        status,
        note,
      });

      toast.success("Attendance updated");
    } catch {
      toast.error("Failed to update attendance");
    }
  };

  /* ================= UPDATE NOTE ================= */
  const updateNote = (userId, note) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: {
        status: prev[userId]?.status || "",
        note,
      },
    }));
  };

  /* ================= BULK MORNING ================= */
  const submitAttendance = async () => {
    const records = employees
      .filter((emp) => !attendance[emp._id]?.status)
      .map((emp) => ({
        userId: emp._id,
        status: "present",
      }));

    if (records.length === 0) {
      toast("Attendance already submitted");
      return;
    }

    try {
      await api.post("/owner/attendance/bulk", {
        date,
        records,
      });

      toast.success("Bulk attendance submitted");
      fetchAttendanceByDate(date);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Bulk submit failed");
    }
  };

  /* ================= SUMMARY ================= */
  const summary = {
    present: Object.values(attendance).filter((a) => a.status === "present")
      .length,
    absent: Object.values(attendance).filter((a) => a.status === "absent")
      .length,
    late: Object.values(attendance).filter((a) => a.status === "late").length,
    leave: Object.values(attendance).filter((a) => a.status === "leave").length,
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Mark Attendance</h1>

      <p className="text-sm text-gray-500 mb-6">
        Logged in as <b>{authUser?.role}</b>
        {authUser?.role === "manager" && ` • ${authUser.department?.name}`}
      </p>

      {/* CONTROLS */}
      <div className="flex gap-4 mb-6 flex-wrap items-center">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={submitAttendance}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Bulk (Morning)
        </button>

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded ml-auto"
        />
      </div>

      {/* SUMMARY */}
      <div className="flex gap-6 mb-4 text-sm font-medium">
        <span className="text-green-600">Present: {summary.present}</span>
        <span className="text-red-600">Absent: {summary.absent}</span>
        <span className="text-yellow-600">Late: {summary.late}</span>
        <span className="text-purple-600">Leave: {summary.leave}</span>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Employee</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Note (optional)</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp) => {
              const current = attendance[emp._id] || {};

              return (
                <tr key={emp._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{emp.username}</p>
                    <p className="text-xs text-gray-400">
                      {emp.department?.name}
                    </p>
                  </td>

                  <td className="px-6 py-4 flex gap-2">
                    {["present", "absent", "late", "leave"].map((status) => (
                      <button
                        key={status}
                        onClick={() => markAttendance(emp._id, status)}
                        className={`px-3 py-1 rounded capitalize text-xs font-medium ${
                          current.status === status
                            ? status === "present"
                              ? "bg-green-600 text-white"
                              : status === "absent"
                              ? "bg-red-600 text-white"
                              : status === "late"
                              ? "bg-yellow-500 text-white"
                              : "bg-purple-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </td>

                  <td className="px-6 py-4">
                    <input
                      type="text"
                      placeholder="Optional note…"
                      value={current.note || ""}
                      onChange={(e) => updateNote(emp._id, e.target.value)}
                      className="w-full border px-3 py-1.5 rounded text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MakeAttendance;
