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
        className="relative min-h-[25rem] sm:min-h-[30rem] lg:min-h-[35rem] w-full max-w-full flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 text-center text-white p-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 text-teal-400 drop-shadow-lg">
            My Watchlist
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light">
            Your curated list of movies to watch.
          </p>
        </div>
      </div>

      <section className="mt-8 w-full max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-teal-400">
          Your Watchlist
        </h2>

        {watchlist && watchlist.length === 0 ? (
          <p className="text-xl text-gray-400 mt-10 text-center">
            No movies in your watchlist yet.
          </p>
        ) : (
          <div className="flex justify-center items-center flex-wrap gap-8">
            {watchlist &&
              watchlist.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Watchlist;