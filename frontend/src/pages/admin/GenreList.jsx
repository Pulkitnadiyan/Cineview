import { useState } from "react";
import {
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
  useFetchGenresQuery,
} from "../../redux/api/genre";

import { toast } from "react-toastify";
import GenreForm from "../../components/GenreForm";
import Modal from "../../components/Modal";

const GenreList = () => {
  const { data: genres, refetch } = useFetchGenresQuery();
  const [name, setName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createGenre] = useCreateGenreMutation();
  const [updateGenre] = useUpdateGenreMutation();
  const [deleteGenre] = useDeleteGenreMutation();

  const handleCreateGenre = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Genre name is required");
      return;
    }

    try {
      const result = await createGenre({ name }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.genre.name} is created.`);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleUpdateGenre = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Genre name is required");
      return;
    }

    try {
      const result = await updateGenre({
        id: selectedGenre._id,
        updateGenre: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        refetch();
        setSelectedGenre(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Update failed.");
    }
  };

  const handleDeleteGenre = async () => {
    try {
      const result = await deleteGenre(selectedGenre._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        refetch();
        setSelectedGenre(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Genre deletion failed. Try again.");
    }
  };

  return (
    // Main Background Set to Dark Gray
    <div className="bg-gray-900 min-h-screen text-white pt-10">
      {/* Container for the content */}
      <div className="ml-[10rem] flex flex-col md:flex-row">
        <div className="md:w-3/4 p-3">
          {/* Heading Style Updated */}
          <h1 className="text-3xl font-bold mb-6 text-white">Manage Genres</h1>

          {/* Genre Form for Creation */}
          <GenreForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateGenre}
            // Button text added for clarity (assuming GenreForm supports this)
            buttonText="Create New Genre" 
          />

          <br />

          {/* Genre List Display */}
          <div className="flex flex-wrap">
            {genres?.map((genre) => (
              <div key={genre._id}>
                <button
                  // Button Styling for Dark Theme
                  className="bg-gray-800 border border-teal-500 text-teal-400 py-2 px-4 
                             rounded-full m-3 hover:bg-teal-500 hover:text-white 
                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 
                             transition duration-150"
                  onClick={() => {
                    // SYNTAX FIX: Removed redundant curly braces around statements
                    setModalVisible(true);
                    setSelectedGenre(genre);
                    setUpdatingName(genre.name);
                  }}
                >
                  {genre.name}
                </button>
              </div>
            ))}
          </div>

          {/* Modal for Update/Delete */}
          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <GenreForm
              value={updatingName}
              setValue={(value) => setUpdatingName(value)}
              handleSubmit={handleUpdateGenre}
              buttonText="Update"
              // handleDelete prop is used here for the Delete button logic in Modal
              handleDelete={handleDeleteGenre}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default GenreList;