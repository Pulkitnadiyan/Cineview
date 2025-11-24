import React, { useState, useEffect } from "react"; // Import hooks
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "../pages/movies/MovieCard";

const SliderUtil = ({ data }) => {
  // State to manually control slides based on screen width
  const [slidesToShow, setSlidesToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setSlidesToShow(2); // Mobile & Tablets (Portrait): Force 2 slides
      } else if (width < 1024) {
        setSlidesToShow(3); // Small Laptops/Tablets (Landscape): 3 slides
      } else {
        setSlidesToShow(4); // Desktop: 4 slides
      }
    };

    // Call handler immediately to set initial state correctly
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow, // Use the dynamic state value
    slidesToScroll: 2,
    arrows: true,
    // Remove the 'responsive' object entirely to avoid conflicts
  };

  return (
    // Add a key to force re-render if needed, though usually not required
    <Slider {...settings} key={slidesToShow}> 
      {data?.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </Slider>
  );
};

export default SliderUtil;