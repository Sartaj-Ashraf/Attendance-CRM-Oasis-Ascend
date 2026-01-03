import { useEffect, useState } from "react";
import useAttendanceSummary from "../../../hooks/useAttendanceSummary";
import MonthRangeFilter from "../../../components/filters/MonthRangeFilter";
import AttendanceSummary from "../../../components/attendence/AttendanceSummary";
import AttendanceTable from "../../../components/AttendanceTable";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../axios/axios";
import { useParams } from "react-router-dom";

/* ================= HELPERS ================= */
const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthRange = (month) => {
  const [year, m] = month.split("-");
  return {
    from: new Date(year, m - 1, 1).toISOString().split("T")[0],
    to: new Date(year, m, 0).toISOString().split("T")[0],
  };
};

const Attendance = () => {
  const [fromMonth, setFromMonth] = useState(getCurrentMonth());
  const [toMonth, setToMonth] = useState(getCurrentMonth());

  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(30);
  const [pagination, setPagination] = useState(null);

  const { data: summary, loading, fetchSummary } = useAttendanceSummary();
  const { userId } = useParams();
  console.log(userId);
  /* ================= FETCH DATA ================= */
  const handleFetch = async (pageNumber = page) => {
    try {
      const from = getMonthRange(fromMonth).from;
      const to = getMonthRange(toMonth).to;

      // 1️⃣ Fetch summary cards
      await fetchSummary({ from, to, userId });

      const endpoint = userId
        ? `/user/getCurrentUserdata/${userId}` // owner
        : "/user/getCurrentUserdata"; // self

      const res = await api.get(endpoint, {
        params: {
          from,
          to,
          page: pageNumber,
          limit,
        },
      });
      console.log(res);
      setTableData(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error("Failed to load attendance", {
        id: toastId,
      });
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    handleFetch(1);
  }, []);

  /* ================= PAGE CHANGE ================= */
  useEffect(() => {
    handleFetch(page);
  }, [page]);

  /* ================= MONTH FILTER ================= */
  const handleMonthSubmit = () => {
    setPage(1); // reset pagination
    handleFetch(1);
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-8">
        {/* ================= LOADING ================= */}
        {loading && (
          <div className="flex justify-center items-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading attendance...</p>
          </div>
        )}

        {/* ================= MONTH FILTER ================= */}
        <MonthRangeFilter
          fromMonth={fromMonth}
          toMonth={toMonth}
          onFromChange={setFromMonth}
          onToChange={setToMonth}
          onSubmit={handleMonthSubmit}
        />
        {!userId && <AttendanceSummary summary={summary} />}
        {/* ================= SUMMARY ================= */}

        {/* ================= TABLE ================= */}
        <AttendanceTable data={tableData} />

        {/* ================= PAGINATION ================= */}
        {pagination && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t">
            {/* LEFT: INFO */}
            <div className="text-sm text-gray-600">
              Showing page{" "}
              <span className="font-medium text-gray-800">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-800">
                {pagination.totalPages}
              </span>{" "}
              •{" "}
              <span className="font-medium text-gray-800">
                {pagination.total}
              </span>{" "}
              records
            </div>

            {/* RIGHT: CONTROLS */}
            <div className="flex items-center gap-2">
              <button
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => p - 1)}
                className="
          flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium
          border bg-white text-gray-700
          hover:bg-gray-100 hover:border-gray-300
          disabled:opacity-40 disabled:cursor-not-allowed
        "
              >
                ← Previous
              </button>

              {/* PAGE INDICATOR */}
              <span className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700">
                {pagination.page}
              </span>

              <button
                disabled={!pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="
          flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium
          border bg-white text-gray-700
          hover:bg-gray-100 hover:border-gray-300
          disabled:opacity-40 disabled:cursor-not-allowed
        "
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Attendance;
