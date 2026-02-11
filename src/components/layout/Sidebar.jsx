import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Shield, Calendar, BarChart3, MessageSquare, Play, Search, FileText, Users, Settings, Mic, MessageCircle } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const menuItems = [
    { name: 'Dashboard', Icon: Home, path: '/dashboard' },
    { name: 'Compliance Guardian', Icon: Shield, path: '/compliance' },
    { name: 'Obligation Tracker', Icon: Calendar, path: '/obligations' },
    { name: 'Risk Analyzer', Icon: BarChart3, path: '/risk' },
    { name: 'Negotiation Strategist', Icon: MessageSquare, path: '/negotiation' },
    { name: 'Scenario Simulation', Icon: Play, path: '/scenarios' },
    { name: 'AI Chatbot', Icon: MessageCircle, path: '/chatbot' },
    { name: 'Voice Assistant', Icon: Mic, path: '/voice-assistant' },
    { name: 'Legal Research', Icon: Search, path: '/research' },
    { name: 'Documents', Icon: FileText, path: '/documents' },
    { name: 'Collaboration', Icon: Users, path: '/collaboration' },
    { name: 'Settings', Icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black border-r border-white/10 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full pt-20 pb-4">
          {/* Navigation Menu */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-4 text-base font-light rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-[#0E0E0E] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/30'
                      : 'text-white hover:bg-white/10'
                  }`
                }
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => setIsOpen(false)}
              >
                <item.Icon className="w-6 h-6 mr-3 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="px-4 mt-4 pt-4 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-[#ffffff]/30">
              <p className="text-xs font-light text-white/70 mb-2">Need Help?</p>
              <button className="w-full px-4 py-2 text-xs font-medium bg-white text-black rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
