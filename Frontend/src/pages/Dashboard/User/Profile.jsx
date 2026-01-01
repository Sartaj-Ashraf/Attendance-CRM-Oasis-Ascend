
// import React, { useEffect, useState } from "react";
// import api from "../../../axios/axios";
// import { toast } from "sonner";

// const MyProfile = () => {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [isEditing, setIsEditing] = useState(false);
//   const [passwordVerified, setPasswordVerified] = useState(false);
//   const [password, setPassword] = useState("");

//   const [profile, setProfile] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     role: "",
//     department: "",
//   });

//   /* ================= FETCH PROFILE ================= */
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await api.get("/api/isAuth");
//         const user = res.data.user;

//         setProfile({
//           username: user.username || "",
//           email: user.email || "",
//           phone: user.phone || "",
//           role: user.role || "",
//           department: user.department?.name || "",
//         });
//       } catch {
//         toast.error("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   /* ================= VERIFY PASSWORD ================= */
//   const verifyPasswordHandler = async () => {
//     if (!password) {
//       toast.error("Enter your password");
//       return;
//     }

//     try {
//          setSaving(true);
//              await api.post("/auth/verify-password", {
//                   password,
//                  });

//       toast.success("Password verified");
//       setPasswordVerified(true);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Incorrect password"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================= SAVE PROFILE ================= */
//   const saveProfile = async () => {
//     try {
//       setSaving(true);

//       await api.put("/user/updateProfile", {
//         username: profile.username,
//         phone: profile.phone,
//       });

//       toast.success("Profile updated");

//       // reset
//       setIsEditing(false);
//       setPasswordVerified(false);
//       setPassword("");
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Update failed"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p className="p-6">Loading profile...</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white rounded-xl shadow-lg border border-gray-200">

//         {/* HEADER */}
//         <div className="px-6 py-4 border-b">
//           <h2 className="text-lg font-bold">My Profile</h2>
//         </div>

//         <div className="p-6">

//           {/* ================= PASSWORD SCREEN ================= */}
//           {isEditing && !passwordVerified && (
//             <div className="max-w-md mx-auto space-y-4 text-center">
//               <h3 className="text-lg font-semibold">
//                 Verify Password
//               </h3>

//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 className="w-full border rounded-lg px-4 py-2"
//               />

//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => {
//                     setIsEditing(false);
//                     setPassword("");
//                   }}
//                   className="px-5 py-2 border rounded-lg"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={verifyPasswordHandler}
//                   disabled={saving}
//                   className="px-5 py-2 bg-blue-600 text-white rounded-lg"
//                 >
//                   Verify
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ================= PROFILE FORM ================= */}
//           {(!isEditing || passwordVerified) && (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Field
//                   label="Full Name"
//                   value={profile.username}
//                   disabled={!passwordVerified}
//                   onChange={(v) =>
//                     setProfile({ ...profile, username: v })
//                   }
//                 />

//                 <Field
//                   label="Email"
//                   value={profile.email}
//                   disabled // email locked
//                 />

//                 <Field
//                   label="Phone"
//                   value={profile.phone}
//                   disabled={!passwordVerified}
//                   onChange={(v) =>
//                     setProfile({ ...profile, phone: v })
//                   }
//                 />

//                 <Field label="Role" value={profile.role} disabled />
//                 <Field label="Department" value={profile.department} disabled />
//               </div>

//               <div className="flex justify-end mt-6 gap-3">
//                 {!isEditing && (
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//                   >
//                     Edit Details
//                   </button>
//                 )}

//                 {passwordVerified && (
//                   <button
//                     onClick={saveProfile}
//                     disabled={saving}
//                     className="px-6 py-2 bg-green-600 text-white rounded-lg"
//                   >
//                     Save Changes
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ================= FIELD ================= */
// const Field = ({ label, value, disabled, onChange }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <input
//       value={value}
//       disabled={disabled}
//       onChange={(e) => onChange?.(e.target.value)}
//       className={`w-full border rounded-lg px-3 py-2 ${
//         disabled ? "bg-gray-100" : ""
//       }`}
//     />
//   </div>
// );

// export default MyProfile;
// import React, { useEffect, useState } from "react";
// import api from "../../../axios/axios";
// import { toast } from "sonner";
// import ChangeEmailModal from "./EmailChange";

