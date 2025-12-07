import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, ArrowLeft, Camera, Save } from "lucide-react";
import SideBar from "@/components/Dashboard/SideBar";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateProfile } from "firebase/auth";

export default function Profile() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user || !displayName.trim()) return;

    try {
      setSaving(true);
      setMessage("");
      await updateProfile(user, {
        displayName: displayName.trim(),
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D1117] text-white">
        <p>Please login to view your profile</p>
      </div>
    );
  }

  const joinedDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div className="flex min-h-screen bg-[#0D1117] text-white font-sans">
      <SideBar />

      <main className="flex-1 overflow-y-auto px-8 py-10">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#161B22] transition hover:border-orange-500/50"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-semibold">Profile Settings</h1>
              <p className="mt-1 text-gray-400">Manage your account information</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="rounded-2xl border border-white/10 bg-[#161B22] p-8">
            {/* Profile Picture Section */}
            <div className="mb-8 flex items-center gap-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-3xl font-bold">
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#161B22] bg-orange-500 transition hover:bg-orange-600">
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.displayName || "User"}
                </h2>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* Success Message */}
            {message && (
              <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-400">
                {message}
              </div>
            )}

            {/* Profile Form */}
            <div className="space-y-6">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                  <User size={16} />
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0D1117] px-4 py-3 text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full rounded-xl border border-white/10 bg-[#0D1117] px-4 py-3 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Email address cannot be changed
                </p>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Calendar size={16} />
                  Member Since
                </label>
                <input
                  type="text"
                  value={joinedDate}
                  disabled
                  className="w-full rounded-xl border border-white/10 bg-[#0D1117] px-4 py-3 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving || !displayName.trim()}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-medium transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-xl border border-white/10 bg-[#0D1117] px-6 py-3 font-medium transition hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-[#161B22] p-4 text-center">
              <p className="text-2xl font-bold text-orange-400">
                {user.emailVerified ? "✓" : "✗"}
              </p>
              <p className="mt-1 text-sm text-gray-400">Email Verified</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#161B22] p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">
                {user.metadata.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="mt-1 text-sm text-gray-400">Last Login</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#161B22] p-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {user.providerData[0]?.providerId === "google.com" ? "Google" : "Email"}
              </p>
              <p className="mt-1 text-sm text-gray-400">Auth Provider</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
