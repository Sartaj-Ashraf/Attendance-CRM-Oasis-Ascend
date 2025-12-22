import axios from "axios";
import React, { useEffect, useState } from "react";

const Topbar = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/getuserdata", { withCredentials: true })
      .then((res) => setUsername(res.data.user.userName));
  }, []);

  return (
    <div className="w-full h-16 bg-gray-800 flex items-center justify-between px-6 shadow-md border-b border-gray-700">
      <h3 className="text-lg font-semibold text-indigo-400">Welcome, {username}</h3>
      <span className="text-2xl text-gray-200">👤</span>
    </div>
  );
};

export default Topbar;
