import { Outlet, useLocation } from "react-router-dom";

const Users = () => {
  const location = useLocation();
  const isAddPage = location.pathname.endsWith("/add");

  return (
    <div>
      {isAddPage && (
        <h2 className="text-xl font-bold">
          <Outlet />
        </h2>
      )}
    </div>
  );
};

export default Users;
