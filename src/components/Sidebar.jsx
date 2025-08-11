import React from 'react';
import { Home, Clock, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavyLogo from '../assets/NavyLogo.png';

const Sidebar = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  onLogout, // <-- Accept onLogout prop
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab) => {
    onTabChange(tab);
    navigate(tab === 'home' ? '/' : '/history');
  };

  const currentTab = location.pathname === '/history' ? 'history' : 'home';

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-slate-900 text-white h-screen transition-all duration-300 flex flex-col shadow-xl fixed left-0 top-0 z-50`}>
      
      {/* Header with centered logo */}
      <div className="h-20 px-4 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex-1 flex justify-center">
            <img src={NavyLogo} alt="Navy Logo" className="h-16 w-auto" />
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronRight className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => handleTabClick('home')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
            currentTab === 'home'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Home</span>}
        </button>

        <button
          onClick={() => handleTabClick('history')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
            currentTab === 'history'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Clock className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">History</span>}
        </button>
      </nav>

      {/* Footer with Logout */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;