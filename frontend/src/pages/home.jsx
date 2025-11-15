import Header from "./movies/Header";
import MoviesContainerPage from "./movies/MoviesContainerPage";

const Home = () => {
  return (
    <>
      <Header />

      <section>
        <MoviesContainerPage />
      </section>
    </>
  );
};

export default Home;
