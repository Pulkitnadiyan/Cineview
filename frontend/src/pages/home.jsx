import Header from "./movies/Header";
import MoviesContainerPage from "./Movies/MoviesContainerPage";

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
