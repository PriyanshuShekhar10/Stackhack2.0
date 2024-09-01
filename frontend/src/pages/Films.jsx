import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import Footer from "../components/Footer/Footer";
import styles from "./Films.module.css";

const Films = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filter, setFilter] = useState({
    genre: "",
    rating: 0,
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/movie/movies`
        );
        const fetchedMovies = response.data.data;
        setMovies(fetchedMovies);
        setFilteredMovies(fetchedMovies);

        const uniqueGenres = [
          ...new Set(fetchedMovies.flatMap((movie) => movie.genre)),
        ];
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  useEffect(() => {
    const filtered = movies.filter((movie) => {
      return (
        (filter.genre === "" || movie.genre.includes(filter.genre)) &&
        (filter.rating === 0 || movie.rating >= filter.rating)
      );
    });
    setFilteredMovies(filtered);
  }, [filter, movies]);

  return (
    <>
      <NavbarComponent />
      <div className={`${styles.container}`}>
        <h1 className={`${styles.heading} new-amsterdam-regular`}>
          Movie List
        </h1>

        <div className={styles.filters}>
          <div className={styles.filter}>
            <label className={styles.label}>Genre:</label>
            <select
              name="genre"
              value={filter.genre}
              onChange={handleFilterChange}
              className={styles.select}
            >
              <option value="">All</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filter}>
            <label className={styles.label}>Rating:</label>
            <input
              type="number"
              name="rating"
              value={filter.rating}
              onChange={handleFilterChange}
              min="0"
              max="10"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.movieList}>
          {filteredMovies.map((movie) => (
            <Link
              to={`/movie/${movie._id}`}
              key={movie._id}
              className={styles.movieCard} // Keep the styling consistent
              style={{ textDecoration: "none", color: "inherit" }} // Ensure link style doesn't interfere
            >
              <div>
                <img src={movie.portraitImgUrl} alt={movie.title} />
                <h2>{movie.title}</h2>
                <p>
                  <span>Rating:</span> {movie.rating}
                </p>
                <p>
                  <span>Genre:</span> {movie.genre.join(", ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Films;
