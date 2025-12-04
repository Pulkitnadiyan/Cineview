import { useParams, Link } from "react-router-dom";
import { useGetActorByIdQuery } from "../../redux/api/actors";
import Loader from "../../components/loader";
import MovieCard from "../movies/MovieCard";
import { BASE_URL } from "../../redux/constants"; // 1. Import BASE_URL

const ActorProfile = () => {
  const { id } = useParams();
  const { data: actor, isLoading, error } = useGetActorByIdQuery(id);

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500 text-center mt-10">Error loading profile.</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8 pt-20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          
          {/* 2. Fix Image Source */}
          <img 
            src={actor.photo?.startsWith("http") ? actor.photo : `${BASE_URL}${actor.photo}`}
            alt={actor.name} 
            className="w-full md:w-[20rem] h-[30rem] object-cover rounded-xl shadow-2xl border-4 border-gray-800"
          />
          
          {/* Bio Info */}
          <div className="flex-1 mt-4 md:mt-0">
            <h1 className="text-5xl font-extrabold text-teal-400 mb-6">{actor.name}</h1>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-300 mb-3 border-b border-gray-600 pb-2">Biography</h3>
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                    {actor.bio}
                </p>
            </div>
          </div>
        </div>

        {/* Filmography Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
             🎬 Filmography 
             <span className="text-sm font-normal text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                {actor.movies?.length || 0} movies
             </span>
          </h2>

          {actor.movies?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {actor.movies.map((movie) => (
                <div key={movie._id} className="transform hover:scale-105 transition duration-300">
                    <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-lg italic">No movies found for this actor yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActorProfile;