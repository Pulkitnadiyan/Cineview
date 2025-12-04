import { useState } from "react";
import { AiOutlineHome, AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai";
import { MdOutlineLocalMovies, MdOutlineFeaturedPlayList, MdFavorite } from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"; // Import chatbot icon
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/user.js";
import { logout } from "../../redux/features/auth/authslice.js";
import Chatbot from "../../components/Chatbot.jsx";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State for chatbot visibility

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApicall] = useLogoutMutation();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

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
    <>
      {/* Main Fixed Navigation Bar Container */}
      <div
        className="
          fixed bottom-0 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-50 
          bg-[#0f0f0f] border border-gray-700 
          w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] max-w-xl 
          px-3 sm:px-4 py-2 rounded-t-xl sm:rounded-full shadow-2xl
        "
      >
        <section className="flex items-center justify-between w-full relative gap-3">
          {/* Section 1: Main Navigation Links */}
          <div className="flex flex-1 items-center justify-start space-x-4 sm:space-x-6 overflow-x-auto">
            {/* Home Link */}
            <Link
              to="/"
              className="flex flex-col md:flex-row items-center justify-center text-white text-xs md:text-sm gap-0.5 md:gap-1
                         transition-colors duration-200 hover:text-teal-400"
            >
              <AiOutlineHome size={22} />
              <span className="hidden md:block nav-item-name">Home</span>
            </Link>

            {/* Movies Link */}
            <Link
              to="/movies"
              className="flex flex-col md:flex-row items-center justify-center text-white text-xs md:text-sm gap-0.5 md:gap-1
                         transition-colors duration-200 hover:text-teal-400"
            >
              <MdOutlineLocalMovies size={22} />
              <span className="hidden md:block nav-item-name">Movies</span>
            </Link>

            {/* Watchlist Link */}
            <Link
              to="/watchlist"
              className="flex flex-col md:flex-row items-center justify-center text-white text-xs md:text-sm gap-0.5 md:gap-1
                         transition-colors duration-200 hover:text-teal-400"
            >
              <MdOutlineFeaturedPlayList size={22} />
              <span className="hidden md:block nav-item-name">Watchlist</span>
            </Link>

            {/* Favorites Link */}
            <Link
              to="/favorites"
              className="flex flex-col md:flex-row items-center justify-center text-white text-xs md:text-sm gap-0.5 md:gap-1
                         transition-colors duration-200 hover:text-teal-400"
            >
              <MdFavorite size={22} />
              <span className="hidden md:block nav-item-name">Favorites</span>
            </Link>
          </div>

          {/* Section 2: Chatbot Toggle Button (Center) */}
          <div className="flex flex-0 justify-center">
            <button
              onClick={toggleChatbot}
              className="text-white transition-colors duration-200 hover:text-teal-400 p-2 rounded-full"
              title="Open Chatbot"
            >
              <IoChatbubbleEllipsesOutline size={24} />
            </button>
          </div>

          {/* Section 3: User/Auth Area */}
          <div className="relative flex flex-1 items-center justify-end">
            {userInfo ? (
              // Logged In User Dropdown Button
              <button
                onClick={toggleDropdown}
                className="flex items-center text-white focus:outline-none hover:text-teal-400 transition-colors text-sm"
              >
                {/* Hide username on very small screens, show from sm and above */}
                <span className="hidden sm:inline mr-1 truncate max-w-[5rem]">
                  {userInfo.username}
                </span>
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
              <ul className="flex items-center space-x-3 sm:space-x-4">
                <li>
                  <Link
                    to="/login"
                    className="flex flex-col md:flex-row items-center justify-center text-white text-xs md:text-sm gap-0.5 md:gap-1
                               transition-colors duration-200 hover:text-teal-400"
                  >
                    <AiOutlineLogin size={22} />
                    <span className="hidden md:block nav-item-name">LOGIN</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="flex flex-col md:flex-row items-center justify-center text-white text-xs md:text-sm gap-0.5 md:gap-1
                               transition-colors duration-200 hover:text-teal-400"
                  >
                    <AiOutlineUserAdd size={22} />
                    <span className="hidden md:block nav-item-name">REGISTER</span>
                  </Link>
                </li>
              </ul>
            )}

            {/* Dropdown Menu (VISIBLE ONLY IF dropdownOpen AND userInfo ARE TRUE) */}
            {dropdownOpen && userInfo && (
              <ul
                className="
                  absolute right-0 bottom-full mb-2 w-[10rem] space-y-2 
                  bg-gray-800 text-white rounded-md shadow-lg py-1 border border-gray-700
                "
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
      </div>

      {/* Chatbot component (overlay / separate from navbar) */}
      <Chatbot isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} />
    </>
  );
};

export default Navigation;
