import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { toast } from "react-toastify";

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    cast: [],
    rating: 0,
    image: null,
    genre: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const [
    createMovie,
    { isLoading: isCreatingMovie, error: createMovieErrorDetail },
  ] = useCreateMovieMutation();

  const [
    uploadImage,
    { isLoading: isUploadingImage, error: uploadImageErrorDetails },
  ] = useUploadImageMutation();

  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();

  useEffect(() => {
    if (genres && genres.length > 0) { // Added length check
      setMovieData((prevData) => ({
        ...prevData,
        genre: genres[0]?._id || "",
      }));
    }
  }, [genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "genre") {
      // In a select dropdown with IDs as values, it's better to set the ID directly
      // The old logic was trying to find genre by name, which is wrong if value is ID
      setMovieData((prevData) => ({
        ...prevData,
        genre: value, // Directly set the value (which is the genre ID)
      }));
    } else if (name === "cast") {
      // Custom handler for cast input (comma-separated string to array)
      setMovieData({ ...movieData, cast: value.split(",").map(item => item.trim()) });
    }
    else {
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

  const handleCreateMovie = async () => {
    try {
      if (
        !movieData.name ||
        !movieData.year ||
        !movieData.detail ||
        movieData.cast.length === 0 || // Check if array is empty
        !selectedImage
      ) {
        toast.error("Please fill all required fields (including Cast and Image)");
        return;
      }

      let uploadedImagePath = null;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadImageResponse = await uploadImage(formData);

        if (uploadImageResponse.data) {
          uploadedImagePath = uploadImageResponse.data.image;
        } else {
            const errorMsg = uploadImageResponse.error?.data?.message || uploadImageResponse.error?.error || "Unknown upload error (400 Bad Request)";
          console.error("Failed to upload image: ", uploadImageErrorDetails);
          toast.error(`Failed to upload image : ${errorMsg}`);
          return;
        }

        await createMovie({
          ...movieData,
          image: uploadedImagePath,
        }).unwrap();

        navigate("/admin/movies-list");

        setMovieData({
          name: "",
          year: 0,
          detail: "",
          cast: [],
          ratings: 0,
          image: null,
          genre: genres[0]?._id || "", // Reset genre to default
        });

        toast.success("Movie Added To Database");
      }
    } catch (error) {
      console.error("Failed to create movie: ", error);
      toast.error(error?.data?.message || "Failed to create movie.");
    }
  };

  return (
    // Dark Theme Background and Centering
    <div className="bg-gray-900 min-h-screen text-white pt-10 flex justify-center">
      <div className="container max-w-2xl p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        
        <p className="text-teal-400 w-full text-3xl font-bold mb-6 text-center">
          Create New Movie
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
            ></textarea>
          </div>
          
          {/* Cast */}
          <div>
            <label className="block text-gray-300 mb-2">
              Cast (comma-separated, e.g., Brad Pitt, Leonardo DiCaprio)
            </label>
            <input
              type="text"
              name="cast"
              value={movieData.cast.join(", ")}
              onChange={handleChange} // Using the consolidated handleChange now
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
                  // Select options should use ID as the value
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Image Upload */}
          <div className="py-2">
            <label
              className={`block w-full text-center py-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedImage ? 'bg-teal-500 border-teal-500 text-white' : 'border border-gray-600 bg-gray-700 text-teal-400 hover:bg-gray-600'
              }`}
            >
              {selectedImage ? selectedImage.name : "Upload Movie Poster"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden" // Hide the default file input
              />
            </label>
            {selectedImage && (
                <p className="text-sm text-gray-400 mt-2">File selected: {selectedImage.name}</p>
            )}
          </div>

          {/* Create Button */}
          <button
            type="button"
            onClick={handleCreateMovie}
            className="w-full bg-teal-500 text-white font-semibold py-3 rounded-lg hover:bg-teal-600 transition duration-200 disabled:opacity-50"
            disabled={isCreatingMovie || isUploadingImage}
          >
            {isCreatingMovie || isUploadingImage ? "Creating..." : "Create Movie"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateMovie;