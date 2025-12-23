// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import Attendance from "./Attendance";

// const Userdashboard = () => {
//   const [page, setPage] = useState("");

//   return (
//     <div className="flex bg-gray-900 min-h-screen text-gray-100">
//       <Sidebar setPage={setPage} />

//       <div className="flex-1">
//         <Topbar />

//         {!page && (
//           <h2 className="text-center text-xl mt-10 text-indigo-400 tracking-wide">
//             Click <strong>Attendance</strong> to view your records
//           </h2>
//         )}

//         {page === "Attendance" && <Attendance />}
//       </div>
//     </div>
//   );
// };

// export default Userdashboard;
import { Toaster, toast } from "sonner";
import { CheckCircle, XCircle, Clock, LogOut, Bell, User } from "lucide-react";

export default function AttendanceDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* TOASTER */}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          className:
            "rounded-xl bg-white text-gray-800 shadow-lg border border-gray-200",
        }}
      />

      {/* HEADER */}
      <header className="h-14 bg-blue-600 px-6 flex items-center justify-between shadow-sm">
        <h1 className="text-white font-semibold text-lg">
          Attendance Overview
        </h1>

        <div className="flex items-center gap-4 text-white">
          <Bell className="cursor-pointer" size={20} />
          <User className="cursor-pointer" size={20} />
        </div>
      </header>

      {/* CONTENT */}
      <main className="p-6 space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            title="Present"
            value="420"
            icon={<CheckCircle size={42} />}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Absent"
            value="8"
            icon={<XCircle size={42} />}
            color="from-yellow-500 to-yellow-600"
          />
          <StatCard
            title="Total Absent"
            value="8"
            icon={<XCircle size={42} />}
            color="from-red-500 to-red-600"
          />
          <StatCard
            title="Late"
            value="15"
            icon={<Clock size={42} />}
            color="from-orange-500 to-orange-600"
          />
          <StatCard
            title="Leave"
            value="3"
            icon={<LogOut size={42} />}
            color="from-blue-500 to-blue-600"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Attendance</h2>
            <button
              onClick={() => toast.success("Data refreshed")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3 text-left">Name</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition border-b last:border-none"
                >
                  <td className="py-3">{row.name}</td>
                  <td>{row.date}</td>
                  <td>{row.in}</td>
                  <td>{row.out}</td>
                  <td>{row.hours}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ title, value, icon, color }) {
  return (
    <div
      className={`rounded-2xl p-5 bg-gradient-to-br ${color} text-white shadow-md hover:scale-[1.02] transition`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-90">{title}</p>
        <div className="opacity-30">{icon}</div>
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    Late: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ---------- DATA ---------- */

const rows = [
  {
    name: "Jaber",
    date: "Nov 15, 2024",
    in: "09:02 AM",
    out: "05:02 PM",
    hours: "8.0h",
    status: "Present",
  },
  {
    name: "Jaber",
    date: "Nov 15, 2024",
    in: "—",
    out: "—",
    hours: "0h",
    status: "Absent",
  },
  {
    name: "Sater",
    date: "Nov 15, 2024",
    in: "08:52 AM",
    out: "04:52 PM",
    hours: "8.0h",
    status: "Late",
  },
];
