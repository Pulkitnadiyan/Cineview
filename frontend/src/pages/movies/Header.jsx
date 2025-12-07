import SliderUtil from "../../components/SliderUtil";
import { useGetNewMoviesQuery } from "../../redux/api/movies";
import { Link } from "react-router-dom";
import Shuffle from "../../components/Shuffle";

const Header = () => {
  const { data, isLoading, isError } = useGetNewMoviesQuery();

  return (
   
   <div className="bg-gray-900 text-teal-400 min-h-[30rem] pt-8 pb-8 px-4 sm:px-8 overflow-x-hidden">
      
    
     <div className="w-full flex justify-center mb-8 mt-4">
  <div className="relative z-10 cursor-pointer text-center">

          <Shuffle
  text="Cineview"
  shuffleDirection="right"
  duration={0.60}
  animationMode="evenodd"
  shuffleTimes={1}
  ease="power3.out"
  stagger={0.03}
  threshold={0.1}
  triggerOnce={true}
  triggerOnHover={true}
  respectReducedMotion={true}


           
            className="text-center text-6xl md:text-9xl font-extrabold" 
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start">
       
        
        {/* Navigation Section (Sidebar) */}
        <nav className="w-full md:w-[12rem] ml-0 mb-6 md:mb-0 p-4 rounded-lg bg-gray-800 shadow-xl border border-gray-700 flex flex-col space-y-2">
          
          <h2 className="text-xl font-semibold mb-2 text-teal-400">Navigation</h2>

          <Link
            to="/"
            className="transition duration-300 ease-in-out block p-3 rounded-lg text-lg text-gray-200 
                       hover:bg-teal-700 hover:text-white"
          >
            Home
          </Link>
          
          <Link
            to="/movies"
            className="transition duration-300 ease-in-out block p-3 rounded-lg text-lg text-gray-200 
                       hover:bg-teal-700 hover:text-white"
          >
            Browse Movies
          </Link>
        </nav>

        {/* Slider Section */}
        <div className="w-full md:w-full md:ml-8 ">
          {isLoading ? (
            <p className="text-teal-400 text-xl text-center mt-20">Loading new movies...</p>
          ) : isError ? (
            <p className="text-red-500 text-xl text-center mt-20">Failed to load movies.</p>
          ) : (
            <SliderUtil data={data} />
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Header;