import { useEffect, useState } from "react";
import useAttendanceSummary from "../../../hooks/useAttendanceSummary";
import MonthRangeFilter from "../../../components/filters/MonthRangeFilter";
import AttendanceSummary from "../../../components/attendence/AttendanceSummary";
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

  const { data, loading, fetchSummary } = useAttendanceSummary();

  const handleFetch = () => {
    const from = getMonthRange(fromMonth).from;
    const to = getMonthRange(toMonth).to;
    fetchSummary({ from, to });
  };

  useEffect(() => {
    handleFetch(); // auto fetch current month
  }, []);

  return (
    <div className="space-y-8">
      {loading && <p className="text-center">Loading...</p>}

      <MonthRangeFilter
        fromMonth={fromMonth}
        toMonth={toMonth}
        onFromChange={setFromMonth}
        onToChange={setToMonth}
        onSubmit={handleFetch}
      />

      <AttendanceSummary summary={data} />
    </div>
  );
};

export default Attendance;
