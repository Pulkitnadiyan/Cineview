import Modal from "../../components/Modal";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";
import {
  useAddFavoriteMovieMutation,
  useRemoveFavoriteMovieMutation,
  useGetFavoriteMoviesQuery,
  useAddMovieToWatchlistMutation,
  useRemoveMovieFromWatchlistMutation,
  useGetWatchlistQuery,
} from "../../redux/api/user";
import MovieTabs from "./MovieTabs";
import { BASE_URL } from "../../redux/constants";

const MovieDetails = () => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  
  // Fetch movie data and loading state
  const { data: movie, refetch, isLoading: loadingMovieData } = useGetSpecificMovieQuery(movieId);
  
  const { userInfo } = useSelector((state) => state.auth);
  const [showTrailer, setShowTrailer] = useState(false);
  
  
  const [createReview, { isLoading: loadingMovieReview }] =
    useAddMovieReviewMutation();

  const [addFavoriteMovie] = useAddFavoriteMovieMutation();
  const [removeFavoriteMovie] = useRemoveFavoriteMovieMutation();
  const { data: favoriteMovies, refetch: refetchFavorites } = useGetFavoriteMoviesQuery();
  
  const [addMovieToWatchlist] = useAddMovieToWatchlistMutation();
  const [removeMovieFromWatchlist] = useRemoveMovieFromWatchlistMutation();
  const { data: watchlist, refetch: refetchWatchlist } = useGetWatchlistQuery();

  const isFavorite = favoriteMovies?.some((m) => m._id === movieId);
  const inWatchlist = watchlist?.some((m) => m._id === movieId);

  const handleAddFavorite = async () => {
    try {
      await addFavoriteMovie({ movieId }).unwrap();
      refetchFavorites();
      toast.success("Movie added to favorites");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      await removeFavoriteMovie({ movieId }).unwrap();
      refetchFavorites();
      toast.success("Movie removed from favorites");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await addMovieToWatchlist({ movieId }).unwrap();
      refetchWatchlist();
      toast.success("Movie added to watchlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      await removeMovieFromWatchlist({ movieId }).unwrap();
      refetchWatchlist();
      toast.success("Movie removed from watchlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        movieId,
        rating,
        comment,
      }).unwrap();

      refetch();
      setComment(""); // Clear comment after successful submission
      
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.message || "Failed to submit review.");
    }
  };

  if (loadingMovieData) {
    return (
        <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
            <h1 className="text-xl text-teal-400">Loading movie details...</h1>
        </div>
    );
  }

  return (
    // Main Container: Dark Background
    <div className="bg-gray-900 min-h-screen text-white pt-10 px-4 sm:px-8">
      
      {/* Go Back Link */}
      <div className="mb-8 w-full max-w-7xl mx-auto">
        <Link
          to="/"
          className="text-teal-400 font-semibold hover:underline"
        >
          ← Go Back to Home
        </Link>
      </div>

      {/* Movie Image */}
      <div className="flex justify-center mb-8">
        <img
        src={
      movie?.image?.startsWith("http")
        ? movie.image
        : `${BASE_URL}${movie?.image}`
    }
          alt={movie?.name}
          className="w-full max-w-4xl rounded-xl shadow-2xl border border-gray-700 object-cover"
        />
      </div>
      
      {/* Movie Info & Details Container */}
      <div className="w-full max-w-5xl mx-auto px-4">
        
        {/* Container One: Details & Cast */}
        <div className="flex flex-col lg:flex-row lg:justify-between mt-8 border-b border-gray-700 pb-8">
          
          <section className="lg:w-3/5 mb-6 lg:mb-0">
            {/* Title */}
            <h2 className="text-4xl md:text-5xl my-4 font-extrabold text-teal-400">
              {movie?.name}
            </h2>
            
            {/* Detail/Description */}
            <p className="my-4 text-gray-400 leading-relaxed max-w-xl">
              {movie?.detail}
            </p>
            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              {/* Trailer Button */}
              {movie?.trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 bg-transparent border-2 border-teal-400 text-teal-400 font-bold py-2 px-6 rounded hover:bg-teal-400 hover:text-gray-900 transition duration-300"
                >
                  Watch Trailer
                </button>
              )}
              {userInfo &&
                (isFavorite ? (
                  <button
                    onClick={handleRemoveFavorite}
                    className="flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition duration-300"
                  >
                    Remove from Favorites
                  </button>
                ) : (
                  <button
                    onClick={handleAddFavorite}
                    className="flex items-center gap-2 bg-teal-500 text-white font-bold py-2 px-6 rounded hover:bg-teal-600 transition duration-300"
                  >
                    Add to Favorites
                  </button>
                ))}
                {userInfo &&
                (inWatchlist ? (
                  <button
                    onClick={handleRemoveFromWatchlist}
                    className="flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition duration-300"
                  >
                    Remove from Watchlist
                  </button>
                ) : (
                  <button
                    onClick={handleAddToWatchlist}
                    className="flex items-center gap-2 bg-teal-500 text-white font-bold py-2 px-6 rounded hover:bg-teal-600 transition duration-300"
                  >
                    Add to Watchlist
                  </button>
                ))}
            </div>
            
            {/* Release Year */}
            <p className="text-xl font-semibold mt-6 text-gray-300">
              Releasing Date: <span className="text-white">{movie?.year}</span>
            </p>
          </section>

          {/* Cast List */}
          <div className="lg:w-1/4 p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
            <h3 className="text-2xl font-semibold mb-3 text-white border-b border-gray-600 pb-2">
                Starring
            </h3>
            <ul className="space-y-2">
              {movie?.cast.map((c, index) => (
                // Used index as key since the original code didn't have an ID for cast member
                <li key={index} className="text-gray-400 text-lg hover:text-teal-400 transition duration-150">
                    — {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Movie Tabs (Reviews) Container */}
        <div className="mt-8">
          <MovieTabs
            loadingMovieReview={loadingMovieReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            movie={movie}
          />
        </div>
        {/* Trailer Modal */}
      <Modal isOpen={showTrailer} onClose={() => setShowTrailer(false)}>
        <div className="relative w-full h-[50vh] md:w-[45rem] md:h-[25rem] bg-black">
          {(() => {
            const extractYoutubeId = (url) => {
              if (!url) return null;
              const regex =
                /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/;
              const match = url.match(regex);
              return match ? match[1] : null;
            };

            const id = extractYoutubeId(movie?.trailer);

            return id ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p>Invalid YouTube URL</p>
            );
          })()}
        </div>
      </Modal>


      </div>
    </div>
  );
};

export default MovieDetails;