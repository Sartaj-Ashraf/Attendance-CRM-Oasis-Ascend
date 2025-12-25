import React, { useEffect, useState } from "react";
import api from "../../../axios/axios.js";
import { toast } from "react-toastify";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDepartmentId, setOpenDepartmentId] = useState(null);

  // ✅ Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data.data || res.data);
    } catch (error) {
      toast.error("Failed to fetch departments");
    }
  };

  // ✅ Fetch users by department (QUERY PARAM)
  const fetchUsers = async (departmentId) => {
    try {
      const res = await api.get("/owner/getAllUsers", {
        params: { department: departmentId }, // ✅ REQUIRED
      });
      setUsers(res.data.data); // ✅ backend returns `data`
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✅ Toggle + fetch users for selected department
  const toggleDetails = (departmentId) => {
    if (openDepartmentId === departmentId) {
      setOpenDepartmentId(null);
      return;
    }

    setOpenDepartmentId(departmentId);
    fetchUsers(departmentId); // ✅ fetch on click
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Departments</h1>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center py-6 text-gray-500">
                  No departments found
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <React.Fragment key={dept._id}>
                  <tr className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {dept.name}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleDetails(dept._id)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
                      >
                        {openDepartmentId === dept._id
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                    </td>
                  </tr>

                  {openDepartmentId === dept._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="2" className="px-6 py-4 text-gray-600">
                        Total Users: {users.length}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Departments;
