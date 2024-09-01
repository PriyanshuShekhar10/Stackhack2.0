import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CinemasPage.css"; // Optional: For styling
import NavbarComponent from "../components/Navbar/NavbarComponent";

const CinemasPage = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your actual API base URL
    const API_BASE_URL = `${import.meta.env.VITE_API}`; // Example

    const fetchCinemas = async () => {
      try {
        // Fetch all cinemas in Delhi
        const response = await axios.get(
          `${API_BASE_URL}/movie/screensbycity/delhi`
        );
        if (response.data.ok) {
          setCinemas(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch cinemas.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching cinemas.");
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  if (loading) {
    return <div>Loading cinemas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (cinemas.length === 0) {
    return <div>No cinemas found in Delhi.</div>;
  }

  return (
    <>
      <NavbarComponent />
      <h1 className=" page-title new-amsterdam-regular">Cinemas in Delhi</h1>
      <div className="cinemas-container">
        {cinemas.map((cinema) => (
          <div key={cinema._id} className="cinema-card">
            <div className="cinema-card-image">
              <img
                src="https://t3.ftcdn.net/jpg/02/81/84/98/360_F_281849878_0Memw2hdFHyggA8gmK6rc8QSU9JnjYba.jpg"
                alt="Cinema"
              />
            </div>
            <div className="cinema-card-info">
              <h2>{cinema.name}</h2>
              <p>
                <strong>Location:</strong> {cinema.location}
              </p>
              <p>
                <strong>Screen Type:</strong> {cinema.screenType}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CinemasPage;
