import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../ContextApi/isAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useContext(AuthContext);

  // 1️⃣ While checking auth (API call in AuthProvider)
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // 2️⃣ If not authenticated → redirect to login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Authenticated → render the protected component
  return children;
};

export default ProtectedRoute;
