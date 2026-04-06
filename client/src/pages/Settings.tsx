import { useState, useEffect } from "react";
import { User, HardDrive, Shield, Camera, Mail, UserPen, ChevronRight, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFiles } from "@/hooks/files/queries/useFiles";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const { storage } = useFiles();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");

  // Cleanup URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const usedMB = storage?.used ? storage.used / (1024 * 1024) : 0;
  const usagePercent = Math.min(storage?.used ? (storage.used / (100 * 1024 * 1024)) * 100 : 0, 100);
  const isStorageCritical = usagePercent > 85;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be under 2MB");
        return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
    toast.success("Preview updated. Save to apply.");
  };

  const handleProfileSave = () => {
    if (!newName.trim() || !newEmail.trim()) {
      toast.error("Information incomplete");
      return;
    }
    setEditingProfile(false);
    toast.success("Profile saved successfully");
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))] px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm opacity-50 mt-1">Manage your account preferences and storage.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR: IDENTITY & QUICK STATS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="relative group p-8 rounded-3xl border border-[rgb(var(--border))] bg-gradient-to-b from-[rgb(var(--card))] to-transparent flex flex-col items-center text-center overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[rgb(var(--primary))] opacity-10 blur-[80px]" />
              
              {/* Avatar Logic */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full p-1 ring-2 ring-[rgb(var(--border))] group-hover:ring-[rgb(var(--primary))] transition-all duration-500 overflow-hidden bg-[rgb(var(--background))]">
                  {avatarPreview || user?.avatar ? (
                    <img src={avatarPreview || user?.avatar} className="w-full h-full object-cover rounded-full" alt="Avatar" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20"><User size={40} /></div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-[rgb(var(--primary))] text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <Camera size={14} />
                  <input type="file" hidden onChange={handleAvatarChange} accept="image/*" />
                </label>
              </div>

              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-xs opacity-50 font-mono tracking-tighter uppercase mb-6">{user?.id || "Pro Member"}</p>

              {/* Mini Storage Indicator */}
              <div className="w-full pt-6 border-t border-[rgb(var(--border))] space-y-3">
                <div className="flex justify-between text-xs font-medium">
                  <span className="opacity-60">Storage Used</span>
                  <span className={isStorageCritical ? "text-red-500" : ""}>{usagePercent.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[rgb(var(--border))] rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${isStorageCritical ? 'bg-red-500' : 'bg-[rgb(var(--primary))]'}`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* PROFILE SECTION */}
            <section className="p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]">
                    <UserPen size={18} />
                  </div>
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                </div>
                <button
                  onClick={() => editingProfile ? handleProfileSave() : setEditingProfile(true)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    editingProfile 
                    ? "bg-[rgb(var(--primary))] text-white" 
                    : "hover:bg-[rgb(var(--border))] border border-[rgb(var(--border))]"
                  }`}
                >
                  {editingProfile ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium opacity-50 ml-1">Full Name</label>
                  {editingProfile ? (
                    <input 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 ring-[rgb(var(--primary))]/20 outline-none transition-all"
                    />
                  ) : (
                    <div className="px-4 py-2.5 rounded-xl bg-[rgb(var(--background))]/50 border border-transparent font-medium">
                      {user?.name}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium opacity-50 ml-1">Email Address</label>
                  {editingProfile ? (
                    <input 
                      value={newEmail} 
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 ring-[rgb(var(--primary))]/20 outline-none transition-all"
                    />
                  ) : (
                    <div className="px-4 py-2.5 rounded-xl bg-[rgb(var(--background))]/50 border border-transparent flex items-center gap-2 font-medium">
                      <Mail size={14} className="opacity-40" />
                      {user?.email}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* SECURITY & STORAGE ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Storage Detailed */}
              <div className="p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
                <div className="flex items-center gap-3 mb-4">
                  <HardDrive size={18} className="opacity-60" />
                  <h3 className="font-semibold">Cloud Storage</h3>
                </div>
                <p className="text-2xl font-bold mb-1">{usedMB.toFixed(1)} <span className="text-sm font-normal opacity-50">/ 100 MB</span></p>
                <p className="text-xs opacity-50 mb-4">Using {usagePercent.toFixed(0)}% of your total quota</p>
                <button className="w-full py-2 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                  Upgrade Plan
                </button>
              </div>

              {/* Security Card */}
              <div className="p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Shield size={18} className="opacity-60" />
                    <h3 className="font-semibold">Account Security</h3>
                  </div>
                  <p className="text-sm opacity-60 leading-relaxed">
                    Last password change: <span className="text-[rgb(var(--foreground))]">3 months ago</span>
                  </p>
                </div>
                <button className="flex items-center justify-between group mt-4 text-sm font-medium text-[rgb(var(--primary))]">
                  Change Password
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;