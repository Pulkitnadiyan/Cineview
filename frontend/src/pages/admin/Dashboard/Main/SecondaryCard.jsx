import { Link } from 'react-router-dom';

const SecondaryCard = ({ pill, content, info, gradient, path }) => {
  // Default gradient agar koi prop pass nahi hota hai (using Teal shades)
  const defaultGradient = 'from-teal-600 to-teal-800';
  
  // Pill background color (Thoda sa dark shade jisse woh card se alag dikhe)
  const pillBg = 'bg-gray-700';
  
  // Use the provided gradient or the default teal gradient
  const finalGradient = gradient || defaultGradient;

  return (
    <Link
      to={path}
      // Main Card Container: Fixed width, dark shadow, margin adjusted
      className={`w-[15rem] h-[12rem] relative mt-10 shadow-2xl ml-5 
                  bg-gradient-to-br ${finalGradient} rounded-xl border-t border-teal-400`}
    >
      
      {/* Pill/Badge at the Top (Slightly Darker than main content) */}
      <div
        className={`absolute -top-4 left-1/2 transform -translate-x-1/2 
                    ${pillBg} text-white font-semibold 
                    rounded-full py-2 px-5 text-sm shadow-lg`}
      >
        {pill}
      </div>

      {/* Main Content (Centered) */}
      <div className="flex items-center justify-center h-full">
        <h2 className="text-5xl font-extrabold text-white tracking-wider">
          {content}
        </h2>
      </div>

      {/* Info/Footer Text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-200">
        {info}
      </div>
      
    </Link>
  );
};

export default SecondaryCard;