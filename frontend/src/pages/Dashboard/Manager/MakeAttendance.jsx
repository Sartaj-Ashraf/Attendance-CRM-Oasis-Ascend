// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// const MakeAttendance = () => {
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const navigate=useNavigate()

//   const [search, setSearch] = useState("");

//   // 🔹 temporary employees
//   const [employees, setEmployees] = useState([
//     { id: 1, name: "John Doe", status: "" },
//     { id: 2, name: "Jane Smith", status: "" },
//     { id: 3, name: "Alex Brown", status: "" },
//     { id: 4, name: "Sara Lee", status: "" },
//   ]);

//   const markAttendance = (id, status) => {
//     setEmployees((prev) =>
//       prev.map((emp) => (emp.id === id ? { ...emp, status } : emp))
//     );
//   };

//   const markAllPresent = () => {
//     setEmployees((prev) => prev.map((emp) => ({ ...emp, status: "present" })));
//     toast.success("All marked present");
//   };

//   const submitAttendance = () => {
//     const incomplete = employees.some((e) => !e.status);

//     if (incomplete) {
//       toast.error("Please mark attendance for all employees");
//       return;
//     }

//     toast.success("Attendance submitted (mock)");
//     console.log({ date, employees });
//   };

//   const filteredEmployees = employees.filter((emp) =>
//     emp.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const summary = {
//     present: employees.filter((e) => e.status === "present").length,
//     absent: employees.filter((e) => e.status === "absent").length,
//     late: employees.filter((e) => e.status === "late").length,
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-4">Mark Attendance</h1>

//       {/* TOP CONTROLS */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <div className="flex items-center gap-3">
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="px-3 py-2 border rounded-lg"
//           />

//           <button
//             onClick={markAllPresent}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//           >
//             Mark All Present
//           </button>
//         </div>

//         <input
//           type="text"
//           placeholder="Search employee..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="px-4 py-2 border rounded-lg w-full md:w-64"
//         />
//       </div>

//       <div className="flex gap-6 mb-6 text-sm">
//         <span className="text-green-600">Present: {summary.present}</span>
//         <span className="text-red-600">Absent: {summary.absent}</span>
//         <span className="text-yellow-600">Late: {summary.late}</span>
//       </div>

//       <div className="bg-white shadow-lg rounded-xl overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr>
//               <th className="px-6 py-3">Employee</th>
//               <th className="px-6 py-3">Status</th>
//               <th className="px-1 py-3">View user </th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredEmployees.length === 0 ? (
//               <tr>
//                 <td colSpan="2" className="text-center py-6 text-gray-500">
//                   No employees found
//                 </td>
//               </tr>
//             ) : (
//               filteredEmployees.map((emp) => (
//                 <tr key={emp.id} className="border-t">
//                   <td className="px-6 py-4">{emp.name}</td>

//                   <td className="px-6 py-4 flex gap-3">
//                     {["present", "absent", "late"].map((status) => (
//                       <button
//                         key={status}
//                         onClick={() => markAttendance(emp.id, status)}
//                         className={`px-3 py-1 rounded capitalize ${
//                           emp.status === status
//                             ? status === "present"
//                               ? "bg-green-600 text-white"
//                               : status === "absent"
//                               ? "bg-red-600 text-white"
//                               : "bg-yellow-500 text-white"
//                             : "bg-gray-200"
//                         }`}
//                       >
//                         {status}
//                       </button>
//                     ))}
//                   </td>
//                   <td>
//                     <button
//             onClick={()=>{navigate("/test2")}}className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//               View Attendance Details
//             </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* SUBMIT */}
//       <button
//         onClick={submitAttendance}
//         className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//       >
//         Submit Attendance
//       </button>
//     </div>
//   );
// };

// export default MakeAttendance;
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MakeAttendance = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [search, setSearch] = useState("");

  /* ================= AUTH USER (DUMMY) ================= */
  const authUser = {
    role: "manager", // change to "owner" to test
    department: {
      _id: "dept_dev",
      name: "Development",
    },
  };

  /* ================= DUMMY EMPLOYEES ================= */
  const ALL_EMPLOYEES = [
    { _id: "1", username: "John Doe", department: "dept_dev" },
    { _id: "2", username: "Jane Smith", department: "dept_dev" },
    { _id: "3", username: "Alex Brown", department: "dept_acc" },
    { _id: "4", username: "Sara Lee", department: "dept_fin" },
  ];

  /* ================= FILTER EMPLOYEES (NO EFFECT) ================= */
  const scopedEmployees = useMemo(() => {
    if (authUser.role === "owner") return ALL_EMPLOYEES;

    return ALL_EMPLOYEES.filter(
      (emp) => emp.department === authUser.department._id
    );
  }, [authUser]);

  /* ================= ATTENDANCE STATE ================= */
  const [attendance, setAttendance] = useState({});

  /* ================= ACTIONS ================= */
  const markAttendance = (id, status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  const markAllPresent = () => {
    const all = {};
    scopedEmployees.forEach((emp) => {
      all[emp._id] = "present";
    });
    setAttendance(all);
    toast.success("All marked present");
  };

  const submitAttendance = () => {
    const incomplete = scopedEmployees.some(
      (emp) => !attendance[emp._id]
    );

    if (incomplete) {
      toast.error("Please mark attendance for all employees");
      return;
    }

    toast.success("Attendance submitted (dummy)");
    console.log({
      date,
      attendance,
      markedBy: authUser.role,
    });
  };

  /* ================= FILTER + SUMMARY ================= */
  const filteredEmployees = scopedEmployees.filter((emp) =>
    emp.username.toLowerCase().includes(search.toLowerCase())
  );

  const summary = {
    present: Object.values(attendance).filter(
      (s) => s === "present"
    ).length,
    absent: Object.values(attendance).filter(
      (s) => s === "absent"
    ).length,
    late: Object.values(attendance).filter(
      (s) => s === "late"
    ).length,
  };

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>

      <p className="text-sm text-gray-500 mb-4">
        Logged in as <b>{authUser.role}</b>
        {authUser.role === "manager" && ` • ${authUser.department.name}`}
      </p>

      {/* TOP CONTROLS */}
      <div className="flex gap-4 mb-6">
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
      <table className="w-full bg-white rounded shadow">
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
              <td className="px-6 py-4">{emp.username}</td>

              <td className="px-6 py-4 flex gap-3">
                {["present", "absent", "late"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      markAttendance(emp._id, status)
                    }
                    className={`px-3 py-1 rounded ${
                      attendance[emp._id] === status
                        ? status === "present"
                          ? "bg-green-600 text-white"
                          : status === "absent"
                          ? "bg-red-600 text-white"
                          : "bg-yellow-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </td>

              <td className="px-6 py-4">
                <button
                  onClick={() =>
                    navigate("/attendance/details")
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Attendance Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
