import React, { useState } from "react";
import { toast } from "sonner";

const MakeAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [search, setSearch] = useState("");

  // 🔹 temporary employees
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", status: "" },
    { id: 2, name: "Jane Smith", status: "" },
    { id: 3, name: "Alex Brown", status: "" },
    { id: 4, name: "Sara Lee", status: "" },
  ]);

  const markAttendance = (id, status) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status } : emp))
    );
  };

  const markAllPresent = () => {
    setEmployees((prev) => prev.map((emp) => ({ ...emp, status: "present" })));
    toast.success("All marked present");
  };

  const submitAttendance = () => {
    const incomplete = employees.some((e) => !e.status);

    if (incomplete) {
      toast.error("Please mark attendance for all employees");
      return;
    }

    toast.success("Attendance submitted (mock)");
    console.log({ date, employees });
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const summary = {
    present: employees.filter((e) => e.status === "present").length,
    absent: employees.filter((e) => e.status === "absent").length,
    late: employees.filter((e) => e.status === "late").length,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Mark Attendance</h1>

      {/* TOP CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />

          <button
            onClick={markAllPresent}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Mark All Present
          </button>
        </div>

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-64"
        />
      </div>

      <div className="flex gap-6 mb-6 text-sm">
        <span className="text-green-600">Present: {summary.present}</span>
        <span className="text-red-600">Absent: {summary.absent}</span>
        <span className="text-yellow-600">Late: {summary.late}</span>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-1 py-3">View user </th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center py-6 text-gray-500">
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-t">
                  <td className="px-6 py-4">{emp.name}</td>

                  <td className="px-6 py-4 flex gap-3">
                    {["present", "absent", "late"].map((status) => (
                      <button
                        key={status}
                        onClick={() => markAttendance(emp.id, status)}
                        className={`px-3 py-1 rounded capitalize ${
                          emp.status === status
                            ? status === "present"
                              ? "bg-green-600 text-white"
                              : status === "absent"
                              ? "bg-red-600 text-white"
                              : "bg-yellow-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SUBMIT */}
      <button
        onClick={submitAttendance}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Submit Attendance
      </button>
    </div>
  );
};

export default MakeAttendance;
