import React, { useState, useEffect } from "react";
import { useUser } from '@/hooks/auth/queries/useUser';
import { useUpdateUser } from "@/hooks/settings/mutations/useSettingsMutation";
import { ProcessingDots } from "@/components/ui/spinners";

const Settings = () => {
  // Your "me" hook providing user context data
  const { me, isLoading } = useUser();
  const updateUser = useUpdateUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Track the raw File object for uploads
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Sync inputs when 'me' loads
  useEffect(() => {
    if (me) {
      setName(me.name || "");
      setEmail(me.email || "");
    }
  }, [me]);

  if (isLoading) return <ProcessingDots />;

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser.mutate({
      name: name,
      email: email,
      avatarUrl: avatarFile // Pass raw File directly matching your service logic
    });
  };

  return (
    <div>
      <h3>Personal Information</h3>
      
      <form onSubmit={handleUserSubmit}>
        
        {/* AVATAR DISPLAY & INPUT */}
        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>User Avatar:</label>
          
          {/* Conditional Rendering logic for previewing image */}
          {avatarFile ? (
            // If user selected a new file, create a temporary local blob URL
            <img 
              src={URL.createObjectURL(avatarFile)} 
              alt="Local Preview" 
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} 
            />
          ) : me?.avatarUrl ? (
            // If no new file is picked, show the absolute URL string sent from backend
            <img 
              src={me.avatarUrl} 
              alt="Current Avatar" 
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} 
            />
          ) : (
            // Default fallback text wrapper if both fields don't exist
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
              No Image
            </div>
          )}

          <br />
          <input 
            type="file" 
            accept="image/*" 
            disabled={updateUser.isPending}
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} 
            style={{ marginTop: "8px" }}
          />
        </div>

        {/* NAME INPUT */}
        <div style={{ marginTop: "12px" }}>
          <label>Full Name:</label>
          <input 
            type="text" 
            value={name} 
            disabled={updateUser.isPending}
            onChange={(e) => setName(e.target.value)} 
          />
        </div>

        {/* EMAIL INPUT */}
        <div style={{ marginTop: "12px" }}>
          <label>Email Address:</label>
          <input 
            type="email" 
            value={email} 
            disabled={updateUser.isPending}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <button type="submit" disabled={updateUser.isPending} style={{ marginTop: "16px" }}>
          {updateUser.isPending ? "Saving..." : "Save User Info"}
        </button>
      </form>
    </div>
  );
};

export default Settings;