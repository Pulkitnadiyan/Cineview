import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetActorByIdQuery, useUpdateActorMutation } from "../../redux/api/actors";
import { toast } from "react-toastify";
import Loader from "../../components/loader";

const UpdateActor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: actor, isLoading } = useGetActorByIdQuery(id);
  const [updateActor, { isLoading: isUpdating }] = useUpdateActorMutation();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    if (actor) {
      setName(actor.name);
      setBio(actor.bio);
      setPhoto(actor.photo);
    }
  }, [actor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateActor({
        id,
        data: { name, bio, photo },
      }).unwrap();
      
      toast.success("Actor updated successfully");
      navigate("/admin/actors/manage");
    } catch (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center pt-20">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-teal-400 text-center">Update Actor</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-teal-500 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Photo URL</label>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-teal-500 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Bio</label>
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-teal-500 text-white"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-teal-500 text-white font-bold py-3 rounded hover:bg-teal-600 transition disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Actor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateActor;