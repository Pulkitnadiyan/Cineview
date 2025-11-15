import PrimaryCard from "./PrimaryCard";
import SecondaryCard from "./SecondaryCard";
// NOTE: Assuming useGetUsersQuery is in the correct path now (../.../user)
import { useGetUsersQuery } from "../../../../redux/api/user"; 
import { useGetTotalMoviesQuery } from "../../../../redux/api/movies";
import { useGetTotalGenresQuery } from "../../../../redux/api/genre";
import Loader from "../../../../components/loader";
// Icons added for dashboard cards
import { FaUsers, FaVideo, FaTags, FaComment } from 'react-icons/fa'; 


const Main = () => {
  // Fetching data for the main dashboard cards
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: movies, isLoading: moviesLoading } = useGetTotalMoviesQuery();
  const { data: genres, isLoading: genresLoading } = useGetTotalGenresQuery();
  
  // Combine loading states
  const isLoading = usersLoading || moviesLoading || genresLoading;

  if (isLoading) {
    // Consistent Loader component display
    return (
        <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center p-4">
            <Loader />
        </div>
    );
  }

  return (
    // Main Content Area: On mobile, ml-0 (default). On md screens, ml-64 to offset the sidebar.
    <section className="bg-gray-900 p-4 pt-20 text-white md:ml-64"> 
      
      <h1 className="text-3xl font-bold mb-8 text-teal-400">Admin Dashboard Overview</h1>
      
      <div className="space-y-10">
        
        {/* 1. Primary Cards: Mobile par single column (flex-col) and md screens par row (flex-row) */}
        <div className="flex justify-around flex-wrap gap-8 md:flex-row flex-col">
          
          {/* PrimaryCard components are fine as they are */}
          <PrimaryCard
            title="Total Movies"
            data={movies?.totalMovies || 0} // Passing Movie Count
            icon={FaVideo}
            path="/admin/movies-list"
          />
          
          <PrimaryCard
            title="Total Users"
            data={users?.length || 0} // Passing User Count
            icon={FaUsers}
            path="/admin/movies-list"
          />
          
          <PrimaryCard
            title="Total Genres"
            data={genres?.totalGenres || 0} // Passing Genre Count
            icon={FaTags}
            path="/admin/movies/genre"
          />
        </div>

        {/* 2. Secondary Cards: Similar responsive layout for these cards */}
        <div className="flex justify-around flex-wrap gap-8 mt-10 md:flex-row flex-col">
          <SecondaryCard
            pill="Recent Activity"
            content="Movies"
            info="View all movie edits"
            path="/admin/movies-list"
            gradient="from-teal-600 to-teal-800"
          />
          <SecondaryCard
            pill="New Signups"
            content="Users"
            info="Check the newest users"
            path="/admin/movies-list"
            gradient="from-cyan-600 to-blue-800"
          />
          <SecondaryCard
            pill="Pending Action"
            content="Comments"
            info="Manage all user feedback"
            path="/admin/movies/comments"
            gradient="from-pink-600 to-red-800"
          />
        </div>
      </div>
    </section>
  );
};

export default Main;