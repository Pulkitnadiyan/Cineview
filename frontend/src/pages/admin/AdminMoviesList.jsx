import { Link } from "react-router-dom";
import { useGetAllMoviesQuery } from "../../redux/api/movies";

const AdminMoviesList = () => {
  const { data: movies, isLoading, isError } = useGetAllMoviesQuery();

  return (
    // Main Background Set to Dark Gray, Text to White
    <div className="bg-gray-900 min-h-screen text-white pt-10">
      <div className="container mx-auto px-4 md:px-12"> 
        {/* Adjusted container to be more centralized */}
        
        <div className="flex flex-col">
          <div className="p-3">
            {/* Heading Style Updated */}
            <div className="text-3xl font-bold mb-6 text-teal-400">
              All Movies ({isLoading ? '...' : movies?.length || 0})
            </div>

            {isLoading && (
              <p className="text-teal-500">Loading movies...</p>
            )}
            
            {isError && (
              <p className="text-red-500">Error fetching movies list.</p>
            )}

            {/* Movie Cards Container */}
            <div className="flex flex-wrap gap-8 justify-center p-4">
              {movies?.map((movie) => (
                <div key={movie._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs overflow-hidden">
                  <div className="rounded-lg shadow-xl bg-gray-800 border border-gray-700 hover:shadow-2xl transition duration-300">
                    
                    {/* Movie Image */}
                    <img
                      src={movie.image}
                      alt={movie.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    
                    {/* Movie Details */}
                    <div className="p-4">
                      {/* Name */}
                      <div className="font-bold text-xl mb-2 text-white truncate">{movie.name}</div>
                      
                      {/* Detail (Limited text length for card view) */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {movie.detail}
                      </p>

                      {/* Update Button */}
                      <div className="pt-2">
                        <Link
                          to={`/admin/movies/update/${movie._id}`}
                          // Teal Button Styling
                          className="w-full block text-center bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                          Update Movie
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMoviesList;