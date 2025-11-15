import {
  useDeleteCommentMutation,
  useGetAllMoviesQuery,
} from "../../redux/api/movies";
import { toast } from "react-toastify";
import Loader from "../../components/loader"; // Assuming you have a Loader component

const AllComments = () => {
  // Rename 'movie' to 'moviesData' for clarity since it holds an array of movies
  const { data: moviesData, refetch, isLoading } = useGetAllMoviesQuery();

  const [deleteComment] = useDeleteCommentMutation();

  const handleDeleteComment = async (movieId, reviewId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
        return;
    }
    
    try {
      await deleteComment({ movieId, reviewId });
      toast.success("Comment Deleted Successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting comment: ", error);
      toast.error(error?.data?.message || "Comment deletion failed.");
    }
  };

  if (isLoading) {
    return (
        <div className="bg-gray-900 min-h-screen flex justify-center items-center">
            <Loader />
        </div>
    );
  }

  // Flatten the reviews into a single array for easier display, 
  // ensuring each review carries its parent movie name/ID for context
  const allReviews = moviesData
    ? moviesData.flatMap((movie) =>
        movie.reviews.map((review) => ({
          ...review,
          movieId: movie._id,
          movieName: movie.name,
        }))
      )
    : [];

  return (
    // Main Container: Dark Background
    <div className="bg-gray-900 min-h-screen text-white p-4 md:p-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-teal-400">
        Manage All User Reviews ({allReviews.length})
      </h1>
      
      {allReviews.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No reviews found across all movies.</p>
      )}

      {/* Reviews Display */}
      <div className="flex flex-col items-center space-y-6">
        {allReviews.map((review) => (
          <div
            key={review._id}
            // Review Card Styling: Dark Gray BG, consistent border, fixed max width
            className="bg-gray-800 p-5 rounded-lg w-full max-w-2xl border border-gray-700 shadow-xl"
          >
            <div className="flex justify-between items-start border-b border-gray-700 pb-3 mb-3">
              {/* Reviewer Name & Movie Context */}
              <div>
                <strong className="text-teal-400 text-lg block">{review.name}</strong>
                <span className="text-sm text-gray-500">
                    on: <span className="text-gray-400 font-semibold">{review.movieName}</span>
                </span>
              </div>
              
              {/* Date */}
              <p className="text-gray-500 text-sm">
                Date: {review.createdAt.substring(0, 10)}
              </p>
            </div>

            {/* Comment Body */}
            <p className="my-4 text-gray-300 leading-relaxed">
                "{review.comment}"
            </p>

            {/* Delete Button */}
            <button
              className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md transition duration-200 hover:bg-red-700"
              onClick={() => handleDeleteComment(review.movieId, review._id)}
            >
              Delete Comment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AllComments;