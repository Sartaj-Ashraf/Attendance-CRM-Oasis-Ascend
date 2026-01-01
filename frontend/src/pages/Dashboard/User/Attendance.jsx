// import { useEffect, useState } from "react";
// import useAttendanceSummary from "../../../hooks/useAttendanceSummary";
// import MonthRangeFilter from "../../../components/filters/MonthRangeFilter";
// import AttendanceSummary from "../../../components/attendence/AttendanceSummary";
// import AttendanceTable from "../../../components/AttendanceTable";
// import toast, { Toaster } from "react-hot-toast";
// import api from "../../../axios/axios"

// const getCurrentMonth = () => {
//   const d = new Date();
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// };

// const getMonthRange = (month) => {
//   const [year, m] = month.split("-");
//   return {
//     from: new Date(year, m - 1, 1).toISOString().split("T")[0],
//     to: new Date(year, m, 0).toISOString().split("T")[0],
//   };
// };

// const Attendance = ({ id }) => {
//   const [fromMonth, setFromMonth] = useState(getCurrentMonth());
//   const [toMonth, setToMonth] = useState(getCurrentMonth());

//   const { data, loading, fetchSummary } = useAttendanceSummary();
  

//   const handleFetch = async () => {
//     const toastId = toast.loading("Fetching attendance data...");

//     try {
//       const from = getMonthRange(fromMonth).from;
//       const to = getMonthRange(toMonth).to;

//       await fetchSummary({ from, to });
//       toast.success("Attendance loaded successfully", { id: toastId });
//     } catch (error) {
//       toast.error("Failed to load attendance", { id: toastId });
//     }
//   };

//   useEffect(() => {
//     handleFetch(); // auto fetch current month
//   }, []);

 
 

//   return (
//     <>
//       {/* Toaster */}
//       <Toaster position="top-right" />

//       <div className="space-y-8">
//         {loading && (
//           <div className="flex justify-center items-center gap-3 text-gray-600">
//             <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//             <p className="text-sm font-medium">Loading attendance...</p>
//           </div>
//         )}

//         <MonthRangeFilter
//           fromMonth={fromMonth}
//           toMonth={toMonth}
//           onFromChange={setFromMonth}
//           onToChange={setToMonth}
//           onSubmit={handleFetch}
//         />

//         <AttendanceSummary summary={data} />
//         <AttendanceTable data={AttendanceData} />
//       </div>
//     </>
//   );
// };

// export default Attendance;
import { useEffect, useState } from "react";
import useAttendanceSummary from "../../../hooks/useAttendanceSummary";
import MonthRangeFilter from "../../../components/filters/MonthRangeFilter";
import AttendanceSummary from "../../../components/attendence/AttendanceSummary";
import AttendanceTable from "../../../components/AttendanceTable";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../axios/axios";

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

  const { data: summary, loading, fetchSummary } = useAttendanceSummary();

  const handleFetch = async () => {
    const toastId = toast.loading("Fetching attendance data...");

    try {
      const from = getMonthRange(fromMonth).from;
      const to = getMonthRange(toMonth).to;

      // 1️⃣ fetch summary
      await fetchSummary({ from, to });

      // 2️⃣ fetch table data
      const res = await api.get("/user/getCurrentUserdata", {
        params: { from, to },
      });

      setTableData(res.data.data);

      toast.success("Attendance loaded successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to load attendance", { id: toastId });
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-8">
        {loading && (
          <div className="flex justify-center items-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading attendance...</p>
          </div>
        )}

        <MonthRangeFilter
          fromMonth={fromMonth}
          toMonth={toMonth}
          onFromChange={setFromMonth}
          onToChange={setToMonth}
          onSubmit={handleFetch}
        />

        {/* SUMMARY CARDS */}
        <AttendanceSummary summary={summary} />

        {/* TABLE */}
        <AttendanceTable data={tableData} />
      </div>
    </>
  );
};

export default Attendance;
