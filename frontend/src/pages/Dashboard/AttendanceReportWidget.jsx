import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
// import api from "../../../axios/axios";
import api from "../../axios/axios.js";

const AttendanceReportWidget = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  /* ================= FETCH FROM BACKEND ================= */
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/GetAttendanceByDate", {
        params: { date },
      });

      setData(res.data.data || []);

      if (!res.data.data || res.data.data.length === 0) {
        toast("No attendance found for this date");
      }
    } catch (error) {
      toast.error("Failed to load attendance");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  /* ================= FILTERED DATA ================= */
const filteredData = useMemo(() => {
  return data
    .filter((row) => row.user) // 🔒 HARD GUARD
    .filter((row) => {
      const username = row.user?.username?.toLowerCase() || "";
      const email = row.user?.email?.toLowerCase() || "";

      const matchesSearch =
        username.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || row.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "all" ||
        row.user?.department?.name === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
}, [data, searchTerm, statusFilter, departmentFilter]);

  /* ================= SUMMARY ================= */
  const summary = useMemo(
    () => ({
      total: data?.length,
      present: data.filter((d) => d.status === "present").length,
      absent: data.filter((d) => d.status === "absent").length,
      late: data.filter((d) => d.status === "late").length,
      leave: data.filter((d) => d.status === "leave").length,
    }),
    [data]
  );

  /* ================= UNIQUE DEPARTMENTS ================= */
  const departments = useMemo(() => {
    return [...new Set(data.map((d) => d?.user?.department?.name))].filter(
      Boolean
    );
  }, [data]);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Attendance Report</h2>
          <p className="text-sm text-gray-500">Daily attendance overview</p>
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
      </div>

      {/* SUMMARY */}
      <div className="flex gap-6 mb-6 text-sm font-medium">
        <span className="text-green-600">Present: {summary.present}</span>
        <span className="text-red-600">Absent: {summary.absent}</span>
        <span className="text-yellow-600">Late: {summary.late}</span>
        <span className="text-purple-600">Leave: {summary.leave}</span>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-lg flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="leave">Leave</option>
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left align-middle">Employee</th>
              <th className="px-4 py-3 text-center align-middle">Department</th>
              <th className="px-4 py-3 text-center align-middle">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr
                  key={row._id}
                  className="border-t hover:bg-gray-50 transition m-1"
                >
                  {/* EMPLOYEE */}
                  <td className="px-4 py-4 align-middle m-1">
                    <p className="font-medium text-gray-800">
                      {row.user.username}
                    </p>
                    <p className="text-xs text-gray-500">{row.user.email}</p>
                  </td>

                  {/* DEPARTMENT */}
                  <td className="px-4 py-4 text-center align-middle">
                    {row.user.department?.name ? (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {row.user.department.name}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        Not assigned
                      </span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4 text-center align-middle">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    row.status === "present"
                      ? "bg-green-100 text-green-700"
                      : row.status === "absent"
                      ? "bg-red-100 text-red-700"
                      : row.status === "late"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReportWidget;
