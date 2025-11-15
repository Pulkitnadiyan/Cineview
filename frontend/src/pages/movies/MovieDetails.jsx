import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";
import MovieTabs from "./MovieTabs";
import { BASE_URL } from "../../redux/constants";

const MovieDetails = () => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  
  // Fetch movie data and loading state
  const { data: movie, refetch, isLoading: loadingMovieData } = useGetSpecificMovieQuery(movieId);
  
  const { userInfo } = useSelector((state) => state.auth);
  
  const [createReview, { isLoading: loadingMovieReview }] =
    useAddMovieReviewMutation();

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
          src={movie?.image}
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
      </div>
    </div>
  );
};

export default MovieDetails;