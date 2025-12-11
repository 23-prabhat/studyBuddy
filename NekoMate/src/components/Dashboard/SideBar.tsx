import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/task', label: 'Tasks' },
    { path: '/timer', label: 'Timer' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/chatbot', label: 'Chatbot' },
  ];
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-lg transition hover:bg-gray-50"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      <div className="border-b border-gray-200 px-6 py-6 text-2xl font-bold tracking-wide text-blue-900 bg-gradient-to-r from-blue-50 to-orange-50">
        NekoMate
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2 text-sm text-gray-700">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`rounded-lg px-3 py-2 transition cursor-pointer ${
                isActive(item.path)
                  ? 'font-medium text-blue-600 bg-blue-50'
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
    </>
  );
}
