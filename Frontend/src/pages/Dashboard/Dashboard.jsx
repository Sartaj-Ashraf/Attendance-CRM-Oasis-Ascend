import React from "react";
import AuthContext from "../../ContextApi/isAuth";
const Dashboard = () => {
  const { isAuth, user, loading } = useContext(AuthContext);
  if (loading) return <p>Loading...</p>;
  if (!isAuth) return <p>Not authorized</p>;
  return <h1>Welcome {user.name}</h1>;
};

export default Dashboard;
