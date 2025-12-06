import Calendar from "@/components/Dashboard/Calendar";
import Notes from "@/components/Dashboard/Notes";
import SideBar from "@/components/Dashboard/SideBar";
import Task from "@/components/Dashboard/Task";
import Timer from "@/components/Dashboard/Timer";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#0D1117] text-white font-sans">
      <SideBar />

      <main className="flex-1 overflow-y-auto px-8 py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 xl:flex-row">
          <section className="flex-1 space-y-8">
            <header>
              <h1 className="text-3xl font-semibold">Hello, Prabhat 👋</h1>
              <p className="mt-1 text-gray-400">Let's be productive today.</p>
            </header>

            <Task />
            <Timer />
          </section>

          <aside className="w-full space-y-8 xl:w-[420px]">
            <Calendar />
            <Notes />
          </aside>
        </div>
      </main>
    </div>
  );
}
