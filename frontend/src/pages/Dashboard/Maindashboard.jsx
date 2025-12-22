import React, { useContext } from "react";
import { User } from "lucide-react";
import { AuthContext } from "../../ContextApi/isAuth";

const Maindashboard = () => {
  const { isAuth, user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!isAuth) return <p>Not authorized</p>;

  if (!user) return <p>Loading user...</p>;

  return <h1>Welcome {user.name}</h1>;
};

export default Maindashboard;
