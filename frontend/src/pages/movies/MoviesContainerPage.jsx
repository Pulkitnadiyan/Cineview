import { useState } from "react";
import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";

import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../components/SliderUtil";

const MoviesContainerPage = () => {
  const { data: newMovies, isLoading: loadingNewMovies } = useGetNewMoviesQuery();
  const { data: topMovies, isLoading: loadingTopMovies } = useGetTopMoviesQuery();
  const { data: genres, isLoading: loadingGenres } = useFetchGenresQuery();
  const { data: randomMovies, isLoading: loadingRandomMovies } = useGetRandomMoviesQuery();

  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreClick = (genreId) => {
    // Toggle functionality: Agar wahi genre dobara click ho toh filter clear kar do
    setSelectedGenre(selectedGenre === genreId ? null : genreId);
  };

  // Filter movies based on the selected genre (using newMovies as base for the last slider)
  const filteredMovies = newMovies?.filter(
    (movie) => selectedGenre === null || movie.genre === selectedGenre
  );
  
  // Overall loading check
  const isPageLoading = loadingNewMovies || loadingTopMovies || loadingGenres || loadingRandomMovies;

  if (isPageLoading) {
    return (
        <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center ">
            <h1 className="text-xl text-teal-400">Loading movie content...</h1>
        </div>
    );
  }

  return (
    // Main Container: Dark Background
    <div className="bg-gray-900 min-h-screen text-white pt-10 px-4 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row lg:justify-start">
        
        {/* Genre Filter Navigation (Sidebar on Large screens, Top bar on others) */}
        <nav className="p-4 rounded-lg bg-gray-800 shadow-xl border border-gray-700 
                        ml-0 lg:ml-[2rem] mb-6 lg:mb-0 
                        flex flex-wrap justify-center lg:flex-col gap-2 h-fit max-w-full lg:max-w-[12rem]">
            
            {/* Show All Button */}
            <button
                className={`transition duration-300 ease-in-out block p-2 rounded-lg text-sm font-medium
                           ${selectedGenre === null ? "bg-teal-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-teal-500 hover:text-white"}`}
                onClick={() => handleGenreClick(null)}
            >
                All Genres
            </button>
            
            {/* Genre Buttons */}
            {genres?.map((g) => (
            <button
              key={g._id}
              className={`transition duration-300 ease-in-out block p-2 rounded-lg text-sm font-medium
                         ${selectedGenre === g._id ? "bg-teal-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-teal-500 hover:text-white"}`}
              onClick={() => handleGenreClick(g._id)}
            >
              {g.name}
            </button>
            ))}
        </nav>

        {/* Movie Sliders Section */}
        <section className="flex flex-col w-full lg:ml-8">
          {/* Slider 1: Choose For You (Random Movies) */}
          <div className="w-full mb-10">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-5 text-teal-400">
                ⭐ Choose For You
            </h1>
            <SliderUtil data={randomMovies} />
          </div>

          {/* Slider 2: Top Movies */}
          <div className="w-full mb-10">
            <h1 className="text-3xl font-bold mb-5 text-teal-400">
                🏆 Top Movies
            </h1>
            <SliderUtil data={topMovies} />
          </div>

          {/* Slider 3: Filtered/New Movies */}
          <div className="w-full mb-10">
            <h1 className="text-3xl font-bold mb-5 text-teal-400">
                🎬 {selectedGenre ? genres?.find(g => g._id === selectedGenre)?.name : 'New Releases'}
            </h1>
            <SliderUtil data={filteredMovies} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default MoviesContainerPage;