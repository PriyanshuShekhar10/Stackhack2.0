/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

import "react-horizontal-scrolling-menu/dist/styles.css";
import "./ScrollComponent.css"; // Assuming you're using a separate CSS file
import { Link } from "react-router-dom";

const ScrollComponent = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filter, setFilter] = useState({
    genre: "",
    rating: 0,
    duration: 0,
  });

  useEffect(() => {
    // Fetch movies when the component is mounted
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/movie/movies`
        );
        const fetchedMovies = response.data.data;
        setMovies(fetchedMovies);
        setFilteredMovies(fetchedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <>
      <div>
        <h1>Movie List</h1>

        <div className="horizontal-scroll no-scrollbar">
          <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
            {movies.map(({ _id, title, portraitImgUrl }) => (
              <Card
                _id={_id} // NOTE: itemId is required for track items
                title={title}
                imgSrc={portraitImgUrl}
                key={_id}
              />
            ))}
          </ScrollMenu>
        </div>
      </div>
    </>
  );
};

const LeftArrow = () => {
  const visibility = React.useContext(VisibilityContext);
  return (
    <Arrow
      onClick={() => visibility.scrollPrev()}
      className="left-arrow"
      style={{ margin: "2rem" }}
    >
      <div className="arrow-icon">&#9664;</div> {/* Left arrow using CSS */}
    </Arrow>
  );
};

const RightArrow = () => {
  const visibility = React.useContext(VisibilityContext);
  return (
    <Arrow onClick={() => visibility.scrollNext()} className="right-arrow">
      <div className="arrow-icon">&#9654;</div> {/* Right arrow using CSS */}
    </Arrow>
  );
};

const Arrow = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`arrow ${className}`}
    style={{
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

function Card({ title, imgSrc, _id }) {
  return (
    <Link
      to={`/movie/${_id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          width: "10rem",
          margin: "5rem",
          cursor: "pointer",
        }}
        tabIndex={0}
      >
        <div className="card">
          <img
            src={imgSrc}
            alt={title}
            style={{ width: "100%", height: "14rem" }}
          />
          <div>{title}</div>
        </div>
      </div>
    </Link>
  );
}
export default ScrollComponent;
