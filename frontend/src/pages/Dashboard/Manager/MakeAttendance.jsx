import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "../../../axios/axios.js";

const MakeAttendance = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [authUser, setAuthUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});

  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = async (user) => {
    try {
      let res;

      // 🔐 OWNER
      if (user.role === "owner") {
        res = await api.get("/owner/getAllEmployee");
        setEmployees(res.data.employees);
      }

      // 🔐 MANAGER
      if (user.role === "manager") {
        res = await api.get("/owner/getAllUsers", {
          params: { department: user.department._id },
        });
        setEmployees(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false); // ✅ ALWAYS stop loading
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/api/isAuth"); // ✅ FIXED
        setAuthUser(res.data.user);
        await fetchEmployees(res.data.user);
      } catch (error) {
        toast.error("Authentication failed");
        setLoading(false); // ✅ IMPORTANT
      }
    };

    init();
  }, []);

  /* ================= FILTER ================= */
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  /* ================= ACTIONS ================= */
  const markAttendance = (userId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: status,
    }));
  };

  const markAllPresent = () => {
    const all = {};
    employees.forEach((emp) => {
      all[emp._id] = "present";
    });
    setAttendance(all);
    toast.success("All marked present");
  };

  /* ================= SUBMIT ================= */
  const submitAttendance = async () => {
    console.group("📌 SUBMIT ATTENDANCE");

    // console.log("📅 Date:", date);
    // console.log("👥 Employees:", employees);
    // console.log("📝 Attendance State:", attendance);
    const incomplete = employees.some((emp) => !attendance[emp._id]);
    console.log("❓ Any incomplete attendance:", incomplete);
    if (incomplete) {
      toast.error("Please mark attendance for all employees");
      return;
    }

    const records = employees.map((emp) => ({
      userId: emp._id,
      status: attendance[emp._id],
    }));
    console.log("📦 Payload Records:", records);
    try {
      await api.post("/owner/attendance/bulk", {
        date,
        records,
      });

      toast.success("Attendance marked successfully");
      setAttendance({});
      console.log("correct");
    } catch (err) {
      console.log("error");
      toast.error(err.response?.data?.msg || "Failed");
    }
  };

  /* ================= SUMMARY ================= */
  const summary = {
    present: Object.values(attendance).filter((s) => s === "present").length,
    absent: Object.values(attendance).filter((s) => s === "absent").length,
    late: Object.values(attendance).filter((s) => s === "late").length,
  };

  /* ================= UI ================= */
  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Mark Attendance</h1>

      <p className="text-sm text-gray-500 mb-6">
        Logged in as <b>{authUser?.role}</b>
        {authUser?.role === "manager" && ` • ${authUser.department?.name}`}
      </p>

      {/* CONTROLS */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={markAllPresent}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Mark All Present
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
      <div className="flex gap-6 mb-4 text-sm">
        <span className="text-green-600">Present: {summary.present}</span>
        <span className="text-red-600">Absent: {summary.absent}</span>
        <span className="text-yellow-600">Late: {summary.late}</span>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">View</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="px-6 py-4">
                  {emp.username}
                  <div className="text-xs text-gray-400">
                    {emp.department?.name}
                  </div>
                </td>

                <td className="px-6 py-4 flex gap-3">
                  {["present", "absent", "late", "leave"].map((status) => (
                    <button
                      key={status}
                      onClick={() => markAttendance(emp._id, status)}
                      className={`px-3 py-1 rounded capitalize ${
                        attendance[emp._id] === status
                          ? status === "present"
                            ? "bg-green-600 text-white"
                            : status === "absent"
                            ? "bg-red-600 text-white"
                            : status === "late"
                            ? "bg-yellow-500 text-white"
                            : "bg-purple-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/attendance/${emp._id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={submitAttendance}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Submit Attendance
      </button>
    </div>
  );
};

export default MakeAttendance;
