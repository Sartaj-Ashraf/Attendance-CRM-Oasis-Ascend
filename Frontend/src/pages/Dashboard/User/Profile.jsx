// import React, { useEffect, useState } from "react";
// import api from "../../../axios/axios";
// import { toast } from "sonner";

// const MyProfile = () => {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [profile, setProfile] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     role: "",
//     department: "",
//   });

//   const [passwords, setPasswords] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
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

//   /* ================= PROFILE UPDATE ================= */
//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();

//     try {
//       setSaving(true);

//       await api.put("/user/updateProfile", {
//         username: profile.username,
//         phone: profile.phone,
//       });

//       toast.success("Profile updated successfully");
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Failed to update profile"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================= PASSWORD UPDATE ================= */
//   const handlePasswordChange = async (e) => {
//     e.preventDefault();

//     if (!passwords.currentPassword || !passwords.newPassword) {
//       toast.error("All password fields are required");
//       return;
//     }

//     if (passwords.newPassword !== passwords.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     try {
//       setSaving(true);

//       await api.put("/user/changePassword", {
//         currentPassword: passwords.currentPassword,
//         newPassword: passwords.newPassword,
//       });

//       toast.success("Password changed successfully");

//       setPasswords({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Failed to change password"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return <p className="p-6 text-gray-500">Loading profile...</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-8">
//       {/* ================= PROFILE INFO ================= */}
//       <div className="bg-white rounded-xl shadow-lg border border-gray-200">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-bold text-gray-800">
//             My Profile
//           </h2>
//           <p className="text-sm text-gray-500">
//             Manage your personal information
//           </p>
//         </div>

//         <form onSubmit={handleProfileUpdate} className="p-6 space-y-5">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* NAME */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Full Name
//               </label>
//               <input
//                 value={profile.username}
//                 onChange={(e) =>
//                   setProfile({ ...profile, username: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2"
//               />
//             </div>

//             {/* EMAIL */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <input
//                 value={profile.email}
//                 onChange={(e) =>
//                   setProfile({ ...profile, email: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 "
//               />
//             </div>

//             {/* PHONE */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone
//               </label>
//              <input
//                  type="text"
//                  inputMode="numeric"
//                 pattern="[0-9]*"
//                 value={profile.phone}
//                   onChange={(e) => {
//                   const value = e.target.value.replace(/\D/g, "") .slice(0, 20); ; // remove non-digits
//                  setProfile({ ...profile, phone: value });
//                  }}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                   disabled
//                   />

//             </div>

//             {/* ROLE */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Role
//               </label>
//               <input
//                 value={profile.role}
//                 disabled
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
//               />
//             </div>

//             {/* DEPARTMENT */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Department
//               </label>
//               <input
//                 value={profile.department}
//                 disabled
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <button
//               disabled={saving}
//               className="mr-3 cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//             >
//               Edit Details
//             </button>
//             <button 
//               disabled={saving}
//               className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* ================= PASSWORD CHANGE ================= */}
//       <div className="bg-white rounded-xl shadow-lg border border-gray-200">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-bold text-gray-800">
//             Change Password
//           </h2>
//         </div>

//         <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
//           <input
//             type="password"
//             placeholder="Current Password"
//             value={passwords.currentPassword}
//             onChange={(e) =>
//               setPasswords({ ...passwords, currentPassword: e.target.value })
//             }
//             className="w-full border border-gray-300 rounded-lg px-3 py-2"
//           />

//           <input
//             type="password"
//             placeholder="New Password"
//             value={passwords.newPassword}
//             onChange={(e) =>
//               setPasswords({ ...passwords, newPassword: e.target.value })
//             }
//             className="w-full border border-gray-300 rounded-lg px-3 py-2"
//           />

//           <input
//             type="password"
//             placeholder="Confirm New Password"
//             value={passwords.confirmPassword}
//             onChange={(e) =>
//               setPasswords({
//                 ...passwords,
//                 confirmPassword: e.target.value,
//               })
//             }
//             className="w-full border border-gray-300 rounded-lg px-3 py-2"
//           />

//           <div className="flex justify-end">
//             <button
//               disabled={saving}
//               className="cursor-pointer px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
//             >
//               Update Password
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MyProfile;
import React, { useEffect, useState } from "react";
import api from "../../../axios/axios";
import { toast } from "sonner";

const MyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [password, setPassword] = useState("");

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
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "",
          department: user.department?.name || "",
        });
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
    if (!password) {
      toast.error("Enter your password");
      return;
    }

    try {
      setSaving(true);
      await api.post("/user/verify-password", { password });

      toast.success("Password verified");
      setPasswordVerified(true);
    } catch {
      toast.error("Incorrect password");
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
        email: profile.email,
        phone: profile.phone,
      });

      toast.success("Profile updated");

      // reset state
      setIsEditing(false);
      setPasswordVerified(false);
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">

        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold">My Profile</h2>
          <p className="text-sm text-gray-500">
            Manage your personal information
          </p>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6">

          {/* ===== PASSWORD SCREEN ===== */}
          {isEditing && !passwordVerified && (
            <div className="max-w-md mx-auto space-y-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Verify Your Password
              </h3>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded-lg px-4 py-2"
              />

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={verifyPassword}
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* ===== PROFILE FORM ===== */}
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

                <Field
                  label="Email"
                  value={profile.email}
                  disabled={!passwordVerified}
                  onChange={(v) =>
                    setProfile({ ...profile, email: v })
                  }
                />

                <Field
                  label="Phone"
                  value={profile.phone}
                  disabled={!passwordVerified}
                  onChange={(v) =>
                    setProfile({ ...profile, phone: v })
                  }
                />

                <Field label="Role" value={profile.role} disabled />
                <Field
                  label="Department"
                  value={profile.department}
                  disabled
                />
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
    </div>
  );
};

/* ================= FIELD COMPONENT ================= */
const Field = ({ label, value, disabled, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
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
