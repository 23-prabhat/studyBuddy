import { useNavigate } from "react-router-dom";

export default function SideBar() {
  const navigate =useNavigate();
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-white/10 bg-[#161B22] text-white shadow-lg">
      <div className="border-b border-white/10 px-6 py-6 text-2xl font-bold tracking-wide">
        NekoMate
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="rounded-lg px-3 py-2 font-medium text-white transition hover:bg-white/5 " onClick={() => navigate('/')}>
            Dashboard
          </li>
          <li className="rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white" onClick={() => navigate('task')}>
            Tasks
          </li>
          <li className="rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white" onClick={() => navigate('analytics')}>
            Analytics
          </li>
          <li className="rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white" onClick={() => navigate('chatbot')}>
            chatbot
          </li>
          <li className="rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white">
            Settings
          </li>
        </ul>
      </nav>

      <div className="border-t border-white/10 px-6 py-4 text-sm text-gray-400">
        <p>Logged in as</p>
        <p className="mt-1 font-medium text-white">Prabhat Jha</p>
      </div>
    </aside>
  );
}
