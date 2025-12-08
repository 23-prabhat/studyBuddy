import { useNavigate, useLocation } from "react-router-dom";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-lg">
      <div className="border-b border-gray-200 px-6 py-6 text-2xl font-bold tracking-wide text-blue-900 bg-gradient-to-r from-blue-50 to-orange-50">
        NekoMate
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2 text-sm text-gray-700">
          <li 
            className={`rounded-lg px-3 py-2 transition cursor-pointer ${
              isActive('/dashboard') 
                ? 'font-medium text-blue-600 bg-blue-50' 
                : 'hover:bg-blue-50 hover:text-blue-600'
            }`} 
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </li>
          <li 
            className={`rounded-lg px-3 py-2 transition cursor-pointer ${
              isActive('/task') 
                ? 'font-medium text-blue-600 bg-blue-50' 
                : 'hover:bg-blue-50 hover:text-blue-600'
            }`} 
            onClick={() => navigate('/task')}
          >
            Tasks
          </li>
          <li 
            className={`rounded-lg px-3 py-2 transition cursor-pointer ${
              isActive('/timer') 
                ? 'font-medium text-blue-600 bg-blue-50' 
                : 'hover:bg-blue-50 hover:text-blue-600'
            }`} 
            onClick={() => navigate('/timer')}
          >
            Timer
          </li>
          <li 
            className={`rounded-lg px-3 py-2 transition cursor-pointer ${
              isActive('/analytics') 
                ? 'font-medium text-blue-600 bg-blue-50' 
                : 'hover:bg-blue-50 hover:text-blue-600'
            }`} 
            onClick={() => navigate('/analytics')}
          >
            Analytics
          </li>
          <li 
            className={`rounded-lg px-3 py-2 transition cursor-pointer ${
              isActive('/chatbot') 
                ? 'font-medium text-blue-600 bg-blue-50' 
                : 'hover:bg-blue-50 hover:text-blue-600'
            }`} 
            onClick={() => navigate('/chatbot')}
          >
            Chatbot
          </li>
        </ul>
      </nav>
    </aside>
  );
}