// const MyProfile = () => {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [isEditing, setIsEditing] = useState(false);
//   const [passwordVerified, setPasswordVerified] = useState(false);
//   const [password, setPassword] = useState("");

//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [pendingEmail, setPendingEmail] = useState("");
//   const [emailVerified, setEmailVerified] = useState(true);

//   const [profile, setProfile] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     role: "",
//     department: "",
//   });

//   /* ================= FETCH PROFILE ================= */
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await api.get("/api/isAuth");
//         const user = res.data.user;

//         setProfile({
//           username: user.username || "",
//           email: user.email || "",
//           phone: user.phone || "",
//           role: user.role || "",
//           department: user.department?.name || "",
//         });

//         // pending email handling
//         if (user.pendingEmail) {
//           setPendingEmail(user.pendingEmail);
//           setEmailVerified(false);
//         }
//       } catch {
//         toast.error("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   /* ================= VERIFY PASSWORD ================= */
//   const verifyPasswordHandler = async () => {
//     if (!password) return toast.error("Enter your password");

//     try {
//       setSaving(true);
//       await api.post("/auth/verify-password", { password });

//       toast.success("Password verified");
//       setPasswordVerified(true);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Incorrect password");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================= SAVE PROFILE ================= */
//   const saveProfile = async () => {
//     try {
//       setSaving(true);

//       await api.put("/user/updateProfile", {
//         username: profile.username,
//         phone: profile.phone,
//       });

//       toast.success("Profile updated");

//       setIsEditing(false);
//       setPasswordVerified(false);
//       setPassword("");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p className="p-6">Loading profile...</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white rounded-xl shadow-lg border border-gray-200">

//         {/* HEADER */}
//         <div className="px-6 py-4 border-b">
//           <h2 className="text-lg font-bold">My Profile</h2>
//           <p className="text-sm text-gray-500">
//             Manage your personal information
//           </p>
//         </div>

//         <div className="p-6">

//           {/* PASSWORD VERIFY */}
//           {isEditing && !passwordVerified && (
//             <div className="max-w-md mx-auto space-y-4 text-center">
//               <h3 className="text-lg font-semibold">
//                 Verify Your Password
//               </h3>

//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 className="w-full border rounded-lg px-4 py-2"
//               />

//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => {
//                     setIsEditing(false);
//                     setPassword("");
//                   }}
//                   className="px-5 py-2 border rounded-lg"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={verifyPasswordHandler}
//                   disabled={saving}
//                   className="px-5 py-2 bg-blue-600 text-white rounded-lg"
//                 >
//                   Verify
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* PROFILE FORM */}
//           {(!isEditing || passwordVerified) && (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                 {/* NAME */}
//                 <Field
//                   label="Full Name"
//                   value={profile.username}
//                   disabled={!passwordVerified}
//                   onChange={(v) =>
//                     setProfile({ ...profile, username: v })
//                   }
//                 />

//                 {/* EMAIL */}
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Email
//                   </label>

//                   <div className="relative">
//                     <input
//                       value={pendingEmail || profile.email}
//                       disabled
//                       className={`w-full border rounded-lg px-3 py-2 pr-28 ${
//                         !emailVerified
//                           ? "border-yellow-400 bg-yellow-50"
//                           : "bg-gray-100"
//                       }`}
//                     />

//                     {!emailVerified && (
//                       <button
//                         onClick={() => setShowEmailModal(true)}
//                         className="absolute right-16 top-1/2 -translate-y-1/2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded hover:underline"
//                       >
//                         Unverified
//                       </button>
//                     )}

//                     {isEditing && passwordVerified && (
//                       <button
//                         onClick={() => setShowEmailModal(true)}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:underline"
//                       >
//                         Change
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* PHONE */}
//                 <Field
//                   label="Phone"
//                   value={profile.phone}
//                   disabled={!passwordVerified}
//                   onChange={(v) =>
//                     setProfile({ ...profile, phone: v })
//                   }
//                 />

//                 <Field label="Role" value={profile.role} disabled />
//                 <Field label="Department" value={profile.department} disabled />
//               </div>

//               <div className="flex justify-end mt-6 gap-3">
//                 {!isEditing && (
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//                   >
//                     Edit Details
//                   </button>
//                 )}

