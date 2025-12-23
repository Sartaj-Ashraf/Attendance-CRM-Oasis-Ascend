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


// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import Attendance from "./Attendance";

// const Userdashboard = () => {
//   const [page, setPage] = useState("");

//   return (
//     <div className="flex bg-gray-100 min-h-screen text-gray-800">
//       {/* Sidebar */}
//       <Sidebar setPage={setPage} />

//       {/* Main Content */}
//       <div className="flex-1">
//         <Topbar />

//         {!page && (
//           <h2 className="text-center text-xl mt-10 text-blue-600 tracking-wide font-semibold">
//             Click <strong>Attendance</strong> to view your records
//           </h2>
//         )}

//         {page === "Attendance" && <Attendance />}
//       </div>
//     </div>
//   );
// };

// export default Userdashboard;


import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Attendance from "./Attendance";

const Userdashboard = () => {
  const [page, setPage] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar setPage={setPage} />

      {/* Main Content */}
      <div className="flex-1">
        <Topbar />

        <div className="p-8">
          {!page && (
            <div className="bg-white shadow-lg rounded-xl p-8 text-center">
              <h2 className="text-xl font-bold text-gray-800">
                Welcome to your Dashboard
              </h2>
              <p className="text-gray-500 mt-2">
                Click <span className="text-blue-600 font-semibold">Attendance</span> to view your records
              </p>
            </div>
          )}

          {page === "Attendance" && <Attendance />}
        </div>
      </div>
    </div>
  );
};

export default Userdashboard;
