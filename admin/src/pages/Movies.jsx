import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminMovieDashboard.css"; // Make sure to create this CSS file

const AdminMovieDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState("");
  const [movieData, setMovieData] = useState({
    title: "",
    description: "",
    portraitImgUrl: "",
    landscapeImgUrl: "",
    rating: "",
    genre: "",
    duration: "",
    trailer: "",
  });

  useEffect(() => {
    fetchMovies();
    fetchScreens();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:8000/movie/movies");
      setMovies(response.data.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchScreens = async () => {
    try {
      const response = await axios.get("http://localhost:8000/movie/screens");
      if (response.data.data.length === 0) {
        alert("No screens found. Please add screens first.");
      }
      setScreens(response.data.data);
    } catch (error) {
      console.error("Error fetching screens:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData({
      ...movieData,
      [name]: value,
    });
  };

  const handleScreenChange = (e) => {
    setSelectedScreen(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/movie/createmovie",
        {
          ...movieData,
          screenId: selectedScreen,
        }
      );
      setMovies([...movies, response.data.data]);
      setMovieData({
        title: "",
        description: "",
        portraitImgUrl: "",
        landscapeImgUrl: "",
        rating: "",
        genre: "",
        duration: "",
        trailer: "",
      });
      setSelectedScreen("");
      alert(response.data.message);
    } catch (error) {
      console.error("Error creating movie:", error);
    }
  };

  const handleDelete = async (movieId) => {
    try {
      await axios.delete(`http://localhost:8000/movie/movies/${movieId}`);
      setMovies(movies.filter((movie) => movie._id !== movieId));
      alert("Movie deleted successfully");
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Movie Dashboard</h1>

      <form onSubmit={handleSubmit} className="movie-form">
        <input
          type="text"
          name="title"
          value={movieData.title}
          onChange={handleInputChange}
          placeholder="Movie Title"
          required
          className="form-input"
        />
        <input
          type="text"
          name="description"
          value={movieData.description}
          onChange={handleInputChange}
          placeholder="Movie Description"
          required
          className="form-input"
        />
        <input
          type="text"
          name="portraitImgUrl"
          value={movieData.portraitImgUrl}
          onChange={handleInputChange}
          placeholder="Portrait Image URL"
          className="form-input"
        />
        <input
          type="text"
          name="landscapeImgUrl"
          value={movieData.landscapeImgUrl}
          onChange={handleInputChange}
          placeholder="Landscape Image URL"
          className="form-input"
        />
        <input
          type="text"
          name="rating"
          value={movieData.rating}
          onChange={handleInputChange}
          placeholder="Rating"
          className="form-input"
        />
        <input
          type="text"
          name="genre"
          value={movieData.genre}
          onChange={handleInputChange}
          placeholder="Genre"
          className="form-input"
        />
        <input
          type="text"
          name="duration"
          value={movieData.duration}
          onChange={handleInputChange}
          placeholder="Duration"
          className="form-input"
        />
        <input
          type="text"
          name="trailer"
          value={movieData.trailer}
          onChange={handleInputChange}
          placeholder="Trailer URL"
          className="form-input"
        />
        <select
          value={selectedScreen}
          onChange={handleScreenChange}
          required
          className="form-select"
        >
          <option value="" disabled>
            Select Screen
          </option>
          {screens.map((screen) => (
            <option key={screen._id} value={screen._id}>
              {screen.name} - {screen.location}
            </option>
          ))}
        </select>
        <button type="submit" className="submit-button">
          Add Movie
        </button>
      </form>

      <h2 className="movies-title">Movies</h2>
      <ul className="movies-list">
        {movies.map((movie) => (
          <li key={movie._id} className="movie-item">
            {movie.title} - {movie.genre}
            <button
              onClick={() => handleDelete(movie._id)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMovieDashboard;
