import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Attendance from "./Attendance";

const Userdashboard = () => {
  const [page, setPage] = useState("");

  return (
    <div className="flex bg-gray-900 min-h-screen text-gray-100">

      <Sidebar setPage={setPage} />

      <div className="flex-1">
        <Topbar />

        {!page && (
          <h2 className="text-center text-xl mt-10 text-indigo-400 tracking-wide">
            Click <strong>Attendance</strong> to view your records
          </h2>
        )}

        {page === "Attendance" && <Attendance />}
      </div>
    </div>
  );
};

export default Userdashboard;
