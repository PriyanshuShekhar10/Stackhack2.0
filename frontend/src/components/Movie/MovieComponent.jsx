import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./movie.css";
import NavbarComponent from "../Navbar/NavbarComponent";

export default function MovieComponent() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/movie/movies/${id}`
        );
        const data = await response.json();
        setMovie(data.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavbarComponent />
      <div className="movie-container">
        <div className="cover-image-container">
          <img
            className="cover-image inset-shadow"
            src={movie.landscapeImgUrl}
            alt={movie.title}
          />
        </div>

        <div className="movie-details">
          <div className="movie-main">
            <img
              className="poster"
              src={movie.portraitImgUrl}
              alt={movie.title}
            />
            <div className="title new-amsterdam-regular">
              <h1>{movie.title.toUpperCase()}</h1>
            </div>
          </div>
          <div className="movie-other-details monospace-text">
            <p>
              <strong>GENRE:</strong> <br />
              <br />
              {movie.genre.join(", ")}
            </p>
            <p>
              <strong>RATING:</strong>
              <br /> <br />
              {movie.rating}
            </p>
            <p>
              <strong>DURATION:</strong>
              <br />
              <br /> {movie.duration} minutes
            </p>
            <p>
              <strong>SYNOPSIS:</strong>
              <br />
              <br /> {movie.description}
            </p>
            <div className="mobile-trailer show">
              {movie.trailer && (
                <button
                  className="button-86"
                  onClick={() => {
                    window.open(movie.trailer, "_blank", "noopener noreferrer");
                  }}
                >
                  <a
                    href={movie.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch Trailer
                  </a>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
