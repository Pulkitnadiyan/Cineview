import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movies";
import { useGetAllActorsQuery } from "../../redux/api/actors"; // Import Actors Query
import { useFetchGenresQuery } from "../../redux/api/genre";
import { toast } from "react-toastify";
import Select from "react-select"; // 1. Import React Select

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
    trailer: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  // APIs
  const [createMovie, { isLoading: isCreatingMovie }] = useCreateMovieMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();
  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();
  const { data: actors } = useGetAllActorsQuery(); // Fetch Actors

  useEffect(() => {
    if (genres && genres.length > 0) {
      setMovieData((prevData) => ({
        ...prevData,
        genre: genres[0]?._id || "",
      }));
    }
  }, [genres]);

  // 2. Transform Actors Data for React Select
  const actorsOptions = actors?.map((actor) => ({
    value: actor._id,
    label: actor.name,
  }));

  // 3. Custom Styles for Dark Theme
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#374151", // Tailwind bg-gray-700
      borderColor: state.isFocused ? "#14b8a6" : "#4b5563", // Teal-500 or Gray-600
      color: "white",
      padding: "5px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1f2937", // Tailwind bg-gray-800
      color: "white",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#14b8a6" : "#1f2937", // Teal on hover
      color: "white",
      cursor: "pointer",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#14b8a6", // Teal background for selected tags
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      ":hover": {
        backgroundColor: "#ef4444", // Red on hover
        color: "white",
      },
    }),
    input: (base) => ({
        ...base,
        color: "white", // Text color while typing
    }),
    singleValue: (base) => ({
        ...base,
        color: "white",
    }),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 4. Handle React Select Change
  const handleCastChange = (selectedOptions) => {
    // Transform selected options back to an array of IDs for the backend
    const castIds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setMovieData({ ...movieData, cast: castIds });
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
        movieData.cast.length === 0 || 
        !selectedImage
      ) {
        toast.error("Please fill all required fields");
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
          toast.error("Failed to upload image");
          return;
        }

        await createMovie({
          ...movieData,
          image: uploadedImagePath,
        }).unwrap();

        navigate("/admin/movies-list");
        toast.success("Movie Added Successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create movie");
    }
  };

  return (
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
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500"
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
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500"
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
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500"
            ></textarea>
          </div>

          {/* React Select for Cast */}
          <div>
            <label className="block text-gray-300 mb-2">Cast (Search & Select)</label>
            <Select
              isMulti // Enable multi-select
              options={actorsOptions} // Pass transformed actors data
              onChange={handleCastChange} // Handle selection
              styles={customStyles} // Apply dark theme styles
              placeholder="Select actors..."
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-gray-300 mb-2">Genre</label>
            <select
              name="genre"
              value={movieData.genre}
              onChange={handleChange}
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500"
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

          {/* Trailer */}
          <div>
            <label className="block text-gray-300 mb-2">Trailer URL</label>
            <input
              type="text"
              name="trailer"
              value={movieData.trailer}
              onChange={handleChange}
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500"
            />
          </div>

          {/* Image Upload */}
          <div className="py-2">
            <label className="block w-full text-center py-3 rounded-lg cursor-pointer bg-gray-700 border border-gray-600 hover:bg-gray-600 transition">
              {selectedImage ? selectedImage.name : "Upload Movie Poster"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleCreateMovie}
            className="w-full bg-teal-500 text-white font-semibold py-3 rounded-lg hover:bg-teal-600 transition disabled:opacity-50"
            disabled={isCreatingMovie || isUploadingImage}
          >
            {isCreatingMovie ? "Creating..." : "Create Movie"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMovie;