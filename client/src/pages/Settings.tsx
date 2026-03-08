import { useState } from "react";
import { User, HardDrive, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFiles } from "@/hooks/files/queries/useFiles";
import { toast } from 'sonner';
const Settings = () => {
  const { user } = useAuth();
  const { storage } = useFiles();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingSecurity, setEditingSecurity] = useState(false);

  const [newName, setNewName] = useState(user?.name || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSave = () => {
    try {
      if (!newName.trim() || !newEmail.trim()) {
        toast.error("Name and email cannot be empty.");
        return;
      }
      console.log("Saving profile changes:", { newName, newEmail });
      toast.success("Profile changes saved successfully!");

      // Here you would call your API to save the changes, e.g.:
      // await api.updateProfile({ name: newName, email: newEmail });
      setEditingProfile(false);
    } catch (error) {
      console.error("Error saving profile changes:", error);
      toast.error("Failed to save profile changes. Please try again.");
    }
  };

  const handleSecuritySave = () => {
    // Implementation for saving security changes
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Please fill in all password fields.");
        return;
      } else if (newPassword !== confirmPassword) {
        toast.error("New password and confirmation do not match.");
        return;
      }
      console.log("Saving security changes:", { currentPassword, newPassword, confirmPassword });
      toast.success("Security changes saved successfully!");
      // Here you would call your API to save the changes, e.g.:
      // await api.updatePassword({ currentPassword, newPassword });
      setEditingSecurity(false);
    } catch (error) {
      console.error("Error saving security changes:", error);
      toast.error("Failed to save security changes. Please try again.");
    }
  };


  return (
    <div className="min-h-screen mt-4 bg-[rgb(var(--background))] text-[rgb(var(--text))] transition-colors duration-300 relative px-4 sm:px-6 py-8 space-y-8">
      <h1>Settings</h1>

      {/* Profile */}
      <section>
        <div className="flex items-center gap-2">
          <User size={20} />
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>

        {!editingProfile ? (
          <div className="space-y-2 mt-3">
            <p>
              Name: <span>{user?.name}</span>
            </p>
            <p>
              Email: <span>{user?.email}</span>
            </p>

            <button
              onClick={() => setEditingProfile(true)}
              className="text-blue-500"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="border p-2 rounded w-full"
            />

            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-2">
              <button
                onClick={handleProfileSave}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditingProfile(false)}
                className="border px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Storage */}
      <section>
        <div>
          <HardDrive size={20} />
          <h2>Storage</h2>
        </div>

        <p>
          Storage plan: <strong>Free (100 MB)</strong>
        </p>

        <p>
          Used:{" "}
          <strong>
            {(storage?.used ? storage.used / (1024 * 1024) : 0).toFixed(2)} MB
          </strong>{" "}
          of 100 MB
        </p>

        <p>Upgrade options coming soon.</p>
      </section>

      {/* Security */}
      <section>
        <div className="flex items-center gap-2">
          <Shield size={20} />
          <h2 className="text-lg font-semibold">Security</h2>
        </div>

        {!editingSecurity ? (
          <div className="mt-3 space-y-2">
            <p>Password: ********</p>

            <button
              onClick={() => setEditingSecurity(true)}
              className="text-blue-500"
            >
              Change Password
            </button>
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSecuritySave}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditingSecurity(false)}
                className="border px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Settings;