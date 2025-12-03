import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateActorMutation } from "../../redux/api/actors";
import { useUploadImageMutation } from "../../redux/api/movies"; // Reusing the image upload mutation
import { toast } from "react-toastify";

const CreateActor = () => {
  const navigate = useNavigate();

  const [actorData, setActorData] = useState({
    name: "",
    bio: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const [createActor, { isLoading: isCreatingActor }] = useCreateActorMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();

  const handleChange = (e) => {
    setActorData({ ...actorData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleCreateActor = async () => {
    try {
      if (!actorData.name || !actorData.bio || !selectedImage) {
        toast.error("Please fill all fields and select an image.");
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedImage);

      const uploadResponse = await uploadImage(formData).unwrap();

      await createActor({
        ...actorData,
        photo: uploadResponse.image,
      }).unwrap();

      toast.success("Actor created successfully");
      navigate("/admin/actors");
    } catch (error) {
      console.error("Failed to create actor:", error);
      toast.error(error?.data?.message || "Failed to create actor.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-10 flex justify-center">
      <div className="container max-w-2xl p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <p className="text-teal-400 w-full text-3xl font-bold mb-6 text-center">
          Create New Actor
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={actorData.name}
              onChange={handleChange}
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Bio</label>
            <textarea
              name="bio"
              value={actorData.bio}
              onChange={handleChange}
              rows="4"
              className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
            ></textarea>
          </div>

          <div className="py-2">
            <label
              className={`block w-full text-center py-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedImage ? 'bg-teal-500 border-teal-500 text-white' : 'border border-gray-600 bg-gray-700 text-teal-400 hover:bg-gray-600'
              }`}
            >
              {selectedImage ? selectedImage.name : "Upload Photo"}
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
            onClick={handleCreateActor}
            className="w-full bg-teal-500 text-white font-semibold py-3 rounded-lg hover:bg-teal-600 transition duration-200 disabled:opacity-50"
            disabled={isCreatingActor || isUploadingImage}
          >
            {isCreatingActor || isUploadingImage ? "Creating..." : "Create Actor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateActor;