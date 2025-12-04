import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <>
      {/* Main Container: Conditionally visible based on isOpen state */}
      <div
        className={`
          w-64 fixed top-0 bottom-0 left-0 bg-gray-900 border-r border-gray-700 pt-20 z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:flex 
        `}
      >
        {/* Sidebar Content */}
        <aside className="w-full flex-shrink-0">
          <ul className="space-y-2 px-4">
            {/* Dashboard Link */}
            <li className="text-lg">
              <Link
                to="/admin/movies/dashboard"
                className="block p-3 rounded-lg text-white font-semibold transition duration-200 bg-teal-600 hover:bg-teal-700 shadow-md"
                onClick={toggle} // Close sidebar on link click
              >
                Dashboard
              </Link>
            </li>
            
            {/* Other Links */}
            <li className="text-lg">
              <Link
                to="/admin/movies/create"
                className="block p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
                onClick={toggle}
              >
                Create Movie
              </Link>
            </li>
            
            <li className="text-lg">
              <Link
                to="/admin/movies/genre"
                className="block p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
                onClick={toggle}
              >
                Create Genre
              </Link>
            </li>
            <li className="text-lg">
    <Link
      to="/admin/actors/create"
      className="block p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
      onClick={toggle}
    >
      Create Actor
    </Link>
  </li>

            <li className="text-lg">
              <Link
                to="/admin/movies-list"
                className="block p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
                onClick={toggle}
              >
                Manage Movies
              </Link>
            </li>
            
            <li className="text-lg">
              <Link
                to="/admin/movies/comments"
                className="block p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-teal-400 transition duration-200"
                onClick={toggle}
              >
                Manage Comments
              </Link>
            </li>
          </ul>
        </aside>
      </div>

      {/* Backdrop Overlay: Conditionally visible when sidebar is open on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggle}
        ></div>
      )}
    </>
  );
};

export default Sidebar;