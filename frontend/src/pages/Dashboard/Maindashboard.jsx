import React, { useContext } from "react";
import { User } from "lucide-react";
import { AuthContext } from "../../ContextApi/isAuth";
import Userdashboard from "./User/Userdashboard.jsx";
import AttendanceDashboard from "./onwer/AttendanceDashboard.jsx";
const Maindashboard = () => {
  const { isAuth, user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!isAuth) return <p>Not authorized</p>;

  if (!user) return <p>Loading user...</p>;

  console.log(user.role);
  // return <>{user?.role === "employee" && <AttendanceDashboard />}</>;
  return <>{user?.role === "employee" && <Userdashboard />}</>;
};
export default Maindashboard;
