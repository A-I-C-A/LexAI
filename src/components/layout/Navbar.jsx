// Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { Search, Bell, Menu, User, Settings, LogOut } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const { user, logOut } = useUserAuth();
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
    <nav className="bg-black border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 fixed w-full top-0 left-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center min-w-0">
          <button 
            onClick={toggleSidebar}
            className="mr-3 sm:mr-4 text-white hover:text-gray-300 focus:outline-none lg:hidden transition-all duration-300 p-2 hover:bg-white/10 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center min-w-0">
            <span className="text-xl sm:text-2xl font-light tracking-tighter text-white truncate flex items-center">
              <img 
              src="/logolegal.png" 
              alt="LegalAxis Logo" 
              className="h-9 sm:h-12 w-auto no-underline object-contain select-none mr-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
              draggable="false"
            />
              LegalAxis
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Desktop Search */}
          <div className="relative hidden md:block">
            <input 
              type="text" 
              className="bg-white/5 backdrop-blur-xl border border-black text-white text-sm rounded-full focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent block w-48 lg:w-64 pl-10 p-2.5 placeholder-white transition-all duration-300 font-light"

              placeholder="Search..."
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-8 h-10 text-white" />
            </div>
          </div>

          {/* Mobile Search Button */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden text-white hover:text-gray-300 focus:outline-none transition-all duration-300 p-2 hover:bg-white/10 rounded-lg"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="text-white hover:text-gray-300 focus:outline-none transition-all duration-300 p-2 hover:bg-white/10 rounded-lg relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-black transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full">3</span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute top-full right-0 z-50 mt-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-80 sm:w-96 py-2">
                <div className="px-4 py-2 border-b border-white/10">
                  <h3 className="text-sm font-medium text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="px-4 py-3 hover:bg-white/10 transition-colors duration-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Bell className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-white">Compliance Alert</p>
                          <p className="text-xs text-gray-400 mt-1">GDPR update requires attention</p>
                          <p className="text-xs text-white mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-white/10">
                  <button className="text-xs text-white hover:underline font-light">View all</button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button 
              type="button" 
              className="flex text-sm bg-white rounded-full focus:ring-2 focus:ring-emerald-500/40 transition-all duration-300 hover:scale-105"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="Open user menu"
            >
              <span className="sr-only">Open user menu</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white text-black font-medium text-sm sm:text-base">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 z-50 mt-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-48 sm:w-56 py-2">
                <div className="px-4 py-3 border-b border-white/10">
                  <span className="block text-sm text-white font-light">{user?.displayName || 'User'}</span>
                  <span className="block text-sm font-medium text-white truncate">{user?.email || 'user@example.com'}</span>
                </div>
                <ul className="py-2">
                  <li>
                    <a href="#" className="px-4 py-2 text-sm text-white hover:bg-white/10 transition-all duration-300 flex items-center font-light">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </a>
                  </li>
                  <li>
                    <a href="#" className="px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-300 flex items-center font-light">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </a>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogOut}
                      className="w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-300 flex items-center text-left font-light"
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

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10">
          <div className="relative">
            <input 
              type="text" 
              className="bg-white/5 backdrop-blur-xl border border-white/10 text-white text-sm rounded-full focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent block w-full pl-10 p-2.5 placeholder-gray-500 transition-all duration-300 font-light" 
              placeholder="Search..."
              autoFocus
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

