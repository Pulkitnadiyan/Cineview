// AdminDashboard.jsx (Updated)
import React, { useState } from 'react';
import Main from "./Main/Main";
import Sidebar from "./Sidebar/Sidebar";
 import AdminHeader from './Header/AdminHeader'

const AdminDashboard = () => {
    // State to manage the sidebar visibility on small screens
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        // Added pt-16 to the root div to create space for the fixed header
        <div className="bg-gray-900 min-h-screen pt-16"> 
            
            {/* 1. Header with Burger Icon */}
            <AdminHeader onToggle={toggleSidebar} />
            
            {/* 2. Sidebar Pass State (Sidebar should be modified as in the previous step) */}
            <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} /> 
            
            <main> 
                <Main />
            </main>
        </div>
    );
};

export default AdminDashboard;