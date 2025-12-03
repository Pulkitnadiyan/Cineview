import { useParams, Link } from "react-router-dom";
import { useGetActorByIdQuery } from "../../redux/api/actors";
import Loader from "../../components/loader";
import MovieCard from "../movies/MovieCard"; // Reuse your existing card

const ActorProfile = () => {
  const { id } = useParams();
  const { data: actor, isLoading, error } = useGetActorByIdQuery(id);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading actor profile</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8 pt-20">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Actor Photo */}
        <img 
          src={actor.photo} 
          alt={actor.name} 
          className="w-64 h-96 object-cover rounded-lg shadow-lg border-2 border-teal-500"
        />
        
        {/* Bio Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-teal-400 mb-4">{actor.name}</h1>
          <p className="text-gray-300 text-lg leading-relaxed">{actor.bio}</p>
        </div>
      </div>

      {/* Filmography Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-teal-500 pl-4">Filmography</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {actor.movies?.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActorProfile;