import React, { useEffect, useState } from "react";
import api from "../../axios/axios";
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
      <div className="bg-white rounded-2xl shadow border">
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-semibold">My Profile</h2>
          <p className="text-sm text-gray-500">
            Personal information & security
          </p>
        </div>

        <div className="p-6">
          {isEditing && !passwordVerified && (
            <div className="max-w-sm mx-auto text-center space-y-4">
              <h3 className="text-lg font-medium">Confirm Password</h3>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border rounded-xl px-4 py-2"
              />
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setPassword("");
                  }}
                  className="px-5 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyPassword}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {(!isEditing || passwordVerified) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field
                  label="Full Name"
                  value={profile.username}
                  disabled={!passwordVerified}
                  onChange={(v) => setProfile({ ...profile, username: v })}
                />

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      value={pendingEmail || profile.email}
                      disabled
                      className="w-full border rounded-xl px-3 py-2 pr-36 bg-gray-100"
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
                          className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700"
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
                  onChange={(v) => setProfile({ ...profile, phone: v })}
                />
                <Field label="Role" value={profile.role} disabled />
                <Field label="Department" value={profile.department} disabled />
              </div>

              <div className="flex justify-end mt-8 gap-3">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 rounded-xl bg-blue-600 text-white"
                  >
                    Edit Profile
                  </button>
                )}
                {passwordVerified && (
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-green-600 text-white"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

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

const Field = ({ label, value, disabled, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full border rounded-xl px-4 py-2 ${
        disabled ? "bg-gray-100" : ""
      }`}
    />
  </div>
);

export default MyProfile;
