import { Link } from "react-router-dom";

// ✅ FIX: Added rating, setRating, and loadingMovieReview to props
const MovieTabs = ({ userInfo, submitHandler, comment, setComment, movie, rating, setRating, loadingMovieReview }) => { 
  return (
    // Main Container (Assuming parent component sets the overall bg-gray-900)
    <div className="text-white p-4 sm:p-6">
      
      {/* 1. Write Review Section */}
      <section className="mb-8 p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
        {userInfo ? (
          <form onSubmit={submitHandler}>
            
            {/* 🛑 FIX ADDED: Rating Select Dropdown */}
            <div className="my-2">
                <label htmlFor="rating" className="block text-xl font-semibold mb-2 text-teal-400">
                    Rating
                </label>
                <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-3 border border-gray-600 rounded-lg w-full xl:w-[45rem] bg-gray-700 text-white focus:border-teal-500 focus:ring-teal-500"
                    required
                >
                    <option value="0" disabled>Select Rating</option>
                    <option value="1">1 - Terrible</option>
                    <option value="2">2 - Poor</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                </select>
            </div>

            <div className="my-4">
              <label htmlFor="comment" className="block text-xl font-semibold mb-2 text-teal-400">
                Write Your Review
              </label>

              <textarea
                id="comment"
                rows="4" 
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                // Input Styling for Dark Theme
                className="p-3 border border-gray-600 rounded-lg w-full xl:w-[45rem] bg-gray-700 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500 resize-none"
                placeholder="Share your thoughts on the movie..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loadingMovieReview}
              // Teal Button Styling
              className="bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 hover:bg-teal-700 mt-2 disabled:opacity-50"
            >
              {loadingMovieReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="text-gray-300">
            Please{" "}
            <Link to="/login" className="text-teal-400 hover:underline font-medium">
              Sign In
            </Link>{" "}
            to write a review.
          </p>
        )}
      </section>

      {/* 2. Display Reviews Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-200">
            User Reviews ({movie?.reviews.length || 0})
        </h2>
        
        <div>
          {movie?.reviews.length === 0 && <p className="text-gray-400">No Reviews yet. Be the first one!</p>}
        </div>

        <div className="space-y-6"> {/* Added spacing between review cards */}
          {movie?.reviews.map((review) => (
            <div
              key={review._id}
              // Review Card Styling: Slightly dark background with border
              className="bg-gray-800 p-5 rounded-lg w-full xl:w-[45rem] border border-gray-700 shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                {/* Reviewer Name */}
                <strong className="text-teal-400 text-lg">{review.name}</strong>
                {/* Date */}
                <p className="text-gray-500 text-sm">
                  Reviewed on: {review.createdAt.substring(0, 10)}
                </p>
              </div>

              {/* Review Comment */}
              <p className="mt-2 text-gray-300 leading-relaxed italic">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieTabs;