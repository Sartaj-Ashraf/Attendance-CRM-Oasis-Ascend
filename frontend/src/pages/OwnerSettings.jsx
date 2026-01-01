import React, { useState } from "react";
import { toast } from "sonner";
import {
  Shield,
  Database,
  Users,
  Download,
  HardDrive,
  LogOut,
  KeyRound,
  UserX,
  UserCheck,
} from "lucide-react";

import ControlCard from "../components/control-center/ControlCard.jsx";
import ActionButton from "../components/control-center/ActionButton.jsx";
import MyProfile from "../components/profile/Profile";

const OwnerControlCenter = () => {
  const [loading, setLoading] = useState(false);
  const [allUsersBlocked, setAllUsersBlocked] = useState(false);

  const runAction = (message, type = "success") => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      toast[type](message);
      setLoading(false);
    }, 800);
  };

  const toggleBlockUsers = () => {
    const next = !allUsersBlocked;
    setAllUsersBlocked(next);
    toast.warning(next ? "All users blocked" : "All users unblocked");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Owner Control Center</h1>
              <p className="text-white/70 mt-1">
                Manage profile, security, and system data
              </p>
            </div>

            <button
              disabled={loading}
              onClick={() => runAction("Settings saved successfully")}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Profile */}
        <section className="grid grid-cols-1">
          <MyProfile />
        </section>

        {/* Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Security */}
          <ControlCard
            title="Security"
            description="High‑impact system actions"
            icon={Shield}
            iconColor="text-destructive"
          >
            <ActionButton
              variant="danger"
              icon={LogOut}
              text="Force Logout All Users"
              onClick={() =>
                runAction("All users logged out forcefully", "warning")
              }
            />
            <ActionButton
              variant="warning"
              icon={KeyRound}
              text="Force Password Reset"
              onClick={() =>
                runAction("Password reset required for all users", "warning")
              }
            />
            <ActionButton
              variant={allUsersBlocked ? "success" : "danger"}
              icon={allUsersBlocked ? UserCheck : UserX}
              text={allUsersBlocked ? "Unblock All Users" : "Block All Users"}
              onClick={toggleBlockUsers}
            />
          </ControlCard>

          {/* Data */}
          <ControlCard
            title="Data & Backup"
            description="Download and backup system data"
            icon={Database}
          >
            <ActionButton
              variant="info"
              icon={Users}
              text="Download Users"
              onClick={() => runAction("Users exported")}
            />
            <ActionButton
              variant="info"
              icon={Download}
              text="Download Attendance"
              onClick={() => runAction("Attendance exported")}
            />
            <ActionButton
              variant="primary"
              icon={HardDrive}
              text="Full Backup"
              onClick={() => runAction("Database backup completed")}
            />
          </ControlCard>
        </section>
      </main>
    </div>
  );
};

export default OwnerControlCenter;
