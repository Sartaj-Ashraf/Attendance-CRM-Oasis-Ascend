import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
// import api from "../../../axios/axios";
import api from "../../axios/axios.js";
import SearchFilter from "../../components/filters/SearchFilter";

const AttendanceReportWidget = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 filters
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // 🔹 departments
  const [departments, setDepartments] = useState([]);

  // 🔹 pagination (ADDED BACK)
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState(null);

  /* ================= FETCH ATTENDANCE ================= */
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/GetAttendanceByDate", {
        params: { date, page, limit },
      });

      setData(res.data.data || []);
      setMeta(res.data.meta || null);

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

  /* ================= FETCH DEPARTMENTS ================= */
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data || []);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchAttendance();
  }, [date, page]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  // reset page when date changes
  useEffect(() => {
    setPage(1);
  }, [date]);

  /* ================= FILTERED DATA ================= */
  const filteredData = useMemo(() => {
    return data
      .filter((row) => row.user)
      .filter((row) => {
        const username = row.user?.username?.toLowerCase() || "";
        const email = row.user?.email?.toLowerCase() || "";

        const matchesSearch =
          username.includes(searchTerm.toLowerCase()) ||
          email.includes(searchTerm.toLowerCase());

        const matchesDepartment =
          !departmentFilter || row.user?.department?._id === departmentFilter;

        return matchesSearch && matchesDepartment;
      });
  }, [data, searchTerm, departmentFilter]);

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

      {/* SEARCH + FILTER */}
      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        selectValue={departmentFilter}
        onSelectChange={setDepartmentFilter}
        selectOptions={departments}
        optionLabel="name"
        optionValue="_id"
        searchPlaceholder="Search name or email..."
      />

      {/* TABLE */}
      <div className="mt-6 overflow-x-auto border rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Employee</th>
              <th className="px-4 py-3 text-center">Department</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-8">
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
                <tr key={row._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <p className="font-medium">{row.user.username}</p>
                    <p className="text-xs text-gray-500">{row.user.email}</p>
                  </td>

                  <td className="px-4 py-4 text-center">
                    {row.user.department?.name || "—"}
                  </td>

                  <td className="px-4 py-4 text-center capitalize">
                    {row.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION UI */}
      {meta && (
        <div className="flex justify-between items-center mt-6 text-sm">
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!meta.hasPrev}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!meta.hasNext}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReportWidget;
