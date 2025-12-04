import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { useGetAllActorsQuery } from "../../redux/api/actors"; // Import Actors Query
import {
  useGetSpecificMovieQuery,
  useUpdateMovieMutation,
  useUploadImageMutation,
  useDeleteMovieMutation,
} from "../../redux/api/movies";
import { toast } from "react-toastify";
import ReactPlayer from "react-player";
import { BASE_URL } from "../../redux/constants";
import Select from "react-select"; // Import React Select

const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    cast: [],
    rating: 0, // Fixed typo from 'ratings' to 'rating' to match backend usually
    image: null,
    genre: "",
    trailer: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  // 1. Fetch Data
  const { data: initialMovieData, isLoading: isLoadingInitialData } = useGetSpecificMovieQuery(id);
  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();
  const { data: actors } = useGetAllActorsQuery(); // Fetch All Actors

  // 2. Setup Mutations
  const [updateMovie, { isLoading: isUpdatingMovie }] = useUpdateMovieMutation();
  const [uploadImage, { isLoading: isUploadingImage, error: uploadImageErrorDetails }] = useUploadImageMutation();
  const [deleteMovie] = useDeleteMovieMutation();

  // 3. Populate State on Load
  useEffect(() => {
    if (initialMovieData) {
      setMovieData({
        ...initialMovieData,
        genre: initialMovieData.genre?._id || "",
        // Ensure cast is an array of IDs for the state
        cast: initialMovieData.cast ? initialMovieData.cast.map((actor) => actor._id) : [],
      });
    }
  }, [initialMovieData]);

  // 4. Prepare Options for React Select
  const actorsOptions = actors?.map((actor) => ({
    value: actor._id,
    label: actor.name,
  }));

  // Helper to find selected options based on IDs in state
  const getSelectedActors = () => {
    if (!actorsOptions || !movieData.cast) return [];
    return actorsOptions.filter((option) => movieData.cast.includes(option.value));
  };

  // 5. Custom Styles for React Select (Dark Mode)
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#374151", // bg-gray-700
      borderColor: state.isFocused ? "#14b8a6" : "#4b5563", // teal-500 : gray-600
      color: "white",
      padding: "2px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1f2937", // bg-gray-800
      color: "white",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#14b8a6" : "#1f2937",
      color: "white",
      cursor: "pointer",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#14b8a6", // teal-500
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      ":hover": {
        backgroundColor: "#ef4444", // red-500
        color: "white",
      },
    }),
    input: (base) => ({ ...base, color: "white" }),
    singleValue: (base) => ({ ...base, color: "white" }),
  };

  // 6. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCastChange = (selectedOptions) => {
    const castIds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setMovieData({ ...movieData, cast: castIds });
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
        (!movieData.image && !selectedImage)
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
        trailer: movieData.trailer,
      };

      await updateMovie({
        id: id,
        updateMovie: dataToUpdate,
      }).unwrap();

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

  if (isLoadingInitialData || isLoadingGenres) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
        <p className="text-teal-400">Loading movie data...</p>
      </div>
    );
  }

  return (
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

          {/* Detail */}
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

          {/* Cast (Searchable React Select) */}
          <div>
            <label className="block text-gray-300 mb-2">Cast (Search & Select)</label>
            <Select
              isMulti
              value={getSelectedActors()} // Helper function to match IDs with Objects
              options={actorsOptions}
              onChange={handleCastChange}
              styles={customStyles}
              placeholder="Search and select actors..."
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

          {/* Trailer */}
          <div>
            <label className="block text-gray-300 mb-2">YouTube Trailer URL</label>
            <input
              type="text"
              name="trailer"
              value={movieData.trailer}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          {movieData.trailer && (
            <div className="mt-4 rounded-md overflow-hidden border border-gray-700">
              <ReactPlayer
                url={movieData.trailer}
                controls
                width="100%"
                height="300px"
              />
            </div>
          )}

          {/* Genre */}
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

          {/* Image Upload */}
          <div className="flex flex-col sm:flex-row gap-6 items-center py-4">
            {(selectedImage || movieData.image) && (
              <div className="w-full sm:w-1/3 flex-shrink-0">
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : movieData.image?.startsWith("http")
                      ? movieData.image
                      : `${BASE_URL}${movieData.image}`
                  }
                  alt="Movie Poster"
                  className="w-full h-32 object-cover rounded-lg border border-gray-600"
                />
              </div>
            )}

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
                className="hidden"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={handleUpdateMovie}
              className="flex-1 bg-teal-500 text-white font-semibold py-3 rounded-lg hover:bg-teal-600 transition duration-200 disabled:opacity-50"
              disabled={isUpdatingMovie || isUploadingImage}
            >
              {isUpdatingMovie || isUploadingImage ? "Updating..." : "Update Movie"}
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