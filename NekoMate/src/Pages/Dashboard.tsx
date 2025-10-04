import SideBar from "@/DashboardComponents/SideBar";
import TimerCard from "@/DashboardComponents/Timercard";
import TodoCard from "@/DashboardComponents/TodoCard";

export default function Dashboard() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/5">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1
          className="text-4xl font-extrabold mb-8 
                     bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                     bg-clip-text text-transparent 
                     drop-shadow-lg tracking-wide"
        >
          Hi, what up's — ready for today's grind?
        </h1>

        <div className="my-10 grid grid-cols-3 gap-6">
          <TodoCard />
          <TimerCard />
        </div>
      </div>
    </div>
  );
}
