import { Outlet } from "react-router-dom";
import AdminSidebar from "./Dashboard/onwer/AdminSidebar";

import Topbar from "./Dashboard/Topbar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Topbar />

        <div className="p-8">
          <Outlet /> {/* 👈 Admin pages render here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
