import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchGenresQuery } from "../../redux/api/genre";
import {
  useGetSpecificMovieQuery,
  useUpdateMovieMutation,
  useUploadImageMutation,
  useDeleteMovieMutation,
} from "../../redux/api/movies";
import { toast } from "react-toastify";


const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    cast: [],
    ratings: 0,
    image: null,
    genre: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const { data: initialMovieData, isLoading: isLoadingInitialData } =
    useGetSpecificMovieQuery(id);

  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();

  useEffect(() => {
    if (initialMovieData) {
      setMovieData({
        ...initialMovieData,
        genre: initialMovieData.genre?._id,
      });
    }
  }, [initialMovieData]);

  const [updateMovie, { isLoading: isUpdatingMovie }] =
    useUpdateMovieMutation();

  const [
    uploadImage,
    { isLoading: isUploadingImage, error: uploadImageErrorDetails },
  ] = useUploadImageMutation();

  const [deleteMovie] = useDeleteMovieMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cast") {
      // Handle cast input: comma-separated string to array of trimmed strings
      setMovieData((prevData) => ({
        ...prevData,
        cast: value.split(",").map((item) => item.trim()),
      }));
    } else {
      setMovieData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleUpdateMovie = async () => {
    try {
      if (
        !movieData.name ||
        !movieData.year ||
        !movieData.detail ||
        movieData.cast.length === 0 ||
        !movieData.genre ||
        !movieData.image // Ensure initial image exists or new one is provided
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      let uploadedImagePath = movieData.image;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadImageResponse = await uploadImage(formData);

        if (uploadImageResponse.data) {
          uploadedImagePath = uploadImageResponse.data.image;
        } else {
          console.error("Failed to upload image:", uploadImageErrorDetails);
          toast.error("Failed to upload image");
          return;
        }
      }

      const dataToUpdate = {
        name: movieData.name,
        year: movieData.year,
        detail: movieData.detail,
        cast: movieData.cast,
        genre: movieData.genre,
        image: uploadedImagePath,
      };

      await updateMovie({
        id: id,
        updateMovie: dataToUpdate,
      }).unwrap(); // Use .unwrap() to catch errors correctly

      toast.success("Movie updated successfully!");
      navigate("/admin/movies-list");
    } catch (error) {
      console.error("Failed to update movie:", error);
      toast.error(error?.data?.message || "Failed to update movie.");
    }
  };

  const handleDeleteMovie = async () => {
    if (!window.confirm("Are you sure you want to delete this movie?")) {
      return;
    }

    try {
      await deleteMovie(id).unwrap();
      toast.success("Movie deleted successfully");
      navigate("/admin/movies-list");
    } catch (error) {
      console.error("Failed to delete movie:", error);
      toast.error(error?.data?.message || `Failed to delete movie.`);
    }
  };

  // Loading state for initial data fetch
  if (isLoadingInitialData || isLoadingGenres) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
        <p className="text-teal-400">Loading movie data...</p>
      </div>
    );
  }

  // Final JSX structure
  return (
    // Dark Theme Background and Centering
    <div className="bg-gray-900 min-h-screen text-white pt-10 flex justify-center">
      <div className="container max-w-2xl p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <p className="text-teal-400 w-full text-3xl font-bold mb-6 text-center">
          Update Movie
        </p>

        <form className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={movieData.name}
              onChange={handleChange}
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-gray-300 mb-2">Year</label>
            <input
              type="number"
              name="year"
              value={movieData.year}
              onChange={handleChange}
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          {/* Detail (Textarea) */}
          <div>
            <label className="block text-gray-300 mb-2">Detail</label>
            <textarea
              name="detail"
              value={movieData.detail}
              onChange={handleChange}
              rows="4"
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          {/* Cast */}
          <div>
            <label className="block text-gray-300 mb-2">
              Cast (comma-separated):
            </label>
            <input
              type="text"
              name="cast"
              value={movieData.cast ? movieData.cast.join(", ") : ""} // Check for array before join
              onChange={handleChange}
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          {/* Genre Dropdown */}
          <div>
            <label className="block text-gray-300 mb-2">Genre</label>
            <select
              name="genre"
              value={movieData.genre}
              onChange={handleChange}
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
              disabled={isLoadingGenres}
            >
              {isLoadingGenres ? (
                <option>Loading genres...</option>
              ) : (
                genres?.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Image Display & Upload */}
          <div className="flex flex-col sm:flex-row gap-6 items-center py-4">
            {/* Current Image Preview */}
            {(selectedImage || movieData.image) && (
              <div className="w-full sm:w-1/3 flex-shrink-0">
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : movieData.image
                  }
                  alt="Movie Poster"
                  className="w-full h-32 object-cover rounded-lg border border-gray-600"
                />
              </div>
            )}

            {/* Image Upload Button (Tailwind Styling) */}
            <label
              className={`block w-full text-center py-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedImage
                  ? "bg-teal-500 border-teal-500 text-white"
                  : "border border-gray-600 bg-gray-700 text-teal-400 hover:bg-gray-600"
              }`}
            >
              {selectedImage ? selectedImage.name : "Change Movie Poster"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden" // Hide the default file input
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={handleUpdateMovie}
              className="flex-1 bg-teal-500 text-white font-semibold py-3 rounded-lg hover:bg-teal-600 transition duration-200 disabled:opacity-50"
              disabled={isUpdatingMovie || isUploadingImage}
            >
              {isUpdatingMovie || isUploadingImage
                ? "Updating..."
                : "Update Movie"}
            </button>

            <button
              type="button"
              onClick={handleDeleteMovie}
              className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50"
              disabled={isUpdatingMovie || isUploadingImage}
            >
              Delete Movie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdateMovie;