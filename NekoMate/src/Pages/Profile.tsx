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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
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
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      <SideBar />

      <main className="flex-1 overflow-y-auto px-8 py-10 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-semibold text-blue-900">Profile Settings</h1>
              <p className="mt-1 text-gray-600">Manage your account information</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            {/* Profile Picture Section */}
            <div className="mb-8 flex items-center gap-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl font-bold">
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white transition hover:bg-blue-600">
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-blue-900">
                  {user.displayName || "User"}
                </h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Success Message */}
            {message && (
              <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {/* Profile Form */}
            <div className="space-y-6">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User size={16} />
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Email address cannot be changed
                </p>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar size={16} />
                  Member Since
                </label>
                <input
                  type="text"
                  value={joinedDate}
                  disabled
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving || !displayName.trim()}
                  className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-green-500">
                {user.emailVerified ? "✓" : "✗"}
              </p>
              <p className="mt-1 text-sm text-gray-600">Email Verified</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-blue-500">
                {user.metadata.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="mt-1 text-sm text-gray-600">Last Login</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-orange-500">
                {user.providerData[0]?.providerId === "google.com" ? "Google" : "Email"}
              </p>
              <p className="mt-1 text-sm text-gray-600">Auth Provider</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
