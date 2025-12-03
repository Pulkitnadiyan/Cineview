import { BASE_URL } from "../../redux/constants";
import { Link } from "react-router-dom";
import { useGetAllActorsQuery } from "../../redux/api/actors";

const ActorList = () => {
  const { data: actors, isLoading, isError } = useGetAllActorsQuery();

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-10">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex justify-between items-center mb-6">
          <div className="text-3xl font-bold text-teal-400">
            Actors ({isLoading ? '...' : actors?.length || 0})
          </div>
          <Link to="/admin/actors/create" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Create Actor
          </Link>
        </div>

        {isLoading && <p className="text-teal-500">Loading actors...</p>}
        {isError && <p className="text-red-500">Error fetching actors list.</p>}

        <div className="flex flex-wrap gap-8 justify-center p-4">
          {actors?.map((actor) => (
            <div key={actor._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs overflow-hidden">
              <div className="rounded-lg shadow-xl bg-gray-800 border border-gray-700 hover:shadow-2xl transition duration-300">
                <img
                  src={actor.photo ? (actor.photo.startsWith("http") ? actor.photo : `${BASE_URL}${actor.photo}`) : '/path/to/default/actor-image.png'}
                  alt={actor.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <div className="font-bold text-xl mb-2 text-white truncate">{actor.name}</div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {actor.bio || "No bio available."}
                  </p>
                  <div className="pt-2">
                    <Link
                      to={`/admin/actors/update/${actor._id}`}
                      className="w-full block text-center bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Update Actor
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActorList;