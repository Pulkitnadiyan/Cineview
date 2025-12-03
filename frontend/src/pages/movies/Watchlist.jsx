import { useGetWatchlistQuery } from "../../redux/api/user";
import MovieCard from "./MovieCard";
import Loader from "../../components/loader";
import banner from "../../assets/banner.jpg";

const Watchlist = () => {
  const { data: watchlist, isLoading, error } = useGetWatchlistQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-0">
      <div
        className="relative h-60 w-full flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 text-center text-white p-4">
          <h1 className="text-4xl font-extrabold text-teal-400 drop-shadow-lg">
            My Watchlist
          </h1>
        </div>
      </div>

      <div className="p-4">
        {watchlist && watchlist.length === 0 ? (
          <p className="text-gray-400 text-center">
            No movies in your watchlist yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {watchlist &&
              watchlist.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;