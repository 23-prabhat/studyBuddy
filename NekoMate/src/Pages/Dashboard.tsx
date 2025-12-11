import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import Calendar from "@/components/Dashboard/Calendar";
import Notes from "@/components/Dashboard/Notes";
import Notifications from "@/components/Dashboard/Notifications";
import SideBar from "@/components/Dashboard/SideBar";
import Task from "@/components/Dashboard/Task";
import Timer from "@/components/Dashboard/Timer";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const getUserName = () => {
    if (user?.displayName) return user.displayName.split(" ")[0];
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      <SideBar />

      {/* Fixed Top Bar for Mobile with Profile/Notifications */}
      <div className="fixed top-0 right-0 z-40 md:hidden flex items-center gap-2 p-3 bg-white/80 backdrop-blur border-b border-gray-200">
        <Notifications />
        <button
          onClick={() => navigate("/profile")}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
          title="Profile"
        >
          <User size={18} />
        </button>
        <button
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>

      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-10 md:ml-0 pt-16 md:pt-6">
        {/* Header with Profile - Desktop Only */}
        <header className="mb-6 sm:mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-blue-900">Hello, {getUserName()} 👋</h1>
            <p className="mt-1 text-gray-600 text-sm sm:text-base">Let's be productive today.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <Notifications />
            <button
              onClick={() => navigate("/profile")}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              title="Profile"
            >
              <User size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8 lg:flex-row">
          <section className="flex-1 space-y-6 sm:space-y-8">
            <Task />
            <Timer />
          </section>

          <aside className="w-full space-y-6 sm:space-y-8 lg:w-[380px] xl:w-[420px]">
            <Calendar />
            <Notes />
          </aside>
        </div>
      </main>
    </div>
  );
}
