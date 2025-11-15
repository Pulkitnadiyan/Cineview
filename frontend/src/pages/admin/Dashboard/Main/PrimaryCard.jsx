import { Link } from 'react-router-dom';
import { FaUsers, FaVideo, FaTags } from 'react-icons/fa'; // Icons needed here as well

// PrimaryCard receives props from Main component
const PrimaryCard = ({ title, data, icon: Icon, path, accent }) => {
  return (
    <Link to={path} className={`w-full max-w-xs h-auto bg-gray-800 text-white rounded-xl p-6 border-b-4 border-teal-500 shadow-xl`}>
      
      <div className="flex items-center justify-between">
        {/* Title */}
        <h2 className="text-xl font-bold text-teal-400 mb-2">
            {title} 
        </h2>
        
        {/* Icon (Renamed to Icon to allow rendering) */}
        {Icon && <Icon size={30} className="text-teal-500" />}
      </div>

      {/* Data Count */}
      <p className="text-4xl font-extrabold text-white mt-4">
          {data}
      </p>
      <p className="text-sm text-gray-400">
          Total count in database.
      </p>
    </Link>
  );
};

export default PrimaryCard;