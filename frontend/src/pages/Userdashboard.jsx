// import { Outlet } from "react-router-dom";
// import Sidebar from "./Dashboard/User/Sidebar";
// import Topbar from "./Dashboard/Topbar";

// const Userdashboard = () => {
//   return (
//     <div>
//       <Topbar/>
//     <div className="min-h-screen bg-gray-100 flex" >
//       <Sidebar />
//       <div className="flex-1">
//         <div className="p-8">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Userdashboard;
import { Outlet } from "react-router-dom";
import Sidebar from "./Dashboard/User/Sidebar";
import TopBar from "./Dashboard/Topbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* FIXED SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="ml-60 flex flex-col min-h-screen">
        {/* TOP BAR */}
        <TopBar />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

