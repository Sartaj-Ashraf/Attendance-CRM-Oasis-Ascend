import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../axios/axios";

// ✅ Context
const AuthContext = createContext(null);

// ✅ Provider
const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/isAuth");
        setIsAuth(true);
        setRole(res.data.role);
      } catch (err) {
        setIsAuth(false);
        setRole("");
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ MUST be a named export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

// ✅ default export
export default AuthProvider;
