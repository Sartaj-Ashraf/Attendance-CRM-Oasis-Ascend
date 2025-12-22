import React, { useState } from "react";

const AttendanceDashboard = () => {
  const users = [
    { id: 1, name: "Rahul Sharma", role: "employee" },
    { id: 2, name: "Amit Verma", role: "employee" },
    { id: 3, name: "Neha Singh", role: "employee" },
  ];

  const today = new Date().toLocaleDateString();
  const [attendance, setAttendance] = useState([]);

  const isMarked = (userId) =>
    attendance.some((a) => a.userId === userId && a.date === today);

  const markAttendance = (user, status) => {
    if (isMarked(user.id)) return;

    setAttendance((prev) => [
      ...prev,
      {
        userId: user.id,
        name: user.name,
        status,
        date: today,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance Dashboard
          </h1>
          <p className="text-gray-500">
            Mark and manage employee attendance for today
          </p>
        </div>

        {/* Mark Attendance */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Employee</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-center p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const marked = isMarked(user.id);

                  return (
                    <tr
                      key={user.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium">{user.name}</td>

                      <td className="p-3 text-center">
                        {marked ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Marked
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-center space-x-2">
                        <button
                          disabled={marked}
                          onClick={() => markAttendance(user, "Present")}
                          className={`px-4 py-1 rounded-lg text-white text-sm transition
                            ${
                              marked
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                          Present
                        </button>

                        <button
                          disabled={marked}
                          onClick={() => markAttendance(user, "Absent")}
                          className={`px-4 py-1 rounded-lg text-white text-sm transition
                            ${
                              marked
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                          Absent
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>

          {attendance.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No attendance records yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-center">Date</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{record.name}</td>
                      <td className="p-3 text-center">{record.date}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              record.status === "Present"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
