export default function SideBar() {
  return (
    <div className="h-screen w-60 text-white flex flex-col shadow-lg border border-white">
      {/* Logo / Title */}
      <div className="px-6 py-6 text-2xl font-bold tracking-wide border-b border-gray-700">
        NekoMate
      </div>

      {/* Navigation */}
      <ul className="flex-1 px-4 py-6 space-y-4">
        <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition">
          Dashboard
        </li>
        <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition">
          Tasks
        </li>
        <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition">
          Analytics
        </li>
        <li className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition">
          Settings
        </li>
      </ul>

      {/* Footer / User */}
      <div className="px-6 py-4 border-t border-gray-700">
        <p className="text-sm text-gray-400">Logged in as</p>
        <p className="font-medium">Prabhat Jha</p>
      </div>
    </div>
  );
}
