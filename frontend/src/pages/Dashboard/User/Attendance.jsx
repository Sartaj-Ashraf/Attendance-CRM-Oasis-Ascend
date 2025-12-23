// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const Attendance = () => {
//   const [records, setRecords] = useState([]);
//   const [summary, setSummary] = useState({});

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/user/attendance/current-month", {
//         withCredentials: true,
//       })
//       .then((res) => {
//         setRecords(res.data.attendance || []);
//         setSummary(res.data.summary || {});
//       });
//   }, []);

//   return (
//     <div className="mt-6 p-6">

//       <h2 className="text-3xl font-bold text-indigo-400 mb-6">Current Month Attendance</h2>

//       <table className="w-full border border-gray-700 rounded-md overflow-hidden shadow">
//         <thead>
//           <tr className="bg-gray-800 text-indigo-300">
//             <th className="p-3 border border-gray-700">Date</th>
//             <th className="p-3 border border-gray-700">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {records.length > 0 ? (
//             records.map((r, index) => (
//               <tr key={index} className="hover:bg-gray-800 transition">
//                 <td className="p-3 border border-gray-700">{r.date}</td>
//                 <td className="p-3 border border-gray-700">{r.status}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={2} className="text-center p-4 text-gray-400">
//                 No Records Found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <div className="mt-8 p-6 border border-gray-700 rounded-lg shadow bg-gray-800 w-80">
//         <h3 className="text-xl font-semibold text-indigo-400 mb-3">Summary</h3>
//         <p className="py-1">Total Days: <span className="font-semibold text-gray-200">{summary.totalDays || 0}</span></p>
//         <p className="py-1">Present: <span className="font-semibold text-green-400">{summary.present || 0}</span></p>
//         <p className="py-1">Absent: <span className="font-semibold text-red-400">{summary.absent || 0}</span></p>
//         <p className="py-1">Half Day: <span className="font-semibold text-yellow-400">{summary.halfday || 0}</span></p>
//         <p className="py-1">Holidays: <span className="font-semibold text-gray-400">{summary.holidays || 0}</span></p>
//       </div>

//     </div>
//   );
// };

// export default Attendance;

// import React, { useState } from "react";
// import Cards from "./Cards";

// const Attendance = () => {
//   const [fromMonth, setFromMonth] = useState("");
//   const [toMonth, setToMonth] = useState("");

//   const attendanceData = {
//     total: 30,
//     present: 22,
//     absent: 4,
//     leave: 2,
//     halfday: 2,
//   };

//   return (
//     <div className="p-6">
//       {/* Filter */}
//       <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
//         <h2 className="text-xl font-bold mb-4 text-gray-800">
//           Attendance Filter
//         </h2>

//         <div className="flex flex-col md:flex-row gap-4">
//           <input
//             type="month"
//             className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             onChange={(e) => setFromMonth(e.target.value)}
//           />

//           <input
//             type="month"
//             className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             onChange={(e) => setToMonth(e.target.value)}
//           />

//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
//             Fetch
//           </button>
//         </div>
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//         <Cards title="Total Days" value={attendanceData.total} color="border-blue-500" />
//         <Cards title="Present" value={attendanceData.present} color="border-green-500" />
//         <Cards title="Absent" value={attendanceData.absent} color="border-red-500" />
//         <Cards title="On Leave" value={attendanceData.leave} color="border-orange-500" />
//         <Cards title="Half Day" value={attendanceData.halfday} color="border-yellow-400" />
//       </div>
//     </div>
//   );
// };

// export default Attendance;

import React, { useState } from "react";
import Cards from "../../../components/Statecard";

const Attendance = () => {
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");

  const attendanceData = {
    total: 30,
    present: 22,
    absent: 4,
    leave: 2,
    halfday: 2,
  };

  return (
    <div className="space-y-8">
      {/* Filter Card */}
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Attendance Filter
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="month"
            className="w-full md:w-auto bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFromMonth(e.target.value)}
          />

          <input
            type="month"
            className="w-full md:w-auto bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setToMonth(e.target.value)}
          />

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            Fetch
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Cards title="Total Days" value={attendanceData.total} color="border-blue-600" />
        <Cards title="Present" value={attendanceData.present} color="border-green-600" />
        <Cards title="Absent" value={attendanceData.absent} color="border-red-600" />
        <Cards title="On Leave" value={attendanceData.leave} color="border-orange-500" />
        <Cards title="Half Day" value={attendanceData.halfday} color="border-yellow-500" />
      </div>
    </div>
  );
};

export default Attendance;

