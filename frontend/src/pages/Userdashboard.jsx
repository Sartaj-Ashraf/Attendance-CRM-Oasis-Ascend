import { Outlet } from "react-router-dom";
import Sidebar from "./Dashboard/User/Sidebar";
import Topbar from "./Dashboard/Topbar";

const Userdashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />
        <div className="p-8">
          <Outlet /> {/* 👈 renders Attendance, Salary, etc */}
        </div>
      </div>
    </div>
  );
};

export default Userdashboard;
