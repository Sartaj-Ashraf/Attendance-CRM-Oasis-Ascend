import React, { useState } from "react";
import { toast } from "sonner";

const OwnerControlCenter = () => {
  const [loading, setLoading] = useState(false);

  /* ------------------ SYSTEM STATE (DUMMY) ------------------ */
  const [system, setSystem] = useState({
    brandName: "Ascend Attendance",
    primaryColor: "#2563eb",
    allowSelfRegistration: false,
    userCreationBy: "owner",
    allUsersBlocked: false,
  });

  /* ------------------ OWNER PROFILE (DUMMY) ------------------ */
  const [profile, setProfile] = useState({
    name: "Umaid Hamid",
    email: "owner@company.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const runAction = (message) => {
    setLoading(true);
    setTimeout(() => {
      toast.success(message);
      setLoading(false);
    }, 900);
  };

  const handleProfileSave = () => {
    if (
      profile.newPassword &&
      profile.newPassword !== profile.confirmPassword
    ) {
      return toast.error("Passwords do not match");
    }

    runAction("Profile updated successfully");
    setProfile({
      ...profile,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-bold text-gray-800">
            Owner Control Center
          </h1>
          <p className="text-gray-500 mt-1">
            System security, branding, access rules, user controls, and data
            management
          </p>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* OWNER BASIC SETTINGS */}
          <Card title="Owner Basic Settings">
            <Input
              label="Owner Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />

            <Input
              label="Email Address"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                type="password"
                label="Current Password"
                value={profile.currentPassword}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    currentPassword: e.target.value,
                  })
                }
              />

              <Input
                type="password"
                label="New Password"
                value={profile.newPassword}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    newPassword: e.target.value,
                  })
                }
              />

              <Input
                type="password"
                label="Confirm Password"
                value={profile.confirmPassword}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <button
              onClick={handleProfileSave}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Update Profile
            </button>
          </Card>

          {/* BRANDING */}
          <Card title="Branding">
            <Input
              label="Brand / Application Name"
              value={system.brandName}
              onChange={(e) =>
                setSystem({ ...system, brandName: e.target.value })
              }
            />

            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600">Primary Color</label>
              <input
                type="color"
                value={system.primaryColor}
                onChange={(e) =>
                  setSystem({ ...system, primaryColor: e.target.value })
                }
                className="h-10 w-16 border rounded"
              />
            </div>
          </Card>

          {/* USER CREATION RULES */}
          <Card title="User Creation Rules">
            <Select
              label="Who can create users"
              value={system.userCreationBy}
              onChange={(e) =>
                setSystem({ ...system, userCreationBy: e.target.value })
              }
              options={[
                { value: "owner", label: "Only Owner" },
                { value: "owner_manager", label: "Owner & Manager" },
              ]}
            />

            <Toggle
              label="Allow new user self-registration"
              checked={system.allowSelfRegistration}
              onChange={() =>
                setSystem({
                  ...system,
                  allowSelfRegistration: !system.allowSelfRegistration,
                })
              }
            />
          </Card>

          {/* SECURITY ACTIONS */}
          <Card title="Security Actions">
            <ActionButton
              color="red"
              text="Force logout all users"
              onClick={() => runAction("All users logged out forcefully")}
            />

            <ActionButton
              color="orange"
              text="Force reset password of all users"
              onClick={() => runAction("Password reset forced for all users")}
            />

            <ActionButton
              color={system.allUsersBlocked ? "green" : "yellow"}
              text={
                system.allUsersBlocked ? "Unblock all users" : "Block all users"
              }
              onClick={() => {
                setSystem({
                  ...system,
                  allUsersBlocked: !system.allUsersBlocked,
                });
                toast.warning(
                  system.allUsersBlocked
                    ? "All users unblocked"
                    : "All users blocked"
                );
              }}
            />
          </Card>

          {/* DATA EXPORT */}
          <Card title="Data & Database">
            <ActionButton
              color="blue"
              text="Download all users data"
              onClick={() => runAction("User data downloaded")}
            />

            <ActionButton
              color="blue"
              text="Download attendance records"
              onClick={() => runAction("Attendance records downloaded")}
            />

            <ActionButton
              color="purple"
              text="Download full database backup"
              onClick={() => runAction("Complete database backup downloaded")}
            />
          </Card>
        </div>

        {/* SAVE */}
        <div className="flex justify-end">
          <button
            disabled={loading}
            onClick={() => runAction("Settings saved successfully")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- UI COMPONENTS ---------------- */

const Card = ({ title, children }) => (
  <section className="bg-white rounded-2xl shadow p-6 space-y-5">
    <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
    {children}
  </section>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      {...props}
      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-600">{label}</label>
    <select
      {...props}
      className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between gap-4">
    <span className="text-gray-700">{label}</span>
    <input type="checkbox" checked={checked} onChange={onChange} />
  </label>
);

const ActionButton = ({ text, onClick, color }) => {
  const colors = {
    red: "bg-red-600 hover:bg-red-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full px-5 py-3 text-white rounded-lg transition ${colors[color]}`}
    >
      {text}
    </button>
  );
};

export default OwnerControlCenter;
