import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import api from "../../axios/axios.js";
import SearchFilter from "../../components/filters/SearchFilter";

const AttendanceReportWidget = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [departments, setDepartments] = useState([]);

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

  const getStatusClasses = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700 border-green-300";
      case "absent":
        return "bg-red-100 text-red-700 border-red-300";
      case "late":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "leave":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  /* ================= FETCH DEPARTMENTS ================= */
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data.data);
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
    <div className="bg-white shadow-md rounded-xl p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Attendance Report
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Daily attendance overview
          </p>
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full sm:w-auto border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block mt-6 overflow-x-auto border rounded-lg">
        <table className="min-w-[600px] w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Employee</th>
              <th className="px-4 py-3 text-center font-medium">Department</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr
                  key={row._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800">
                      {row.user.username}
                    </p>
                    <p className="text-xs text-gray-500 break-all">
                      {row.user.email}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-center">
                    {row.user.department?.name || "—"}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusClasses(
                        row.status
                      )}`}
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

      {/* ================= MOBILE CARDS ================= */}
      <div className="sm:hidden mt-6 space-y-3">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No data found
          </div>
        ) : (
          filteredData.map((row) => (
            <div
              key={row._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="mb-2">
                <p className="font-medium text-gray-800">
                  {row.user.username}
                </p>
                <p className="text-xs text-gray-500 break-all">
                  {row.user.email}
                </p>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Department</span>
                <span>{row.user.department?.name || "—"}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Status</span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusClasses(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      {meta && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-6 text-sm">
          <span className="text-gray-600">
            Page {meta.page} of {meta.totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!meta.hasPrev}
              className="px-4 py-1.5 border rounded-lg disabled:opacity-50"
            >
              Prev
            </button>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!meta.hasNext}
              className="px-4 py-1.5 border rounded-lg disabled:opacity-50"
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
