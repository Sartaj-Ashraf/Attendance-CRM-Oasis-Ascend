import { Outlet } from "react-router-dom";
import AdminSidebar from "./Dashboard/onwer/AdminSidebar";
import Topbar from "./Dashboard/Topbar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* MAIN CONTENT (OFFSET BY SIDEBAR WIDTH) */}
      <div className="ml-60 min-h-screen flex flex-col">
        {/* Optional Topbar */}
        {/* <Topbar /> */}

        <main
          className="flex-1 p-8 overflow-y-auto "
        >
          <Outlet /> {/* Admin pages render here */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
