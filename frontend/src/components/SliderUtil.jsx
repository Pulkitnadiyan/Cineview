import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "../pages/movies/MovieCard";

const SliderUtil = ({ data }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    
    // ✅ FORCE MOBILE DEFAULT: Start with 2 slides
    slidesToShow: 2,
    slidesToScroll: 1,
    
    // ✅ ENABLE MOBILE FIRST: Breakpoints will now trigger on min-width (scaling UP)
    mobileFirst: true, 
    
    responsive: [
      {
        // When screen becomes larger than 768px (Tablet), show 3 slides
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        // When screen becomes larger than 1024px (Desktop), show 4 slides
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
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