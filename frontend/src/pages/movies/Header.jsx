import SliderUtil from "../../components/SliderUtil";
import { useGetNewMoviesQuery } from "../../redux/api/movies";
import { Link } from "react-router-dom";
import TextPressure from "../../components/TextPressure";

const Header = () => {
  const { data, isLoading, isError } = useGetNewMoviesQuery();

  return (
   
    <div className="bg-gray-900 text-white min-h-[30rem] pt-8 pb-8 px-4 sm:px-8 overflow-x-hidden">
      <div className="relative h-[150px] w-full flex items-center justify-center mb-6 overflow-hidden">
    <TextPressure
      text="CINEVIEW"
      flex={true}
      alpha={false}
      stroke={false}
      width={true}
      weight={true}
      italic={true}
      textColor="#2dd4bf" 
      strokeColor="#ff0000"
      minFontSize={36}
    />
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