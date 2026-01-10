import React, { useEffect, useState, useMemo } from "react";
import api from "../../../axios/axios.js";
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

  /* ================= FETCH MANAGERS ================= */
  const fetchManagers = async () => {
    try {
      const res = await api.get("/owner/getManagers");
      setManagers(res.data.data || []);
    } catch {
      toast.error("Failed to load managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  /* ================= FILTER ================= */
  const filteredManagers = useMemo(() => {
    return managers.filter((manager) =>
      manager?.username
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    );
  }, [managers, debouncedSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 sm:p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Managers
          </h1>
          <p className="text-sm text-gray-500">
            List of all department managers
          </p>
        </div>

        <input
          type="text"
          placeholder="Search manager..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:ml-auto w-full sm:w-64 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block bg-white shadow-xl rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
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
                  <td className="px-6 py-4 font-medium">
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
                      onClick={() => {
                        setSelectedManager(manager);
                        setShowReplaceModal(true);
                      }}
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

      {/* ================= MOBILE CARDS ================= */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading managers...
          </div>
        ) : filteredManagers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No managers found
          </div>
        ) : (
          filteredManagers.map((manager) => (
            <div
              key={manager._id}
              className="bg-white rounded-xl border p-4 shadow-sm"
            >
              <p className="font-medium text-gray-800">
                {manager.username}
              </p>
              <p className="text-xs text-gray-500 break-all">
                {manager.email}
              </p>

              <div className="mt-2 text-sm space-y-1">
                <p>
                  <span className="text-gray-500">Department:</span>{" "}
                  {manager.department?.name || "Not Assigned"}
                </p>

                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                      manager.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {manager.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedManager(manager);
                  setShowReplaceModal(true);
                }}
                className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Demote Manager
              </button>
            </div>
          ))
        )}
      </div>

      {/* ================= REPLACE MODAL ================= */}
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
