import React, { useEffect, useState, useMemo } from "react";
import api from "../../../axios/axios.js"
import toast from "react-hot-toast";
import useDebounce from "../../../hooks/Debouncing";
import OwnerReplaceManagerModal from "../../../components/OwnerReplaceManagerModal";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  const debouncedSearch = useDebounce(search, 600);

  // 🔹 Fetch managers
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

  useEffect(() => {
    fetchManagers();
  }, []);

  // 🔹 Open replace modal
  const handleOpenReplaceModal = (manager) => {
    setSelectedManager(manager);
    setShowReplaceModal(true);
  };

  // 🔹 Filter managers
  const filteredManagers = useMemo(() => {
    return managers.filter((manager) =>
      manager?.username
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    );
  }, [managers, debouncedSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      
      <div className="mb-6 flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Managers</h1>
          <p className="text-gray-500">List of all department managers</p>
        </div>

        <input
          type="text"
          placeholder="Search manager..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Loading managers...
                </td>
              </tr>
            ) : filteredManagers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
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

                  <td className="px-6 py-4 text-gray-600">
                    {manager.email}
                  </td>

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

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleOpenReplaceModal(manager)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
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

      <OwnerReplaceManagerModal
        open={showReplaceModal}
        manager={selectedManager}
        onClose={() => {
          setShowReplaceModal(false);
          setSelectedManager(null);
        }}
        onSuccess={fetchManagers}
      />
    </div>
  );
};

export default Managers;