//                 {passwordVerified && (
//                   <button
//                     onClick={saveProfile}
//                     disabled={saving}
//                     className="px-6 py-2 bg-green-600 text-white rounded-lg"
//                   >
//                     Save Changes
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* EMAIL MODAL */}
//       {showEmailModal && (
//         <ChangeEmailModal
//           existingPendingEmail={pendingEmail}
//           onEmailPending={(email) => {
//             setPendingEmail(email);
//             setEmailVerified(false);
//           }}
//           onClose={(verified) => {
//             setShowEmailModal(false);
//             if (verified) {
//               setProfile((p) => ({ ...p, email: pendingEmail }));
//               setPendingEmail("");
//               setEmailVerified(true);
//             }
//           }}
//         />
//       )}
//     </div>
//   );
// };

// /* FIELD COMPONENT */
// const Field = ({ label, value, disabled, onChange }) => (
//   <div>
//     <label className="block text-sm font-medium mb-1">{label}</label>
//     <input
//       value={value}
//       disabled={disabled}
//       onChange={(e) => onChange?.(e.target.value)}
//       className={`w-full border rounded-lg px-3 py-2 ${
//         disabled ? "bg-gray-100" : ""
//       }`}
//     />
//   </div>
// );

// export default MyProfile;

// import React, { useEffect, useState } from "react";
// import api from "../../../axios/axios";
// import { toast } from "sonner";
// import ChangeEmailModal from "./ChangeEmailModal";

// const MyProfile = () => {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [isEditing, setIsEditing] = useState(false);
//   const [passwordVerified, setPasswordVerified] = useState(false);
//   const [password, setPassword] = useState("");

//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [emailModalMode, setEmailModalMode] = useState("change");
//   const [pendingEmail, setPendingEmail] = useState("");

//   const [profile, setProfile] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     role: "",
//     department: "",
//   });

//   /* ================= FETCH PROFILE ================= */
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await api.get("/api/isAuth");
//         const user = res.data.user;

//         setProfile({
//           username: user.username || "",
//           email: user.email || "",
//           phone: user.phone || "",
//           role: user.role || "",
//           department: user.department?.name || "",
//         });

//         // 👇 if backend sends pendingEmail
//         if (user.pendingEmail) {
//           setPendingEmail(user.pendingEmail);
//         }
//       } catch {
//         toast.error("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   /* ================= VERIFY PASSWORD ================= */
//   const verifyPasswordHandler = async () => {
//     if (!password) {
//       toast.error("Enter your password");
//       return;
//     }

//     try {
//       setSaving(true);

//       await api.post("/auth/verify-password", { password });

//       toast.success("Password verified");
//       setPasswordVerified(true);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Incorrect password");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================= SAVE PROFILE ================= */
//   const saveProfile = async () => {
//     try {
//       setSaving(true);

//       await api.put("/user/updateProfile", {
//         username: profile.username,
//         phone: profile.phone,
//       });

//       toast.success("Profile updated");

//       setIsEditing(false);
//       setPasswordVerified(false);
//       setPassword("");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p className="p-6">Loading profile...</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white rounded-xl shadow-lg border border-gray-200">

//         {/* HEADER */}
//         <div className="px-6 py-4 border-b">
//           <h2 className="text-lg font-bold">My Profile</h2>
//           <p className="text-sm text-gray-500">
//             Manage your personal information
//           </p>
//         </div>

//         <div className="p-6">

//           {/* ================= PASSWORD SCREEN ================= */}
//           {isEditing && !passwordVerified && (
//             <div className="max-w-md mx-auto space-y-4 text-center">
//               <h3 className="text-lg font-semibold">
//                 Verify Password
//               </h3>

//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 className="w-full border rounded-lg px-4 py-2"
//               />

//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => {
//                     setIsEditing(false);
//                     setPassword("");
//                   }}
//                   className="px-5 py-2 border rounded-lg"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={verifyPasswordHandler}
//                   disabled={saving}
//                   className="px-5 py-2 bg-blue-600 text-white rounded-lg"
//                 >
//                   Verify
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ================= PROFILE FORM ================= */}
//           {(!isEditing || passwordVerified) && (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                 {/* FULL NAME */}
//                 <Field
//                   label="Full Name"
//                   value={profile.username}
//                   disabled={!passwordVerified}
//                   onChange={(v) =>
//                     setProfile({ ...profile, username: v })
//                   }
//                 />

