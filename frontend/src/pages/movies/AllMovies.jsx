import { useGetAllMoviesQuery } from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";
import MovieCard from "./MovieCard";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import banner from "../../assets/banner.jpg";
import {
  setMoviesFilter,
  setFilteredMovies,
  setMovieYears,
  setUniqueYears,
} from "../../redux/features/movies/moviesSlice";

const AllMovies = () => {
  const dispatch = useDispatch();
  const { data, isLoading: loadingAllMovies } = useGetAllMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: newMovies } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();

  const { moviesFilter, filteredMovies, uniqueYears } = useSelector(
    (state) => state.movies
  );

  useEffect(() => {
    if (data) {
      const movieYears = data.map((movie) => movie.year);
      const uniqueYearsData = Array.from(new Set(movieYears)).sort((a, b) => b - a);
      
      dispatch(setFilteredMovies(data || [])); 
      dispatch(setMovieYears(movieYears));
      dispatch(setUniqueYears(uniqueYearsData));
    }
  }, [data, dispatch]);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    dispatch(setMoviesFilter({ searchTerm: searchTerm }));

    const filteredMovies = data.filter((movie) =>
      movie.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    dispatch(setFilteredMovies(filteredMovies));
  };

  const handleGenreClick = (genreId) => {
    dispatch(setMoviesFilter({ selectedGenre: genreId }));
    
    if (!genreId) {
        dispatch(setFilteredMovies(data || [])); 
    } else {
        const filterByGenre = data.filter((movie) => movie.genre === genreId);
        dispatch(setFilteredMovies(filterByGenre));
    }
  };

  const handleYearChange = (year) => {
    dispatch(setMoviesFilter({ selectedYear: year }));

    if (!year) {
        dispatch(setFilteredMovies(data || []));
    } else {
        const filterByYear = data.filter((movie) => movie.year === +year);
        dispatch(setFilteredMovies(filterByYear));
    }
  };

  const handleSortChange = (sortOption) => {
    dispatch(setMoviesFilter({ selectedSort: sortOption }));
    
    let sortedData = [];
    switch (sortOption) {
      case "new":
        sortedData = newMovies;
        break;
      case "top":
        sortedData = topMovies;
        break;
      case "random":
        sortedData = randomMovies;
        break;

      default:
        sortedData = data;
        break;
    }
    dispatch(setFilteredMovies(sortedData || []));
  };

  if (loadingAllMovies) {
    return (
        <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
            <h1 className="text-xl text-teal-400">Loading movie list...</h1>
        </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-0">
      <section>
        
        {/* 1. Banner Section (Relative parent with Adjusted Height) */}
        <div
          className="relative min-h-[25rem] sm:min-h-[30rem] lg:min-h-[35rem] w-full max-w-full flex items-center justify-center bg-cover bg-center overflow-hidden" 
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute inset-0 bg-black/70"></div> 

          <div className="relative z-10 text-center text-white p-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 text-teal-400 drop-shadow-lg">
              The Movies Hub
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light">
              Cinematic Odyssey: Unveiling the Magic of Movies
            </p>
          </div>
        </div> {/* End of Banner Image Container */}
        
        {/* 2. Search Bar & Filters Container (Negative Margin Adjusted for visibility) */}
        <section className="-mt-16 sm:-mt-20 md:-mt-24 w-full flex flex-col items-center p-4 z-30">
            
            {/* Filter Dropdowns (MOVED UP: Filters now at the top of the overlapping section) */}
            {/* Mobile: Stacked (flex-col) | Desktop: Side-by-side (md:flex-row) */}
            <div className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-3xl z-30 mb-6">
              
              {/* Genre Filter */}
              <select
                className="w-full md:flex-1 border border-gray-600 p-3 rounded-lg text-gray-200 bg-gray-800 focus:ring-teal-500 focus:border-teal-500 block"
                value={moviesFilter.selectedGenre}
                onChange={(e) => handleGenreClick(e.target.value)}
              >
                <option value="">Genres</option>
                {genres?.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))}
              </select>

              {/* Year Filter */}
              <select
                className="w-full md:flex-1 border border-gray-600 p-3 rounded-lg text-gray-200 bg-gray-800 focus:ring-teal-500 focus:border-teal-500 block"
                value={moviesFilter.selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
              >
                <option value="">Year</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                className="w-full md:flex-1 border border-gray-600 p-3 rounded-lg text-gray-200 bg-gray-800 focus:ring-teal-500 focus:border-teal-500 block"
                value={moviesFilter.selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="new">New Releases</option>
                <option value="top">Top Rated</option>
                <option value="random">Random</option>
              </select>
            </div>
            {/* End of Filter Dropdowns */}

            {/* Search Input (MOVED DOWN: Now at the bottom, ensuring maximum visibility) */}
            <input
              type="text"
              className="w-full max-w-3xl h-14 md:h-[4rem] border-2 border-teal-500 bg-gray-900 text-white px-6 md:px-10 outline-none rounded-lg text-lg shadow-2xl transition duration-300 focus:border-teal-400"
              placeholder="Search Movie..."
              value={moviesFilter.searchTerm}
              onChange={handleSearchChange}
            />
          </section>
        {/* End of Search and Filters Section */}

        {/* 3. Movie Cards Display Section */}
        <section className="mt-8 w-full max-w-7xl mx-auto p-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-teal-400">
             {moviesFilter.searchTerm ? `Results for "${moviesFilter.searchTerm}"` : "All Movies"}
          </h2>
          
          <div className="flex justify-center items-center flex-wrap gap-8">
            {filteredMovies && filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))
            ) : (
                <p className="text-xl text-gray-400 mt-10">No movies found matching the criteria.</p>
            )}
          </div>
        </section>
      </section>
    </div>
  );
};

export default AllMovies;