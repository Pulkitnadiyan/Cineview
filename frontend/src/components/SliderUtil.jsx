import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "../pages/movies/MovieCard";

const SliderUtil = ({ data }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Default for PC/Large Screens
    slidesToScroll: 2,
    
    // Ensure mobileFirst is disabled so we use Desktop-First logic
    mobileFirst: false,

    responsive: [
      {
        // For screens smaller than 1024px (Laptop/Tablet)
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        // For screens smaller than 768px (Tablets & Big Phones)
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Force 2 cards
          slidesToScroll: 1,
        },
      },
      {
        // For screens smaller than 480px (Standard Mobiles)
        breakpoint: 480,
        settings: {
          slidesToShow: 2, // Strictly 2 cards
          slidesToScroll: 1,
          arrows: false, // Optional: Hide arrows on mobile for cleaner look
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {data?.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </Slider>
  );
};

export default SliderUtil;