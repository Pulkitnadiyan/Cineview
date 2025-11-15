import { useGetUsersQuery } from "../../../../redux/api/users";
import PrimaryCard from "./PrimaryCard";
import { FaBroadcastTower } from 'react-icons/fa'; // Added a relevant icon for 'Realtime'

const RealTimeCard = () => {
  const { data: visitors, isLoading, isError } = useGetUsersQuery();

  return (
    // Main Card Container: Consistent dark background, shadow, and rounded corners
    <div className="w-full max-w-sm lg:max-w-md mt-10 bg-gray-800 text-white rounded-xl shadow-xl p-6 border border-gray-700">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2 border-b border-gray-700 pb-3">
        <h2 className="text-2xl font-bold text-teal-400">Realtime</h2>
        <FaBroadcastTower size={24} className="text-teal-500 animate-pulse" /> {/* Added Icon */}
      </div>
      
      {/* Subtitle */}
      <p className="text-sm text-gray-500 mb-4">
        {isLoading ? 'Fetching live status...' : 'Update Live'}
      </p>

      {/* Visitor Count (Subscribers/Total Users) */}
      <div className="my-5">
        <h2 className="text-5xl font-extrabold mb-1 text-white">
          {isLoading ? '...' : visitors?.length || 0}
        </h2>
        <p className="text-lg text-gray-400">Total Registered Users</p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-4"></div>

      {/* Primary Card (Assuming PrimaryCard needs to be placed here) */}
      {/* Note: If PrimaryCard is meant to be a separate card, consider moving it outside this component's return structure. */}
      {/* Yahan PrimaryCard ka use shayad thoda redundant hai agar dono ek hi data use kar rahe hain, but code ke hisaab se use rehne diya hai. */}
      <PrimaryCard /> 
      
    </div>
  );
};

export default RealTimeCard;