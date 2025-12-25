import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../ContextApi/isAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuth, loading, user } = useContext(AuthContext);
  // user = { id, name, role }

  // 1️⃣ While checking auth
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // 2️⃣ Not logged in
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }console.log(allowedRoles)
 
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4️⃣ Allowed
  return children;
};

export default ProtectedRoute;
