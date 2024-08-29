import { useEffect, useState } from "react";
import axios from "axios";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import Footer from "../components/Footer/Footer";
import styles from "./Films.module.css"; // Import the CSS module

const Films = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filter, setFilter] = useState({
    genre: "",
    rating: 0,
    duration: 0,
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/movie/movies`
        );
        setMovies(response.data.data);
        setFilteredMovies(response.data.data);
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
        (filter.rating === 0 || movie.rating >= filter.rating) &&
        (filter.duration === 0 || movie.duration <= filter.duration)
      );
    });
    setFilteredMovies(filtered);
  }, [filter, movies]);

  return (
    <>
      <NavbarComponent />
      <div className={styles.container}>
        <h1 className={styles.heading}>Movie List</h1>

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
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              {/* Add more genres as needed */}
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
          <div className={styles.filter}>
            <label className={styles.label}>Duration (Max):</label>
            <input
              type="number"
              name="duration"
              value={filter.duration}
              onChange={handleFilterChange}
              min="0"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.movieList}>
          {filteredMovies.map((movie) => (
            <div key={movie._id} className={styles.movieCard}>
              <img src={movie.portraitImgUrl} alt={movie.title} />
              <h2>{movie.title}</h2>
              <p>
                <span>Rating:</span> {movie.rating}
              </p>
              <p>
                <span>Genre:</span> {movie.genre.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Films;
