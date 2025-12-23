// import axios from "axios";
// import React, { useEffect, useState } from "react";

// import { useNavigate } from "react-router-dom";

// import api from "../../../axios/axios.js";
// const Topbar = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");

//   // useEffect(() => {
//   //   axios
//   //     .get("http://localhost:5000/user/getuserdata", { withCredentials: true })
//   //     .then((res) => setUsername(res.data.user.userName));
//   // }, []);

//   const LogoutHandler = async () => {
//     try {
//       const data = await api.post("/user/logout");

//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//     } catch (e) {}
//   };
//   return (
//     <div className="w-full h-16 bg-gray-800 flex items-center justify-between px-6 shadow-md border-b border-gray-700">
//       <h3 className="text-lg font-semibold text-indigo-400">
//         Welcome, {username}
//       </h3>
//       <span className="text-2xl text-gray-200">👤</span>
//       <button
//         className="bg-red-900 rounded border text-white-900 p-1  hover:bg-white hover:text-red-900 "
//         onClick={() => LogoutHandler()}
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default Topbar;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../axios/axios.js";

const Topbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const LogoutHandler = async () => {
    try {
      await api.post("/user/logout");
      setTimeout(() => navigate("/login"), 1000);
    } catch (e) {}
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-xl mx-6 mt-6 px-6 py-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-800">
        Welcome, <span className="text-blue-600">{username || "User"}</span>
      </h3>

      <div className="flex items-center gap-4">
        <span className="text-2xl text-gray-500">👤</span>

        <button
          onClick={LogoutHandler}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
