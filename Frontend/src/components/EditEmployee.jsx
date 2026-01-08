// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import api from "../axios/axios.js";

// const EditEmployee = ({ user, onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [departments, setDepartments] = useState([]);

//   const [form, setForm] = useState({
//     email: "",
//     department: "",
//     payment: "paid",
//   });

//   /* ================= FETCH DEPARTMENTS ================= */
//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   const fetchDepartments = async () => {
//     try {
//       const res = await api.get("/department/get");

//       // setDepartments(res)
//       setDepartments(res.data?.data || []);
//     } catch {
//       toast.error("Failed to fetch departments");
//     }
//   };

//   /* ================= PREFILL FORM ================= */
//   useEffect(() => {
//     if (user) {
//       setForm({
//         email: user.email || "",
//         department: user.department?._id || "",
//         payment: user.payment || "paid",
//       });
//     }
//   }, [user]);

//   /* ================= CHANGE ================= */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       await api.put(`/owner/updateUser/${user._id}`, {
//         email: form.email,
//         department: form.department,
//         payment: form.payment,
//       });

//       toast.success("Employee updated successfully");

//       // 🔔 Show info only if backend really changes email
//       if (
//         form.email !== user.email &&
//         form.email !== user.pendingEmail
//       ) {
//         toast.info(
//           "New email added. Verification is required before it becomes active."
//         );
//       }

//       onSuccess?.();
//       onClose();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Failed to update employee"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//       <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-6">
//           Edit Employee
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* EMAIL */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               className="w-full px-4 py-2 border rounded-lg"
//             />
//             {form.email !== user?.email &&
//               form.email !== user?.pendingEmail && (
//                 <p className="text-xs text-orange-600 mt-1">
//                   Changing email will require verification
//                 </p>
//               )}
//           </div>

//           {/* DEPARTMENT */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Department
//             </label>
//             <select
//               name="department"
//               value={form.department}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               className="w-full px-4 py-2 border rounded-lg bg-white"
//             >
//               <option value="">Select Department</option>
//               {departments.map((dept) => (
//                 <option key={dept._id} value={dept._id}>
//                   {dept.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* PAYMENT */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Payment Status
//             </label>
//             <select
//               name="payment"
//               value={form.payment}
//               onChange={handleChange}
//               disabled={loading}
//               className="w-full px-4 py-2 border rounded-lg bg-white"
//             >
//               <option value="paid">Paid</option>
//               <option value="unpaid">Unpaid</option>
//             </select>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={loading}
//               className="px-4 py-2 border rounded-lg"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
//             >
//               {loading ? "Saving..." : "Update"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditEmployee;


import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../axios/axios.js";
import { useContext } from "react";
import AuthContext from "../ContextApi/isAuth.jsx";

const EditEmployee = ({
  user,
  onClose,
  onSuccess,
  managerDepartmentId,
}) => {
  const { user: authUser } = useContext(AuthContext);
  const role = authUser?.role;

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    email: "",
    department: "",
    payment: "paid",
  });

  /* ================= FETCH DEPARTMENTS (OWNER ONLY) ================= */
  useEffect(() => {
    if (role === "owner") fetchDepartments();
  }, [role]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");
      setDepartments(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  /* ================= PREFILL FORM ================= */
  useEffect(() => {
    if (!user) return;

    setForm({
      email: user.email || "",
      department:
        role === "manager"
          ? managerDepartmentId // 🔒 FORCE MANAGER DEPT
          : user.department?._id || "",
      payment: user.payment || "paid",
    });
  }, [user, role, managerDepartmentId]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ❌ MANAGER CANNOT CHANGE DEPARTMENT
    if (name === "department" && role === "manager") return;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/owner/updateUser/${user._id}`, {
        email: form.email,
        department:
          role === "manager" ? managerDepartmentId : form.department,
        payment: form.payment,
      });

      toast.success("Employee updated");

      if (
        form.email !== user.email &&
        form.email !== user.pendingEmail
      ) {
        toast.info("New email requires verification");
      }

      onSuccess?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Edit Employee</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange}
              name="email"
              required
              disabled={loading}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          {/* DEPARTMENT */}
          <div>
            <label className="text-sm font-medium">Department</label>

            {role === "manager" ? (
              <input
                disabled
                value={user.department?.name || ""}
                className="w-full border px-4 py-2 rounded-lg bg-gray-100"
              />
            ) : (
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* PAYMENT */}
          <div>
            <label className="text-sm font-medium">Payment</label>
            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