//                 {/* EMAIL */}
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Email
//                   </label>

//                   <div className="relative">
//                     <input
//                       value={pendingEmail || profile.email}
//                       disabled
//                       className={`w-full border rounded-lg px-3 py-2 pr-28 ${
//                         pendingEmail
//                           ? "border-yellow-400 bg-yellow-50"
//                           : "bg-gray-100"
//                       }`}
//                     />

//                     {/* UNVERIFIED */}
//                     {pendingEmail && (
//                       <button
//                         onClick={() => setShowEmailModal(true)
                          
//                         }
//                         className="absolute right-16 top-1/2 -translate-y-1/2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded"
//                       >
//                         Unverified
//                       </button>
//                     )}

//                     {/* CHANGE */}
//                     {isEditing && passwordVerified && (
//                       <button
//                       onClick={() => {
//                         setEmailModalMode("change");
//                        setShowEmailModal(true);
//                         }}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600"
//                       >
//                         Change
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* PHONE */}
//                 <Field
//                   label="Phone"
//                   value={profile.phone}
//                   disabled={!passwordVerified}
//                   onChange={(v) =>
//                     setProfile({ ...profile, phone: v })
//                   }
//                 />

//                 <Field label="Role" value={profile.role} disabled />
//                 <Field label="Department" value={profile.department} disabled />
//               </div>

//               <div className="flex justify-end mt-6 gap-3">
//                 {!isEditing && (
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//                   >
//                     Edit Details
//                   </button>
//                 )}

//                 {passwordVerified && (
//                   <button
//                     onClick={saveProfile}
//                     disabled={saving}
//                     className="px-6 py-2 bg-green-600 text-white rounded-lg"
//                   >
//                     Save Changes
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* ================= EMAIL MODAL ================= */}
//       {/* {showEmailModal && (
//         <ChangeEmailModal
//           onPendingEmail={(email) => setPendingEmail(email)}
//           onClose={(verified) => {
//             setShowEmailModal(false);

//             if (verified) {
//               setProfile((p) => ({ ...p, email: pendingEmail }));
//               setPendingEmail("");
//             }
//           }}
//         />
//       )} */}
//       {showEmailModal && (
//   <ChangeEmailModal
//     mode={emailModalMode}
//     defaultEmail={pendingEmail}
//     onPendingEmail={(email) => setPendingEmail(email)}
//     onClose={(verified) => {
//       setShowEmailModal(false);
//       setEmailModalMode("email");

//       if (verified) {
//         setProfile((p) => ({ ...p, email: pendingEmail }));
//         setPendingEmail("");
//       }
//     }}
//   />
// )}
//     </div>
//   );
// };

// /* ================= FIELD ================= */
// const Field = ({ label, value, disabled, onChange }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <input
//       value={value}
//       disabled={disabled}
//       onChange={(e) => onChange?.(e.target.value)}
//       className={`w-full border rounded-lg px-3 py-2 ${
//         disabled ? "bg-gray-100" : ""
//       }`}
//     />
//   </div>
// );

// export default MyProfile;

// import React, { useEffect, useState } from "react";
// import api from "../../../axios/axios";
// import { toast } from "sonner";
// import ChangeEmailModal from "./ChangeEmailModal";

// const MyProfile = () => {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [isEditing, setIsEditing] = useState(false);
//   const [passwordVerified, setPasswordVerified] = useState(false);
//   const [password, setPassword] = useState("");

//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [emailModalMode, setEmailModalMode] = useState("change"); // change | verify
//   const [pendingEmail, setPendingEmail] = useState("");
//   const [emailVerified, setEmailVerified] = useState(true);

//   const [profile, setProfile] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     role: "",
//     department: "",
//   });

//   /* ================= FETCH PROFILE ================= */
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await api.get("/api/isAuth");
//         const user = res.data.user;

//         setProfile({
//           username: user.username,
//           email: user.email,
//           phone: user.phone || "",
//           role: user.role,
//           department: user.department?.name || "",
//         });

