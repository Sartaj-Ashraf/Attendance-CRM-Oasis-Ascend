// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../axios/axios";
// import toast from "react-hot-toast";

// const AddUser = ({ onClose }) => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     payment: "paid",
//     role: "employee",
//     department: "",
//   });

//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🔹 Fetch departments
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const res = await api.get("/department/get");
//         setDepartments(res.data?.data || res.data || []);
//       } catch (error) {
//         toast.error("Failed to load departments");
//       }
//     };
//     fetchDepartments();
//   }, []);

//   // 🔹 Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // 🔹 Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { username, email, phone, department } = form;
//     if (!username || !email || !phone || !department) {
//       toast.error("All fields are required");
//       return;
//     }

//     const toastId = toast.loading("Creating user...");
//     try {
//       setLoading(true);

//       await api.post("/owner/create", form);

//       toast.success("User created successfully", { id: toastId });

//       setForm({
//         username: "",
//         email: "",
//         phone: "",
//         payment: "paid",
//         role: "employee",
//         department: "",
//       });

//       setTimeout(() => navigate("/owner/users"), 1200);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create user", {
//         id: toastId,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New User</h2>
//       <p className="text-gray-500 mb-6">
//         Fill in the details to create a new employee
//       </p>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Username */}
//         <input
//           name="username"
//           value={form.username}
//           onChange={handleChange}
//           placeholder="Username"
//           autoComplete="off"
//           required
//           className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         />

//         {/* Email */}
//         <input
//           name="email"
//           type="email"
//           value={form.email}
//           onChange={handleChange}
//           placeholder="Email"
//           autoComplete="email"
//           required
//           className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         />

//         {/* Phone */}
//         <input
//           name="phone"
//           type="tel"
//           value={form.phone}
//           onChange={handleChange}
//           placeholder="Phone"
//           autoComplete="tel"
//           required
//           className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         />

//         {/* Department */}
//         <select
//           name="department"
//           value={form.department}
//           onChange={handleChange}
//           required
//           className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         >
//           <option value="">Select Department</option>
//           {departments.map((dept) => (
//             <option key={dept._id} value={dept._id}>
//               {dept.name}
//             </option>
//           ))}
//         </select>

//         {/* Payment */}
//         <select
//           name="payment"
//           value={form.payment}
//           onChange={handleChange}
//           className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         >
//           <option value="paid">Paid</option>
//           <option value="unpaid">Unpaid</option>
//         </select>

//         {/* Role (fixed) */}
//         <input
//           value="Employee"
//           disabled
//           className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
//         />

//         {/* Buttons */}
//         <div className="flex justify-end gap-4 pt-6">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
//           >
//             {loading ? "Creating..." : "Add User"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddUser;

// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import api from "../../../axios/axios";

// const AddUser = ({ onClose }) => {
//   const [loading, setLoading] = useState(false);

//   // 🔹 Logged in user info
//   const [authUser, setAuthUser] = useState(null);

//   // 🔹 Departments (for owner only)
//   const [departments, setDepartments] = useState([]);

//   // 🔹 Form state
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     password: "",
//     department: "",
//     role: "employee",
//   });

//   /* ================= FETCH AUTH USER ================= */
//   useEffect(() => {
//     const fetchAuthUser = async () => {
//       try {
//         const res = await api.get("/api/isAuth");
//         setAuthUser(res.data.user);

//         // If manager → auto assign department
//         if (res.data.user.role === "manager") {
//           setForm((prev) => ({
//             ...prev,
//             department: res.data.user.department?._id,
//           }));
//         }
//       } catch {
//         toast.error("Failed to load user info");
//       }
//     };

//     fetchAuthUser();
//   }, []);

//   useEffect(() => {
//     if (authUser?.role === "owner") {
//       fetchDepartments();
//     }
//   }, [authUser]);

//   const fetchDepartments = async () => {
//     try {
//       const res = await api.get("/department/get");
//       setDepartments(res.data.departments || []);
//     } catch {
//       toast.error("Failed to fetch departments");
//     }
//   };

//   /* ================= HANDLE CHANGE ================= */
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.username || !form.email || !form.password) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.post("/owner/addUser", form);

//       toast.success("User added successfully");
//       onClose?.();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//       <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-6">
//           Add Employee
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* NAME */}
//           <input
//             type="text"
//             name="username"
//             placeholder="Full Name"
//             value={form.username}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           />

//           {/* EMAIL */}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           />

//           {/* PHONE */}
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone"
//             value={form.phone}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           />

//           {/* PASSWORD */}
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           />
//                <select
//           name="payment"
//           value={form.payment}
//           onChange={handleChange}
//           className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         >
//           <option value="paid">Full Time</option>
//           <option value="unpaid">Internship</option>
//         </select>
//           {authUser?.role === "owner" && (
//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg bg-white"
//             >
//               <option value="employee">Employee</option>
//             </select>
//           )}

//           {/* DEPARTMENT */}
//           {authUser?.role === "owner" ? (
//             <select
//               name="department"
//               value={form.department}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-lg bg-white"
//             >
//               <option value="">Select Department</option>
//               {departments.map((dept) => (
//                 <option key={dept._id} value={dept._id}>
//                   {dept.name}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
//               Department: {authUser?.department?.name}
//             </div>
//           )}
              

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? "Adding..." : "Add User"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddUser;
import { useState, useEffect } from "react";
import api from "../../../axios/axios";
import { toast } from "sonner";

const AddUser = ({ onClose }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    payment: "paid",
    role: "employee",
    department: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  /* ================= FETCH AUTH USER ================= */
  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await api.get("/api/isAuth");
        setAuthUser(res.data.user);

        // 🔒 IF MANAGER → FIX DEPARTMENT
        if (res.data.user.role === "manager") {
          setForm((prev) => ({
            ...prev,
            department: res.data.user.department?._id,
          }));
        }
      } catch {
        toast.error("Failed to load user info");
      }
    };

    fetchAuthUser();
  }, []);

  /* ================= FETCH DEPARTMENTS (OWNER ONLY) ================= */
  useEffect(() => {
    if (authUser?.role === "owner") {
      fetchDepartments();
    }
  }, [authUser]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department/get");

      // ✅ SAME AS YOUR FIRST CODE
      setDepartments(res.data?.data || res.data || []);
    } catch {
      toast.error("Failed to load departments");
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, phone, department } = form;

    if (!username || !email || !phone || !department) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/owner/create", form);

      toast.success("User created successfully");
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Add New User
      </h2>
      <p className="text-gray-500 mb-6">
        Fill in the details to create a new employee
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* USERNAME */}
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />

        {/* PHONE */}
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />

        {/* DEPARTMENT */}
        {authUser?.role === "owner" ? (
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        ) : (
          // 🔒 MANAGER: SHOW FIXED DEPARTMENT
          <div className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-600">
            Department: {authUser?.department?.name}
          </div>
        )}

        {/* PAYMENT */}
        <select
          name="payment"
          value={form.payment}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="paid">Full Time</option>
          <option value="unpaid">Internship</option>
        </select>

        {/* ROLE (FIXED) */}
        <input
          value="Employee"
          disabled
          className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
