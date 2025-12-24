import { Outlet, useLocation } from "react-router-dom";

const Users = () => {
  const location = useLocation();
  const isAddPage = location.pathname.endsWith("/add");

  return (
    <div>
     
    </div>
  );
};

export default Users;
