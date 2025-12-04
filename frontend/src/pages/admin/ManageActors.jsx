import { Link } from "react-router-dom";
import { useGetAllActorsQuery, useDeleteActorMutation } from "../../redux/api/actors";
import { toast } from "react-toastify";
import Loader from "../../components/loader";

const ManageActors = () => {
  const { data: actors, isLoading, refetch } = useGetAllActorsQuery();
  const [deleteActor] = useDeleteActorMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this actor?")) {
      try {
        await deleteActor(id).unwrap();
        toast.success("Actor deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete actor");
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8 pt-20">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-teal-400 text-center">
          Manage Actors ({actors?.length})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {actors?.map((actor) => (
            <div
              key={actor._id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-teal-500 transition duration-300"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={actor.photo}
                  alt={actor.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="p-4 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 text-center">{actor.name}</h2>
                
                <div className="flex gap-4 w-full">
                  <Link
                    to={`/admin/actors/update/${actor._id}`}
                    className="flex-1 bg-teal-600 text-white py-2 rounded text-center hover:bg-teal-700 transition"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(actor._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageActors;