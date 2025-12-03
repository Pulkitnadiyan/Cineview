import { Link } from "react-router-dom";
import { useGetWatchlistQuery } from "../../redux/api/user";
import MovieCard from "./MovieCard";
import Loader from "../../components/loader";
import banner from "../../assets/banner.jpg";
import { FaHeartBroken, FaBookmark } from "react-icons/fa"; // Ensure you have react-icons installed

const Watchlist = () => {
  const { data: watchlist, isLoading, error } = useGetWatchlistQuery();

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="text-center p-6 bg-gray-800 rounded-lg border border-red-500/50 shadow-lg">
          <h2 className="text-red-500 text-xl font-bold mb-2">Oops! Something went wrong.</h2>
          <p className="text-gray-400">{error?.data?.message || error.message || "Failed to load watchlist."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white pb-10">
      
      {/* 1. Hero / Banner Section */}
      <div 
        className="relative h-[20rem] md:h-[24rem] w-full bg-cover bg-center overflow-hidden" 
        style={{ backgroundImage: `url(${banner})` }}
      >
        {/* Gradient Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-gray-900"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 container mx-auto flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3 mb-2">
            <FaBookmark className="text-teal-400 text-3xl md:text-4xl" />
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl tracking-tight">
              My Watchlist
            </h1>
          </div>
          <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl text-center md:text-left">
            Your personalized collection of must-watch movies.
          </p>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="container mx-auto px-4 md:px-12 mt-4">
        
        {/* Stats Bar */}
        {watchlist?.length > 0 && (
           <div className="mb-8 border-b border-gray-800 pb-4 flex justify-between items-end">
              <span className="text-teal-500 font-semibold uppercase tracking-widest text-sm">
                {watchlist.length} {watchlist.length === 1 ? 'Title' : 'Titles'} Saved
              </span>
           </div>
        )}

        {watchlist && watchlist.length === 0 ? (
          // 3. Empty State Design
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="bg-gray-800 p-6 rounded-full mb-6 shadow-lg border border-gray-700">
                <FaHeartBroken className="text-gray-500 text-5xl" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md text-lg">
              It seems you haven't saved any movies yet. Explore our library and find your next favorite film!
            </p>
            <Link 
              to="/movies" 
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-teal-500/30 transform hover:-translate-y-1"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          // 4. Movie Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {watchlist.map((movie) => (
              <div key={movie._id} className="w-full hover:scale-105 transition-transform duration-300">
                 <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;