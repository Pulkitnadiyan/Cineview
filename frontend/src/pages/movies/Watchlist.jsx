import { useGetWatchlistQuery } from "../../redux/api/user";
import MovieCard from "./MovieCard";
import Loader from "../../components/loader";

const Watchlist = () => {
  const { data: watchlist, isLoading, error } = useGetWatchlistQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold mb-4 text-white">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-gray-400">No movies in your watchlist yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {watchlist.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
