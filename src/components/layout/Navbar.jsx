// Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, Menu, User, Settings, LogOut, Sun, Moon } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const { user, logOut } = useUserAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <nav className="bg-background border-b border-border px-4 sm:px-6 py-3 sm:py-4 fixed w-full top-0 left-0 z-50 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center min-w-0">
          <button 
            onClick={toggleSidebar}
            className="mr-3 sm:mr-4 text-foreground hover:text-muted-foreground focus:outline-none lg:hidden transition-all duration-300 p-2 hover:bg-accent rounded-lg"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center min-w-0">
            <span className="text-xl sm:text-2xl font-light tracking-tighter text-foreground truncate flex items-center">
              <img 
              src="/logolegal.png" 
              alt="LegalAxis Logo" 
              className="h-9 sm:h-12 w-auto no-underline object-contain select-none mr-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
              draggable="false"
            />
              LegalAxis
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="text-foreground hover:text-muted-foreground focus:outline-none transition-all duration-300 p-2 hover:bg-accent rounded-lg"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="text-foreground hover:text-muted-foreground focus:outline-none transition-all duration-300 p-2 hover:bg-accent rounded-lg relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-background transform translate-x-1/2 -translate-y-1/2 bg-foreground rounded-full">3</span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute top-full right-0 z-50 mt-2 bg-card backdrop-blur-xl border border-border rounded-2xl shadow-2xl w-80 sm:w-96 py-2">
                <div className="px-4 py-2 border-b border-border">
                  <h3 className="text-sm font-medium text-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="px-4 py-3 hover:bg-accent transition-colors duration-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Bell className="w-4 h-4 text-foreground" />
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-foreground">Compliance Alert</p>
                          <p className="text-xs text-muted-foreground mt-1">GDPR update requires attention</p>
                          <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-border">
                  <button className="text-xs text-foreground hover:underline font-light">View all</button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button 
              type="button" 
              className="flex text-sm bg-foreground rounded-full focus:ring-2 focus:ring-dashboard-accent/40 transition-all duration-300 hover:scale-105"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="Open user menu"
            >
              <span className="sr-only">Open user menu</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-foreground text-background font-medium text-sm sm:text-base">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 z-50 mt-2 bg-card backdrop-blur-xl border border-border rounded-2xl shadow-2xl w-48 sm:w-56 py-2">
                <div className="px-4 py-3 border-b border-border">
                  <span className="block text-sm text-foreground font-light">{user?.displayName || 'User'}</span>
                  <span className="block text-sm font-medium text-foreground truncate">{user?.email || 'user@example.com'}</span>
                </div>
                <ul className="py-2">
                  <li>
                    <a href="#" className="px-4 py-2 text-sm text-foreground hover:bg-accent transition-all duration-300 flex items-center font-light">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </a>
                  </li>
                  <li>
                    <a href="#" className="px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-300 flex items-center font-light">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </a>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogOut}
                      className="w-full px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-300 flex items-center text-left font-light"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

