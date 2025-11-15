import React from 'react';
import { FaBars } from 'react-icons/fa'; // Burger Icon
import { Link } from 'react-router-dom';

// Prop: onToggle (Sidebar state change function)
const AdminHeader = ({ onToggle }) => {
  return (
    // Fixed top bar for mobile navigation
    // md:ml-64 to match the Main content offset on desktop
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 z-40 md:ml-64">
      <div className="flex justify-between items-center">
        
        {/* Logo/Title Link */}
        <Link to="/admin/movies/dashboard" className="text-xl font-bold text-teal-400">
          Admin Panel
        </Link>

        {/* Burger Icon (Only visible on small screens/mobile) */}
        <button 
          onClick={onToggle} 
          className="md:hidden p-2 text-gray-300 hover:text-white transition duration-200"
        >
          {/* FaBars is the Burger icon from react-icons */}
          <FaBars size={24} /> 
        </button>

      </div>
    </header>
  );
};

export default AdminHeader;