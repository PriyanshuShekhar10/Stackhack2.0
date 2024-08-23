import { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarComponent from '../components/Navbar/NavbarComponent';
import Footer from '../components/Footer/Footer';
import './films.css'

const Films = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filter, setFilter] = useState({
    genre: '',
    rating: 0,
    duration: 0,
  });

  useEffect(() => {
    // Fetch movies when the component is mounted
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://stackhack2-0-backend.onrender.com/movie/movies');
        setMovies(response.data.data);
        setFilteredMovies(response.data.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on user input
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
        (filter.genre === '' || movie.genre.includes(filter.genre)) &&
        (filter.rating === 0 || movie.rating >= filter.rating) &&
        (filter.duration === 0 || movie.duration <= filter.duration)
      );
    });
    setFilteredMovies(filtered);
  }, [filter, movies]);

  return (
    <>
      <NavbarComponent />
      <div>
        <h1>Movie List</h1>

        <div className="filters">
          <label>
            Genre:
            <select name="genre" value={filter.genre} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              {/* Add more genres as needed */}
            </select>
          </label>
          <label>
            Rating:
            <input
              type="number"
              name="rating"
              value={filter.rating}
              onChange={handleFilterChange}
              min="0"
              max="10"
            />
          </label>
          <label>
            Duration (Max):
            <input
              type="number"
              name="duration"
              value={filter.duration}
              onChange={handleFilterChange}
              min="0"
            />
          </label>
        </div>

        <div className="movie-list">
          {filteredMovies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <img src={movie.portraitImgUrl} alt={movie.title} />
              <h2>{movie.title}</h2>
              <p>{movie.description}</p>
              <p>Rating: {movie.rating}</p>
              <p>Genre: {movie.genre.join(', ')}</p>
              <p>Duration: {movie.duration} mins</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Films;
