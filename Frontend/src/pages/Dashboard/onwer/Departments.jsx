// import React, { useState, useMemo } from "react";

// const Departments = () => {
//   // 🔹 SEARCH STATE
//   const [search, setSearch] = useState("");

//   // 🔹 DUMMY DATA (later replace with backend)
//   const [employees] = useState([
//     {
//       id: 1,
//       name: "John Doe",
//       department: "Development",
//       manager: "Umaid Khan",
//     },
//     {
//       id: 2,
//       name: "Jane Smith",
//       department: "Development",
//       manager: "Umaid Khan",
//     },
//     {
//       id: 3,
//       name: "Alex Brown",
//       department: "Accounts",
//       manager: "Sara Lee",
//     },
//     {
//       id: 4,
//       name: "Sara Lee",
//       department: "Finance",
//       manager: "Michael Scott",
//     },
//   ]);

//   // 🔹 FILTERED DATA (search by name or department)
//   const filteredEmployees = useMemo(() => {
//     return employees.filter((emp) =>
//       emp.name.toLowerCase().includes(search.toLowerCase()) ||
//       emp.department.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [search, employees]);

//   // 🔹 SUMMARY
//   const totalEmployees = employees.length;
//   const totalDepartments = new Set(
//     employees.map((emp) => emp.department)
//   ).size;

//   return (
//     <div className="p-6">
//       {/* ===== HEADER ===== */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Departments
//         </h1>

//         {/* SEARCH */}
//         <input
//           type="text"
//           placeholder="Search employee or department..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
//         />
//       </div>

//       {/* ===== SUMMARY ===== */}
//       <div className="flex gap-6 mb-6 text-sm">
//         <span className="text-green-600 font-medium">
//           Total Employees: {totalEmployees}
//         </span>
//         <span className="text-blue-600 font-medium">
//           Total Departments: {totalDepartments}
//         </span>
//       </div>

//       {/* ===== TABLE ===== */}
//       <div className="bg-white shadow-lg rounded-xl overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr>
//               <th className="px-6 py-3">Employee Name</th>
//               <th className="px-6 py-3">Department</th>
//               <th className="px-6 py-3">Manager Name</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredEmployees.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan="3"
//                   className="text-center py-6 text-gray-500"
//                 >
//                   No records found
//                 </td>
//               </tr>
//             ) : (
//               filteredEmployees.map((emp) => (
//                 <tr
//                   key={emp.id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >
//                   <td className="px-6 py-4 font-medium text-gray-800">
//                     {emp.name}
//                   </td>
//                   <td className="px-6 py-4 text-gray-600">
//                     {emp.department}
//                   </td>
//                   <td className="px-6 py-4 text-gray-600">
//                     {emp.manager}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Departments;

// import React, { useState } from "react";
// import ConfirmModal from "../../../components/confrim/ConfirmModal";

// const Departments = () => {
//   // 🔹 DUMMY DATA (replace with backend later)
//   const [departments] = useState([
//     {
//       id: 1,
//       name: "Development",
//       manager: "Umaid Khan",
//       employees: ["John Doe", "Jane Smith", "Alex Brown"],
//     },
//     {
//       id: 2,
//       name: "Accounts",
//       manager: "Sara Lee",
//       employees: ["Robert Fox", "Emily Clark"],
//     },
//     {
//       id: 3,
//       name: "Finance",
//       manager: "Michael Scott",
//       employees: ["Pam Beesly", "Jim Halpert", "Dwight Schrute"],
//     },
//   ]);

//   // 🔹 MODAL STATE
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [open, setOpen] = useState(false);

//   // 🔹 OPEN DETAILS
//   const handleViewDetails = (department) => {
//     setSelectedDepartment(department);
//     setOpen(true);
//   };

//   // 🔹 CLOSE MODAL
//   const handleClose = () => {
//     setOpen(false);
//     setSelectedDepartment(null);
//   };

//   return (
//     <div className="p-6">
//       {/* ===== HEADER ===== */}
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">
//         Departments
//       </h1>

//       {/* ===== TABLE ===== */}
//       <div className="bg-white shadow-lg rounded-xl overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr>
//               <th className="px-6 py-3">Department</th>
//               <th className="px-6 py-3">Manager</th>
//               <th className="px-6 py-3">Total Employees</th>
//               <th className="px-6 py-3">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {departments.map((dept) => (
//               <tr
//                 key={dept.id}
//                 className="border-b hover:bg-gray-50 transition"
//               >
//                 <td className="px-6 py-4 font-medium text-gray-800">
//                   {dept.name}
//                 </td>

//                 <td className="px-6 py-4 text-gray-600">
//                   {dept.manager}
//                 </td>

//                 <td className="px-6 py-4 text-gray-600">
//                   {dept.employees.length}
//                 </td>

//                 <td className="px-6 py-4">
//                   <button
//                     onClick={() => handleViewDetails(dept)}
//                     className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                   >
//                     View Details
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ===== DETAILS MODAL ===== */}
//       {open && selectedDepartment && (
//         <ConfirmModal
//           title={`${selectedDepartment.name} Department`}
//           message=""
//           onConfirm={handleClose}
//           onCancel={handleClose}
//         >
//           <div className="mt-4">
//             <h3 className="font-semibold text-gray-800 mb-3">
//               Employees
//             </h3>

//             <ul className="list-disc list-inside space-y-1 text-gray-700">
//               {selectedDepartment.employees.map((emp, index) => (
//                 <li key={index}>{emp}</li>
//               ))}
//             </ul>
//           </div>
//         </ConfirmModal>
//       )}
//     </div>
//   );
// };

// export default Departments;

import React, { useState } from "react";

const Departments = () => {
  // 🔹 Dummy data (later from backend)
  const [departments] = useState([
    {
      id: 1,
      name: "Development",
      manager: "Umaid Khan",
      employees: ["John Doe", "Jane Smith", "Alex Brown"],
    },
    {
      id: 2,
      name: "Accounts",
      manager: "Sara Lee",
      employees: ["Robert Fox", "Emily Clark"],
    },
    {
      id: 3,
      name: "Finance",
      manager: "Michael Scott",
      employees: ["Pam Beesly", "Jim Halpert", "Dwight Schrute"],
    },
  ]);

  // 🔹 Track which department is expanded
  const [openDepartmentId, setOpenDepartmentId] = useState(null);

  const toggleDetails = (id) => {
    setOpenDepartmentId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6">
      {/* ===== HEADER ===== */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Departments
      </h1>

      {/* ===== TABLE ===== */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Manager</th>
              <th className="px-6 py-3">Total Employees</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <React.Fragment key={dept.id}>
                {/* ===== MAIN ROW ===== */}
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {dept.manager}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {dept.employees.length}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleDetails(dept.id)}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      {openDepartmentId === dept.id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </td>
                </tr>

                {/* ===== DETAILS ROW ===== */}
                {openDepartmentId === dept.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="4" className="px-6 py-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Employees in {dept.name}
                        </h3>

                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {dept.employees.map((emp, index) => (
                            <li key={index}>{emp}</li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Departments;