//         setEmailVerified(!user.pendingEmail);
//         setPendingEmail(user.pendingEmail || "");
//       } catch {
//         toast.error("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   /* ================= VERIFY PASSWORD ================= */
//   const verifyPassword = async () => {
//     if (!password) return toast.error("Enter password");

//     try {
//       setSaving(true);
//       await api.post("/auth/verify-password", { password });
//       toast.success("Password verified");
//       setPasswordVerified(true);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Incorrect password");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================= SAVE PROFILE ================= */
//   const saveProfile = async () => {
//     try {
//       setSaving(true);

//       await api.put("/user/updateProfile", {
//         username: profile.username,
//         phone: profile.phone,
//       });

//       toast.success("Profile updated");
//       setIsEditing(false);
//       setPasswordVerified(false);
//       setPassword("");
//     } catch {
//       toast.error("Update failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p className="p-6">Loading...</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white rounded-xl shadow-lg border">

//         {/* HEADER */}
//         <div className="px-6 py-4 border-b">
//           <h2 className="text-lg font-bold">My Profile</h2>
//           <p className="text-sm text-gray-500">
//             Manage your personal information
//           </p>
//         </div>

//         <div className="p-6">

//           {/* PASSWORD SCREEN */}
//           {isEditing && !passwordVerified && (
//             <div className="max-w-md mx-auto space-y-4 text-center">
//               <h3 className="text-lg font-semibold">Verify Password</h3>

//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 className="w-full border rounded-lg px-4 py-2"
//               />

//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => {
//                     setIsEditing(false);
//                     setPassword("");
//                   }}
//                   className="px-5 py-2 border rounded-lg"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={verifyPassword}
//                   disabled={saving}
//                   className="px-5 py-2 bg-blue-600 text-white rounded-lg"
//                 >
//                   Verify
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* PROFILE FORM */}
//           {(!isEditing || passwordVerified) && (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                 <Field
//                   label="Full Name"
//                   value={profile.username}
//                   disabled={!passwordVerified}
//                   onChange={(v) =>
//                     setProfile({ ...profile, username: v })
//                   }
//                 />

//                 {/* EMAIL */}
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Email
//                   </label>

//                   <div className="relative">
//                     <input
//                       value={pendingEmail || profile.email}
//                       disabled
//                       className="w-full border rounded-lg px-3 py-2 bg-gray-100"
//                     />

//                     {passwordVerified && (
//                       <button
//                         onClick={() => {
//                           setEmailModalMode("change");
//                           setShowEmailModal(true);
//                         }}
//                         className="absolute right-3 top-2 text-sm text-blue-600"
//                       >
//                         Change
//                       </button>
//                     )}
//                   </div>

//                   {!emailVerified && (
//                     <button
//                       onClick={() => {
//                         setEmailModalMode("verify");
//                         setShowEmailModal(true);
//                       }}
//                       className="mt-1 text-xs text-orange-600 underline"
//                     >
//                       Unverified
//                     </button>
//                   )}
//                 </div>

//                 <Field
//                   label="Phone"
//                   value={profile.phone}
//                   disabled={!passwordVerified}
//                   onChange={(v) =>
//                     setProfile({ ...profile, phone: v })
//                   }
//                 />

//                 <Field label="Role" value={profile.role} disabled />
//                 <Field label="Department" value={profile.department} disabled />
//               </div>

//               <div className="flex justify-end mt-6 gap-3">
//                 {!isEditing && (
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//                   >
//                     Edit Details
//                   </button>
//                 )}

//                 {passwordVerified && (
//                   <button
//                     onClick={saveProfile}
//                     disabled={saving}
//                     className="px-6 py-2 bg-green-600 text-white rounded-lg"
//                   >
//                     Save Changes
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* EMAIL MODAL */}
//       {showEmailModal && (
//         <ChangeEmailModal
//           mode={emailModalMode}
//           defaultEmail={pendingEmail}
//           onPendingEmail={(email) => {
//             setPendingEmail(email);
//             setEmailVerified(false);
//           }}
//           onClose={(verified) => {
//             setShowEmailModal(false);
//             if (verified) {
//               setProfile((p) => ({ ...p, email: pendingEmail }));
//               setPendingEmail("");
//               setEmailVerified(true);
//             }
//           }}
//         />
//       )}
//     </div>
//   );
// };

