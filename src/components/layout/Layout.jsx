// Layout.jsx
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024) { // lg breakpoint
        setSidebarOpen(false);
        setIsMobile(true);
      } else {
        setSidebarOpen(true);
        setIsMobile(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex min-h-screen w-full bg-black text-white pt-16">
        {/* Overlay for mobile when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}
        
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 bg-black">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;