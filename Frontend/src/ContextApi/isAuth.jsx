import React, { createContext, useEffect, useState } from "react";
// import api from "../axios/axios.js";
import api from "../axios/axios.js";
import axios from "axios";
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/isAuth`,
          {
            withCredentials: true, // 🔥 IMPORTANT
          }
        );
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
        setUser,
        setIsAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
