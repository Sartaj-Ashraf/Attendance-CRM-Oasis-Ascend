import axios from "axios";
import React, { useEffect, useState } from "react";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/attendance/current-month", {
        withCredentials: true,
      })
      .then((res) => {
        setRecords(res.data.attendance || []);
        setSummary(res.data.summary || {});
      });
  }, []);

  return (
    <div className="mt-6 p-6">

      <h2 className="text-3xl font-bold text-indigo-400 mb-6">Current Month Attendance</h2>

      <table className="w-full border border-gray-700 rounded-md overflow-hidden shadow">
        <thead>
          <tr className="bg-gray-800 text-indigo-300">
            <th className="p-3 border border-gray-700">Date</th>
            <th className="p-3 border border-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((r, index) => (
              <tr key={index} className="hover:bg-gray-800 transition">
                <td className="p-3 border border-gray-700">{r.date}</td>
                <td className="p-3 border border-gray-700">{r.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="text-center p-4 text-gray-400">
                No Records Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-8 p-6 border border-gray-700 rounded-lg shadow bg-gray-800 w-80">
        <h3 className="text-xl font-semibold text-indigo-400 mb-3">Summary</h3>
        <p className="py-1">Total Days: <span className="font-semibold text-gray-200">{summary.totalDays || 0}</span></p>
        <p className="py-1">Present: <span className="font-semibold text-green-400">{summary.present || 0}</span></p>
        <p className="py-1">Absent: <span className="font-semibold text-red-400">{summary.absent || 0}</span></p>
        <p className="py-1">Half Day: <span className="font-semibold text-yellow-400">{summary.halfday || 0}</span></p>
        <p className="py-1">Unknown: <span className="font-semibold text-gray-400">{summary.unknown || 0}</span></p>
      </div>

    </div>
  );
};

export default Attendance;
