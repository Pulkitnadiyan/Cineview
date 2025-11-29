import { useSelector } from "react-redux";
import { selectFavoriteMovies } from "../../redux/features/movies/moviesSlice";
import MovieCard from "./MovieCard";

const FavoriteMovies = () => {
  const favorites = useSelector(selectFavoriteMovies);

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold mb-4 text-white">Favorite Movies</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-400">No favorite movies yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteMovies;