import { Outlet } from "react-router-dom";
import AdminSidebar from "./Dashboard/onwer/AdminSidebar";
import Topbar from "./Dashboard/Topbar";

const AdminDashboard = () => {
  return (
    <div
      className="
        min-h-screen bg-gray-100
        flex                
        w-full                  /* ✅ layout container */
      "
    >
      {/* ===== FIXED SIDEBAR ===== */}
      <AdminSidebar />

      {/* ===== MAIN CONTENT ===== */}
      <div
        className="
        w-full
          min-h-screen
          flex flex-col
          ml-0                                /* ✅ no space on mobile */
          sm:ml-60                            /* ✅ space only when sidebar is visible */
          transition-all duration-300         /* ✅ smooth resize */
        "
      >
        {/* ===== TOPBAR ===== */}
        <Topbar />

        {/* ===== PAGE CONTENT ===== */}
        <main
          className="
            flex-1
            overflow-y-auto
            p-4 sm:p-6 lg:p-8               /* ✅ responsive padding */
          "
        >
          <Outlet /> {/* Admin pages render here */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
