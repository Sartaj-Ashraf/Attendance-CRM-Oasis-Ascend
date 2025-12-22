// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../axios/axios";

// Create context
const AuthContext = createContext(null);

// Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- AUTO LOGIN / CHECK SESSION ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/isAuth"); // must return user + role
        setUser(res.data.user);
        setIsAuth(true);
      } catch (error) {
        setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // --- LOGIN HANDLER ---
  const login = async (credentials) => {
    const res = await api.post("/login", credentials); 
    setUser(res.data.user);
    setIsAuth(true);
  };

  // --- LOGOUT HANDLER ---
  const logout = async () => {
    await api.post("/logout");
    setUser(null);
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export default AuthProvider;
