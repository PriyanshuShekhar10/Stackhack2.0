import React, { useState, useEffect } from "react";
import Footer from "../components/Footer/Footer";
import NavbarComponent from "../components/Navbar/NavbarComponent";
import Image from "../assets/cinema.jpg";
import axios from "axios";

export default function Cinemas() {
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    // Fetch screens in Delhi
    const fetchScreens = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/movie/screensbycity/Delhi",
          {
            withCredentials: true,
          }
        );
        if (response.data.ok) {
          setScreens(response.data.data);
        } else {
          console.error("No screens found.");
        }
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };

    fetchScreens();
  }, []);

  return (
    <>
      <NavbarComponent />
      <img src={Image} alt="Cinema Banner" style={{ width: "100vw" }} />
      <div>
        <h2>Cinemas in Delhi</h2>
        {screens.length > 0 ? (
          <ul>
            {screens.map((screen) => (
              <li key={screen._id}>
                <h3>{screen.name}</h3>
                <p>Location: {screen.location}</p>
                <p>Seats: {screen.seats}</p>
                <p>Screen Type: {screen.screenType}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No screens available in Delhi.</p>
        )}
      </div>
      <Footer />
    </>
  );
}
