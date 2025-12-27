import React, { useEffect, useState, useMemo } from "react";
import api from "../../../axios/axios";
import toast from "react-hot-toast";
import useDebounce from "../../../hooks/Debouncing";
// import ConfirmModal from "@/components/common/ConfirmModal";
import ConfirmModal from "../../../components/confrim/ConfirmModal";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  const DebounceSearch = useDebounce(search, 600);
  const fetchManagers = async () => {
    try {
      const res = await api.get("/owner/getManagers");
      setManagers(res.data.data);
    } catch (err) {
      toast.error("Failed to load managers");
    } finally {
      setLoading(false);
    }
  };
  const handleOpenConfirm = (manager) => {
    setSelectedManager(manager);
    setShowConfirm(true);
  };
  useEffect(() => {
    fetchManagers();
  }, []);
  const filteredManagers = useMemo(() => {
    return managers.filter((manager) =>
      manager?.username?.toLowerCase().includes(search.toLowerCase())
    );
  }, [managers, DebounceSearch]);
  const handleConfirmDemote = async () => {
    try {
      await api.patch(`/owner/demote/${selectedManager._id}`);
      toast.success("Manager demoted successfully");

      // update UI
      setManagers((prev) => prev.filter((m) => m._id !== selectedManager._id));
    } catch (error) {
      toast.error("Failed to demote manager");
    } finally {
      setShowConfirm(false);
      setSelectedManager(null);
    }
  };
  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedManager(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 flex">
        <div>
          {" "}
          <h1 className="text-2xl font-bold text-gray-800">Managers</h1>{" "}
          <p className="text-gray-500">List of all department managers</p>
        </div>

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-grey-900 px-3 py-2 rounded ml-auto"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Demote</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  Loading managers...
                </td>
              </tr>
            ) : filteredManagers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No managers found
                </td>
              </tr>
            ) : (
              filteredManagers.map((manager) => (
                <tr
                  key={manager._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {manager.username}
                  </td>

                  <td className="px-6 py-4 text-gray-600">{manager.email}</td>

                  <td className="px-6 py-4 text-gray-600">
                    {manager.department?.name || "Not Assigned"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        manager.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {manager.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center ">
                    <button
                      onClick={() => handleOpenConfirm(manager)}
                      className="text-white  p-2 rounded-2xl hover:underline text-m bg-red-700"
                    >
                      Demote
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Managers;
