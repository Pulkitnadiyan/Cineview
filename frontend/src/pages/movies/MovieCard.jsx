import { BASE_URL } from "../../redux/constants";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    // Main Card Container: Margin and Hover Shadow
    <div key={movie._id} className="relative group m-4 overflow-hidden rounded-lg shadow-xl bg-gray-800 transition duration-300 hover:shadow-2xl hover:scale-[1.02]">
      
      <Link to={`/movies/${movie._id}`}>
        {/* Movie Image with Opacity Hover Effect */}
        <img
          src={BASE_URL + movie.image}
          alt={movie.name}
          className="w-full h-72 object-cover rounded-t-lg transition duration-300 ease-in-out transform group-hover:opacity-30 group-hover:blur-sm"
        />
      </Link>

      {/* Movie Info Overlay */}
     <div 
        className="absolute inset-0 flex flex-col justify-end items-center p-4 
                   opacity-100 md:opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 group-hover:bg-black/50" // <-- FIX: opacity-100 md:opacity-0 added
      >
        {/* Movie Name */}
        <p className="text-xl font-bold text-white text-center mb-1">
          {movie.name}
        </p>
        
        {/* Example Detail / Year / Rating */}
        {movie.year && (
            <span className="text-sm text-teal-400 font-semibold">
                Release: {movie.year}
            </span>
        )}
        
        {/* Optional: View Details Button */}
        <Link 
            to={`/movies/${movie._id}`}
            className="mt-3 bg-teal-600 text-white text-sm font-semibold py-2 px-4 rounded-full transition duration-200 hover:bg-teal-700"
        >
            View Details
        </Link>
      </div>
      
    </div>
  );
};

export default MovieCard;