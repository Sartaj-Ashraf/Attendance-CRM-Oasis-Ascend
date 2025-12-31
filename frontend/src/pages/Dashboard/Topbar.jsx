
// import OasisAscendLogo from "../../components/Oalogo";

// const TopBar = () => {
//   return (
//     <header className="bg-white border-b px-6 py-3 flex justify-between items-center">
//       <OasisAscendLogo size={42} />

//       {/* right side content */}
//     </header>
//   );
// };

// export default TopBar;

import React, { useContext } from "react";
import { AuthContext } from "../../ContextApi/isAuth";
import OasisAscendLogo from "../../components/Oalogo";
import Clock from "../../components/Clock";

const TopBar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* LEFT: BRAND */}
      <OasisAscendLogo size={42} />

      <div className="flex items-center gap-4">
         <Clock />
        <div className="text-right leading-tight">
        </div>
         <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {user?.username?.[0]?.toUpperCase() || "U"}
         </div>
         </div>
    </header>
  );
};

export default TopBar;


