import React, { useState, useEffect } from 'react';
// import { logout, reset } from '../../../features/auth/authSlice';
// import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import { 
  ChartNoAxesColumn, 
  Logs,
  Menu, 
  Users, 
 ShipWheel ,
 Blocks ,
  Settings, 
  Search,
  ChevronDown,
  ChevronRight,
  User,
 LogOut 
} from 'lucide-react';
import { useSelector } from 'react-redux';

const SideBar= () => {
  const location = useLocation();
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { user } = useSelector((state) => state.reducer.auth);
//   const name= user?.payload?.user?.firstName;
//   const email= user?.payload?.user?.email;

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to logout?");
    if (shouldLogout) {
      dispatch(logout());
      dispatch(reset());
      toast.success("Logged out successfully!");
      navigate("/");
    }
  };

  // Get active item from current URL
  const getActiveItemFromPath = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/matches') return 'Match';
    if (path === '/league') return 'League';
    if (path === '/players') return 'Players';
    

    return 'Dashboard'; // default
  };

  const activeItem = getActiveItemFromPath();

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: ChartNoAxesColumn, 
      active: true,
      path: '/dashboard'
    },
    { 
      name: 'Match', 
      icon: Blocks ,
      path: '/matches'
    },
    { 
      name: 'League', 
      icon: ShipWheel,
      path: '/league'
    },{ 
      name: 'Player', 
      icon: Users,
      path: '/players'
    }
  ];

  const handleItemClick = (itemName) => {
    if (itemName === 'Management') {
      setIsManagementOpen(!isManagementOpen);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const SidebarContent = () => (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-center">EPL</h1>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;
          
          return (
            <div key={item.name}>
              {item.hasSubmenu ? (
                <button
                  onClick={() => handleItemClick(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                    isActive 
                      ? 'bg-purple-50 text-[#288f5f]  border-[#288f5f]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-500' : 'text-gray-500'}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  {item.hasSubmenu && (
                    <div className="ml-auto">
                      {isManagementOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  )}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                    isActive 
                      ? 'bg-[#288f5f] text-white border-[#288f5f]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                </Link>
              )}
              
              {/* Submenu */}
              {item.hasSubmenu && isManagementOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        activeItem === subItem.name
                          ? 'bg-purple-50 text-purple-500'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-100">
        <Link
          to="/accountant-settings"
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
            activeItem === 'Settings' 
              ? 'bg-purple-50 text-purple-500' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings className={`w-5 h-5 ${activeItem === 'Settings' ? 'text-purple-500' : 'text-gray-500'}`} />
          <span className="font-medium text-sm">Settings</span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <Link 
        onClick={handleLogout} 
          to="/"
          className="flex items-center space-x-3 px-3 py-2 mb-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@gmail.com</p>
          </div>
          <LogOut  className="w-4 h-4 text-gray-400" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg border border-gray-200 md:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <div className="fixed top-0 left-0 w-64 h-screen z-40">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          {/* Backdrop */}
          {isMobileOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={toggleMobileMenu}
            />
          )}
          
          {/* Mobile Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default SideBar;