// const Field = ({ label, value, disabled, onChange }) => (
//   <div>
//     <label className="block text-sm font-medium mb-1">{label}</label>
//     <input
//       value={value}
//       disabled={disabled}
//       onChange={(e) => onChange?.(e.target.value)}
//       className={`w-full border rounded-lg px-3 py-2 ${
//         disabled ? "bg-gray-100" : ""
//       }`}
//     />
//   </div>
// );

// export default MyProfile;

import React, { useEffect, useState } from "react";
import api from "../../../axios/axios";
import { toast } from "sonner";
import ChangeEmailModal from "./ChangeEmailModal";

const MyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [password, setPassword] = useState("");

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailModalMode, setEmailModalMode] = useState("change");

  const [pendingEmail, setPendingEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(true);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    department: "",
  });

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/isAuth");
        const user = res.data.user;

        setProfile({
          username: user.username,
          email: user.email,
          phone: user.phone || "",
          role: user.role,
          department: user.department?.name || "",
        });

        if (user.pendingEmail) {
          setPendingEmail(user.pendingEmail);
          setEmailVerified(false);
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ================= VERIFY PASSWORD ================= */
  const verifyPassword = async () => {
    if (!password) return toast.error("Enter password");

    try {
      setSaving(true);
      await api.post("/auth/verify-password", { password });
      toast.success("Password verified");
      setPasswordVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Incorrect password");
    } finally {
      setSaving(false);
    }
  };

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      setSaving(true);

      await api.put("/user/updateProfile", {
        username: profile.username,
        phone: profile.phone,
      });

      toast.success("Profile updated");
      setIsEditing(false);
      setPasswordVerified(false);
      setPassword("");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border">

        {/* HEADER */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold">My Profile</h2>
          <p className="text-sm text-gray-500">
            Manage your personal information
          </p>
        </div>

        <div className="p-6">

          {/* PASSWORD VERIFY */}
          {isEditing && !passwordVerified && (
            <div className="max-w-md mx-auto space-y-4 text-center">
              <h3 className="text-lg font-semibold">Verify Password</h3>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border rounded-lg px-4 py-2"
              />

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setPassword("");
                  }}
                  className="px-5 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={verifyPassword}
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* PROFILE FORM */}
          {(!isEditing || passwordVerified) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Field
                  label="Full Name"
                  value={profile.username}
                  disabled={!passwordVerified}
                  onChange={(v) =>
                    setProfile({ ...profile, username: v })
                  }
                />

                {/* EMAIL FIELD */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>

                  <div className="relative">
                    <input
                      value={pendingEmail || profile.email}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 pr-40 bg-gray-100"
                    />

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                      {passwordVerified && (
                        <button
                          onClick={() => {
                            setEmailModalMode("change");
                            setShowEmailModal(true);
                          }}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Change
                        </button>
                      )}

                      {!emailVerified && (
                        <button
                          onClick={() => {
                            setEmailModalMode("verify");
                            setShowEmailModal(true);
                          }}
                          className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200"
                        >
                          Unverified
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <Field
                  label="Phone"
                  value={profile.phone}
                  disabled={!passwordVerified}
                  onChange={(v) =>
                    setProfile({ ...profile, phone: v })
                  }
                />

                <Field label="Role" value={profile.role} disabled />
                <Field label="Department" value={profile.department} disabled />
              </div>

              <div className="flex justify-end mt-6 gap-3">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Edit Details
                  </button>
                )}

                {passwordVerified && (
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* EMAIL MODAL */}
      {showEmailModal && (
        <ChangeEmailModal
          mode={emailModalMode}
          defaultEmail={pendingEmail}
          onPendingEmail={(email) => {
            setPendingEmail(email);
            setEmailVerified(false);
          }}
          onClose={(verified) => {
            setShowEmailModal(false);
            if (verified) {
              setProfile((p) => ({ ...p, email: pendingEmail }));
              setPendingEmail("");
              setEmailVerified(true);
            }
          }}
        />
      )}
    </div>
  );
};

/* FIELD */
const Field = ({ label, value, disabled, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full border rounded-lg px-3 py-2 ${
        disabled ? "bg-gray-100" : ""
      }`}
    />
  </div>
);

export default MyProfile;



