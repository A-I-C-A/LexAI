import { NavLink } from 'react-router-dom';
import {
  Home,
  Shield,
  Calendar,
  BarChart3,
  MessageSquare,
  Play,
  Search,
  FileText,
  Users,
  Settings,
  Mic,
  MessageCircle
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useUserAuth();
  const { theme } = useTheme();

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
    { name: 'Settings', Icon: Settings, path: '/settings' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 bg-card border-r border-border`}
        style={{
          width: '260px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}
      >
        {/* ===== LOGO SECTION (RESTORED) ===== */}
        <div
          className="border-b border-border"
          style={{
            padding: '20px 20px 16px 20px'
          }}
        >
          <div
            className="text-foreground"
            style={{
              fontSize: '20px',
              fontWeight: '600',
              letterSpacing: '0.3px'
            }}
          >
            LegalAxis
          </div>
        </div>

        {/* ===== SCROLLABLE MENU ===== */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 sidebar-scroll">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <div
                    className="menu-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: isActive
                        ? (theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')
                        : 'transparent',
                      color: isActive 
                        ? (theme === 'dark' ? '#FFFFFF' : '#000000')
                        : (theme === 'dark' ? '#B3B3B3' : '#6B7280')
                    }}
                  >
                    <item.Icon
                      size={20}
                      style={{
                        flexShrink: 0,
                        color: isActive 
                          ? (theme === 'dark' ? '#FFFFFF' : '#000000')
                          : (theme === 'dark' ? '#9CA3AF' : '#6B7280'),
                        transition: 'color 0.2s ease'
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* ===== USER SECTION ===== */}
        <div
          className="border-t border-border"
          style={{
            padding: '16px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <span
                className="text-white"
                style={{
                  fontSize: '15px',
                  fontWeight: '600'
                }}
              >
                {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                className="text-foreground"
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user?.displayName || 'User'}
              </p>
              <p
                className="text-muted-foreground"
                style={{
                  fontSize: '13px',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          <button
            className="support-button text-foreground border-border hover:bg-accent"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: 'transparent',
              border: '1px solid',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            Contact Support
          </button>
        </div>
      </aside>

      {/* Scrollbar + Hover Styles */}
      <style>{`
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} transparent;
        }

        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          border-radius: 2px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
        }

        .menu-item:hover {
          background-color: ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} !important;
          color: ${theme === 'dark' ? '#FFFFFF' : '#000000'} !important;
        }

        .menu-item:hover svg {
          color: ${theme === 'dark' ? '#FFFFFF' : '#000000'} !important;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
