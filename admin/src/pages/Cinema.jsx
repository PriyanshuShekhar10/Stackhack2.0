// Importing React and necessary hooks
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
// Importing the CSS module
import styles from "./Cinema.module.css";

export default function Cinema() {
  const [screenData, setScreenData] = useState({
    name: "",
    location: "",
    seats: 0,
    city: "Delhi", // Fixed city
    screenType: "",
  });

  const [scheduleData, setScheduleData] = useState({
    screenId: "",
    movieId: "",
    showTime: "",
    startDate: "", // New state property for start date
    endDate: "", // New state property for end date
  });

  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);

  // Move fetchScreens out of useEffect
  const fetchScreens = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/movie/screensbycity/Delhi`,
        { withCredentials: true }
      );
      if (response.data.ok) {
        setScreens(response.data.data);
      } else {
        console.error("Failed to fetch screens.");
      }
    } catch (error) {
      console.error("Error fetching screens:", error);
    }
  };

  useEffect(() => {
    // Fetch available movies
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/movie/movies`,
          {
            withCredentials: true,
          }
        );
        if (response.data.ok) {
          setMovies(response.data.data);
        } else {
          console.error("Failed to fetch movies.");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
    fetchScreens();
  }, []);

  const handleScreenChange = (e) => {
    const { name, value } = e.target;
    setScreenData({
      ...screenData,
      [name]: value,
    });
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({
      ...scheduleData,
      [name]: value,
    });
  };

  const createScreen = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/movie/createscreen`,
        screenData,
        { withCredentials: true }
      );
      if (response.data.ok) {
        alert("Screen added successfully!");
        // Fetch updated screens list
        fetchScreens();
      } else {
        alert("Failed to add screen.");
      }
    } catch (error) {
      console.error("Error creating screen:", error);
      alert("An error occurred while creating the screen.");
    }
  };

  const addMovieSchedule = async (e) => {
    e.preventDefault();
    const startDate = new Date(scheduleData.startDate);
    const endDate = new Date(scheduleData.endDate);

    for (
      let dt = new Date(startDate);
      dt <= endDate;
      dt.setDate(dt.getDate() + 1)
    ) {
      const currentScheduleData = {
        ...scheduleData,
        showDate: dt.toISOString().split("T")[0], // Format date to 'YYYY-MM-DD'
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/movie/addmoviescheduletoscreen`,
          currentScheduleData,
          { withCredentials: true }
        );
        if (!response.data.ok) {
          alert(
            `Failed to add movie schedule for ${currentScheduleData.showDate}.`
          );
        }
      } catch (error) {
        console.error(
          `Error adding movie schedule for ${currentScheduleData.showDate}:`,
          error
        );
        alert(
          `An error occurred while adding the movie schedule for ${currentScheduleData.showDate}.`
        );
      }
    }

    alert("Movie schedules added successfully!");
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2>Add New Screen</h2>
        <form onSubmit={createScreen} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Screen Name:</label>
            <input
              type="text"
              name="name"
              value={screenData.name}
              onChange={handleScreenChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={screenData.location}
              onChange={handleScreenChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Seats:</label>
            <input
              type="number"
              name="seats"
              value={screenData.seats}
              onChange={handleScreenChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Screen Type:</label>
            <input
              type="text"
              name="screenType"
              value={screenData.screenType}
              onChange={handleScreenChange}
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Create Screen
          </button>
        </form>

        <h2>Add Movie Schedule to Screen</h2>
        <form onSubmit={addMovieSchedule} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Screen:</label>
            <select
              name="screenId"
              value={scheduleData.screenId}
              onChange={handleScheduleChange}
              required
            >
              <option value="">Select Screen</option>
              {screens.map((screen) => (
                <option key={screen._id} value={screen._id}>
                  {screen.name} - {screen.location}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Movie:</label>
            <select
              name="movieId"
              value={scheduleData.movieId}
              onChange={handleScheduleChange}
              required
            >
              <option value="">Select Movie</option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Show Time:</label>
            <input
              type="time"
              name="showTime"
              value={scheduleData.showTime}
              onChange={handleScheduleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={scheduleData.startDate}
              onChange={handleScheduleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={scheduleData.endDate}
              onChange={handleScheduleChange}
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Add Schedule
          </button>
        </form>
      </div>
    </>
  );
}
