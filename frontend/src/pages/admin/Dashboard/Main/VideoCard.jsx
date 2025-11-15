const VideoCard = ({ image, title, date, comments }) => {
  return (
    <>
      {/* Main Container: Full width card style for dark theme list */}
      <div className="flex items-center w-full p-3 mt-3 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition duration-150 cursor-pointer">
        
        {/* 1. Image/Thumbnail */}
        <div className="flex-shrink-0">
          <img 
            src={image} 
            alt="Movie Thumbnail" 
            className="h-14 w-14 object-cover rounded-md border border-teal-500" 
          />
        </div>

        {/* 2. Title and Date/Info */}
        <div className="ml-4 flex-grow min-w-0">
          <h2 className="text-base font-semibold text-white truncate">
            {title}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {date}
          </p>
        </div>

        {/* 3. Comment Count/Metric */}
        <div className="flex-shrink-0 ml-4 flex items-center">
          <span className="text-sm font-bold text-teal-400">
            {comments}
          </span>
          <span className="text-sm text-gray-500 ml-1">
            Comments
          </span>
        </div>
        
      </div>
    </>
  );
};

export default VideoCard;