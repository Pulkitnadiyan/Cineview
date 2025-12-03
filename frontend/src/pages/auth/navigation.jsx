import { useState } from "react";
import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';
import * as Io5Icons from 'react-icons/io5'; // Import chatbot icon
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from "../../redux/api/user.js";
import { logout } from '../../redux/features/auth/authslice.js';
import Chatbot from "../../components/Chatbot.jsx";

const Navigation = () => {
    const { userInfo } = useSelector((state) => state.auth);
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State for chatbot visibility
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [logoutApicall] = useLogoutMutation();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const toggleChatbot = () => { // Function to toggle chatbot visibility
        setIsChatbotOpen(!isChatbotOpen);
    }
    
    const logoutHandler = async () => {
        try {
            await logoutApicall().unwrap();
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };


    return (
        // Main Fixed Navigation Bar Container (Positioning and Styling for the bar)
        <div className="fixed bottom-0 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-50 bg-[#0f0f0f] border border-gray-700 
             w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] max-w-xl 
             px-4 py-2 rounded-t-xl sm:rounded-full shadow-2xl">

            <section className="flex justify-between items-center w-full relative"> {/* Added relative for Chatbot positioning */}
                
                {/* Section 1: Main Navigation Links */}
                <div className="flex space-x-6">
                    {/* Home Link */}
                    <Link
                        to="/"
                        className="flex items-center text-white transition-colors duration-200 hover:text-teal-400"
                    >
                        <AiIcons.AiOutlineHome size={22} />
                        <span className="hidden md:block nav-item-name ml-1">Home</span>
                    </Link>

                    {/* Movies Link */}
                    <Link
                        to="/movies"
                        className="flex items-center text-white transition-colors duration-200 hover:text-teal-400"
                    >
                        <MdIcons.MdOutlineLocalMovies size={22} />
                        <span className="hidden md:block nav-item-name ml-1">Movies</span>
                    </Link>

                    <Link
                        to="/watchlist"
                        className="flex items-center text-white transition-colors duration-200 hover:text-teal-400"
                    >
                        <MdIcons.MdOutlineFeaturedPlayList size={22} />
                        <span className="hidden md:block nav-item-name ml-1">Watchlist</span>
                    </Link>
                </div>

                {/* Section 2: Chatbot Toggle Button (Center) */}
                <div className="flex-grow flex justify-center">
                    <button
                        onClick={toggleChatbot}
                        className="text-white transition-colors duration-200 hover:text-teal-400 p-2 rounded-full"
                        title="Open Chatbot"
                    >
                        <Io5Icons.IoChatbubbleEllipsesOutline size={22} />
                    </button>
                </div>

                {/* Section 3: User/Auth Area */}
                <div className="relative flex items-center">
                    {userInfo ? (
                        // Logged In User Dropdown Button
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center text-white focus:outline-none hover:text-teal-400 transition-colors"
                        >
                            <span className="mr-1">{userInfo.username}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 transform transition-transform duration-200 ${
                                    dropdownOpen ? "rotate-180" : "rotate-0"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                                />
                            </svg>
                        </button>
                    ) : (
                        // Not Logged In: Login/Register Links
                        <ul className="flex space-x-4">
                            <li>
                                <Link
                                    to="/login"
                                    className="flex items-center text-white transition-colors duration-200 hover:text-teal-400"
                                >
                                    <AiIcons.AiOutlineLogin size={22} />
                                    <span className="hidden md:block nav-item-name ml-1">LOGIN</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="flex items-center text-white transition-colors duration-200 hover:text-teal-400"
                                >
                                    <AiIcons.AiOutlineUserAdd size={22} />
                                    <span className="hidden md:block nav-item-name ml-1">REGISTER</span>
                                </Link>
                            </li>
                        </ul>
                    )}

                    {/* Dropdown Menu (VISIBLE ONLY IF dropdownOpen AND userInfo ARE TRUE) */}
                    {dropdownOpen && userInfo && (
                        <ul
                            className="absolute right-0 bottom-full mb-2 w-[10rem] space-y-2 
                                       bg-gray-800 text-white rounded-md shadow-lg py-1 border border-gray-700"
                            onClick={() => setDropdownOpen(false)}
                        >
                            {/* Admin Dashboard Link */}
                            {userInfo.isAdmin && (
                                <li>
                                    <Link
                                        to="/admin/movies/dashboard"
                                        className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                            )}

                            {/* Profile Link */}
                            <li>
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                                >
                                    Profile
                                </Link>
                            </li>

                            {/* Logout Button */}
                            <li>
                                <button
                                    onClick={logoutHandler}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </section>
            <Chatbot isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} /> {/* Pass props to Chatbot */}
        </div>
    );
};

export default Navigation;