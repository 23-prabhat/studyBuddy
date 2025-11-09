import Calendar from "@/components/Dashboard/Calendar";
import Notes from "@/components/Dashboard/Notes";
import SideBar from "@/components/Dashboard/SideBar";
import Task from "@/components/Dashboard/Task";
import Timer from "@/components/Dashboard/Timer";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0D1117] text-white font-sans">
      {/* ===== Sidebar ===== */}
      <SideBar />

      {/* ===== Main Dashboard Area ===== */}
      <main className="flex-1 flex justify-between px-10 py-10 space-x-8 overflow-y-auto">
        {/* ===== Left Section: Tasks + Timer ===== */}
        <section className="flex flex-col flex-[2]">
          {/* Greeting Section */}
          <header className="mb-8">
            <h1 className="text-3xl font-semibold">Hello, Prabhat 👋</h1>
            <p className="text-gray-400 mt-1">Let's be productive today.</p>
          </header>

          {/* Tasks */}
          <div className="space-y-8">
            <Task />

            {/* Timer Section */}
            <div className="w-full max-w-lg">
              <Timer />
            </div>
          </div>
        </section>

        {/* ===== Right Section: Calendar + Notes ===== */}
        <aside className="flex flex-col flex-1 space-y-10">
          <div className="w-full">
            <Calendar />
          </div>
          <div className="w-full">
            <Notes />
          </div>
        </aside>
      </main>
    </div>
  );
}
